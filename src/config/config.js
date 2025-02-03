const path = require('path');

const config = {
    port: process.env.PORT || 3000,
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

module.exports = config; 