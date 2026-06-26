"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchPokemonList, fetchPokemonDetail, extractPokemonIdFromUrl } from "@/services/pokeApi";
import type { Pokemon } from "@/types/pokemon";

const LIMIT = 16;

export function usePokemonList(initialData?: Pokemon[]) {
    const [pokemons, setPokemons] = useState<Pokemon[]>(initialData ?? []);
    const [isLoading, setIsLoading] = useState(!initialData || initialData.length === 0);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const totalPages = totalCount > 0 ? Math.ceil(totalCount / LIMIT) : 0;

    const loadPage = useCallback(async (page: number) => {
        try {
            setIsLoading(true);
            setError(null);

            const offset = (page - 1) * LIMIT;
            const listData = await fetchPokemonList(offset, LIMIT);

            const details = await Promise.all(
                listData.results.map((p) => {
                    const id = extractPokemonIdFromUrl(p.url);
                    return fetchPokemonDetail(id);
                })
            );

            setPokemons(details);
            setTotalCount(listData.count);
            setCurrentPage(page);
        } catch {
            setError("Failed to load Pokémon data. Try again.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // On mount: if no initialData, fetch page 1 fully.
    // If initialData exists (SSR), just fetch the total count for pagination.
    useEffect(() => {
        if (!initialData || initialData.length === 0) {
            loadPage(1);
        } else {
            fetchPokemonList(0, 1)
                .then((res) => setTotalCount(res.count))
                .catch(() => {});
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const goToPage = useCallback(
        (page: number) => {
            if (page < 1 || page > totalPages || page === currentPage || isLoading) return;
            window.scrollTo({ top: 0, behavior: "smooth" });
            loadPage(page);
        },
        [totalPages, currentPage, isLoading, loadPage]
    );

    return {
        pokemons,
        isLoading,
        currentPage,
        totalPages,
        totalCount,
        error,
        goToPage,
    };
}