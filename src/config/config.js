const path = require('path');
const net = require('net');

async function findAvailablePort(startPort) {
    const isPortAvailable = (port) => {
        return new Promise((resolve) => {
            const server = net.createServer();
            
            server.once('error', () => {
                resolve(false);
            });
            
            server.once('listening', () => {
                server.close();
                resolve(true);
            });
            
            server.listen(port);
        });
    };

    let port = startPort;
    while (!(await isPortAvailable(port))) {
        console.log(`🔍 Porta ${port} em uso, tentando próxima...`);
        port++;
    }
    
    console.log(`✅ Porta ${port} disponível`);
    return port;
}

const config = {
    port: process.env.PORT || 3000, // Será substituído se não disponível
    modelConfig: {
        modelName: 'mistral-7b-instruct-v0.1.Q4_0.gguf',
        modelPath: path.join(process.env.APPDATA || '', 'nomic.ai', 'GPT4All'),
    },
    corsOptions: {
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:5500',
            'http://seu-outro-site.com',
        ],
        methods: ['GET', 'POST'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true,
        optionsSuccessStatus: 200
    }
};

// Exporta uma função que retorna a configuração com a porta disponível
module.exports = async function getConfig() {
    config.port = await findAvailablePort(config.port);
    return config;
}; 