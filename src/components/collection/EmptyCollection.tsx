"use client";

import { useRouter } from "next/navigation";
import { PokeballIcon } from "@/components/icons/PokeballIcon";

export function EmptyCollection() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
            {/* Animated pokeball */}
            <div className="mb-6 opacity-20 animate-[pokeball-bounce_1.5s_ease-in-out_infinite]">
                <PokeballIcon size={80} color="#E3350D" />
            </div>

            <h2 className="font-display font-bold text-xl text-[#1A1A2E] mb-2">
                Collection Empty
            </h2>
            <p className="text-sm text-gray-400 font-display leading-relaxed mb-6 max-w-xs">
                You haven&apos;t caught any Pokémon yet. Start your adventure!
            </p>

            <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#E3350D]
                   text-white text-sm font-bold font-display
                   hover:bg-[#c42d0b] active:scale-95 transition-all shadow-sm"
            >
                <PokeballIcon size={16} color="white" />
                Start Catching Pokémon
            </button>
        </div>
    );
}