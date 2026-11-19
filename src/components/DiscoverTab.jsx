"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence } from "framer-motion";
import { Heart, X, Users, Flame } from "lucide-react";
import SwipeCard from "./SwipeCard";
import MatchModal from "./MatchModal";
import MatchesView from "./MatchesView";

export default function DiscoverTab() {
  const [view, setView] = useState("swipe");
  const [feed, setFeed] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);
  const [newMatch, setNewMatch] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [feedRes, matchesRes] = await Promise.all([
        fetch("/api/feed"),
        fetch("/api/matches"),
      ]);
      const feedData = await feedRes.json();
      const matchesData = await matchesRes.json();
      setFeed(feedData.profiles || []);
      setMatches(matchesData.matches || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSwipe = async (action) => {
    if (swiping || feed.length === 0) return;
    const current = feed[0];
    setSwiping(true);
    setFeedback(action);

    try {
      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId: current.id, action }),
      });

      if (res.ok) {
        const data = await res.json();
        setFeed((prev) => prev.slice(1));
        if (data.matched && data.match) {
          setNewMatch(data.match);
          setMatches((prev) => [data.match, ...prev]);
        }
      }
    } finally {
      setSwiping(false);
      setTimeout(() => setFeedback(null), 300);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="flex items-center justify-between px-5 py-4">
        <h1 className="text-xl font-extrabold tracking-tight text-neutral-900">Discover</h1>
        <div className="flex bg-[#F4F2F7] p-1 rounded-full border-2 border-neutral-900">
          <button
            onClick={() => setView("swipe")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              view === "swipe"
                ? "bg-[#EF5382] text-neutral-900 border border-neutral-900"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            Explore
          </button>
          <button
            onClick={() => setView("matches")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition ${
              view === "matches"
                ? "bg-[#EF5382] text-neutral-900 border border-neutral-900"
                : "text-neutral-600 hover:text-neutral-900"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Matches ({matches.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm font-medium">
          Loading profiles...
        </div>
      ) : view === "matches" ? (
        <MatchesView matches={matches} />
      ) : feed.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
          <div className="w-16 h-16 rounded-full bg-[#FEF08A] border-2 border-neutral-900 shadow-[3px_3px_0px_0px_#171717] flex items-center justify-center mb-4">
            <Flame className="w-7 h-7 text-neutral-900" />
          </div>
          <h2 className="text-lg font-extrabold text-neutral-900">You're all caught up</h2>
          <p className="text-sm text-neutral-500 mt-1">
            No more profiles left to discover right now. Check your matches or come back later!
          </p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col px-5 pb-4">
          <div className="relative flex-1 min-h-[420px]">
            <AnimatePresence>
              {feed
                .slice(0, 2)
                .reverse()
                .map((profile, idx, arr) => {
                  const isFront = idx === arr.length - 1;
                  return (
                    <SwipeCard
                      key={profile.id}
                      profile={profile}
                      isFront={isFront}
                      disabled={swiping}
                      onSwipe={handleSwipe}
                    />
                  );
                })}
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-center gap-8 pt-6 pb-2">
            <button
              onClick={() => handleSwipe("PASS")}
              disabled={swiping}
              aria-label="Pass"
              className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-neutral-900 bg-white text-neutral-900 shadow-[4px_4px_0px_0px_#171717] hover:bg-[#FECDD3] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition disabled:opacity-50 ${
                feedback === "PASS" ? "bg-[#FECDD3] translate-x-[2px] translate-y-[2px] shadow-none" : ""
              }`}
            >
              <X className="w-7 h-7 stroke-[2.5]" />
            </button>

            <button
              onClick={() => handleSwipe("LIKE")}
              disabled={swiping}
              aria-label="Like"
              className={`w-16 h-16 rounded-full flex items-center justify-center border-2 border-neutral-900 bg-[#EF5382] text-neutral-900 shadow-[4px_4px_0px_0px_#171717] hover:bg-[#e54374] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition disabled:opacity-50 ${
                feedback === "LIKE" ? "bg-[#e54374] translate-x-[2px] translate-y-[2px] shadow-none" : ""
              }`}
            >
              <Heart className="w-7 h-7 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      <MatchModal
        match={newMatch}
        onClose={() => setNewMatch(null)}
        onViewMatches={() => {
          setNewMatch(null);
          setView("matches");
        }}
      />
    </div>
  );
}
