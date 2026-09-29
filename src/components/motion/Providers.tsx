"use client";

import { MotionConfig } from "motion/react";
import { BannerCookies } from "@/components/consentimento/BannerCookies";
import { DiagnosticoProvider } from "@/components/diagnostico/DiagnosticoProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <DiagnosticoProvider>{children}</DiagnosticoProvider>
      <BannerCookies />
    </MotionConfig>
  );
}
