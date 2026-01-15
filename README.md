# 📬 FinMail.ai - Triagem Inteligente de E-mails

![Status do Projeto](https://img.shields.io/badge/Status-Conclu%C3%ADdo-brightgreen)
![Vercel](https://img.shields.io/badge/Deploy-Vercel-black)
![React](https://img.shields.io/badge/Frontend-React-blue)
![FastAPI](https://img.shields.io/badge/Backend-FastAPI-009688)

## 📝 Contexto do Desafio
Esta solução foi desenvolvida para uma grande empresa do setor financeiro que lida com um alto volume diário de e-mails. O desafio consiste em automatizar a leitura e classificação dessas mensagens, diferenciando solicitações que exigem ação imediata (**Produtivo**) de mensagens de caráter social ou irrelevante (**Improdutivo**).

O sistema atua como um assistente inteligente que:
1. **Analisa** o teor do e-mail (texto inserido ou anexo em PDF/TXT).
2. **Classifica** a prioridade conforme as categorias predefinidas.
3. **Sugere** uma resposta profissional automática para agilizar o atendimento.

## ✨ Funcionalidades
- **Classificação por IA:** Utiliza Processamento de Linguagem Natural (NLP) para entender a intenção real do remetente.
- **Leitura de Arquivos:** Processamento automático de e-mails salvos em documentos `.txt` e `.pdf`.
- **Interface Glassmorphism:** Design moderno em "dark mode" com efeitos de transparência, otimizado para a produtividade do usuário.
- **Sistema de Resiliência (Fallback):** Caso a API de IA esteja offline, o sistema utiliza uma heurística baseada em palavras-chave financeiras para não interromper o serviço.
- **Fluxo de Trabalho:** Botão interativo para simular o envio da resposta sugerida.

## 🛠️ Tecnologias Utilizadas
- **Frontend:** React.js, Tailwind CSS v4, Lucide React (Ícones), Framer Motion (Animações).
- **Backend:** Python 3.10+, FastAPI (Framework assíncrono).
- **IA/NLP:** Hugging Face Inference API (Modelo: `MoritzLaurer/DeBERTa-v3-base-mnli-xnli`).
- **Deploy Cloud:** Vercel (Arquitetura Serverless).


## 🚀 Como Executar Localmente

### 1. Clonar o Repositório
```bash
git clone [https://github.com/camilawolter/desafio-email.git](https://github.com/camilawolter/desafio-email.git)
cd desafio-email
```

### 2. Configurar o Backend (Python)
Navegue até a pasta: `cd backend`

Crie e ative um ambiente virtual:

```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate
```

Instale as dependências necessárias:

```bash
pip install -r requirements.txt
```

Crie um arquivo .env na pasta backend e adicione seu token do Hugging Face:
```json
HF_TOKEN=seu_token_aqui
```

Inicie o servidor local:
```bash
uvicorn api.main:app --reload
```
### 3. Configurar o Frontend (React)
Navegue até a pasta: `cd frontend`

Instale os pacotes:

```bash
npm install
```
Inicie o projeto em modo de desenvolvimento:

```bash
npm run dev
```
O sistema estará disponível em `http://localhost:5173.`

## 🧠 Lógica de Classificação e Resiliência
Para garantir que a operação financeira nunca pare, o sistema trabalha em duas camadas:

Camada de IA: Utiliza o modelo DeBERTa-v3 para análise semântica profunda, identificando intenções e sentimentos no texto.

Camada de Segurança (Fallback): Se a API de IA falhar ou demorar a responder, o backend aciona uma varredura por termos críticos (ex: boleto, pagamento, erro, extrato). Isso garante que mensagens produtivas sejam detectadas mesmo sem conexão com a nuvem de IA.