class ChatApp {
    constructor() {
        this.messageContainer = document.getElementById('chatMessages');
        this.questionInput = document.getElementById('questionInput');
        this.sendButton = document.getElementById('sendButton');
        this.statusBar = document.getElementById('modelStatus');
        
        // Usar a URL atual do navegador como base
        this.apiUrl = window.location.hostname === '127.0.0.1' 
            ? 'http://localhost:3000/api'
            : '/api';
        
        this.init();
    }

    async init() {
        this.bindEvents();
        await this.checkModelStatus();
    }

    bindEvents() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.questionInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });
    }

    async checkModelStatus() {
        try {
            const response = await fetch(`${this.apiUrl}/status`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const status = await response.json();
            
            this.updateStatus(status);
            
            if (status.isLoading) {
                setTimeout(() => this.checkModelStatus(), 2000);
            }
        } catch (error) {
            this.statusBar.textContent = 'Erro ao verificar status do modelo';
            console.error('Erro:', error);
        }
    }

    updateStatus(status) {
        if (status.isLoading) {
            this.statusBar.textContent = 'Status do modelo: Carregando...';
        } else if (status.isReady) {
            this.statusBar.textContent = 'Status do modelo: Pronto';
        } else {
            this.statusBar.textContent = 'Status do modelo: Erro';
        }
    }

    addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${isUser ? 'user-message' : 'ai-message'}`;
        messageDiv.textContent = text;
        this.messageContainer.appendChild(messageDiv);
        this.messageContainer.scrollTop = this.messageContainer.scrollHeight;
    }

    async sendMessage() {
        const question = this.questionInput.value.trim();
        if (!question) return;

        this.addMessage(question, true);
        this.questionInput.value = '';
        this.setLoading(true);

        try {
            const response = await fetch(`${this.apiUrl}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question })
            });

            const data = await response.json();
            
            if (response.ok) {
                this.addMessage(data.response);
            } else {
                throw new Error(data.error);
            }
        } catch (error) {
            this.addMessage(`Erro: ${error.message}`);
        } finally {
            this.setLoading(false);
        }
    }

    setLoading(isLoading) {
        this.sendButton.disabled = isLoading;
        this.questionInput.disabled = isLoading;
        if (isLoading) {
            this.sendButton.textContent = 'Enviando...';
        } else {
            this.sendButton.textContent = 'Enviar';
        }
    }
}

// Inicializar a aplicação
document.addEventListener('DOMContentLoaded', () => {
    new ChatApp();
}); 