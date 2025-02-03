# Chat com IA Local

Uma aplicação web que utiliza o modelo Mistral-7B localmente através do GPT4All para processar perguntas e respostas.

## 🚀 Funcionalidades

- Interface web para chat
- Processamento local de IA usando Mistral-7B
- Feedback em tempo real do status do modelo
- Tratamento de erros robusto
- Sistema de logs detalhado
- API RESTful para integração com outros sistemas

## 📋 Pré-requisitos

- Node.js 18.x ou superior
- NPM ou Yarn
- Modelo Mistral-7B baixado (arquivo .gguf)
- Mínimo 8GB de RAM
- Espaço em disco para o modelo (~4GB)

## 🔧 Instalação

1. Clone o repositório
```bash
git clone https://github.com/williamhssilva/QuizQuest.git
cd chat-ia-local
```

2. Instale as dependências
```bash
npm install
```

3. Configure o modelo
- Baixe o modelo Mistral-7B do [site oficial do GPT4All](https://gpt4all.io/models)
- O modelo deve estar em: `C:\Users\SEU_USUARIO\AppData\Local\nomic.ai\GPT4All` (Windows)
- Para Linux: `~/.local/share/nomic.ai/GPT4All`
- Para Mac: `~/Library/Application Support/nomic.ai/GPT4All`

4. Inicie o servidor
```bash
npm start
```

## 🌐 Uso

Acesse `http://localhost:3000` no navegador

### API Endpoints

#### Status do Modelo
```http
GET /api/status
```
Retorna o estado atual do modelo de IA

#### Processar Pergunta
```http
POST /api/chat
Content-Type: application/json

{
    "question": "Sua pergunta aqui"
}
```

## ⚙️ Configuração

As configurações podem ser ajustadas em `src/config/config.js`:
- Porta do servidor
- Configurações do modelo
- Opções CORS
- Parâmetros de geração de texto

## 📦 Estrutura do Projeto

```
QuizQuest/
├── src/
│   ├── config/
│   │   └── config.js
│   ├── routes/
│   │   └── api.js
│   ├── services/
│   │   └── aiService.js
│   ├── middleware/
│   │   └── errorHandler.js
│   └── app.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── main.js
│   └── index.html
└── package.json
```

## 🛠️ Tecnologias Utilizadas

- Node.js
- Express
- GPT4All
- HTML5
- CSS3
- JavaScript

## 🤝 Contribuindo

1. Faça o fork do projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT - veja o arquivo [LICENSE.md](LICENSE.md) para detalhes

## ✨ Agradecimentos

- [GPT4All](https://gpt4all.io) pelo modelo de IA
- [Nomic AI](https://home.nomic.ai) pela biblioteca Node.js
- Comunidade open source

Link do projeto: [https://github.com/williamhssilva/chat-ia-local](https://github.com/williamhssilva/chat-ia-local) 
