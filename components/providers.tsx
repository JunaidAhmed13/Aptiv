"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

/** Wraps the app in a React Query client (server-state for the webhook call). */
export function Providers({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { retry: 1, refetchOnWindowFocus: false },
          // Mutations (the screening submit) handle their own retry via UI.
          mutations: { retry: 0 },
        },
      })
  );

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
