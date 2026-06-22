"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchPokemonList, fetchPokemonDetail, extractPokemonIdFromUrl } from "@/services/pokeApi";
import { POKEMON_LIST_LIMIT } from "@/constants";
import type { Pokemon } from "@/types/pokemon";

export function usePokemonList() {
    const [pokemons, setPokemons] = useState<Pokemon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadPokemons = useCallback(async (currentOffset: number, append: boolean) => {
        try {
            if (append) setIsFetchingMore(true);
            else setIsLoading(true);

            const listData = await fetchPokemonList(currentOffset, POKEMON_LIST_LIMIT);

            const details = await Promise.all(
                listData.results.map((p) => {
                    const id = extractPokemonIdFromUrl(p.url);
                    return fetchPokemonDetail(id);
                })
            );

            setPokemons((prev) => append ? [...prev, ...details] : details);
            setHasMore(listData.next !== null);
            setError(null);
        } catch {
            setError("Gagal memuat data Pokemon. Coba lagi.");
        } finally {
            setIsLoading(false);
            setIsFetchingMore(false);
        }
    }, []);

    useEffect(() => {
        loadPokemons(0, false);
    }, [loadPokemons]);

    const loadMore = useCallback(() => {
        if (!isFetchingMore && hasMore) {
            const nextOffset = offset + POKEMON_LIST_LIMIT;
            setOffset(nextOffset);
            loadPokemons(nextOffset, true);
        }
    }, [isFetchingMore, hasMore, offset, loadPokemons]);

    return { pokemons, isLoading, isFetchingMore, hasMore, error, loadMore };
}