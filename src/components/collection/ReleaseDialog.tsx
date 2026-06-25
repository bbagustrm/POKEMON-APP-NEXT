"use client";

import { XIcon, WarningIcon } from "@phosphor-icons/react";
import { PokeballIcon } from "@/components/icons/PokeballIcon";
import type { CaughtPokemon } from "@/types/pokemon";
import Image from "next/image";

interface ReleaseDialogProps {
    pokemon: CaughtPokemon;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ReleaseDialog({ pokemon, onConfirm, onCancel }: ReleaseDialogProps) {
    const imageUrl =
        pokemon.sprites.other["official-artwork"].front_default ??
        pokemon.sprites.front_default ??
        "";

    return (
        <div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <div className="w-full max-w-sm mx-4 mb-4 md:mb-0 rounded-3xl overflow-hidden shadow-2xl bg-white animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="relative bg-gray-900 pt-8 pb-14 flex flex-col items-center gap-3">
                    <button
                        onClick={onCancel}
                        className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors"
                    >
                        <XIcon size={20} weight="bold" />
                    </button>

                    {/* Pokeball bg decoration */}
                    <div className="absolute bottom-0 right-0 opacity-5 translate-x-4 translate-y-4">
                        <PokeballIcon size={120} color="white" />
                    </div>

                    <div className="relative w-28 h-28 drop-shadow-xl">
                        <Image
                            src={imageUrl}
                            alt={pokemon.nickname}
                            fill
                            className="object-contain opacity-80"
                            sizes="112px"
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="px-6 pt-4 pb-6 -mt-6 bg-white rounded-t-3xl relative">
                    <div className="flex items-center justify-center gap-2 mb-1">
                        <WarningIcon size={18} weight="fill" className="text-amber-500" />
                        <p className="text-xs font-semibold font-display text-amber-600 uppercase tracking-wide">
                            Release Pokémon
                        </p>
                    </div>

                    <h2 className="text-2xl font-bold font-display text-center text-[#1A1A2E] capitalize mb-1">
                        {pokemon.nickname}
                    </h2>
                    {pokemon.nickname !== pokemon.name && (
                        <p className="text-center text-xs text-gray-400 font-display capitalize mb-3">
                            ({pokemon.name})
                        </p>
                    )}

                    <p className="text-center text-sm text-gray-500 mb-5 leading-relaxed">
                        Are you sure you want to release{" "}
                        <span className="font-semibold capitalize text-[#1A1A2E]">
              {pokemon.nickname}
            </span>
                        ? This Pokémon will be gone forever.
                    </p>

                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold
                         font-display text-gray-600 hover:bg-gray-50 active:scale-95 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white
                         text-sm font-semibold font-display active:scale-95 transition-all shadow-sm"
                        >
                            Yes, Release
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}