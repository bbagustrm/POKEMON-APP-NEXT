"use client";

import {useState, useEffect} from "react";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {CheckCircleIcon, BagIcon} from "@phosphor-icons/react";
import {PokeballIcon} from "@/components/icons/PokeballIcon";
import {PokemonTypeBadge} from "./PokemonTypeBadge";
import {CatchModal} from "@/components/catch/CatchModal";
import {PokemonDrawer} from "./PokemonDrawer";
import {useAppSelector} from "@/store/hooks";
import {getPokemonSpriteUrl} from "@/services/pokeApi";
import type {Pokemon} from "@/types/pokemon";
import {getTypeColor} from "@/lib/typeColors";

interface PokemonCardProps {
    pokemon: Pokemon,
    onCatch?: (pokemon: Pokemon) => void
}

export function PokemonCard({pokemon, onCatch}: PokemonCardProps) {
    const router = useRouter();
    const collection = useAppSelector((s) => s.collection.pokemon);
    const [showCatchModal, setShowCatchModal] = useState(false);
    const [showDrawer, setShowDrawer] = useState(false);

    // Defer isCaught check until after mount to avoid hydration mismatch
    // (server has no localStorage, so collection is [] on SSR)
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);
    const isCaught = mounted && collection.some((p) => p.id === pokemon.id);

    const primaryType = pokemon.types[0]?.type.name ?? "normal";
    const colors = getTypeColor(primaryType);
    const {src: spriteUrl, isAnimated} = getPokemonSpriteUrl(pokemon.id, pokemon.sprites);
    const paddedId = String(pokemon.id).padStart(3, "0");

    return (
        <>
            <div
                className="relative rounded-2xl overflow-hidden shadow-sm border border-white/60
                   hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
                style={{backgroundColor: colors.bg}}
                onClick={() => setShowDrawer(true)}
            >
                {/* Pokeball deco */}
                <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-10"
                     style={{backgroundColor: colors.border}}/>
                <div className="absolute -right-3 -top-3 w-16 h-16 rounded-full opacity-10"
                     style={{backgroundColor: colors.border}}/>

                <div className="relative p-4 pb-3">
                    <div className="flex items-start justify-between mb-1">
                        <div className="flex flex-wrap gap-1">
                            {pokemon.types.map((t) => (
                                <PokemonTypeBadge key={t.type.name} type={t.type.name} size="sm"/>
                            ))}
                        </div>
                        <span className="text-xs font-bold font-display opacity-50"
                              style={{color: colors.text}}>
                          #{paddedId}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold capitalize font-display leading-tight mt-2"
                        style={{color: colors.text}}>
                        {pokemon.name}
                    </h3>

                    <div className="flex justify-center mt-2 mb-3 h-28 items-center">
                        <Image
                            src={spriteUrl}
                            alt={pokemon.name}
                            width={112}
                            height={112}
                            className="w-28 h-28 object-contain drop-shadow-md group-hover:scale-110 transition-transform duration-200"
                            style={{imageRendering: pokemon.id <= 649 ? "pixelated" : "auto"}}
                            unoptimized={isAnimated}
                            loading="lazy"
                        />
                    </div>

                    {/* Buttons — stop propagation so button click doesn't open drawer */}
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        {isCaught ? (
                            <>
                                <button
                                    disabled
                                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2
                             text-xs font-semibold font-display opacity-60 cursor-not-allowed"
                                    style={{backgroundColor: colors.border, color: "#fff"}}
                                >
                                    <CheckCircleIcon weight="fill" size={15}/>
                                    Caught!
                                </button>
                                <button
                                    onClick={() => router.push("/collection")}
                                    className="flex items-center justify-center gap-1 rounded-xl py-2 px-3
                             text-xs font-semibold font-display border transition-colors"
                                    style={{
                                        borderColor: colors.border,
                                        color: colors.text,
                                        backgroundColor: "rgba(255,255,255,0.5)",
                                    }}
                                >
                                    <BagIcon weight="fill" size={15}/>
                                    Collection
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setShowCatchModal(true)}
                                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2
                           text-xs font-semibold font-display text-white
                           hover:opacity-90 active:scale-95 transition-all duration-150 shadow-sm"
                                style={{backgroundColor: "#E3350D"}}
                            >
                                <PokeballIcon size={15} color="white"/>
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