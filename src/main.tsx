import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "./components/ui/sonner.tsx";
import "./index.css";
import { RootRoute } from "./routes/root.tsx";

// Create a client
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RootRoute />
      <Toaster />
    </QueryClientProvider>
  </React.StrictMode>
);
