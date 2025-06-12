"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import EvoLogo from "./EvoLogo";

const navItems = [
  { href: "/dashboard", label: "Home" },
  { href: "/dashboard/learning", label: "Learning" },
  { href: "/dashboard/mentor", label: "Mentor" },
  { href: "/dashboard/options", label: "Options" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="h-screen w-56 bg-gradient-to-b from-darkBlue to-black border-r border-blue/30 text-white flex flex-col py-6 px-4 space-y-8 shadow-[0_0_25px_rgba(0,0,0,0.3),inset_0_0_10px_rgba(59,130,246,0.2)]">
      {/* Logo */}
      <Link href="/" className="w-full flex justify-center">
        <EvoLogo width={120} height={60} />
      </Link>

      <nav className="flex-1 flex flex-col gap-2 mt-8">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`px-3 py-2 rounded-md font-medium transition-all ${
                active 
                  ? "bg-gradient-to-r from-blue/30 to-transparent border-l-2 border-l-blue shadow-[0_0_10px_rgba(59,130,246,0.3)]" 
                  : "hover:bg-white/5 hover:border-l hover:border-l-blue/50"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
} 