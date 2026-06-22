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
    title: "PokéDex App",
    description: "Catch and collect your favorite Pokemon!",
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