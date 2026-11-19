"use client";

import { Heart, MapPin } from "lucide-react";

export default function MatchesView({ matches }) {
  if (matches.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
        <div className="w-14 h-14 rounded-full bg-[#FDE2E4] border-2 border-neutral-900 flex items-center justify-center mb-3">
          <Heart className="w-6 h-6 text-[#EF5382]" />
        </div>
        <h3 className="text-lg font-bold text-neutral-900">No matches yet</h3>
        <p className="text-sm text-neutral-500 mt-1 max-w-xs">
          Keep swiping! Likes stay completely secret until it's mutual.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-3">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-bold text-neutral-900">Your matches</h2>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#F4F2F7] text-neutral-700">
          {matches.length}
        </span>
      </div>

      {matches.map((m) => (
        <div
          key={m.id}
          className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#F4F2F7] border border-neutral-200/80"
        >
          <img
            src={m.photo_url}
            alt={m.name}
            className="w-13 h-13 rounded-full object-cover shrink-0 border-2 border-neutral-900"
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-neutral-900 truncate">
              {m.name}, {m.age}
            </h4>
            <div className="flex items-center gap-1 text-xs text-neutral-500">
              <MapPin className="w-3 h-3" />
              <span className="truncate">{m.location}</span>
            </div>
            <p className="text-xs text-neutral-600 truncate mt-1">{m.bio}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
