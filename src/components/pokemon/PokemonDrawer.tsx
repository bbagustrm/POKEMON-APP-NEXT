"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { XIcon, LightningIcon, BarbellIcon, ArrowRightIcon, StarIcon, DropIcon, LeafIcon } from "@phosphor-icons/react";
import { PokemonTypeBadge } from "./PokemonTypeBadge";
import { PokeballIcon } from "@/components/icons/PokeballIcon";
import { getPokemonSpriteUrl, formatName } from "@/services/pokeApi";
import { getTypeColor } from "@/lib/typeColors";
import { usePokemonDetail } from "@/hooks/usePokemonDetail";
import type { Pokemon } from "@/types/pokemon";

interface PokemonDrawerProps {
    pokemon: Pokemon | null;
    onClose: () => void;
}

const STAT_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    hp:                { label: "HP",      color: "#22c55e", icon: <DropIcon weight="fill" size={12} /> },
    attack:            { label: "ATK",     color: "#f97316", icon: <LightningIcon weight="fill" size={12} /> },
    defense:           { label: "DEF",     color: "#3b82f6", icon: <BarbellIcon weight="fill" size={12} /> },
    "special-attack":  { label: "Sp.ATK", color: "#a855f7", icon: <StarIcon weight="fill" size={12} /> },
    "special-defense": { label: "Sp.DEF", color: "#06b6d4", icon: <LeafIcon weight="fill" size={12} /> },
    speed:             { label: "SPD",     color: "#f43f5e", icon: <LightningIcon weight="fill" size={12} /> },
};

const TABS = ["About", "Stats", "Moves", "Evolution"] as const;
type Tab = typeof TABS[number];

function StatBar({ name, value }: { name: string; value: number }) {
    const cfg = STAT_CONFIG[name] ?? { label: name, color: "#94a3b8", icon: null };
    const pct = Math.min((value / 255) * 100, 100);

    return (
        <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 w-16 shrink-0">
                <span style={{ color: cfg.color }}>{cfg.icon}</span>
                <span className="text-[11px] font-bold font-display" style={{ color: cfg.color }}>
                    {cfg.label}
                </span>
            </div>
            <span className="text-xs font-bold font-display text-gray-700 w-7 text-right shrink-0">
                {value}
            </span>
            <div className="flex-1 h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${pct}%`, backgroundColor: cfg.color }}
                />
            </div>
        </div>
    );
}

function EvolutionCard({ id, name, trigger, minLevel, item }: {
    id: number; name: string; trigger?: string; minLevel?: number; item?: string;
}) {
    const spriteUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/${id}.gif`;
    const fallback  = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    const triggerLabel = (() => {
        if (minLevel) return `Lv.${minLevel}`;
        if (item) return formatName(item);
        if (trigger === "use-item") return "Use Item";
        if (trigger === "trade") return "Trade";
        return "Evolve";
    })();

    return (
        <div className="flex flex-col items-center gap-1">
            <div className="w-32 h-32 flex items-center justify-center rounded-2xl bg-gray-50 border border-gray-100">
                <Image
                    src={id <= 649 ? spriteUrl : fallback}
                    alt={name}
                    width={56}
                    height={56}
                    className="w-24 h-24 object-contain"
                    style={{ imageRendering: id <= 649 ? "pixelated" : "auto" }}
                    unoptimized={id <= 649}
                />
            </div>
            <span className="text-xs font-bold font-display capitalize text-center text-gray-700 leading-tight">
                {name}
            </span>
            <span className="text-[10px] text-gray-400 font-display">
                #{String(id).padStart(3, "0")}
            </span>
        </div>
    );
}

// ─── Tab content ────────────────────────────────────────────────────────────
function TabContent({
                        activeTab, pokemon, species, evolution, flavorText, genus, colors,
                        totalStats, genderRate, femaleChance, maleChance, catchRate,
                        stats, abilities, moves,
                    }: {
    activeTab: Tab;
    pokemon: Pokemon;
    species: any;
    evolution: any[];
    flavorText: string | null;
    genus: string | null;
    colors: ReturnType<typeof getTypeColor>;
    totalStats: number;
    genderRate: number;
    femaleChance: number | null;
    maleChance: number | null;
    catchRate: number | null;
    stats: Pokemon["stats"];
    abilities: Pokemon["abilities"];
    moves: Pokemon["moves"];
}) {
    return (
        <>
            {/* ── ABOUT ── */}
            {activeTab === "About" && (
                <div className="p-5 flex flex-col gap-5">
                    {flavorText && (
                        <div className="rounded-2xl p-4 border border-gray-100"
                             style={{ backgroundColor: colors.bg }}>
                            <p className="text-sm leading-relaxed font-display italic"
                               style={{ color: colors.text }}>
                                &quot;{flavorText}&quot;
                            </p>
                        </div>
                    )}

                    <section>
                        <h3 className="text-[11px] font-bold font-display uppercase tracking-widest text-gray-400 mb-3">
                            Physical
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { label: "Height",        value: `${(pokemon.height / 10).toFixed(1)} m` },
                                { label: "Weight",        value: `${(pokemon.weight / 10).toFixed(1)} kg` },
                                { label: "Base EXP",      value: pokemon.base_experience ?? "—" },
                                { label: "Capture Rate",  value: catchRate !== null ? `${catchRate}%` : "—" },
                            ].map(({ label, value }) => (
                                <div key={label} className="rounded-2xl p-3 bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-display uppercase tracking-wide mb-1">
                                        {label}
                                    </p>
                                    <p className="text-sm font-bold font-display text-gray-800">{value}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[11px] font-bold font-display uppercase tracking-widest text-gray-400 mb-3">
                            Breeding
                        </h3>
                        <div className="flex flex-col gap-2">
                            <div className="rounded-2xl p-3 bg-gray-50 border border-gray-100">
                                <p className="text-[10px] text-gray-400 font-display uppercase tracking-wide mb-2">Gender</p>
                                {genderRate === -1 ? (
                                    <span className="text-sm font-bold font-display text-gray-500">Genderless</span>
                                ) : (
                                    <div className="flex flex-col gap-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-blue-400 text-xs font-bold font-display w-12">
                                                ♂ {maleChance?.toFixed(0)}%
                                            </span>
                                            <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
                                                <div className="h-full rounded-full bg-blue-400"
                                                     style={{ width: `${maleChance}%` }} />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-pink-400 text-xs font-bold font-display w-12">
                                                ♀ {femaleChance?.toFixed(0)}%
                                            </span>
                                            <div className="flex-1 h-3 rounded-full bg-gray-200 overflow-hidden">
                                                <div className="h-full rounded-full bg-pink-400"
                                                     style={{ width: `${femaleChance}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="rounded-2xl p-3 bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-display uppercase tracking-wide mb-1">Egg Groups</p>
                                    <p className="text-sm font-bold font-display text-gray-800 capitalize">
                                        {species?.egg_groups.map((e: any) => formatName(e.name)).join(", ") || "—"}
                                    </p>
                                </div>
                                <div className="rounded-2xl p-3 bg-gray-50 border border-gray-100">
                                    <p className="text-[10px] text-gray-400 font-display uppercase tracking-wide mb-1">Growth Rate</p>
                                    <p className="text-sm font-bold font-display text-gray-800 capitalize">
                                        {species?.growth_rate.name ? formatName(species.growth_rate.name) : "—"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-[11px] font-bold font-display uppercase tracking-widest text-gray-400 mb-3">
                            Abilities
                        </h3>
                        <div className="flex flex-col gap-2">
                            {abilities.map((a) => (
                                <div key={a.ability.name}
                                     className="flex items-center justify-between rounded-2xl px-4 py-3 bg-gray-50 border border-gray-100">
                                    <span className="text-sm font-bold font-display capitalize text-gray-800">
                                        {formatName(a.ability.name)}
                                    </span>
                                    {a.is_hidden && (
                                        <span className="text-[10px] font-bold font-display px-2 py-0.5 rounded-full bg-purple-100 text-purple-600">
                                            Hidden
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>

                    {species?.habitat && (
                        <section>
                            <h3 className="text-[11px] font-bold font-display uppercase tracking-widest text-gray-400 mb-3">
                                Habitat
                            </h3>
                            <div className="rounded-2xl px-4 py-3 bg-gray-50 border border-gray-100">
                                <span className="text-sm font-bold font-display capitalize text-gray-800">
                                    {formatName(species.habitat.name)}
                                </span>
                            </div>
                        </section>
                    )}
                </div>
            )}

            {/* ── STATS ── */}
            {activeTab === "Stats" && (
                <div className="p-5 flex flex-col gap-4">
                    <div className="flex flex-col gap-3">
                        {stats.map((s) => (
                            <StatBar key={s.stat.name} name={s.stat.name} value={s.base_stat} />
                        ))}
                    </div>
                    <div className="rounded-2xl p-4 border-2 mt-2 flex items-center justify-between"
                         style={{ borderColor: colors.border, backgroundColor: colors.bg }}>
                        <span className="text-sm font-bold font-display" style={{ color: colors.text }}>
                            Total Base Stats
                        </span>
                        <span className="text-2xl font-bold font-display" style={{ color: colors.text }}>
                            {totalStats}
                        </span>
                    </div>
                    <p className="text-[10px] text-gray-400 text-center font-display">Max stat value: 255</p>
                </div>
            )}

            {/* ── MOVES ── */}
            {activeTab === "Moves" && (
                <div className="p-5">
                    <p className="text-[10px] text-gray-400 font-display uppercase tracking-widest mb-3">
                        {moves.length} moves available
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        {moves.slice(0, 40).map((m) => (
                            <div key={m.move.name}
                                 className="rounded-xl px-3 py-2 bg-gray-50 border border-gray-100">
                                <span className="text-xs font-semibold font-display capitalize text-gray-700">
                                    {formatName(m.move.name)}
                                </span>
                            </div>
                        ))}
                    </div>
                    {moves.length > 40 && (
                        <p className="text-center text-xs text-gray-400 font-display mt-4">
                            +{moves.length - 40} more moves
                        </p>
                    )}
                </div>
            )}

            {/* ── EVOLUTION ── */}
            {activeTab === "Evolution" && (
                <div className="p-5">
                    {evolution.length <= 1 ? (
                        <div className="flex flex-col items-center py-10 gap-3">
                            <PokeballIcon size={48} color="#d1d5db" />
                            <p className="text-sm text-gray-400 font-display text-center">
                                {pokemon.name} does not evolve.
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {evolution.map((step, i) => (
                                <div key={step.id}>
                                    <EvolutionCard {...step} />
                                    {i < evolution.length - 1 && (
                                        <div className="flex flex-col items-center py-2 gap-3">
                                            <ArrowRightIcon size={32} weight="bold" className="rotate-90 text-gray-300" />
                                            {evolution[i + 1]?.minLevel && (
                                                <span className="text-[10px] font-bold font-display text-gray-400 bg-gray-100 rounded-full px-2 py-0.5">
                                                    Lv. {evolution[i + 1].minLevel}
                                                </span>
                                            )}
                                            {evolution[i + 1]?.item && (
                                                <span className="text-[10px] font-bold font-display text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 capitalize">
                                                    {formatName(evolution[i + 1].item!)}
                                                </span>
                                            )}
                                            {!evolution[i + 1]?.minLevel && !evolution[i + 1]?.item && evolution[i + 1]?.trigger && (
                                                <span className="text-[10px] font-bold font-display text-gray-400 bg-gray-100 rounded-full px-2 py-0.5 capitalize">
                                                    {formatName(evolution[i + 1].trigger!)}
                                                </span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </>
    );
}

// ─── Main Drawer ────────────────────────────────────────────────────────────
export function PokemonDrawer({ pokemon, onClose }: PokemonDrawerProps) {
    const [activeTab, setActiveTab] = useState<Tab>("About");
    const [visible, setVisible] = useState(false);
    const { species, evolution, flavorText, genus, isLoading } = usePokemonDetail(pokemon);
    const drawerRef = useRef<HTMLDivElement>(null);

    // Resolve nickname jika datang dari CaughtPokemon
    const nickname = (pokemon as any)?.nickname as string | undefined;
    const displayName = nickname && nickname !== pokemon?.name ? nickname : pokemon?.name ?? "";
    const speciesName = nickname && nickname !== pokemon?.name ? pokemon?.name : null;

    useEffect(() => {
        if (pokemon) {
            requestAnimationFrame(() => setVisible(true));
            setActiveTab("About");
        } else {
            setVisible(false);
        }
    }, [pokemon]);

    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
        window.addEventListener("keydown", handler);
        return () => window.removeEventListener("keydown", handler);
    }, []);

    function handleClose() {
        setVisible(false);
        setTimeout(onClose, 300);
    }

    if (!pokemon) return null;

    const primaryType = pokemon.types[0]?.type.name ?? "normal";
    const colors = getTypeColor(primaryType);
    const { src: spriteUrl, isAnimated } = getPokemonSpriteUrl(pokemon.id, pokemon.sprites);
    const paddedId = String(pokemon.id).padStart(3, "0");
    // Defensive fallback untuk data lama di store yang belum punya field lengkap
    const stats     = pokemon.stats     ?? [];
    const abilities = pokemon.abilities ?? [];
    const moves     = pokemon.moves     ?? [];
    const totalStats = stats.reduce((a, s) => a + s.base_stat, 0);
    const genderRate = species?.gender_rate ?? -1;
    const femaleChance = genderRate === -1 ? null : (genderRate / 8) * 100;
    const maleChance   = femaleChance === null ? null : 100 - femaleChance;
    const catchRate = species ? Math.round((species.capture_rate / 255) * 100) : null;

    const sharedTabContentProps = {
        activeTab, pokemon, species, evolution, flavorText, genus, colors,
        totalStats, genderRate, femaleChance, maleChance, catchRate,
        stats, abilities, moves,
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
                style={{ opacity: visible ? 1 : 0 }}
                onClick={handleClose}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={[
                    "fixed z-50 bg-white shadow-2xl flex flex-col overflow-hidden",
                    "transition-transform duration-300 ease-out",
                    // Mobile: bottom sheet
                    "bottom-0 left-0 right-0 rounded-t-3xl max-h-[90dvh]",
                    // Desktop: right panel
                    "md:inset-y-0 md:left-auto md:right-0 md:w-[60vw] md:max-w-4xl",
                    "md:rounded-none md:rounded-l-3xl md:flex-row md:max-h-none",
                    // Animation
                    visible
                        ? "translate-y-0 md:translate-x-0"
                        : "translate-y-full md:translate-y-0 md:translate-x-full",
                ].join(" ")}
            >

                {/* ══ LEFT PANEL — desktop only ══ */}
                <div
                    className="hidden md:flex md:flex-col md:w-2/5 md:shrink-0 relative overflow-hidden"
                    style={{ background: `linear-gradient(160deg, ${colors.border}ee 0%, ${colors.border}88 100%)` }}
                >
                    {/* Pokeball decorations */}
                    <div className="absolute -right-10 -bottom-10 opacity-10">
                        <PokeballIcon size={200} color="white" />
                    </div>
                    <div className="absolute -left-6 -top-6 opacity-5">
                        <PokeballIcon size={120} color="white" />
                    </div>

                    {/* Close button */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center
                                   rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                    >
                        <XIcon size={18} weight="bold" color="white" />
                    </button>

                    {/* Content */}
                    <div className="relative flex flex-col items-center justify-center flex-1 px-6 py-10 gap-5">
                        {/* ID */}
                        <p className="text-white/50 text-xs font-display font-bold tracking-widest">
                            #{paddedId}
                        </p>

                        {/* Sprite */}
                        <div className="w-32 h-32 flex items-center justify-center">
                            <Image
                                src={spriteUrl}
                                alt={displayName}
                                width={176}
                                height={176}
                                className="w-44 h-44 object-contain drop-shadow-2xl"
                                style={{ imageRendering: pokemon.id <= 649 ? "pixelated" : "auto" }}
                                unoptimized={isAnimated}
                            />
                        </div>

                        {/* Name */}
                        <div className="text-center">
                            <h2 className="text-2xl font-bold font-display capitalize text-white tracking-wide leading-tight">
                                {displayName}
                            </h2>
                            {/* Species name jika punya nickname */}
                            {speciesName && (
                                <p className="text-white/50 text-xs font-display mt-0.5 capitalize">
                                    {speciesName}
                                </p>
                            )}
                            {genus && (
                                <p className="text-white/60 text-xs font-display mt-1 italic">{genus}</p>
                            )}
                        </div>

                        {/* Type badges */}
                        <div className="flex flex-wrap justify-center gap-2">
                            {pokemon.types.map((t) => (
                                <PokemonTypeBadge key={t.type.name} type={t.type.name} />
                            ))}
                        </div>

                        {/* Legendary / Mythical */}
                        {(species?.is_legendary || species?.is_mythical) && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                            bg-yellow-400/90 text-yellow-900 text-[11px] font-bold font-display">
                                <StarIcon weight="fill" size={11} />
                                {species.is_legendary ? "Legendary" : "Mythical"}
                            </span>
                        )}

                        {/* Quick stat pills */}
                        <div className="w-full mt-4 grid grid-cols-2 gap-2">
                            {[
                                { label: "Height", value: `${(pokemon.height / 10).toFixed(1)}m` },
                                { label: "Weight", value: `${(pokemon.weight / 10).toFixed(1)}kg` },
                            ].map(({ label, value }) => (
                                <div key={label}
                                     className="rounded-xl p-2.5 text-center"
                                     style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                                    <p className="text-white/50 text-[9px] font-display uppercase tracking-wide">{label}</p>
                                    <p className="text-white text-sm font-bold font-display">{value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ══ RIGHT PANEL / Mobile full sheet ══ */}
                <div className="flex flex-col flex-1 min-h-0 overflow-hidden">

                    {/* ── MOBILE HEADER ── */}
                    <div
                        className="md:hidden relative pt-6 pb-10 px-5 shrink-0 overflow-hidden"
                        style={{ background: `linear-gradient(135deg, ${colors.border}dd 0%, ${colors.border}99 100%)` }}
                    >
                        {/* Pokeball deco */}
                        <div className="absolute -right-8 -bottom-8 opacity-10">
                            <PokeballIcon size={150} color="white" />
                        </div>
                        <div className="absolute -left-4 -top-4 opacity-5">
                            <PokeballIcon size={100} color="white" />
                        </div>

                        {/* Handle + Close */}
                        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/40" />
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center
                                       rounded-full bg-white/20 hover:bg-white/40 transition-colors"
                        >
                            <XIcon size={18} weight="bold" color="white" />
                        </button>

                        {/* Sprite */}
                        <div className="flex justify-center mb-3 mt-2">
                            <Image
                                src={spriteUrl}
                                alt={displayName}
                                width={140}
                                height={140}
                                className="w-36 h-36 object-contain drop-shadow-xl"
                                style={{ imageRendering: pokemon.id <= 649 ? "pixelated" : "auto" }}
                                unoptimized={isAnimated}
                            />
                        </div>

                        {/* Name & ID */}
                        <div className="text-center">
                            <p className="text-white/60 text-xs font-display font-medium mb-1">#{paddedId}</p>
                            <h2 className="text-2xl font-bold font-display capitalize text-white tracking-wide mb-1">
                                {displayName}
                            </h2>
                            {/* Species name jika punya nickname */}
                            {speciesName && (
                                <p className="text-white/60 text-xs font-display mb-1 capitalize">
                                    {speciesName}
                                </p>
                            )}
                            {genus && (
                                <p className="text-white/70 text-xs font-display mb-2 italic">{genus}</p>
                            )}
                            <div className="flex justify-center gap-2">
                                {pokemon.types.map((t) => (
                                    <PokemonTypeBadge key={t.type.name} type={t.type.name} />
                                ))}
                            </div>
                            {(species?.is_legendary || species?.is_mythical) && (
                                <div className="mt-2 flex justify-center">
                                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full
                                                     bg-yellow-400/90 text-yellow-900 text-[11px] font-bold font-display">
                                        <StarIcon weight="fill" size={11} />
                                        {species.is_legendary ? "Legendary" : "Mythical"}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── TABS ── */}
                    <div className="flex border-b border-gray-100 shrink-0 px-2 pt-1 bg-white">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={[
                                    "flex-1 py-3 text-xs font-bold font-display transition-all duration-150",
                                    activeTab === tab
                                        ? "border-b-2 text-[#E3350D]"
                                        : "text-gray-400 hover:text-gray-600",
                                ].join(" ")}
                                style={{ borderColor: activeTab === tab ? "#E3350D" : "transparent" }}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    {/* ── CONTENT ── */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex flex-col gap-3 p-5">
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="h-8 rounded-xl bg-gray-100 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <TabContent {...sharedTabContentProps} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}