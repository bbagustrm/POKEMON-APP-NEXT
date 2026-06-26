"use client";

import { PokemonCard } from "./PokemonCard";
import { Pagination } from "./Pagination";
import { ArrowClockwiseIcon } from "@phosphor-icons/react";
import type { Pokemon } from "@/types/pokemon";

interface PokemonGridProps {
    pokemons: Pokemon[];
    isLoading: boolean;
    currentPage: number;
    totalPages: number;
    error: string | null;
    onCatch: (pokemon: Pokemon) => void;
    onPageChange: (page: number) => void;
}

// Cards considered above-the-fold (2-col mobile = 2 rows = 4 cards)
const PRIORITY_COUNT = 4;

function SkeletonCard() {
    return (
        <div className="rounded-2xl overflow-hidden bg-white/60 border border-white/60 p-4 animate-pulse">
            <div className="flex justify-between mb-3">
                <div className="h-5 w-16 rounded-full bg-gray-200" />
                <div className="h-4 w-8 rounded bg-gray-200" />
            </div>
            <div className="h-5 w-24 rounded bg-gray-200 mb-3" />
            <div className="flex justify-center mb-4">
                <div className="w-28 h-28 rounded-full bg-gray-200" />
            </div>
            <div className="h-9 rounded-xl bg-gray-200" />
        </div>
    );
}

export function PokemonGrid({
                                pokemons,
                                isLoading,
                                currentPage,
                                totalPages,
                                error,
                                onCatch,
                                onPageChange,
                            }: PokemonGridProps) {
    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p className="text-gray-500 font-display text-sm text-center px-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500
                               text-white text-sm font-semibold font-display hover:bg-red-600 transition"
                >
                    <ArrowClockwiseIcon size={16} weight="bold" />
                    Try again
                </button>
            </div>
        );
    }

    return (
        <>
            {/* Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4">
                {isLoading
                    ? Array.from({ length: 16 }).map((_, i) => <SkeletonCard key={i} />)
                    : pokemons.map((p, index) => (
                        <PokemonCard
                            key={p.id}
                            pokemon={p}
                            onCatch={onCatch}
                            priority={index < PRIORITY_COUNT}
                        />
                    ))}
            </div>

            {/* Pagination */}
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                isLoading={isLoading}
            />
        </>
    );
}