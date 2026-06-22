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