import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Loader2, CheckCircle, FileText, Upload, X, ShieldCheck, Check } from 'lucide-react';

export default function App() {
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [sent, setSent] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

  const handleAction = async () => {
    if (!input && !file) return alert("Por favor, insira o conteúdo do e-mail.");
    
    setLoading(true);
    setSent(false);
    
    const fd = new FormData();
    if (file) {
      fd.append('arquivo', file);
    } else {
      fd.append('texto', input);
    }

    try {
      const res = await axios.post(`${API_URL}/processar`, fd);
      setResult(res.data);
    } catch (e) { 
      console.error(e);
      alert("Erro ao conectar com o servidor. Verifique se o backend está rodando."); 
    } finally { 
      setLoading(false); 
    }
  };

  const simularEnvio = () => {
    setSent(true);
    setTimeout(() => {
      setResult(null);
      setInput('');
      setFile(null);
      setSent(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans p-4 md:p-10 selection:bg-blue-500/30">
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-full h-full bg-blue-600/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 w-fit">
              <ShieldCheck className="text-blue-500" size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Sistema de Triagem Financeira</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter">FinMail<span className="text-blue-500">.ai</span></h1>
          </div>
          <div className="hidden md:block text-right border-l border-slate-800 pl-6">
            <p className="text-[10px] font-bold text-slate-500">STATUS DA IA</p>
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> OPERACIONAL
            </div>
          </div>
        </header>

        <main className="grid lg:grid-cols-12 gap-8 items-stretch">
          {/* Lado Esquerdo: Entrada de Dados */}
          <div className="lg:col-span-7">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl h-full flex flex-col">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Mail className="text-blue-500" size={20} /> E-mail Recebido
              </h2>
              
              <textarea 
                className="flex-1 w-full min-h-[300px] bg-slate-950/50 border border-slate-800 p-6 rounded-2xl outline-none text-slate-300 placeholder:text-slate-700 text-lg leading-relaxed resize-none focus:border-blue-500/50 transition-all"
                placeholder="Cole o corpo do e-mail aqui..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={!!file}
              />

              <div className="mt-6 flex flex-col sm:flex-row items-center gap-4">
                <div className="w-full">
                  {!file ? (
                    <label className="flex items-center justify-center w-full h-14 border-2 border-dashed border-slate-800 rounded-xl cursor-pointer hover:bg-white/5 transition-all group">
                      <div className="flex items-center gap-2 text-slate-500 group-hover:text-blue-400">
                        <Upload size={18} />
                        <span className="text-xs font-bold uppercase tracking-widest">Anexar .PDF ou .TXT</span>
                      </div>
                      <input type="file" className="hidden" accept=".pdf,.txt" onChange={(e) => setFile(e.target.files[0])} />
                    </label>
                  ) : (
                    <div className="flex items-center justify-between bg-blue-500/10 border border-blue-500/30 p-3 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-400" size={18} />
                        <span className="text-xs font-bold text-blue-200 truncate max-w-[150px]">{file.name}</span>
                      </div>
                      <button onClick={() => setFile(null)} className="text-blue-400 hover:text-white"><X size={18} /></button>
                    </div>
                  )}
                </div>

                <button 
                  onClick={handleAction}
                  disabled={loading}
                  className="w-full sm:w-80 h-14 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 rounded-xl font-black text-white shadow-lg shadow-blue-600/10 transition-all flex justify-center items-center gap-3 active:scale-95"
                >
                  {loading ? <Loader2 className="animate-spin" /> : <Send size={18} />}
                  {loading ? "PROCESSANDO..." : "ANALISAR E-MAIL"}
                </button>
              </div>
            </div>
          </div>

          {/* Lado Direito: Resultado da IA */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {result ? (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl h-full flex flex-col"
                >
                  <div className="mb-8">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Classificação Automática</span>
                    <div className={`text-4xl font-black italic tracking-tighter ${result.categoria === 'Produtivo' ? 'text-emerald-400' : 'text-slate-400'}`}>
                      {result.categoria}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded uppercase font-bold tracking-tighter">{result.metodo}</span>
                      <span className="text-[9px] text-slate-600 font-bold">{result.data}</span>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col space-y-4">
                    <div className="flex items-center justify-between text-blue-400">
                      <span className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        <CheckCircle size={14} /> Resposta Sugerida
                      </span>
                    </div>
                    <div className="flex-1 p-6 bg-slate-950/80 rounded-2xl border border-slate-800 text-slate-300 italic leading-relaxed text-sm shadow-inner">
                      "{result.resposta_sugerida}"
                    </div>

                    <button 
                      onClick={simularEnvio}
                      disabled={sent}
                      className={`w-full py-4 rounded-xl font-black transition-all flex justify-center items-center gap-2 ${
                        sent ? 'bg-emerald-500 text-white' : 'bg-white text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      {sent ? <Check size={20} /> : <Mail size={20} />}
                      {sent ? "RESPOSTA ENVIADA!" : "ENVIAR ESTA RESPOSTA"}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full border-2 border-dashed border-slate-800 rounded-[2.5rem] flex flex-col items-center justify-center p-10 text-center opacity-30">
                  <Mail size={48} className="mb-4 text-slate-700" />
                  <p className="text-sm font-medium text-slate-500 italic leading-relaxed">
                    Aguardando entrada de dados para iniciar a triagem e sugerir a melhor resposta para o cliente.
                  </p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </main>

        <footer className="mt-12 text-center text-[10px] font-bold text-slate-600 uppercase tracking-[0.4em]">
          Plataforma de Automação de Atendimento • Desafio 2026
        </footer>
      </div>
    </div>
  );
}