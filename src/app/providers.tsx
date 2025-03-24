'use client'

import ProgressProvider from "@/components/providers/ProgressProvider";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};

export default function Providers({ children }: Props) {
  return (
    <SessionProvider>
      <ProgressProvider>
        {children}
      </ProgressProvider>
    </SessionProvider>
  );
} 