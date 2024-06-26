import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useInit } from "./common/hooks/useInit";
import { Toaster } from "./components/ui/sonner";
import { RootRoute } from "./routes/root";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
      staleTime: 2000,
    },
  },
});

export const App = () => {
  const ready = useInit();

  if (!ready) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <RootRoute />
      <Toaster
        richColors
        position="bottom-left"
        duration={5000}
        theme="light"
        visibleToasts={3}
        closeButton
      />
    </QueryClientProvider>
  );
};
