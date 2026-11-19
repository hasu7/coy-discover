"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { MapPin } from "lucide-react";

export default function SwipeCard({ profile, onSwipe, isFront, disabled }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-16, 16]);
  const likeOpacity = useTransform(x, [40, 120], [0, 1]);
  const passOpacity = useTransform(x, [-120, -40], [1, 0]);

  const handleDragEnd = (_, info) => {
    if (disabled) return;
    if (info.offset.x > 110) {
      onSwipe("LIKE");
    } else if (info.offset.x < -110) {
      onSwipe("PASS");
    }
  };

  return (
    <motion.div
      style={{ x, rotate }}
      drag={isFront && !disabled ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      initial={{ scale: isFront ? 1 : 0.96, y: isFront ? 0 : 12, opacity: isFront ? 1 : 0.85 }}
      animate={{ scale: isFront ? 1 : 0.96, y: isFront ? 0 : 12, opacity: isFront ? 1 : 0.85 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`absolute inset-0 rounded-3xl overflow-hidden bg-white border-2 border-neutral-900 shadow-[5px_5px_0px_0px_#171717] select-none ${
        isFront ? "z-10 cursor-grab active:cursor-grabbing" : "z-0 pointer-events-none"
      }`}
    >
      <img
        src={profile.photo_url}
        alt={profile.name}
        draggable={false}
        className="w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />

      <motion.div
        style={{ opacity: likeOpacity }}
        className="absolute top-6 left-6 bg-[#A7F3D0] border-2 border-neutral-900 text-neutral-900 font-extrabold text-2xl px-4 py-1 rounded-full -rotate-12 tracking-wider shadow-[3px_3px_0px_0px_#171717] pointer-events-none"
      >
        LIKE
      </motion.div>

      <motion.div
        style={{ opacity: passOpacity }}
        className="absolute top-6 right-6 bg-[#FECDD3] border-2 border-neutral-900 text-neutral-900 font-extrabold text-2xl px-4 py-1 rounded-full rotate-12 tracking-wider shadow-[3px_3px_0px_0px_#171717] pointer-events-none"
      >
        PASS
      </motion.div>

      <div className="absolute bottom-0 inset-x-0 p-5 text-white">
        <div className="flex items-baseline gap-2">
          <h2 className="text-2xl font-extrabold tracking-tight">{profile.name}</h2>
          <span className="text-xl font-medium text-neutral-200">{profile.age}</span>
        </div>

        <div className="flex items-center gap-1 text-sm text-neutral-200 mt-0.5">
          <MapPin className="w-3.5 h-3.5" />
          <span>{profile.location}</span>
        </div>

        <p className="text-sm text-neutral-100 mt-2.5 leading-snug line-clamp-2">
          {profile.bio}
        </p>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {profile.interests.map((interest) => (
            <span
              key={interest}
              className="text-xs font-semibold bg-white/95 text-neutral-900 border border-neutral-900 px-2.5 py-1 rounded-full"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
