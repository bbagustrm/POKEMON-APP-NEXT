"use client";

import React, { useState, useEffect, useRef } from "react";
import { XIcon, CheckCircleIcon, StarIcon, SmileyXEyesIcon } from "@phosphor-icons/react";
import { useAppDispatch } from "@/store/hooks";
import { catchPokemon } from "@/store/slices/collectionSlice";
import { PokeballIcon } from "@/components/icons/PokeballIcon";
import { PokemonTypeBadge } from "@/components/pokemon/PokemonTypeBadge";
import { getPokemonSpriteUrl } from "@/services/pokeApi";
import type { Pokemon } from "@/types/pokemon";

type Phase = "throwing" | "shaking" | "failed" | "success" | "naming";

interface CatchModalProps {
    pokemon: Pokemon;
    onClose: () => void;
}

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
    return Array.from({ length: count }, (_, i) => ({
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

function ConfettiParticle({ p }: { p: Particle }) {
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
                    style={{ color: p.color, transform: `rotate(${p.rotation}deg)` }}
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

export function CatchModal({ pokemon, onClose }: CatchModalProps) {
    const dispatch = useAppDispatch();
    const [phase, setPhase] = useState<Phase>("throwing");
    const [nickname, setNickname] = useState("");
    const [saved, setSaved] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [showSparkle, setShowSparkle] = useState(false);
    const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

    const { src: spriteUrl } = getPokemonSpriteUrl(pokemon.id, pokemon.sprites);

    function addTimer(fn: () => void, ms: number) {
        const t = setTimeout(fn, ms);
        timers.current.push(t);
        return t;
    }

    useEffect(() => {
        // Throw → shake → 50/50 result
        addTimer(() => setPhase("shaking"), 800);
        addTimer(() => {
            const success = Math.random() < 0.5;
            if (success) {
                setPhase("success");
                setParticles(generateParticles(40));
                setShowSparkle(true);
                addTimer(() => setPhase("naming"), 800);
            } else {
                setPhase("failed");
                // Tutup modal otomatis setelah 2 detik
                addTimer(onClose, 2000);
            }
        }, 2400);

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

    // Warna header berdasarkan phase
    const headerBg = (() => {
        if (phase === "failed") return "linear-gradient(135deg, #374151 0%, #1f2937 100%)";
        if (phase === "success" || phase === "naming")
            return "linear-gradient(135deg, #1A1A2E 0%, #16213E 50%, #0F3460 100%)";
        return "linear-gradient(135deg, #E3350D 0%, #c42d0b 100%)";
    })();

    return (
        <>
            <style>{`
        @keyframes confetti-fall {
          0%   { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(420px) rotate(720deg); opacity: 0; }
        }
        @keyframes sparkle-pop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          50%  { transform: scale(1.2) rotate(5deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes pokemon-reveal {
          0%   { transform: scale(0.3) translateY(20px); opacity: 0; filter: brightness(5); }
          50%  { transform: scale(1.15) translateY(-8px); filter: brightness(1.5); }
          100% { transform: scale(1) translateY(0); opacity: 1; filter: brightness(1); }
        }
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px 5px rgba(255,203,5,0.4); }
          50%       { box-shadow: 0 0 40px 15px rgba(255,203,5,0.7); }
        }
        @keyframes star-spin {
          0%   { transform: rotate(0deg) scale(0); opacity: 0; }
          50%  { transform: rotate(180deg) scale(1.3); opacity: 1; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.8; }
        }
        @keyframes shake-success {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-4px); }
          40%       { transform: translateX(4px); }
          60%       { transform: translateX(-3px); }
          80%       { transform: translateX(3px); }
        }
        @keyframes failed-shake {
          0%, 100% { transform: translateX(0) rotate(0deg); }
          15%       { transform: translateX(-8px) rotate(-5deg); }
          30%       { transform: translateX(8px) rotate(5deg); }
          45%       { transform: translateX(-6px) rotate(-3deg); }
          60%       { transform: translateX(6px) rotate(3deg); }
          75%       { transform: translateX(-3px) rotate(-1deg); }
        }
        @keyframes pokemon-flee {
          0%   { transform: scale(1) translateX(0); opacity: 1; }
          30%  { transform: scale(1.1) translateX(-10px); opacity: 1; }
          100% { transform: scale(0.3) translateX(80px); opacity: 0; }
        }
        @keyframes failed-pop {
          0%   { transform: scale(0.8); opacity: 0; }
          60%  { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-sparkle-pop    { animation: sparkle-pop 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .animate-pokemon-reveal { animation: pokemon-reveal 0.7s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .animate-glow-pulse     { animation: glow-pulse 1.5s ease-in-out infinite; }
        .animate-star-spin      { animation: star-spin 0.8s ease-out forwards; }
        .animate-shake-success  { animation: shake-success 0.4s ease-in-out; }
        .animate-failed-shake   { animation: failed-shake 0.6s ease-in-out; }
        .animate-pokemon-flee   { animation: pokemon-flee 0.8s ease-in 0.3s forwards; }
        .animate-failed-pop     { animation: failed-pop 0.4s ease-out forwards; }
      `}</style>

            <div
                className="fixed inset-0 z-50 flex items-end md:items-center justify-center
                   bg-black/70 backdrop-blur-sm overflow-hidden"
                onClick={handleBackdropClick}
            >
                {/* Confetti — hanya saat success */}
                <div className="absolute inset-x-0 top-0 pointer-events-none overflow-hidden h-full">
                    {particles.map((p) => <ConfettiParticle key={p.id} p={p} />)}
                </div>

                {/* Modal */}
                <div
                    className="relative w-full max-w-sm mx-4 mb-4 md:mb-0 rounded-3xl overflow-hidden shadow-2xl bg-white z-10"
                    style={{ animation: "sparkle-pop 0.35s cubic-bezier(0.34,1.56,0.64,1) forwards" }}
                >
                    {/* ===== HEADER ===== */}
                    <div
                        className="relative overflow-hidden pt-8 pb-16 flex flex-col items-center"
                        style={{ background: headerBg, transition: "background 0.6s ease" }}
                    >
                        {phase === "naming" && (
                            <button
                                onClick={onClose}
                                className="absolute top-3 right-3 text-white/50 hover:text-white transition-colors z-10"
                            >
                                <XIcon size={22} weight="bold" />
                            </button>
                        )}

                        <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-10 bg-white" />
                        <div className="absolute -left-4 -bottom-4 w-24 h-24 rounded-full opacity-10 bg-white" />

                        {/* Sparkle stars — hanya success */}
                        {showSparkle && (
                            <>
                                {[
                                    { top: "15%", left: "12%",  size: 20, delay: "0s" },
                                    { top: "20%", right: "10%", size: 16, delay: "0.15s" },
                                    { top: "55%", left: "8%",   size: 14, delay: "0.25s" },
                                    { top: "60%", right: "8%",  size: 18, delay: "0.1s" },
                                    { top: "35%", left: "20%",  size: 12, delay: "0.3s" },
                                    { top: "40%", right: "18%", size: 22, delay: "0.05s" },
                                ].map((s, i) => (
                                    <div
                                        key={i}
                                        className="absolute pointer-events-none"
                                        style={{ ...s, animation: `star-spin 0.8s ease-out ${s.delay} forwards` }}
                                    >
                                        <StarIcon size={s.size} weight="fill" style={{ color: "#FFCB05" }} />
                                    </div>
                                ))}
                            </>
                        )}

                        {/* Phase: throwing */}
                        {phase === "throwing" && (
                            <div className="flex flex-col items-center gap-4">
                                <div className="animate-bounce">
                                    <PokeballIcon size={72} color="white" />
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
                                    <PokeballIcon size={72} color="white" />
                                </div>
                                <p className="text-white/80 text-sm font-display font-medium animate-pulse">
                                    Menangkap...
                                </p>
                            </div>
                        )}

                        {/* Phase: FAILED — Pokemon kabur */}
                        {phase === "failed" && (
                            <div className="flex flex-col items-center gap-3 animate-failed-pop">
                                <div className="relative">
                                    {/* Pokeball meledak */}
                                    <div className="animate-failed-shake">
                                        <PokeballIcon size={56} color="#9ca3af" />
                                    </div>
                                    {/* Pokemon flee */}
                                    <div
                                        className="absolute -right-12 -top-4 animate-pokemon-flee"
                                        style={{ imageRendering: "pixelated" }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={spriteUrl}
                                            alt={pokemon.name}
                                            width={60}
                                            height={60}
                                            className="object-contain opacity-80"
                                            style={{ imageRendering: pokemon.id <= 649 ? "pixelated" : "auto" }}
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 mt-2">
                                    <SmileyXEyesIcon size={22} weight="fill" className="text-gray-400" />
                                    <p className="text-gray-300 font-display font-bold text-base">
                                        Oh no! It broke free!
                                    </p>
                                </div>
                                <p className="text-gray-500 text-xs font-display animate-pulse">
                                    Menutup otomatis...
                                </p>
                            </div>
                        )}

                        {/* Phase: success */}
                        {phase === "success" && (
                            <div className="flex flex-col items-center gap-2 animate-sparkle-pop">
                                <div
                                    className="rounded-full p-3 animate-glow-pulse"
                                    style={{ background: "rgba(255,203,5,0.15)" }}
                                >
                                    <div
                                        className="rounded-full p-2"
                                        style={{ background: "rgba(255,203,5,0.25)" }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={spriteUrl}
                                            alt={pokemon.name}
                                            width={110}
                                            height={110}
                                            className="object-contain animate-pokemon-reveal"
                                            style={{ imageRendering: pokemon.id <= 649 ? "pixelated" : "auto" }}
                                        />
                                    </div>
                                </div>
                                <p className="text-[#FFCB05] font-display font-bold text-lg animate-shake-success">
                                    ✨ Berhasil ditangkap! ✨
                                </p>
                            </div>
                        )}

                        {/* Phase: naming */}
                        {phase === "naming" && (
                            <div className="flex flex-col items-center">
                                <div
                                    className="rounded-full p-3"
                                    style={{ background: "rgba(255,203,5,0.12)" }}
                                >
                                    <div
                                        className="rounded-full p-2"
                                        style={{ background: "rgba(255,203,5,0.2)" }}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={spriteUrl}
                                            alt={pokemon.name}
                                            width={100}
                                            height={100}
                                            className="object-contain"
                                            style={{ imageRendering: pokemon.id <= 649 ? "pixelated" : "auto" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* ===== BODY ===== */}
                    <div className="px-6 pt-4 pb-6 -mt-6 relative bg-white rounded-t-3xl">
                        <div className="text-center mb-4">
                            <p className="text-xs text-gray-400 font-display font-medium mb-1">
                                #{String(pokemon.id).padStart(3, "0")}
                            </p>
                            <h2 className="text-2xl font-bold font-display capitalize text-[#1A1A2E]">
                                {pokemon.name}
                            </h2>
                            <div className="flex justify-center gap-2 mt-2">
                                {pokemon.types.map((t) => (
                                    <PokemonTypeBadge key={t.type.name} type={t.type.name} />
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
                                            <CheckCircleIcon weight="fill" size={18} />
                                            Tersimpan!
                                        </>
                                    ) : (
                                        <>
                                            <PokeballIcon size={18} color="white" />
                                            Tambah ke Koleksi
                                        </>
                                    )}
                                </button>
                            </div>
                        )}

                        {/* Skeleton / loading phases */}
                        {(phase === "throwing" || phase === "shaking") && (
                            <div className="h-12 rounded-xl bg-gray-100 animate-pulse mt-2" />
                        )}

                        {/* Failed state body */}
                        {phase === "failed" && (
                            <div className="text-center py-2">
                                <p className="text-sm text-gray-500 font-display">
                  <span className="font-semibold capitalize text-[#1A1A2E]">
                    {pokemon.name}
                  </span>{" "}
                                    berhasil melarikan diri!
                                </p>
                                <p className="text-xs text-gray-400 font-display mt-1">
                                    Coba lagi untuk menangkapnya.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}