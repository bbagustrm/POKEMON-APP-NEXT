import type { Metadata } from "next";
import { Pixelify_Sans, Press_Start_2P } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const pixelify = Pixelify_Sans({
    subsets: ["latin"],
    variable: "--font-body",
});

const pressStart = Press_Start_2P({
    subsets: ["latin"],
    weight: "400",
    variable: "--font-display",
});

export const metadata: Metadata = {
    metadataBase: new URL("https://pokedex-app.vercel.app"),
    title: {
        default: "PokéDex App — Catch & Collect Pokémon",
        template: "%s | PokéDex App",
    },
    description:
        "Browse, catch, and collect your favorite Pokémon in this interactive Pokédex application. Explore stats, evolutions, and more!",
    keywords: [
        "Pokémon",
        "Pokédex",
        "catch Pokémon",
        "Pokémon collection",
        "Pokémon stats",
        "Pokémon evolution",
    ],
    authors: [{ name: "PokéDex App" }],
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        type: "website",
        locale: "en_US",
        siteName: "PokéDex App",
        title: "PokéDex App — Catch & Collect Pokémon",
        description:
            "Browse, catch, and collect your favorite Pokémon in this interactive Pokédex application.",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${pixelify.variable} ${pressStart.variable}`}
        >
        <body className="pokeball-bg min-h-screen">
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}