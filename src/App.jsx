import { useRef, useState } from "react";
import { ThinkingOrb } from "thinking-orbs";
import { BorderBeam } from "border-beam";
import {
  MetalText,
  setCursorLightConfig,
  useMetalTextReflection
} from "metal-fx";

setCursorLightConfig({ cursor: false });

function Metric({ label, value }) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ComponentTests() {
  const reflectionRef = useRef(null);
  useMetalTextReflection(reflectionRef);

  return (
    <section className="panel-section">
      <h2>Composants</h2>

      <div className="component-test">
        <span className="component-label">ThinkingOrb · composing</span>
        <ThinkingOrb state="composing" size={64} />
      </div>

      <div className="component-test">
        <span className="component-label">ThinkingOrb · working</span>
        <ThinkingOrb state="working" size={64} />
      </div>

      <div className="component-test">
        <span className="component-label">BorderBeam</span>
        <BorderBeam size="line" colorVariant="mono">
          <div className="beam-content">Test BorderBeam</div>
        </BorderBeam>
      </div>

      <div className="component-test metal-test">
        <span className="component-label">Metal FX</span>
        <span ref={reflectionRef} className="reflection-target">Mistia</span>
        <MetalText
          font="500 24px/1.2 Inter, sans-serif"
          color="#777777"
          strength={0.9}
          reflectionTargets={[{ ref: reflectionRef, strength: 0.64 }]}
        >
          Test
        </MetalText>
      </div>
    </section>
  );
}

function App() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [temperature, setTemperature] = useState("0.7");
  const [topP, setTopP] = useState("1");
  const [maxTokens, setMaxTokens] = useState("1024");

  function sendMessage(event) {
    event.preventDefault();
    const content = message.trim();

    if (!content) return;

    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", content }
    ]);
    setMessage("");
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <h1 className="brand">
          Mist<span>IA</span>
        </h1>
      </header>

      <div className="workspace">
        <section className="chat-panel" aria-label="Chat de test">
          <div className="chat-heading">
            <h2>Chat de test</h2>
          </div>

          <div className="messages" aria-live="polite">
            {messages.map((item) => {
              const isUser = item.role === "user";

              return (
                <div
                  className={`message-row ${isUser ? "user-row" : "assistant-row"}`}
                  key={item.id}
                >
                  <article
                    className={`message ${isUser ? "user-message" : "assistant-message"}`}
                  >
                    <strong>{isUser ? "Utilisateur" : "Mistia"}</strong>
                    <p>{item.content}</p>
                  </article>
                </div>
              );
            })}
          </div>

          <form className="composer" onSubmit={sendMessage}>
            <label className="sr-only" htmlFor="message">
              Écrire un message
            </label>
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
              placeholder="Écrire un message..."
              rows={1}
            />
            <button type="submit" disabled={!message.trim()} aria-label="Envoyer">
              Envoyer
            </button>
          </form>
          <p className="connection-note">Modèle Mistia non connecté</p>
        </section>

        <aside className="side-panel">
          <section className="panel-section">
            <h2>Sortie</h2>
            <div className="metrics">
              <Metric label="Tokens reçus" value="—" />
              <Metric label="Tokens générés" value="—" />
              <Metric label="Temps de réponse" value="—" />
              <Metric label="Tokens / seconde" value="—" />
            </div>
          </section>

          <section className="panel-section">
            <h2>Paramètres</h2>
            <div className="settings">
              <label>
                <span>Température</span>
                <input
                  type="number"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(event) => setTemperature(event.target.value)}
                />
              </label>
              <label>
                <span>Top P</span>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={topP}
                  onChange={(event) => setTopP(event.target.value)}
                />
              </label>
              <label>
                <span>Tokens maximum</span>
                <input
                  type="number"
                  min="1"
                  max="32768"
                  step="1"
                  value={maxTokens}
                  onChange={(event) => setMaxTokens(event.target.value)}
                />
              </label>
            </div>
            <p className="muted-note">Paramètres d'interface, pas encore reliés au modèle.</p>
          </section>

          <section className="panel-section external-chat">
            <h2>ChatGPT ↔ Mistia</h2>
            <div className="external-chat-empty">
              <span>Connexion à configurer</span>
            </div>
          </section>

          <ComponentTests />
        </aside>
      </div>
    </main>
  );
}

export default App;
