from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime
import requests
import io
import PyPDF2
import os

app = FastAPI()

# Permite que o React (porta 5173) acesse o Python (porta 8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

HF_TOKEN = os.getenv("HF_TOKEN")

def extrair_texto(arquivo, filename):
    try:
        if filename.endswith('.pdf'):
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(arquivo))
            return " ".join([page.extract_text() for page in pdf_reader.pages])
        return arquivo.decode('utf-8')
    except Exception:
        return ""

async def query_hf(payload, model_id):
    headers = {"Authorization": f"Bearer {HF_TOKEN}"}
    url = f"https://router.huggingface.co/models/{model_id}"
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=15)
        return response.json() if response.status_code == 200 else {"error": "api_fail"}
    except:
        return {"error": "conn_fail"}

@app.post("/processar")
async def processar(texto: str = Form(None), arquivo: UploadFile = File(None)):
    try:
        conteudo = ""
        if arquivo:
            conteudo = extrair_texto(await arquivo.read(), arquivo.filename)
        elif texto:
            conteudo = texto
        
        if not conteudo:
            raise HTTPException(status_code=400, detail="Vazio")

        # IA + Lógica de Fallback
        res = await query_hf(
            {"inputs": conteudo, "parameters": {"candidate_labels": ["Produtivo", "Improdutivo"]}},
            "MoritzLaurer/DeBERTa-v3-base-mnli-xnli"
        )
        
        if "error" in res:
            p_prod = ["boleto", "pagamento", "erro", "ajuda", "suporte", "vencimento", "extrato"]
            categoria = "Produtivo" if any(p in conteudo.lower() for p in p_prod) else "Improdutivo"
            metodo = "Análise por Padrões"
        else:
            categoria = res['labels'][0]
            metodo = "Deep Learning AI"

        resp = "Olá! Identificamos uma demanda técnica. Nossa equipe financeira já foi notificada." if categoria == "Produtivo" \
               else "Agradecemos o seu contato! Sua mensagem foi recebida e arquivada com sucesso."

        return {"categoria": categoria, "resposta_sugerida": resp, "metodo": metodo, "chars": len(conteudo)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
        