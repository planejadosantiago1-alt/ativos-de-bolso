export const androidCodeData = {
  manifest: `<!-- AndroidManifest.xml -->
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.ativosdebolso.app">

    <!-- Permissão para desenhar o micro-popup sobre outros apps (Elimina atrito) -->
    <uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW"/>
    
    <!-- Permissão para rodar serviço em background de forma confiável -->
    <uses-permission android:name="android.permission.FOREGROUND_SERVICE"/>

    <application>
        <!-- Declaração do NotificationListenerService, o core da nossa captura automática -->
        <service
            android:name=".services.TransactionNotificationService"
            android:label="Ativos de Bolso Auto-Tracker"
            android:permission="android.permission.BIND_NOTIFICATION_LISTENER_SERVICE"
            android:exported="true">
            <intent-filter>
                <action android:name="android.service.notification.NotificationListenerService" />
            </intent-filter>
        </service>
    </application>
</manifest>`,

  service: `// TransactionNotificationService.kt
package com.ativosdebolso.app.services

import android.service.notification.NotificationListenerService
import android.service.notification.StatusBarNotification
import android.util.Log
import com.ativosdebolso.app.ui.OverlayController

/**
 * Arquitetura Principal de Captura de Gastos.
 * Ouve notificações em tempo real para remover 100% de input manual do usuário.
 */
class TransactionNotificationService : NotificationListenerService() {

    // Lista de pacotes de bancos monitorados
    private val bankPackages = listOf("com.nu.production", "com.itau", "br.com.intermedium")

    override fun onNotificationPosted(sbn: StatusBarNotification) {
        val packageName = sbn.packageName
        
        if (bankPackages.contains(packageName)) {
            val extras = sbn.notification.extras
            val text = extras.getString("android.text") ?: return
            
            // Regex Parse Function (Exemplo Simplificado - "Compra de R$ 45,90 aprovada em Starbucks")
            val valueRegex = Regex("R\\\\$\\\\s?(\\\\d+[.,]\\\\d{2})")
            val merchantRegex = Regex("em\\\\s+(.+)")
            
            val amountMatch = valueRegex.find(text)
            val merchantMatch = merchantRegex.find(text)
            
            if (amountMatch != null && merchantMatch != null) {
                // Formatting data
                val amountStr = amountMatch.groupValues[1].replace(",", ".")
                val amount = amountStr.toFloatOrNull() ?: 0f
                val merchant = merchantMatch.groupValues[1].trim()
                
                triggerMicroPopup(amount, merchant)
            }
        }
    }

    private fun triggerMicroPopup(amount: Float, merchant: String) {
        Log.d("NudgeService", "Captured: $amount at $merchant")
        
        // Chamada da View de sobreposição imediata
        OverlayController.showPopup(applicationContext, amount, merchant)
    }
}`,

  popup: `// PopupOverlay.kt
package com.nudge.app.ui

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

/**
 * Motor de Interface Local - Jetpack Compose
 * Aparece sobre outros aplicativos para classificação com 1 clique.
 */
@Composable
fun NudgeMicroPopup(
    amount: Float,
    merchant: String,
    suggestedCategory: String? = null,
    onCategorySelected: (String) -> Unit
) {
    Card(
        modifier = Modifier.padding(16.dp).fillMaxWidth(),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text("Novo Gasto Detectado!", style = MaterialTheme.typography.titleMedium)
            Text("R$ $amount em $merchant", style = MaterialTheme.typography.headlineMedium)
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // IA Suggestion ou Manual Quick-Select
            if (suggestedCategory != null) {
                Text("Categoria sugerida (IA):", style = MaterialTheme.typography.labelSmall)
                Button(
                    onClick = { onCategorySelected(suggestedCategory) },
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
                ) {
                    Text("$suggestedCategory (✓ Confirmar +XP)")
                }
            } else {
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    CategoryButton("Almoço", onCategorySelected, Modifier.weight(1f))
                    CategoryButton("Transporte", onCategorySelected, Modifier.weight(1f))
                    CategoryButton("Lazer", onCategorySelected, Modifier.weight(1f))
                }
            }
        }
    }
}

@Composable
fun CategoryButton(name: String, onClick: (String) -> Unit, modifier: Modifier = Modifier) {
    OutlinedButton(onClick = { onClick(name) }, modifier = modifier) {
        Text(name)
    }
}`,

  database: `-- Supabase / PostgreSQL Schema
-- Estrutura otimizada para Gamificação e Categorização.

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    streak_count INT DEFAULT 0,
    current_xp INT DEFAULT 0,
    level INT DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    merchant VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    captured_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    response_time_ms BIGINT -- Usado para Analytics de Atrito
);

CREATE TABLE merchant_habits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merchant VARCHAR(255) NOT NULL,
    time_window VARCHAR(50), -- ex: "MORNING", "EVENING"
    suggested_category VARCHAR(50),
    confidence_score DECIMAL(3, 2), -- De 0.00 a 1.00
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`,

  gamification: `// GamificationEngine.kt
package com.ativosdebolso.app.domain

import java.time.Instant

/**
 * Lógica de Gamificação Financeira
 * Psicologia Comportamental focada no reforço positivo imediato.
 */
object GamificationEngine {

    private const val BASE_XP = 10
    private const val FAST_RESPONSE_XP_BONUS = 5
    private const val MAX_SECONDS_FOR_BONUS = 5L // Janela para ganhar bônus

    /**
     * Calcula a evolução do usuário com base no reflexo de registrar (1 click).
     * @return Pair<XP_Ganho, Novo_Streak>
     */
    fun calculateXP(
        transactionTimestamp: Instant,
        responseTimestamp: Instant,
        currentStreak: Int
    ): Pair<Int, Int> {
        val secondsTaken = responseTimestamp.epochSecond - transactionTimestamp.epochSecond
        
        var xpEarned = BASE_XP
        var newStreak = currentStreak
        
        // Fast Response Bonus: Estimula que o usuário olhe o gasto imediatamente
        if (secondsTaken <= MAX_SECONDS_FOR_BONUS) {
            xpEarned += FAST_RESPONSE_XP_BONUS
            newStreak += 1 
        } else {
            // Em respostas lentas, quebramos o streak, forçando o hábito
            newStreak = if (secondsTaken > 3600) 1 else currentStreak
        }
        
        // Multiplicador de Streak para retenção
        val streakMultiplier = (newStreak / 5) * 2
        xpEarned += streakMultiplier
        
        return Pair(xpEarned, newStreak)
    }
}`,

  aiEngine: `// AtivosAIEngine.kt
package com.ativosdebolso.app.domain.ai

import com.ativosdebolso.app.data.TransactionRepository

/**
 * Motor Local de IA - Integração com Ativos AI
 * Analisa os padrões de gastos da base de dados e sugere opções de investimento
 */
class AtivosAIEngine(private val repo: TransactionRepository) {

    fun generateInvestmentRecommendation(userId: String): String {
        val monthlyIncome = repo.getUserIncome(userId)
        val currentMonthSpend = repo.getCurrentMonthTotal(userId)
        
        // Se a pessoa for gastar menos do que ganha, gerar plano
        val leftOver = monthlyIncome - currentMonthSpend
        
        if (leftOver > 100f) {
            val systemPrompt = """
                Atue como o Ativos AI, um planejador financeiro especializado em Brasil.
                O usuário tem R$ $leftOver sobrando este mês e os maiores superávits foram
                nas categorias Lazer e Alimentação. 
                Sugira 2 tipos de investimentos (como Tesouro, CDB) focados 
                em rendimento com baixo risco, explicando o retorno estimado de forma gamificada.
            """.trimIndent()
            
            // Simulação da chamada do SDK do Gemini (Gemini API do Google)
            // val response = geminiModel.generateContent(systemPrompt)
            // return response.text
            
            return "Sugestão da IA pronta para exibição!"
        }
        
        return "Conclua as missões de redução de gastos primeiro."
    }
}`
};
