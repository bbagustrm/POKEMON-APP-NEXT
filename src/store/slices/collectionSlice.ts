import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { CaughtPokemon } from "@/types/pokemon";
import { LOCAL_STORAGE_KEY } from "@/constants";

function loadFromLocalStorage(): CaughtPokemon[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        return raw ? (JSON.parse(raw) as CaughtPokemon[]) : [];
    } catch {
        return [];
    }
}

interface CollectionState {
    pokemon: CaughtPokemon[];
}

const initialState: CollectionState = {
    pokemon: loadFromLocalStorage(),
};

const collectionSlice = createSlice({
    name: "collection",
    initialState,
    reducers: {
        catchPokemon(state, action: PayloadAction<CaughtPokemon>) {
            const alreadyCaught = state.pokemon.some(
                (p) => p.id === action.payload.id
            );
            if (!alreadyCaught) {
                state.pokemon.push(action.payload);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.pokemon));
            }
        },
        releasePokemon(state, action: PayloadAction<number>) {
            state.pokemon = state.pokemon.filter((p) => p.id !== action.payload);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.pokemon));
        },
    },
});

export const { catchPokemon, releasePokemon } = collectionSlice.actions;
export default collectionSlice.reducer;