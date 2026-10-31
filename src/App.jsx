import { useRef, useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  Check,
  ChevronDown,
  CircleHelp,
  Command,
  Copy,
  Cpu,
  Gauge,
  MessageSquare,
  MoreHorizontal,
  PanelRightClose,
  PanelRightOpen,
  Plus,
  RotateCcw,
  Send,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  Square,
  Timer,
  Zap
} from "lucide-react";
import { ThinkingOrb } from "thinking-orbs";
import { BorderBeam } from "border-beam";
import {
  MetalText,
  setCursorLightConfig,
  useMetalTextReflection
} from "metal-fx";

setCursorLightConfig({ cursor: false });

function Metric({ icon: Icon, label, value, detail }) {
  return (
    <div className="metric-card">
      <div className="metric-icon"><Icon size={15} /></div>
      <div className="metric-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  );
}

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [showDetails, setShowDetails] = useState(true);
  const [temperature, setTemperature] = useState("0.7");
  const [topP, setTopP] = useState("1");
  const [maxTokens, setMaxTokens] = useState("1024");
  const [copied, setCopied] = useState(false);
  const reflectionRef = useRef(null);
  useMetalTextReflection(reflectionRef);

  function sendMessage(event) {
    event.preventDefault();
    const content = message.trim();
    if (!content) return;

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content, time: new Date() }
    ]);
    setMessage("");
  }

  function copyConversation() {
    const text = messages.map((item) => `${item.role === "user" ? "Vous" : "Mistia"} : ${item.content}`).join("\n\n");
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }

  const statusLabel = status === "composing"
    ? "Réflexion"
    : status === "working"
      ? "Génération"
      : "En attente";

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="brand-mark"><Sparkles size={17} /></div>
          <span className="environment-tag">LAB</span>
        </div>
        <div className="topbar-actions">
          <div className={`model-status ${status}`}>
            <span className="status-dot" />
            <span>{statusLabel}</span>
          </div>
          <button className="icon-button" type="button" onClick={() => setShowDetails((value) => !value)} aria-label={showDetails ? "Masquer les paramètres" : "Afficher les paramètres"} title="Panneau latéral">
            {showDetails ? <PanelRightClose size={17} /> : <PanelRightOpen size={17} />}
          </button>
        </div>
      </header>

      <div className={`workspace ${showDetails ? "" : "details-hidden"}`}>
        <section className="chat-panel" aria-label="Conversation Mistia">
          <div className="chat-toolbar">
            <div className="chat-title">
              <div className="chat-title-icon"><MessageSquare size={16} /></div>
              <div>
                <h2>Nouvelle conversation</h2>
                <span>Session locale · API à connecter</span>
              </div>
            </div>
            <div className="toolbar-actions">
              <button className="subtle-button" type="button" onClick={copyConversation} disabled={!messages.length}>
                {copied ? <Check size={15} /> : <Copy size={15} />}
                <span>{copied ? "Copié" : "Copier"}</span>
              </button>
              <button className="icon-button" type="button" onClick={() => setMessages([])} disabled={!messages.length} aria-label="Nouvelle conversation" title="Effacer la conversation">
                <Plus size={17} />
              </button>
              <button className="icon-button" type="button" aria-label="Options" title="Options">
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>

          <div className="messages" aria-live="polite">
            {messages.length === 0 ? (
              <div className="empty-state">
                <div className="empty-orb"><ThinkingOrb state="composing" size={76} /></div>
                <h3>Prêt à tester Mistia ?</h3>
                <p>Envoie un message pour commencer une conversation.</p>
                <div className="quick-prompts">
                  <button type="button" onClick={() => setMessage("Présente-toi en quelques phrases.")}><Sparkles size={14} /> Présente-toi</button>
                  <button type="button" onClick={() => setMessage("Explique-moi comment tu fonctionnes.")}><Cpu size={14} /> Fonctionnement</button>
                </div>
              </div>
            ) : (
              messages.map((item) => {
                const isUser = item.role === "user";
                return (
                  <div className={`message-row ${isUser ? "user-row" : "assistant-row"}`} key={item.id}>
                    {!isUser && <div className="avatar assistant-avatar"><Sparkles size={15} /></div>}
                    <article className={`message ${isUser ? "user-message" : "assistant-message"}`}>
                      {!isUser && <div className="message-author"><span ref={reflectionRef}>Mistia</span><span className="message-model">Assistant</span></div>}
                      <p>{item.content}</p>
                      <div className="message-meta">{item.time.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
                    </article>
                    {isUser && <div className="avatar user-avatar">G</div>}
                  </div>
                );
              })
            )}

            {status !== "idle" && (
              <div className="message-row assistant-row status-row">
                <div className="avatar assistant-avatar"><Sparkles size={15} /></div>
                <div className="thinking-card">
                  {status === "working" ? (
                    <BorderBeam size="line" colorVariant="mono">
                      <div className="thinking-inner"><ThinkingOrb state="working" size={34} /><span>Mistia génère une réponse…</span><span className="thinking-dots">•••</span></div>
                    </BorderBeam>
                  ) : (
                    <div className="thinking-inner"><ThinkingOrb state="composing" size={34} /><span>Mistia réfléchit…</span><span className="thinking-dots">•••</span></div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="composer-area">
            <form className="composer" onSubmit={sendMessage}>
              <button className="composer-tool" type="button" aria-label="Ajouter" title="Ajouter"><Plus size={18} /></button>
              <label className="sr-only" htmlFor="message">Écrire un message</label>
              <textarea
                id="message"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage(event);
                  }
                }}
                placeholder="Écrire à Mistia…"
                rows={1}
              />
              <button className="send-button" type="submit" disabled={!message.trim()} aria-label="Envoyer le message"><Send size={17} /></button>
            </form>
            <div className="composer-footer">
              <span><Command size={12} /> Entrée pour envoyer · Maj + Entrée pour un retour à la ligne</span>
              <span>Les réponses du modèle apparaîtront ici</span>
            </div>
          </div>
        </section>

        {showDetails && (
          <aside className="side-panel">
            <div className="side-heading">
              <div><SlidersHorizontal size={16} /><h2>Console de test</h2></div>
              <button className="icon-button" type="button" aria-label="Options de la console"><MoreHorizontal size={17} /></button>
            </div>

            <section className="panel-section">
              <div className="section-heading"><h3>État du modèle</h3><span className="live-tag"><i /> LOCAL</span></div>
              <div className="status-card">
                <div className="status-orb"><ThinkingOrb state={status === "working" ? "working" : "composing"} size={42} /></div>
                <div><strong>{statusLabel}</strong><span>Simulation d'état pour les tests UI</span></div>
              </div>
              <div className="state-controls">
                <button className={status === "composing" ? "selected" : ""} type="button" onClick={() => setStatus(status === "composing" ? "idle" : "composing")}><ThinkingOrb state="composing" size={20} /><span>Réflexion</span></button>
                <button className={status === "working" ? "selected" : ""} type="button" onClick={() => setStatus(status === "working" ? "idle" : "working")}><ThinkingOrb state="working" size={20} /><span>Génération</span></button>
                <button className={status === "idle" ? "selected" : ""} type="button" onClick={() => setStatus("idle")}><Square size={14} /><span>Arrêt</span></button>
              </div>
            </section>

            <section className="panel-section">
              <div className="section-heading"><h3>Performances</h3><Activity size={15} /></div>
              <div className="metrics">
                <Metric icon={ArrowDown} label="Tokens entrants" value="—" detail="En attente de l'API" />
                <Metric icon={ArrowUp} label="Tokens sortants" value="—" detail="En attente de l'API" />
                <Metric icon={Timer} label="Temps de réponse" value="—" detail="Mesure à connecter" />
                <Metric icon={Gauge} label="Tokens / seconde" value="—" detail="Mesure à connecter" />
              </div>
            </section>

            <section className="panel-section">
              <div className="section-heading"><h3>Paramètres du modèle</h3><Settings2 size={15} /></div>
              <div className="settings">
                <label><span>Température</span><input type="number" min="0" max="2" step="0.1" value={temperature} onChange={(event) => setTemperature(event.target.value)} /></label>
                <label><span>Top P</span><input type="number" min="0" max="1" step="0.05" value={topP} onChange={(event) => setTopP(event.target.value)} /></label>
                <label><span>Tokens maximum</span><input type="number" min="1" max="32768" step="1" value={maxTokens} onChange={(event) => setMaxTokens(event.target.value)} /></label>
              </div>
              <p className="muted-note"><CircleHelp size={13} /> Valeurs d'interface. Elles seront transmises à l'API quand elle sera intégrée.</p>
            </section>

            <section className="panel-section component-section">
              <div className="section-heading"><h3>Effets actifs</h3><Zap size={15} /></div>
              <div className="effect-row"><span className="effect-preview"><ThinkingOrb state="composing" size={24} /></span><div><strong>ThinkingOrb</strong><small>Indicateur de réflexion</small></div><span className="effect-check"><Check size={13} /></span></div>
              <div className="effect-row"><span className="effect-preview beam-preview"><span /></span><div><strong>BorderBeam</strong><small>Contour animé pendant la génération</small></div><span className="effect-check"><Check size={13} /></span></div>
              <div className="effect-row"><span className="effect-preview metal-preview"><MetalText font="600 15px Inter, sans-serif" color="#777777" strength={0.9} reflectionTargets={[{ ref: reflectionRef, strength: 0.64 }]}>M</MetalText></span><div><strong>Metal FX</strong><small>Reflet sur le nom de Mistia</small></div><span className="effect-check"><Check size={13} /></span></div>
            </section>
            <div className="side-footer"><span> MISTIA LAB</span><span>Interface de développement</span></div>
          </aside>
        )}
      </div>
    </main>
  );
}

export default App;
