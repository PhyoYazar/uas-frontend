import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useInit } from "./common/hooks/useInit";
import { Toaster } from "./components/ui/sonner";
import { RootRoute } from "./routes/root";

// Create a client
const queryClient = new QueryClient();

export const App = () => {
  const ready = useInit();

  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <RootRoute />
      <Toaster />
    </QueryClientProvider>
  );
};
