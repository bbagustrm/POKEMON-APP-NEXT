import axios from "axios";
import { POKEAPI_BASE_URL, POKEMON_LIST_LIMIT } from "@/constants";
import type { Pokemon, PokemonListResponse } from "@/types/pokemon";

const pokeApiClient = axios.create({
    baseURL: POKEAPI_BASE_URL,
    timeout: 10000,
});

export async function fetchPokemonList(
    offset = 0,
    limit = POKEMON_LIST_LIMIT
): Promise<PokemonListResponse> {
    const { data } = await pokeApiClient.get<PokemonListResponse>(
        `/pokemon?limit=${limit}&offset=${offset}`
    );
    return data;
}

export async function fetchPokemonDetail(nameOrId: string | number): Promise<Pokemon> {
    const { data } = await pokeApiClient.get<Pokemon>(`/pokemon/${nameOrId}`);
    return data;
}

export function extractPokemonIdFromUrl(url: string): number {
    const parts = url.split("/").filter(Boolean);
    return Number(parts[parts.length - 1]);
}

const ANIMATED_GIF_BASE =
    "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated";

export function getPokemonSpriteUrl(
    id: number,
    sprites: Pokemon["sprites"]
): { src: string; isAnimated: boolean } {
    if (id <= 649) {
        return {
            src: `${ANIMATED_GIF_BASE}/${id}.gif`,
            isAnimated: true,
        };
    }
    // Fallback: official artwork untuk gen 6+
    const fallback =
        sprites.other["official-artwork"].front_default ??
        sprites.front_default ??
        "";
    return { src: fallback, isAnimated: false };
}