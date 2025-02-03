const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Status do modelo
router.get('/status', async (req, res) => {
    console.log('📊 Requisição de status recebida');
    try {
        const status = await aiService.getModelStatus();
        console.log('✅ Status enviado:', status);
        res.json(status);
    } catch (error) {
        console.error('❌ Erro ao obter status:', error);
        res.status(500).json({ error: error.message });
    }
});

// Rota para processar perguntas
router.post('/chat', async (req, res) => {
    const startTime = Date.now();
    const { question } = req.body;
    
    console.log('💬 Nova pergunta recebida:', question);
    
    try {
        if (!question) {
            console.warn('❌ Pergunta vazia recebida');
            return res.status(400).json({ error: 'Pergunta não fornecida' });
        }
        
        const response = await aiService.processQuestion(question);
        const processTime = Date.now() - startTime;
        
        console.log('✅ Resposta enviada:', {
            tempoProcessamento: `${processTime}ms`,
            tamanhoPergunta: question.length,
            tamanhoResposta: response.length
        });
        
        res.json({ response });
    } catch (error) {
        console.error('❌ Erro ao processar chat:', error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 