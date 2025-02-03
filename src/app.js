const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');
const errorHandler = require('./middleware/errorHandler');
const getConfig = require('./config/config');

async function startServer() {
    const config = await getConfig();
    const app = express();

    // Middleware de logging
    app.use((req, res, next) => {
        console.log(`📥 ${new Date().toISOString()} ${req.method} ${req.url}`);
        const start = Date.now();
        
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`📤 ${new Date().toISOString()} ${req.method} ${req.url} ${res.statusCode} ${duration}ms`);
        });
        
        next();
    });

    // Middlewares
    app.use(cors(config.corsOptions));
    app.use(express.json());
    app.use(express.static(path.join(__dirname, '../public')));

    // Rotas da API
    app.use('/api', apiRoutes);

    // Handler de erros
    app.use(errorHandler);

    // Rota para a página principal
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, '../public/index.html'));
    });

    // Inicialização do servidor
    app.listen(config.port, () => {
        console.log(`
🚀 Servidor iniciado
📍 Porta: ${config.port}
📁 Modelo: ${config.modelConfig.modelName}
⏰ ${new Date().toISOString()}
        `);
    });

    return app;
}

// Inicia o servidor
startServer().catch(console.error);

module.exports = startServer; 