import Header from "@/components/Header";
import type { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />

      <main className="p-4 md:p-6">{children}</main>
    </>
  );
}
