"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CheckCircleIcon, BagIcon } from "@phosphor-icons/react";
import { PokeballIcon } from "@/components/icons/PokeballIcon";
import { PokemonTypeBadge } from "./PokemonTypeBadge";
import { CatchModal } from "@/components/catch/CatchModal";
import { PokemonDrawer } from "./PokemonDrawer";
import { useAppSelector } from "@/store/hooks";
import { getPokemonSpriteUrl } from "@/services/pokeApi";
import type { Pokemon } from "@/types/pokemon";
import { getTypeColor } from "@/lib/typeColors";

interface PokemonCardProps {
    pokemon: Pokemon;
    onCatch?: (pokemon: Pokemon) => void;
    priority?: boolean;
}

export function PokemonCard({ pokemon, onCatch, priority = false }: PokemonCardProps) {
    const router = useRouter();
    const collection = useAppSelector((s) => s.collection.pokemon);
    const [showCatchModal, setShowCatchModal] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);

    // Defer isCaught check to avoid SSR/client hydration mismatch
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const isCaught = mounted && collection.some((p) => p.id === pokemon.id);

    const primaryType = pokemon.types[0]?.type.name ?? "normal";
    const colors = getTypeColor(primaryType);
    const { src: animatedSpriteUrl, isAnimated } = getPokemonSpriteUrl(pokemon.id, pokemon.sprites);
    const paddedId = String(pokemon.id).padStart(3, "0");

    // Static sprite — official artwork (high quality, no animation overhead)
    // Falls back to basic sprite if official artwork is unavailable
    const staticSpriteUrl =
        pokemon.sprites?.other?.["official-artwork"]?.front_default ??
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.id}.png`;

    return (
        <>
            <div
                className="relative rounded-2xl overflow-hidden shadow-sm border border-white/60
                            hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                style={{ backgroundColor: colors.bg }}
                onClick={() => setShowDrawer(true)}
            >
                {/* Pokeball decorations */}
                <div
                    className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-10"
                    style={{ backgroundColor: colors.border }}
                />
                <div
                    className="absolute -right-3 -top-3 w-16 h-16 rounded-full opacity-10"
                    style={{ backgroundColor: colors.border }}
                />

                <div className="relative p-4 pb-3 h-full flex flex-col justify-between">
                    {/* Type badges + ID */}
                    <div className="flex items-start justify-between mb-1">
                        <div className="flex flex-wrap gap-1">
                            {pokemon.types.map((t) => (
                                <PokemonTypeBadge key={t.type.name} type={t.type.name} size="sm" />
                            ))}
                        </div>
                        <span
                            className="text-xs font-bold font-display opacity-50"
                            style={{ color: colors.text }}
                        >
                            #{paddedId}
                        </span>
                    </div>

                    {/* Name */}
                    <h3
                        className="text-lg font-bold capitalize font-display leading-tight mt-2"
                        style={{ color: colors.text }}
                    >
                        {pokemon.name}
                    </h3>

                    {/* Sprite container — static image always loads, GIF only swaps in on hover */}
                    <div className="relative flex justify-center mt-2 mb-3 h-28 items-center">
                        {/*
                         * STATIC sprite (official artwork or fallback PNG).
                         * Always rendered — lightweight, good for LCP.
                         * Fades out on hover to reveal the animated GIF below.
                         */}
                        <Image
                            src={staticSpriteUrl}
                            alt={pokemon.name}
                            width={112}
                            height={112}
                            className={[
                                "w-28 h-28 object-contain drop-shadow-md absolute",
                                "transition-all duration-200",
                                // On hover: fade out + scale up (GIF will show underneath)
                                isAnimated
                                    ? "group-hover:opacity-0 group-hover:scale-110"
                                    : "group-hover:scale-110",
                            ].join(" ")}
                            style={{ imageRendering: "auto" }}
                            // priority cards skip lazy-loading → better LCP score
                            priority={priority}
                            loading={priority ? undefined : "lazy"}
                        />

                        {/*
                         * ANIMATED GIF — only rendered for Gen 1–5 Pokémon (id <= 649).
                         * Hidden by default (opacity-0), fades in on card hover.
                         * Loading is always lazy so it never blocks initial paint.
                         */}
                        {isAnimated && (
                            <Image
                                src={animatedSpriteUrl}
                                alt=""
                                aria-hidden="true"
                                width={112}
                                height={112}
                                className="w-28 h-28 object-contain drop-shadow-md absolute
                                           opacity-0 group-hover:opacity-100 group-hover:scale-110
                                           transition-all duration-200"
                                style={{ imageRendering: "pixelated" }}
                                unoptimized // GIFs must bypass Next.js image optimiser
                                loading="lazy"
                            />
                        )}
                    </div>

                    {/* Action buttons — stop propagation so clicks don't open drawer */}
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {isCaught ? (
                            <>
                                <button
                                    onClick={() => router.push("/collection")}
                                    className="flex flex-1 items-center justify-center gap-1 rounded-xl py-2 px-3
                                               text-xs font-semibold font-display border transition-colors"
                                    style={{
                                        borderColor: colors.border,
                                        color: colors.text,
                                        backgroundColor: "rgba(255,255,255,0.5)",
                                    }}
                                >
                                    <BagIcon weight="fill" size={15} />
                                    Collection
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setShowCatchModal(true)}
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2
                                           text-xs font-semibold font-display text-white
                                           hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm"
                                style={{ backgroundColor: "#E3350D" }}
                            >
                                <PokeballIcon size={15} color="white" />
                                Catch!
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showDrawer && (
                <PokemonDrawer
                    pokemon={pokemon}
                    onClose={() => setShowDrawer(false)}
                />
            )}

            {showCatchModal && (
                <CatchModal
                    pokemon={pokemon}
                    onClose={() => setShowCatchModal(false)}
                />
            )}
        </>
    );
}