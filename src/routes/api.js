const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');
const os = require('os');

// Health Check detalhado
router.get('/health', async (req, res) => {
    try {
        const status = await aiService.getModelStatus();
        const uptime = process.uptime();
        
        const healthStatus = {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: `${Math.floor(uptime / 3600)}h ${Math.floor((uptime % 3600) / 60)}m ${Math.floor(uptime % 60)}s`,
            model: {
                isReady: status.isReady,
                isLoading: status.isLoading,
                queueLength: status.queueLength,
                name: aiService.config?.modelConfig.modelName
            },
            system: {
                memory: {
                    total: Math.round(os.totalmem() / (1024 * 1024 * 1024)) + 'GB',
                    free: Math.round(os.freemem() / (1024 * 1024 * 1024)) + 'GB',
                    usage: Math.round((1 - os.freemem() / os.totalmem()) * 100) + '%'
                },
                cpu: {
                    cores: os.cpus().length,
                    load: os.loadavg()
                },
                platform: os.platform(),
                arch: os.arch()
            },
            version: process.env.npm_package_version || '1.0.0'
        };

        res.json(healthStatus);
    } catch (error) {
        console.error('❌ Erro ao verificar saúde do sistema:', error);
        res.status(500).json({
            status: 'error',
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

// Status simples para verificação rápida
router.get('/ping', (req, res) => {
    res.json({ 
        status: 'ok',
        timestamp: new Date().toISOString()
    });
});

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
        
        const response = await aiService.addToQueue(question, 'normal');
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

router.post('/chat/stream', async (req, res) => {
    const { question } = req.body;
    
    console.log('💬 Nova requisição de streaming recebida:', question);
    
    if (!question) {
        console.warn('❌ Pergunta vazia recebida');
        return res.status(400).json({ error: 'Pergunta não fornecida' });
    }

    try {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        const stream = await aiService.addToQueue(question, 'stream');
        
        for await (const chunk of stream) {
            res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
        }

        res.write('data: [DONE]\n\n');
        res.end();
    } catch (error) {
        console.error('❌ Erro no streaming:', error);
        res.write(`data: ${JSON.stringify({ error: error.message })}\n\n`);
        res.end();
    }
});

module.exports = router; 