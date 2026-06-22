"use client";

import React, {useState, useEffect, useRef} from "react";
import {XIcon, CheckCircleIcon, StarIcon} from "@phosphor-icons/react";
import {useAppDispatch} from "@/store/hooks";
import {catchPokemon} from "@/store/slices/collectionSlice";
import {PokeballIcon} from "@/components/icons/PokeballIcon";
import {PokemonTypeBadge} from "@/components/pokemon/PokemonTypeBadge";
import {getPokemonSpriteUrl} from "@/services/pokeApi";
import type {Pokemon} from "@/types/pokemon";

type Phase = "throwing" | "shaking" | "success" | "naming";

interface CatchModalProps {
    pokemon: Pokemon;
    onClose: () => void;
}

// Konfeti particle
interface Particle {
    id: number;
    x: number;
    color: string;
    size: number;
    delay: number;
    duration: number;
    shape: "circle" | "rect" | "star";
    rotation: number;
}

const CONFETTI_COLORS = [
    "#E3350D", "#FFCB05", "#3B82F6", "#10B981",
    "#A855F7", "#F59E0B", "#EC4899", "#06B6D4",
];

function generateParticles(count: number): Particle[] {
    return Array.from({length: count}, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 6 + Math.random() * 8,
        delay: Math.random() * 0.6,
        duration: 1.2 + Math.random(),
        shape: (["circle", "rect", "star"] as const)[Math.floor(Math.random() * 3)],
        rotation: Math.random() * 360,
    }));
}

function ConfettiParticle({p}: { p: Particle }) {
    return (
        <div
            className="absolute top-0 pointer-events-none"
            style={{
                left: `${p.x}%`,
                animation: `confetti-fall ${p.duration}s ease-in ${p.delay}s forwards`,
                zIndex: 60,
            }}
        >
            {p.shape === "star" ? (
                <StarIcon
                    size={p.size + 4}
                    weight="fill"
                    style={{color: p.color, transform: `rotate(${p.rotation}deg)`}}
                />
            ) : (
                <div
                    style={{
                        width: p.size,
                        height: p.shape === "rect" ? p.size * 0.5 : p.size,
                        backgroundColor: p.color,
                        borderRadius: p.shape === "circle" ? "50%" : 2,
                        transform: `rotate(${p.rotation}deg)`,
                    }}
                />
            )}
        </div>
    );
}

export function CatchModal({pokemon, onClose}: CatchModalProps) {
    const dispatch = useAppDispatch();
    const [phase, setPhase] = useState<Phase>("throwing");
    const [nickname, setNickname] = useState("");
    const [saved, setSaved] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [showSparkle, setShowSparkle] = useState(false);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    const {src: spriteUrl} = getPokemonSpriteUrl(pokemon.id, pokemon.sprites);

    function addTimer(fn: () => void, ms: number) {
        const t = setTimeout(fn, ms);
        timers.current.push(t);
        return t;
    }

    useEffect(() => {
        addTimer(() => setPhase("shaking"), 800);
        addTimer(() => {
            setPhase("success");
            setParticles(generateParticles(40));
            setShowSparkle(true);
        }, 2400);
        addTimer(() => setPhase("naming"), 3200);

        return () => timers.current.forEach(clearTimeout);
    }, []);

    function handleSave() {
        if (saved) return;
        const finalName = nickname.trim() || pokemon.name;
        dispatch(
            catchPokemon({
                id: pokemon.id,
                name: pokemon.name,
                nickname: finalName,
                types: pokemon.types,
                sprites: pokemon.sprites,
                caughtAt: new Date().toISOString(),
            })
        );
        setSaved(true);
        addTimer(onClose, 900);
    }

    function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
        if (e.target === e.currentTarget && phase === "naming") onClose();
    }

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-end md:items-center justify-center
                   bg-black/70 backdrop-blur-sm overflow-hidden"
                onClick={handleBackdropClick}
            >
                {/* Confetti layer */}
                <div className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden h-full">
                    {particles.map((p) => <ConfettiParticle key={p.id} p={p}/>)}
                </div>

                {/* Modal */}
                <div className="relative w-full max-w-sm mx-4 mb-4 md:mb-0 rounded-3xl overflow-hidden
                        shadow-2xl bg-white z-10"
                     style={{
                         animation: "sparkle-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards",
                     }}
                >
                    {/* ===== HEADER ===== */}
                    <div
                        className="relative overflow-hidden pt-8 pb-16 flex flex-col items-center"
                        style={{
                            background: phase === "success" || phase === "naming"
                                ? "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)"
                                : "linear-gradient(135deg, #E3350D 0%, #c42d0b 100%)",
                            transition: "background 0.6s ease",
                        }}
                    >
                        {/* Tutup */}
                        {phase === "naming" && (
                            <button
                                onClick={onClose}
                                className="cursor-pointer absolute top-3 right-3 text-white/50 hover:text-white transition-colors z-10"
                            >
                                <XIcon size={22} weight="bold"/>
                            </button>
                        )}

                        {/* Decorative circles */}
                        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-10 bg-white"/>
                        <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full opacity-10 bg-white"/>

                        {/* Sparkle stars di success */}
                        {showSparkle && (
                            <>
                                {[
                                    {top: "15%", left: "12%", size: 20, delay: "0s"},
                                    {top: "20%", right: "10%", size: 16, delay: "0.15s"},
                                    {top: "55%", left: "8%", size: 14, delay: "0.25s"},
                                    {top: "60%", right: "8%", size: 18, delay: "0.1s"},
                                    {top: "35%", left: "20%", size: 12, delay: "0.3s"},
                                    {top: "40%", right: "18%", size: 22, delay: "0.05s"},
                                ].map((s, i) => (
                                    <div
                                        key={i}
                                        className="absolute pointer-events-none"
                                        style={{...s, animation: `star-spin 0.8s ease-out ${s.delay} forwards`}}
                                    >
                                        <StarIcon size={s.size} weight="fill" style={{color: "#FFCB05"}}/>
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Phase: throwing */}
                        {phase === "throwing" && (
                            <div className="flex flex-col items-center gap-4">
                                <div className="animate-bounce">
                                    <PokeballIcon size={72} color="white"/>
                                </div>
                                <p className="text-white/80 text-sm font-display font-medium animate-pulse">
                                    Melempar Pokeball...
                                </p>
                            </div>
                        )}

                        {/* Phase: shaking */}
                        {phase === "shaking" && (
                            <div className="flex flex-col items-center gap-4">
                                <div className="animate-pokeball-shake">
                                    <PokeballIcon size={72} color="white"/>
                                </div>
                                <p className="text-white/80 text-sm font-display font-medium animate-pulse">
                                    Menangkap...
                                </p>
                            </div>
                        )}

                        {/* Phase: success — Pokemon reveal dengan efek dramatis */}
                        {phase === "success" && (
                            <div className="flex flex-col items-center gap-2 animate-sparkle-pop">
                                {/* Glow ring */}
                                <div
                                    className="rounded-full p-3 animate-glow-pulse"
                                    style={{background: "rgba(255,203,5,0.15)"}}
                                >
                                    <div
                                        className="rounded-full p-2"
                                        style={{background: "rgba(255,203,5,0.25)"}}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={spriteUrl}
                                            alt={pokemon.name}
                                            width={110}
                                            height={110}
                                            className="object-contain animate-pokemon-reveal"
                                            style={{imageRendering: pokemon.id <= 649 ? "pixelated" : "auto"}}
                                        />
                                    </div>
                                </div>
                                <p className="text-[#FFCB05] font-display font-bold text-lg animate-shake-success">
                                    ✨ Berhasil ditangkap! ✨
                                </p>
                            </div>
                        )}

                        {/* Phase: naming — tetap tampilkan Pokemon dengan glow */}
                        {phase === "naming" && (
                            <div className="flex flex-col items-center">
                                <div
                                    className="rounded-full p-3"
                                    style={{background: "rgba(255,203,5,0.12)"}}
                                >
                                    <div
                                        className="rounded-full p-2"
                                        style={{background: "rgba(255,203,5,0.2)"}}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={spriteUrl}
                                            alt={pokemon.name}
                                            width={100}
                                            height={100}
                                            className="object-contain"
                                            style={{imageRendering: pokemon.id <= 649 ? "pixelated" : "auto"}}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ===== BODY ===== */}
                    <div className="px-6 pt-4 pb-6 -mt-6 relative bg-white rounded-t-3xl">
                        {/* Pokemon info */}
                        <div className="text-center mb-4">
                            <p className="text-xs text-gray-400 font-display font-medium mb-1">
                                #{String(pokemon.id).padStart(3, "0")}
                            </p>
                            <h2 className="text-2xl font-bold font-display capitalize text-[#1A1A2E]">
                                {pokemon.name}
                            </h2>
                            <div className="flex justify-center gap-2 mt-2">
                                {pokemon.types.map((t) => (
                                    <PokemonTypeBadge key={t.type.name} type={t.type.name}/>
                                ))}
                            </div>
                        </div>

                        {/* Naming form */}
                        {phase === "naming" && (
                            <div className="animate-in slide-in-from-bottom-2 duration-300">
                                <label className="block text-xs font-semibold font-display text-gray-500 mb-1.5">
                                    Beri nama Pokemon-mu
                                </label>
                                <input
                                    type="text"
                                    autoFocus
                                    value={nickname}
                                    onChange={(e) => setNickname(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                                    placeholder={pokemon.name}
                                    maxLength={20}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-2.5
                             text-sm font-display text-[#1A1A2E] placeholder-gray-300
                             focus:outline-none focus:ring-2 focus:ring-[#E3350D]/30
                             focus:border-[#E3350D] transition-all"
                                />
                                <p className="text-[10px] text-gray-400 mt-1 text-right">
                                    Kosongkan untuk pakai nama asli
                                </p>
                                <button
                                    onClick={handleSave}
                                    disabled={saved}
                                    className="mt-4 w-full flex items-center justify-center gap-2
                             bg-[#E3350D] hover:bg-[#c42d0b] active:scale-95
                             text-white font-bold font-display rounded-xl py-3
                             transition-all duration-150 disabled:opacity-60"
                                >
                                    {saved ? (
                                        <>
                                            <CheckCircleIcon weight="fill" size={18}/>
                                            Tersimpan!
                                        </>
                                    ) : (
                                        <>
                                            <PokeballIcon size={18} color="white"/>
                                            Tambah ke Koleksi
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Skeleton button saat loading phases */}
                        {phase !== "naming" && (
                            <div className="h-12 rounded-xl bg-gray-100 animate-pulse mt-2"/>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}