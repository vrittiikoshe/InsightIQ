import { useState } from "react";
import { Send } from "lucide-react";
import { chatWithDocument } from "../services/chatService";

function ChatBox({ documentId }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    const userQuestion = question;

    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userQuestion,
      },
    ]);

    setQuestion("");
    setLoading(true);

    try {
      const data = await chatWithDocument(documentId, userQuestion);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: data.answer,
        },
      ]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="mt-8 bg-white rounded-3xl shadow p-6">

      <h2 className="text-2xl font-bold mb-5">
        💬 Chat with your document
      </h2>

      <div className="h-80 overflow-y-auto border rounded-xl p-4 bg-stone-50">

        {messages.length === 0 && (
          <p className="text-stone-500">
            Ask anything about this document.
          </p>
        )}

        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.sender === "user"
                ? "text-right"
                : "text-left"
            }`}
          >
            <div
              className={`inline-block px-4 py-3 rounded-2xl ${
                msg.sender === "user"
                  ? "bg-[#65735B] text-white"
                  : "bg-stone-200"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-stone-500">
            AI is thinking...
          </p>
        )}

      </div>

      <div className="flex gap-3 mt-5">

        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Ask anything..."
          className="flex-1 border rounded-xl px-4 py-3 outline-none"
        />

        <button
          onClick={handleSend}
          className="bg-[#65735B] hover:bg-[#55624D] text-white px-5 rounded-xl"
        >
          <Send size={20} />
        </button>

      </div>

    </div>
  );
}

export default ChatBox;