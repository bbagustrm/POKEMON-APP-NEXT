"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import { PokemonTypeBadge } from "@/components/pokemon/PokemonTypeBadge";
import { ReleaseDialog } from "./ReleaseDialog";
import { PokemonDrawer } from "@/components/pokemon/PokemonDrawer";
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
    const [showDrawer, setShowDrawer] = useState(false);

    const primaryType = pokemon.types[0]?.type.name ?? "normal";
    const colors = getTypeColor(primaryType);
    const { src: animatedSpriteUrl, isAnimated } = getPokemonSpriteUrl(pokemon.id, pokemon.sprites);
    const paddedId = String(pokemon.id).padStart(3, "0");

    const staticSpriteUrl =
        pokemon.sprites?.other?.["official-artwork"]?.front_default ??
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

    const caughtDate = new Intl.DateTimeFormat("en-US", {
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
                            transition-all duration-200 group cursor-pointer"
                style={{ backgroundColor: colors.bg }}
                onClick={() => setShowDrawer(true)}
            >
                {/* Decorations */}
                <div className="absolute -right-5 -top-5 w-24 h-24 rounded-full opacity-10"
                     style={{ backgroundColor: colors.border }} />
                <div className="absolute -right-2 -top-2 w-14 h-14 rounded-full opacity-10"
                     style={{ backgroundColor: colors.border }} />

                <div className="relative p-4 pb-3">
                    {/* Header: ID + date */}
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

                    {/* Nickname + species name */}
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

                    {/* Sprite — static always visible, GIF fades in on hover */}
                    <div className="relative flex justify-center my-2 h-24 items-center">
                        {/* Static / official artwork */}
                        <Image
                            src={staticSpriteUrl}
                            alt={pokemon.nickname}
                            width={112}
                            height={112}
                            className={[
                                "object-contain drop-shadow-md absolute",
                                "transition-all duration-200",
                                isAnimated
                                    ? "group-hover:opacity-0 group-hover:scale-110"
                                    : "group-hover:scale-110",
                            ].join(" ")}
                            style={{ imageRendering: "auto" }}
                            loading="lazy"
                        />

                        {/* Animated GIF — only for Gen 1–5 */}
                        {isAnimated && (
                            <Image
                                src={animatedSpriteUrl}
                                alt=""
                                aria-hidden="true"
                                width={112}
                                height={112}
                                className="object-contain drop-shadow-md absolute
                                           opacity-0 group-hover:opacity-100 group-hover:scale-110
                                           transition-all duration-200"
                                style={{ imageRendering: "pixelated" }}
                                unoptimized
                                loading="lazy"
                            />
                        )}
                    </div>

                    {/* Type badges */}
                    <div className="flex flex-wrap gap-1 mb-3">
                        {pokemon.types.map((t) => (
                            <PokemonTypeBadge key={t.type.name} type={t.type.name} size="sm" />
                        ))}
                    </div>

                    {/* Release button — stopPropagation agar tidak trigger drawer */}
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                            onClick={() => setShowDialog(true)}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2
                                       text-xs font-semibold font-display border
                                       hover:bg-white/50 active:scale-95 transition-all"
                            style={{ borderColor: colors.border, color: colors.text }}
                        >
                            <ArrowSquareOutIcon size={14} weight="bold" />
                            Release
                        </button>
                    </div>
                </div>
            </div>

            {showDrawer && (
                <PokemonDrawer
                    pokemon={pokemon}
                    onClose={() => setShowDrawer(false)}
                />
            )}

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