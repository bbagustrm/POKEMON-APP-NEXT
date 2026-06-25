"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenIcon, BagIcon } from "@phosphor-icons/react";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useState } from "react";
import { PokeballIcon } from "@/components/icons/PokeballIcon";

export function Navbar() {
    const pathname = usePathname();
    const count = useAppSelector((s) => s.collection.pokemon.length);

    // Avoid hydration mismatch: badge only renders after client mount
    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    const links = [
        { href: "/", label: "Pokédex", icon: BookOpenIcon },
        { href: "/collection", label: "Collection", icon: BagIcon, badge: count },
    ];

    return (
        <>
            {/* Top bar — desktop */}
            <header className="hidden md:flex items-center justify-between px-6 py-3
                         bg-[#E3350D] shadow-md sticky top-0 z-40">
                <Link href="/" className="flex items-center gap-2 text-white font-display font-bold text-xl tracking-wide">
                    <PokeballIcon size={24} color="white" />
                    PokéDex
                </Link>
                <nav className="flex gap-2">
                    {links.map(({ href, label, icon: Icon, badge }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-display
                            transition-all duration-150
                            ${active
                                    ? "bg-white text-[#E3350D]"
                                    : "text-white/80 hover:text-white hover:bg-white/20"
                                }`}
                            >
                                <Icon weight={active ? "fill" : "regular"} size={18} />
                                {label}
                                {mounted && badge !== undefined && badge > 0 && (
                                    <span className="ml-1 bg-[#FFCB05] text-[#1A1A2E] text-[10px]
                                   font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {badge > 99 ? "99+" : badge}
                  </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </header>

            {/* Top bar — mobile (logo only) */}
            <header className="md:hidden flex items-center justify-center px-4 py-3
                         bg-[#E3350D] shadow-md sticky top-0 z-40">
                <Link href="/" className="flex items-center gap-2 text-white font-display font-bold text-lg tracking-wide">
                    <PokeballIcon size={20} color="white" />
                    PokéDex
                </Link>
            </header>

            {/* Bottom nav — mobile */}
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40
                      bg-white border-t border-gray-200 shadow-lg">
                <div className="flex">
                    {links.map(({ href, label, icon: Icon, badge }) => {
                        const active = pathname === href;
                        return (
                            <Link
                                key={href}
                                href={href}
                                className={`flex-1 flex flex-col items-center justify-center py-3 gap-1
                            transition-colors duration-150
                            ${active ? "text-[#E3350D]" : "text-gray-400 hover:text-gray-600"}`}
                            >
                                <div className="relative">
                                    <Icon weight={active ? "fill" : "regular"} size={22} />
                                    {mounted && badge !== undefined && badge > 0 && (
                                        <span className="absolute -top-1.5 -right-2 bg-[#FFCB05] text-[#1A1A2E]
                                     text-[9px] font-bold rounded-full w-4 h-4
                                     flex items-center justify-center">
                      {badge > 99 ? "99+" : badge}
                    </span>
                                    )}
                                </div>
                                <span className={`text-[10px] font-semibold font-display ${active ? "text-[#E3350D]" : ""}`}>
                  {label}
                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
}