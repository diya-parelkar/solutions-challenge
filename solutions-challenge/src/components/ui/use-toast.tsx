import { createContext, useContext, ReactNode, useState } from "react";

interface ToastContextType {
  toast: (message: string, variant?: "success" | "error") => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context.toast;
};

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState<string | null>(null);
  const [variant, setVariant] = useState<"success" | "error">("success");

  const toast = (message: string, variant: "success" | "error" = "success") => {
    setMessage(message);
    setVariant(variant);
    setTimeout(() => setMessage(null), 3000); // Hide after 3 seconds
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      {message && (
        <div
          className={`toast ${variant}`}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "10px",
            background: variant === "error" ? "#D9534F" : "#5CB85C",
            color: "white",
            borderRadius: "5px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
          }}
        >
          {message}
        </div>
      )}
    </ToastContext.Provider>
  );
};
