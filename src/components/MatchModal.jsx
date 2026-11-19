"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function MatchModal({ match, onClose, onViewMatches }) {
  if (!match) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-sm bg-white border-2 border-neutral-900 rounded-3xl p-6 text-center text-neutral-900 shadow-[6px_6px_0px_0px_#171717]"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#FDE2E4] border-2 border-neutral-900 text-[#EF5382] mb-3">
          <Heart className="w-6 h-6 fill-[#EF5382]" />
        </div>

        <h2 className="text-3xl font-extrabold tracking-tight text-neutral-900">
          It's a match!
        </h2>
        <p className="text-sm text-neutral-600 mt-1">
          You and <span className="font-semibold text-neutral-900">{match.name}</span> both liked each other.
        </p>

        <img
          src={match.photo_url}
          alt={match.name}
          className="w-28 h-28 rounded-full object-cover mx-auto my-5 border-2 border-neutral-900 shadow-[4px_4px_0px_0px_#171717]"
        />

        <div className="flex flex-col gap-3">
          <button
            onClick={onViewMatches}
            className="w-full py-3 rounded-full bg-[#EF5382] hover:bg-[#e54374] border-2 border-neutral-900 shadow-[3px_3px_0px_0px_#171717] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none font-bold text-neutral-900 transition"
          >
            View Matches
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 rounded-full bg-[#F4F2F7] hover:bg-neutral-200 border-2 border-neutral-900 font-semibold text-neutral-900 transition"
          >
            Keep Swiping
          </button>
        </div>
      </motion.div>
    </div>
  );
}
