import dynamic from "next/dynamic";
import Link from "next/link";
import EvoLogo from "../components/EvoLogo";

const ChatUI = dynamic(() => import("../components/ChatUI"), {
  ssr: false,
});

export default function MentorPage() {
  return (
    <div className="min-h-screen flex flex-col bg-bgCosmic text-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-blueGrey/50 bg-black/60 backdrop-blur-md">
        <Link href="/">
          <EvoLogo width={105} height={53} />
        </Link>
        <span className="text-sm opacity-80">Mentor Mode</span>
      </header>

      {/* Chat */}
      <div className="flex-1">
        <ChatUI theme="dark" />
      </div>
    </div>
  );
} 