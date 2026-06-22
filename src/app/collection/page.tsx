"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlassIcon, SortAscendingIcon, SortDescendingIcon } from "@phosphor-icons/react";
import { useAppSelector } from "@/store/hooks";
import { CollectionCard } from "@/components/collection/CollectionCard";
import { EmptyCollection } from "@/components/collection/EmptyCollection";
import { Navbar } from "@/components/layout/Navbar";
import { PokeballIcon } from "@/components/icons/PokeballIcon";

type SortKey = "caught" | "name" | "id";

export default function CollectionPage() {
    const collection = useAppSelector((s) => s.collection.pokemon);
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<SortKey>("caught");
    const [sortAsc, setSortAsc] = useState(false);

    const filtered = useMemo(() => {
        const q = search.toLowerCase().trim();
        return collection
            .filter(
                (p) =>
                    p.nickname.toLowerCase().includes(q) ||
                    p.name.toLowerCase().includes(q) ||
                    p.types.some((t) => t.type.name.includes(q))
            )
            .sort((a, b) => {
                let cmp = 0;
                if (sortKey === "name") cmp = a.nickname.localeCompare(b.nickname);
                else if (sortKey === "id") cmp = a.id - b.id;
                else cmp = new Date(a.caughtAt).getTime() - new Date(b.caughtAt).getTime();
                return sortAsc ? cmp : -cmp;
            });
    }, [collection, search, sortKey, sortAsc]);

    const sortOptions: { key: SortKey; label: string }[] = [
        { key: "caught", label: "Ditangkap" },
        { key: "name", label: "Nama" },
        { key: "id", label: "No. Pokedex" },
    ];

    return (
        <div className="min-h-screen pb-24 md:pb-0">
            <Navbar />

            {/* Header */}
            <div className="px-4 pt-6 pb-4">
                <div className="flex items-center gap-3 mb-1">
                    <PokeballIcon size={28} color="#E3350D" />
                    <h1 className="font-display font-bold text-3xl text-[#1A1A2E]">
                        Koleksiku
                    </h1>
                </div>
                <p className="text-sm text-gray-500 ml-1">
                    {collection.length === 0
                        ? "Belum ada Pokemon"
                        : `${collection.length} Pokemon tertangkap`}
                </p>
            </div>

            {collection.length === 0 ? (
                <EmptyCollection />
            ) : (
                <>
                    {/* Search + Sort bar */}
                    <div className="px-4 mb-4 flex flex-col gap-2">
                        {/* Search */}
                        <div className="relative">
                            <MagnifyingGlassIcon
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Cari nama, tipe..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200
                           bg-white text-sm font-display text-[#1A1A2E] placeholder-gray-300
                           focus:outline-none focus:ring-2 focus:ring-[#E3350D]/20 focus:border-[#E3350D]
                           transition-all"
                            />
                        </div>

                        {/* Sort */}
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400 font-display shrink-0">Urutkan:</span>
                            <div className="flex gap-1.5 flex-wrap">
                                {sortOptions.map(({ key, label }) => (
                                    <button
                                        key={key}
                                        onClick={() => {
                                            if (sortKey === key) setSortAsc((v) => !v);
                                            else { setSortKey(key); setSortAsc(true); }
                                        }}
                                        className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold
                               font-display border transition-all
                               ${sortKey === key
                                            ? "bg-[#E3350D] text-white border-[#E3350D]"
                                            : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        {label}
                                        {sortKey === key && (
                                            sortAsc
                                                ? <SortAscendingIcon size={12} weight="bold" />
                                                : <SortDescendingIcon size={12} weight="bold" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Grid */}
                    {filtered.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-gray-400 font-display text-sm">
                                Tidak ada Pokemon yang cocok dengan &quot;{search}&quot;
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 px-4">
                            {filtered.map((p) => (
                                <CollectionCard key={p.id} pokemon={p} />
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}