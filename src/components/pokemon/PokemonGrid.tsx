"use client";

import { useRef, useCallback } from "react";
import { PokemonCard } from "./PokemonCard";
import { ArrowClockwiseIcon } from "@phosphor-icons/react";
import type { Pokemon } from "@/types/pokemon";

interface PokemonGridProps {
    pokemons: Pokemon[];
    isLoading: boolean;
    isFetchingMore: boolean;
    hasMore: boolean;
    error: string | null;
    onCatch: (pokemon: Pokemon) => void;
    onLoadMore: () => void;
}

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
                                isFetchingMore,
                                hasMore,
                                error,
                                onCatch,
                                onLoadMore,
                            }: PokemonGridProps) {
    const observerRef = useRef<IntersectionObserver | null>(null);

    const sentinelRef = useCallback(
        (node: HTMLDivElement | null) => {
            if (observerRef.current) observerRef.current.disconnect();
            if (!node) return;
            observerRef.current = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetchingMore) {
                    onLoadMore();
                }
            }, { threshold: 0.1 });
            observerRef.current.observe(node);
        },
        [hasMore, isFetchingMore, onLoadMore]
    );

    if (isLoading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonCard key={i} />
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <p className="text-gray-500 font-display text-lg">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500
                     text-white text-sm font-semibold font-display hover:bg-red-600 transition"
                >
                    <ArrowClockwiseIcon size={16} weight="bold" />
                    Coba lagi
                </button>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4">
                {pokemons.map((p) => (
                    <PokemonCard key={p.id} pokemon={p} onCatch={onCatch} />
                ))}

                {isFetchingMore &&
                    Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={`more-${i}`} />)}
            </div>

            {/* Infinite scroll sentinel */}
            {hasMore && <div ref={sentinelRef} className="h-8" />}

            {!hasMore && pokemons.length > 0 && (
                <p className="text-center text-sm text-gray-400 font-display py-8">
                    Semua Pokemon sudah dimuat!
                </p>
            )}
        </>
    );
}