import type { Metadata } from "next";
import { HomeClient } from "@/components/home/HomeClient";
import { fetchPokemonList, fetchPokemonDetail, extractPokemonIdFromUrl } from "@/services/pokeApi";
import { POKEMON_LIST_LIMIT } from "@/constants";
import type { Pokemon } from "@/types/pokemon";

export const metadata: Metadata = {
    title: "Pokédex",
    description:
        "Browse and catch Pokémon! Explore detailed stats, types, evolutions, and build your collection.",
};

export default async function HomePage() {
    let initialPokemons: Pokemon[] = [];

    try {
        const listData = await fetchPokemonList(0, POKEMON_LIST_LIMIT);
        initialPokemons = await Promise.all(
            listData.results.map((p) => {
                const id = extractPokemonIdFromUrl(p.url);
                return fetchPokemonDetail(id);
            })
        );
    } catch {
        // If server-side fetch fails, HomeClient will handle client-side fetch
        initialPokemons = [];
    }

    return <HomeClient initialPokemons={initialPokemons} />;
}