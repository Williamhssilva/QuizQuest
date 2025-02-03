const { loadModel, createCompletion } = require('gpt4all');
const getConfig = require('../config/config');

class AIService {
    constructor() {
        this.model = null;
        this.isLoading = false;
        this.isReady = false;
        this.requestQueue = [];
        this.isProcessing = false;
        this.config = null;
        this.init();
        console.log('AIService iniciado - Aguardando carregamento do modelo...');
    }

    async init() {
        try {
            // Carrega a configuração primeiro
            this.config = await getConfig();
            // Depois inicia o modelo
            await this.initModel();
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            throw error;
        }
    }

    async addToQueue(question, type = 'normal') {
        console.log(`➕ Adicionando requisição à fila - Tipo: ${type}`);
        return new Promise((resolve, reject) => {
            this.requestQueue.push({ question, resolve, reject, type });
            this.processQueue();
        });
    }

    async processQueue() {
        if (this.isProcessing || this.requestQueue.length === 0) return;

        this.isProcessing = true;
        console.log(`📋 Processando fila - ${this.requestQueue.length} requisições pendentes`);

        try {
            const { question, resolve, reject, type } = this.requestQueue[0];

            let response;
            if (type === 'normal') {
                response = await this.processQuestion(question);
            } else if (type === 'stream') {
                response = this.streamResponse(question);
            }

            resolve(response);
        } catch (error) {
            const { reject } = this.requestQueue[0];
            reject(error);
        } finally {
            this.requestQueue.shift();
            this.isProcessing = false;
            
            if (this.requestQueue.length > 0) {
                setImmediate(() => this.processQueue());
            }
        }
    }

    async initModel() {
        try {
            this.isLoading = true;
            console.log('Iniciando carregamento do modelo:', this.config.modelConfig.modelName);
            console.log('Caminho do modelo:', this.config.modelConfig.modelPath);
            
            this.model = await loadModel(this.config.modelConfig.modelName, {
                modelPath: this.config.modelConfig.modelPath,
                verbose: true
            });
            
            console.log('✅ Modelo Mistral inicializado com sucesso!');
            this.isReady = true;
            this.isLoading = false;
        } catch (error) {
            this.isLoading = false;
            console.error('❌ Erro ao carregar modelo:', error);
            console.error('Detalhes do erro:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    async getModelStatus() {
        console.log('Status atual do modelo:', {
            isLoading: this.isLoading,
            isReady: this.isReady,
            queueLength: this.requestQueue.length
        });
        return {
            isLoading: this.isLoading,
            isReady: this.isReady,
            queueLength: this.requestQueue.length
        };
    }

    async processQuestion(question) {
        if (!this.isReady) {
            console.warn('❌ Tentativa de usar modelo não inicializado');
            throw new Error('Modelo ainda não está pronto');
        }
        
        try {
            console.log('📝 Processando pergunta:', question);
            console.time('tempo_resposta');
            
            const response = await createCompletion(this.model, question, {
                temperature: 0.7,
                maxTokens: 500,
                topP: 0.95,
                topK: 40,
                repeatPenalty: 1.1
            });
            
            console.timeEnd('tempo_resposta');
            console.log('✅ Resposta gerada com sucesso');
            
            return response.choices[0].message.content;
        } catch (error) {
            console.error('❌ Erro ao processar pergunta:', error);
            console.error('Detalhes do erro:', {
                pergunta: question,
                erro: error.message,
                stack: error.stack
            });
            throw error;
        }
    }

    async* streamResponse(question) {
        if (!this.isReady) {
            console.warn('❌ Tentativa de usar modelo não inicializado');
            throw new Error('Modelo ainda não está pronto');
        }
        
        try {
            console.log('📝 Iniciando streaming para pergunta:', question);
            console.time('tempo_resposta_stream');
            
            const response = await createCompletion(this.model, question, {
                temperature: 0.7,
                maxTokens: 500,
                topP: 0.95,
                topK: 40,
                repeatPenalty: 1.1
            });
            
            // Simula streaming dividindo a resposta em chunks
            const text = response.choices[0].message.content;
            const words = text.split(' ');
            
            for (const word of words) {
                yield word + ' ';
                await new Promise(resolve => setTimeout(resolve, 50)); // Pequeno delay para simular streaming
            }
            
            console.timeEnd('tempo_resposta_stream');
            console.log('✅ Streaming concluído');
        } catch (error) {
            console.error('❌ Erro no streaming:', error);
            throw error;
        }
    }

    async getSystemMetrics() {
        const used = process.memoryUsage();
        
        return {
            memory: {
                heapTotal: Math.round(used.heapTotal / 1024 / 1024) + 'MB',
                heapUsed: Math.round(used.heapUsed / 1024 / 1024) + 'MB',
                rss: Math.round(used.rss / 1024 / 1024) + 'MB',
                external: Math.round(used.external / 1024 / 1024) + 'MB'
            },
            queue: {
                length: this.requestQueue.length,
                processing: this.isProcessing
            },
            model: {
                ready: this.isReady,
                loading: this.isLoading
            }
        };
    }
}

// Criamos e exportamos uma instância única
const aiService = new AIService();
module.exports = aiService;