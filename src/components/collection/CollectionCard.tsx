
"use client";

import { useState } from "react";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { PokemonTypeBadge } from "@/components/pokemon/PokemonTypeBadge";
import { ReleaseDialog } from "./ReleaseDialog";
import { useAppDispatch } from "@/store/hooks";
import { releasePokemon } from "@/store/slices/collectionSlice";
import { getPokemonSpriteUrl } from "@/services/pokeApi";
import type { CaughtPokemon } from "@/types/pokemon";
import { getTypeColor } from "@/lib/typeColors";

interface CollectionCardProps {
    pokemon: CaughtPokemon;
}

export function CollectionCard({ pokemon }: CollectionCardProps) {
    const dispatch = useAppDispatch();
    const [showDialog, setShowDialog] = useState(false);

    const primaryType = pokemon.types[0]?.type.name ?? "normal";
    const colors = getTypeColor(primaryType);
    const { src: spriteUrl } = getPokemonSpriteUrl(pokemon.id, pokemon.sprites);
    const paddedId = String(pokemon.id).padStart(3, "0");

    const caughtDate = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(new Date(pokemon.caughtAt));

    function handleRelease() {
        dispatch(releasePokemon(pokemon.id));
        setShowDialog(false);
    }

    return (
        <>
            <div
                className="relative rounded-2xl overflow-hidden border border-white/60
                   shadow-sm hover:shadow-md hover:-translate-y-0.5
                   transition-all duration-200 group"
                style={{ backgroundColor: colors.bg }}
            >
                <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full opacity-10"
                     style={{ backgroundColor: colors.border }} />
                <div className="absolute -right-2 -top-2 w-14 h-14 rounded-full opacity-10"
                     style={{ backgroundColor: colors.border }} />

                <div className="relative p-4 pb-3">
                    <div className="flex justify-between items-start mb-1">
            <span className="text-[10px] font-bold font-display opacity-40"
                  style={{ color: colors.text }}>
              #{paddedId}
            </span>
                        <span className="text-[10px] font-display opacity-50"
                              style={{ color: colors.text }}>
              {caughtDate}
            </span>
                    </div>

                    <h3 className="text-base font-bold font-display capitalize leading-tight"
                        style={{ color: colors.text }}>
                        {pokemon.nickname}
                    </h3>
                    {pokemon.nickname !== pokemon.name && (
                        <p className="text-[11px] opacity-50 capitalize font-display"
                           style={{ color: colors.text }}>
                            {pokemon.name}
                        </p>
                    )}

                    <div className="flex justify-center my-2 h-24 items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={spriteUrl}
                            alt={pokemon.nickname}
                            width={96}
                            height={96}
                            className="object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-200"
                            style={{ imageRendering: pokemon.id <= 649 ? "pixelated" : "auto" }}
                        />
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                        {pokemon.types.map((t) => (
                            <PokemonTypeBadge key={t.type.name} type={t.type.name} size="sm" />
                        ))}
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowDialog(true)}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2
                         text-xs font-semibold font-display border
                         hover:bg-white/50 active:scale-95 transition-all"
                            style={{ borderColor: colors.border, color: colors.text }}
                        >
                            <ArrowSquareOutIcon size={14} weight="bold" />
                            Lepaskan
                        </button>
                    </div>
                </div>
            </div>

            {showDialog && (
                <ReleaseDialog
                    pokemon={pokemon}
                    onConfirm={handleRelease}
                    onCancel={() => setShowDialog(false)}
                />
            )}
        </>
    );
}