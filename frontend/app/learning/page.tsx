import dynamic from "next/dynamic";
import Link from "next/link";
import EvoLogo from "../components/EvoLogo";

// Dynamically import ChatUI to avoid SSR issues with window usage
const ChatUI = dynamic(() => import("../components/ChatUI"), {
  ssr: false,
});

export default function LearningPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-200 bg-white shadow-sm">
        <Link href="/">
          <EvoLogo width={105} height={53} />
        </Link>
        <span className="text-sm text-blueGrey">Learning Mode</span>
      </header>

      {/* Chat */}
      <div className="flex-1">
        <ChatUI theme="light" />
      </div>
    </div>
  );
} 