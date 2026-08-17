import { useState } from "react";
import { SendHorizontal, Bot, User } from "lucide-react";

import { chatWithDocument } from "../../services/chatService";

function ChatBox({ documentId }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const response = await chatWithDocument(
        documentId,
        question
      );

      const aiMessage = {
        sender: "ai",
        text: response.answer,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: "Something went wrong while generating the response.",
        },
      ]);
    }

    setQuestion("");
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-3xl shadow p-6 mt-8">

      <h2 className="text-2xl font-bold mb-5">
        Chat with AI
      </h2>

      <div className="h-[420px] overflow-y-auto border rounded-2xl p-5 bg-stone-50 space-y-4">

        {messages.length === 0 && (
          <p className="text-stone-500 text-center mt-10">
            Ask anything about this document.
          </p>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.sender === "user"
                ? "justify-end"
                : "justify-start"
            }`}
          >

            <div
              className={`max-w-[80%] rounded-2xl px-5 py-3 ${
                message.sender === "user"
                  ? "bg-[#65735B] text-white"
                  : "bg-white border"
              }`}
            >

              <div className="flex items-center gap-2 mb-2">

                {message.sender === "user" ? (
                  <User size={16} />
                ) : (
                  <Bot size={16} />
                )}

                <span className="font-semibold">
                  {message.sender === "user" ? "You" : "AI"}
                </span>

              </div>

              <p>{message.text}</p>

            </div>

          </div>
        ))}

        {loading && (
          <div className="flex justify-start">

            <div className="bg-white border rounded-2xl px-5 py-3">

              <div className="flex items-center gap-2">
                <Bot size={16} />
                <span className="font-semibold">
                  AI
                </span>
              </div>

              <p className="mt-2">
                Thinking...
              </p>

            </div>

          </div>
        )}

      </div>

      <div className="flex gap-3 mt-5">

        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
          placeholder="Ask anything about this document..."
          className="flex-1 rounded-xl border px-4 py-3 outline-none"
        />

        <button
          onClick={handleSend}
          className="bg-[#65735B] text-white rounded-xl px-5 hover:bg-[#55624D]"
        >
          <SendHorizontal />
        </button>

      </div>

    </div>
  );
}

export default ChatBox;