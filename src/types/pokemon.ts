export interface PokemonListItem {
    name: string;
    url: string;
}

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: PokemonListItem[];
}

export interface PokemonType {
    slot: number;
    type: {
        name: string;
        url: string;
    };
}

export interface PokemonSprites {
    front_default: string | null;
    other: {
        "official-artwork": {
            front_default: string | null;
        };
        dream_world: {
            front_default: string | null;
        };
    };
}

export interface PokemonStat {
    base_stat: number;
    stat: {
        name: string;
    };
}

export interface Pokemon {
    id: number;
    name: string;
    types: PokemonType[];
    sprites: PokemonSprites;
    stats: PokemonStat[];
    height: number;
    weight: number;
    base_experience: number;
}

export interface CaughtPokemon {
    id: number;
    name: string;
    nickname: string;
    types: PokemonType[];
    sprites: PokemonSprites;
    caughtAt: string;
}

// Tambahkan di bawah types yang sudah ada:

export interface PokemonAbility {
    ability: { name: string; url: string };
    is_hidden: boolean;
    slot: number;
}

export interface PokemonMove {
    move: { name: string; url: string };
}

export interface PokemonHeldItem {
    item: { name: string; url: string };
}

// Update interface Pokemon — tambah field baru:
export interface Pokemon {
    id: number;
    name: string;
    types: PokemonType[];
    sprites: PokemonSprites;
    stats: PokemonStat[];
    abilities: PokemonAbility[];
    moves: PokemonMove[];
    held_items: PokemonHeldItem[];
    height: number;
    weight: number;
    base_experience: number;
    species: { name: string; url: string };
}

// Untuk species / flavor text
export interface PokemonSpecies {
    flavor_text_entries: {
        flavor_text: string;
        language: { name: string };
        version: { name: string };
    }[];
    genera: {
        genus: string;
        language: { name: string };
    }[];
    habitat: { name: string } | null;
    growth_rate: { name: string };
    capture_rate: number;
    base_happiness: number;
    is_legendary: boolean;
    is_mythical: boolean;
    evolution_chain: { url: string };
    egg_groups: { name: string }[];
    gender_rate: number; // -1 = genderless, 0–8 females per 8
}

// Untuk evolution chain
export interface EvolutionDetail {
    min_level: number | null;
    trigger: { name: string };
    item: { name: string } | null;
}

export interface ChainLink {
    species: { name: string; url: string };
    evolution_details: EvolutionDetail[];
    evolves_to: ChainLink[];
}

export interface EvolutionChain {
    chain: ChainLink;
}

// Flat evolution step untuk display
export interface EvolutionStep {
    name: string;
    id: number;
    trigger?: string;
    minLevel?: number;
    item?: string;
}