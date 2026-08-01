import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <GoogleOAuthProvider clientId="378982534951-8bc9ac3a4obnjj57g3ui4scofermjng4.apps.googleusercontent.com">
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
      </GoogleOAuthProvider>
    </ThemeProvider>
  </StrictMode>
);