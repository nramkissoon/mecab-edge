"use client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PropsWithChildren } from "react";
import { SelectedWordMappingProvider } from "~/components/WordContext";
import { Toaster } from "~/components/Toaster";

const queryClient = new QueryClient();

export const Providers: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <SelectedWordMappingProvider setSelectedWordProvider>
        {children}
        <Toaster />
      </SelectedWordMappingProvider>
    </QueryClientProvider>
  );
};
