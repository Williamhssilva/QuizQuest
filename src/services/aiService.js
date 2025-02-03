const { loadModel, createCompletion } = require('gpt4all');
const config = require('../config/config');

class AIService {
    constructor() {
        this.model = null;
        this.isLoading = false;
        this.isReady = false;
        this.initModel();
        console.log('AIService iniciado - Aguardando carregamento do modelo...');
    }

    async initModel() {
        try {
            this.isLoading = true;
            console.log('Iniciando carregamento do modelo:', config.modelConfig.modelName);
            console.log('Caminho do modelo:', config.modelConfig.modelPath);
            
            this.model = await loadModel(config.modelConfig.modelName, {
                modelPath: config.modelConfig.modelPath,
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
            isReady: this.isReady
        });
        return {
            isLoading: this.isLoading,
            isReady: this.isReady
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
}

module.exports = new AIService(); 