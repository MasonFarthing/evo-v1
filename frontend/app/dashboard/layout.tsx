import Sidebar from "../components/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "evo Dashboard",
  description: "AI companion dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen bg-bgCosmic text-white">
      <Sidebar />
      <main className="flex-1 bg-gradient-to-br from-black via-darkBlue/20 to-black">
        {children}
      </main>
    </div>
  );
} 