import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: "#ffffff",
          color: "#333",
          borderRadius: "12px",
          border: "1px solid #e7e5e4",
          padding: "16px",
        },
        success: {
          iconTheme: {
            primary: "#65735B",
            secondary: "#ffffff",
          },
        },
      }}
    />
  </StrictMode>
);