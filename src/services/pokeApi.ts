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

import type { PokemonSpecies, EvolutionChain, EvolutionStep, ChainLink } from "@/types/pokemon";

export async function fetchPokemonSpecies(nameOrId: string | number): Promise<PokemonSpecies> {
    const { data } = await pokeApiClient.get<PokemonSpecies>(`/pokemon-species/${nameOrId}`);
    return data;
}

export async function fetchEvolutionChain(url: string): Promise<EvolutionChain> {
    const { data } = await axios.get<EvolutionChain>(url);
    return data;
}

export function flattenEvolutionChain(chain: ChainLink): EvolutionStep[] {
    const steps: EvolutionStep[] = [];

    function walk(link: ChainLink) {
        const parts = link.species.url.split("/").filter(Boolean);
        const id = Number(parts[parts.length - 1]);
        steps.push({ name: link.species.name, id });

        if (link.evolves_to.length > 0) {
            const next = link.evolves_to[0];
            const detail = next.evolution_details[0];
            const parts2 = next.species.url.split("/").filter(Boolean);
            const nextId = Number(parts2[parts2.length - 1]);
            steps.push({
                name: next.species.name,
                id: nextId,
                trigger: detail?.trigger?.name,
                minLevel: detail?.min_level ?? undefined,
                item: detail?.item?.name ?? undefined,
            });
            if (next.evolves_to.length > 0) walk(next);
        }
    }

    walk(chain);
    return steps;
}

export function formatName(name: string): string {
    return name.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}