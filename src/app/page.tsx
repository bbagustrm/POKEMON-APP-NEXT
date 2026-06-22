"use client";

import { useState } from "react";
import { usePokemonList } from "@/hooks/usePokemonList";
import { PokemonGrid } from "@/components/pokemon/PokemonGrid";
import { CatchModal } from "@/components/catch/CatchModal";
import { Navbar } from "@/components/layout/Navbar";
import type { Pokemon } from "@/types/pokemon";

export default function HomePage() {
    const { pokemons, isLoading, isFetchingMore, hasMore, error, loadMore } =
        usePokemonList();

    const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

    return (
        <div className="min-h-screen pb-24 md:pb-0">
            <Navbar />

            {/* Header */}
            <div className="px-4 pt-6 pb-4">
                <h1 className="font-display font-bold text-3xl text-[#1A1A2E] leading-tight">
                    Pokédex
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    {pokemons.length > 0
                        ? `${pokemons.length} Pokemon dimuat`
                        : "Memuat Pokemon..."}
                </p>
            </div>

            <PokemonGrid
                pokemons={pokemons}
                isLoading={isLoading}
                isFetchingMore={isFetchingMore}
                hasMore={hasMore}
                error={error}
                onCatch={setSelectedPokemon}
                onLoadMore={loadMore}
            />

            {selectedPokemon && (
                <CatchModal
                    pokemon={selectedPokemon}
                    onClose={() => setSelectedPokemon(null)}
                />
            )}
        </div>
    );
}