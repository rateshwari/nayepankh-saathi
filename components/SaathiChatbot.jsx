"use client";
import { useState, useRef, useEffect } from "react";

const COLORS = {
  bg: "#0F1117",
  surface: "#1A1F2E",
  bubble: "#1E2330",
  accent: "#F97316",
  accentLight: "#FED7AA",
  cream: "#FEF3C7",
  muted: "#6B7280",
  border: "#2A3040",
  userBubble: "#1D3A5F",
  white: "#F9FAFB",
};

const SYSTEM_PROMPT_EN = `You are Saathi, a warm and helpful AI assistant for NayePankh Foundation — a youth-led NGO in India that helps underprivileged communities. You assist users across three areas:

1. EDUCATION: Government scholarships (NSP, state scholarships), free coaching, mid-day meal schemes, digital literacy programs, government school admission processes, and study resources for underprivileged students.

2. FOOD & HUNGER: How to access PDS (ration card), Antyodaya Anna Yojana, PM Garib Kalyan Anna Yojana, how to locate food distribution drives, steps to register for food aid, and how to contact NayePankh for food drives.

3. WOMEN'S HEALTH: Menstrual hygiene education, busting myths around menstruation, how to access free sanitary napkins (through government schemes like Suvidha, or NayePankh drives), ASHA worker contacts, and personal hygiene awareness.

About NayePankh:
- Founded during COVID-19 in 2020, officially registered 28 March 2021
- 12A and 80G certified NGO (donors get 50% income tax relief)
- Contact: contact@nayepankh.com | +91-8318500748
- Motto: "Badalte Bharat Ki Nayi Tasveer"
- Serves 2+ lakh people, led entirely by youth

Guidelines:
- Be warm, empathetic, and non-judgmental. Users may be facing difficult situations.
- Give practical, actionable information — steps, helpline numbers, government portal links.
- Never ask for personal financial information.
- If someone needs urgent help (food crisis, health emergency), always give the NayePankh contact first.
- Keep responses concise and clear — many users are on small screens or have limited reading ability.
- If asked something outside your scope, gently redirect and offer what you CAN help with.
- Always end with an offer to help further or ask a follow-up question.`;

const SYSTEM_PROMPT_HI = `आप साथी हैं — NayePankh Foundation के लिए एक गर्मजोशी भरे और सहायक AI सहायक। NayePankh एक युवा-संचालित NGO है जो भारत में वंचित समुदायों की मदद करती है। आप तीन क्षेत्रों में मदद करते हैं:

1. शिक्षा: सरकारी छात्रवृत्ति (NSP, राज्य छात्रवृत्ति), मुफ्त कोचिंग, मिड-डे मील योजना, डिजिटल साक्षरता कार्यक्रम, और वंचित छात्रों के लिए अध्ययन संसाधन।

2. भोजन और भूख: राशन कार्ड (PDS), अंत्योदय अन्न योजना, PM गरीब कल्याण अन्न योजना, खाद्य वितरण केंद्र, और NayePankh के फूड ड्राइव।

3. महिला स्वास्थ्य: मासिक धर्म स्वच्छता शिक्षा, भ्रांतियों को दूर करना, मुफ्त सैनिटरी नैपकिन (सुविधा योजना या NayePankh), ASHA कार्यकर्ता संपर्क।

NayePankh के बारे में:
- संपर्क: contact@nayepankh.com | +91-8318500748
- 12A और 80G प्रमाणित NGO
- 2 लाख से अधिक लोगों की मदद

दिशानिर्देश:
- गर्मजोशी और सहानुभूति से बात करें। उपयोगकर्ता कठिन परिस्थितियों में हो सकते हैं।
- व्यावहारिक और actionable जानकारी दें।
- अगर कोई तत्काल मदद चाहे, NayePankh का संपर्क पहले दें।
- उत्तर संक्षिप्त और स्पष्ट रखें।
- हमेशा आगे मदद का प्रस्ताव दें।`;

const QUICK_TOPICS = {
  en: [
    { label: "📚 Scholarships", text: "How can I apply for a government scholarship?" },
    { label: "🍱 Food aid", text: "How do I get a ration card or food assistance?" },
    { label: "🌸 Menstrual health", text: "Where can I get free sanitary napkins?" },
    { label: "📞 Contact NGO", text: "How can I contact NayePankh for help?" },
    { label: "🎓 Free coaching", text: "Are there free coaching or tuition programs?" },
  ],
  hi: [
    { label: "📚 छात्रवृत्ति", text: "सरकारी छात्रवृत्ति के लिए आवेदन कैसे करें?" },
    { label: "🍱 खाद्य सहायता", text: "राशन कार्ड या खाना कहाँ से मिलेगा?" },
    { label: "🌸 महिला स्वास्थ्य", text: "मुफ्त सैनिटरी नैपकिन कहाँ मिलेंगे?" },
    { label: "📞 NGO से संपर्क", text: "NayePankh से कैसे संपर्क करें?" },
    { label: "🎓 मुफ्त कोचिंग", text: "मुफ्त कोचिंग या ट्यूशन कहाँ मिलेगी?" },
  ],
};

const WELCOME = {
  en: "Namaste! 🙏 I'm **Saathi**, your helper from NayePankh Foundation.\n\nI can assist you with:\n• 📚 Education & scholarships\n• 🍱 Food assistance & ration cards\n• 🌸 Women's health & hygiene\n\nWhat would you like help with today?",
  hi: "नमस्ते! 🙏 मैं **साथी** हूँ — NayePankh Foundation का आपका सहायक।\n\nमैं इन विषयों में मदद कर सकता हूँ:\n• 📚 शिक्षा और छात्रवृत्ति\n• 🍱 खाद्य सहायता और राशन कार्ड\n• 🌸 महिला स्वास्थ्य और स्वच्छता\n\nआज आप किस बारे में जानना चाहते हैं?",
};

function formatMessage(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n/g, "<br/>");
}

export default function SaathiChatbot() {
  const [lang, setLang] = useState("en");
  const [messages, setMessages] = useState([
    { role: "assistant", content: WELCOME.en, id: 0 },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTopics, setShowTopics] = useState(true);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const switchLang = (newLang) => {
    setLang(newLang);
    setMessages([{ role: "assistant", content: WELCOME[newLang], id: Date.now() }]);
    setShowTopics(true);
  };

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setShowTopics(false);

    const userMsg = { role: "user", content: userText, id: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setLoading(true);

    

    try {
      const response = await fetch("/api/chat", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    message: userText,
    language: lang,
  }),
});

const data = await response.json();


      const reply =
  data.reply ||
  (lang === "hi"
    ? "माफ़ करें, मुझे कोई उत्तर नहीं मिला।"
    : "Sorry, I couldn't get a response.");
      setMessages((prev) => [...prev, { role: "assistant", content: reply, id: Date.now() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: lang === "hi"
            ? "माफ़ करें, कुछ गड़बड़ हुई। कृपया दोबारा कोशिश करें।"
            : "Sorry, something went wrong. Please try again.",
          id: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div style={{
      fontFamily: "'Hind Siliguri', 'Noto Sans Devanagari', sans-serif",
      background: COLORS.bg,
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        background: COLORS.surface,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "14px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: COLORS.accent,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 20,
          }}>🤝</div>
          <div>
            <div style={{ color: COLORS.white, fontWeight: 600, fontSize: 16, lineHeight: 1.2 }}>
              {lang === "hi" ? "साथी" : "Saathi"}
            </div>
            <div style={{ color: COLORS.accent, fontSize: 11, fontWeight: 500 }}>
              NayePankh Foundation
            </div>
          </div>
        </div>

        {/* Language toggle */}
        <div style={{
          display: "flex",
          background: COLORS.bubble,
          borderRadius: 20,
          padding: 3,
          gap: 2,
        }}>
          {["en", "hi"].map((l) => (
            <button
              key={l}
              onClick={() => switchLang(l)}
              style={{
                padding: "5px 14px",
                borderRadius: 16,
                border: "none",
                cursor: "pointer",
                fontSize: 12,
                fontWeight: 600,
                transition: "all 0.2s",
                background: lang === l ? COLORS.accent : "transparent",
                color: lang === l ? "#fff" : COLORS.muted,
              }}
            >
              {l === "en" ? "EN" : "हिं"}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        paddingBottom: 8,
      }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{
            display: "flex",
            flexDirection: msg.role === "user" ? "row-reverse" : "row",
            alignItems: "flex-end",
            gap: 8,
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: COLORS.accent,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, flexShrink: 0,
              }}>🤝</div>
            )}
            <div style={{
              maxWidth: "78%",
              padding: "10px 14px",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              background: msg.role === "user" ? COLORS.userBubble : COLORS.bubble,
              color: COLORS.white,
              fontSize: 14,
              lineHeight: 1.6,
              border: msg.role === "assistant" ? `1px solid ${COLORS.border}` : "none",
            }}
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
            />
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: "50%",
              background: COLORS.accent,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
            }}>🤝</div>
            <div style={{
              padding: "12px 16px",
              borderRadius: "18px 18px 18px 4px",
              background: COLORS.bubble,
              border: `1px solid ${COLORS.border}`,
              display: "flex", gap: 5, alignItems: "center",
            }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width: 7, height: 7, borderRadius: "50%",
                  background: COLORS.accent,
                  animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
                }} />
              ))}
            </div>
          </div>
        )}

        {/* Quick topics */}
        {showTopics && !loading && (
          <div style={{ marginTop: 8 }}>
            <div style={{ color: COLORS.muted, fontSize: 12, marginBottom: 8, paddingLeft: 4 }}>
              {lang === "hi" ? "जल्दी शुरू करें:" : "Quick topics:"}
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {QUICK_TOPICS[lang].map((topic, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(topic.text)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 20,
                    border: `1px solid ${COLORS.accent}`,
                    background: "transparent",
                    color: COLORS.accentLight,
                    fontSize: 13,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = COLORS.accent;
                    e.target.style.color = "#fff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = COLORS.accentLight;
                  }}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div style={{
        background: COLORS.surface,
        borderTop: `1px solid ${COLORS.border}`,
        padding: "12px 12px 16px",
        display: "flex",
        gap: 8,
        alignItems: "flex-end",
      }}>
        <textarea
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKey}
          placeholder={lang === "hi" ? "यहाँ लिखें..." : "Type your message..."}
          rows={1}
          style={{
            flex: 1,
            background: COLORS.bubble,
            border: `1px solid ${COLORS.border}`,
            borderRadius: 20,
            padding: "10px 16px",
            color: COLORS.white,
            fontSize: 14,
            resize: "none",
            outline: "none",
            fontFamily: "inherit",
            lineHeight: 1.5,
            maxHeight: 100,
            overflowY: "auto",
          }}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + "px";
          }}
        />
        <button
          onClick={() => sendMessage()}
          disabled={!input.trim() || loading}
          style={{
            width: 42, height: 42,
            borderRadius: "50%",
            border: "none",
            background: input.trim() && !loading ? COLORS.accent : COLORS.border,
            cursor: input.trim() && !loading ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18,
            transition: "background 0.2s",
            flexShrink: 0,
          }}
        >
          ➤
        </button>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: "center",
        padding: "6px 0 10px",
        background: COLORS.surface,
        color: COLORS.muted,
        fontSize: 11,
      }}>
        NayePankh Foundation · contact@nayepankh.com · +91-8318500748
      </div>

      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
          40% { transform: translateY(-6px); opacity: 1; }
        }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.border}; border-radius: 4px; }
        textarea::placeholder { color: ${COLORS.muted}; }
      `}</style>
    </div>
  );
}
