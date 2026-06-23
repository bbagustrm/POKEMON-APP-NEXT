"use client";

import { useState, useEffect } from "react";
import {
    fetchPokemonSpecies,
    fetchEvolutionChain,
    flattenEvolutionChain,
} from "@/services/pokeApi";
import type { Pokemon, PokemonSpecies, EvolutionStep } from "@/types/pokemon";

interface PokemonDetailData {
    species: PokemonSpecies | null;
    evolution: EvolutionStep[];
    flavorText: string;
    genus: string;
    isLoading: boolean;
    error: boolean;
}

export function usePokemonDetail(pokemon: Pokemon | null): PokemonDetailData {
    const [species, setSpecies] = useState<PokemonSpecies | null>(null);
    const [evolution, setEvolution] = useState<EvolutionStep[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!pokemon) return;
        setIsLoading(true);
        setError(false);

        fetchPokemonSpecies(pokemon.id)
            .then(async (spec) => {
                setSpecies(spec);
                const chain = await fetchEvolutionChain(spec.evolution_chain.url);
                setEvolution(flattenEvolutionChain(chain.chain));
            })
            .catch(() => setError(true))
            .finally(() => setIsLoading(false));
    }, [pokemon?.id]);

    const flavorText = species?.flavor_text_entries
        .filter((e) => e.language.name === "en")
        .slice(-1)[0]
        ?.flavor_text.replace(/\f|\n/g, " ") ?? "";

    const genus = species?.genera
        .find((g) => g.language.name === "en")
        ?.genus ?? "";

    return { species, evolution, flavorText, genus, isLoading, error };
}