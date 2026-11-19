"use client";

import { useState } from "react";
import { Home, Compass } from "lucide-react";
import DiscoverTab from "@/components/DiscoverTab";

export default function App() {
  const [activeTab, setActiveTab] = useState("discover");

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex justify-center">
      <div className="w-full max-w-md h-screen bg-white border-x border-neutral-200 flex flex-col">
        <main className="flex-1 overflow-hidden">
          {activeTab === "home" ? (
            <div className="h-full bg-white" aria-label="Home placeholder" />
          ) : (
            <DiscoverTab />
          )}
        </main>

        <nav className="h-16 bg-white border-t-2 border-neutral-900 flex items-center justify-around px-6 shrink-0">
          <button
            onClick={() => setActiveTab("home")}
            className={`flex flex-col items-center gap-1 text-xs font-bold transition ${
              activeTab === "home" ? "text-neutral-900" : "text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            onClick={() => setActiveTab("discover")}
            className={`flex flex-col items-center gap-1 text-xs font-bold transition ${
              activeTab === "discover" ? "text-[#EF5382]" : "text-neutral-400 hover:text-neutral-700"
            }`}
          >
            <Compass className="w-5 h-5" />
            <span>Discover</span>
          </button>
        </nav>
      </div>
    </div>
  );
}
