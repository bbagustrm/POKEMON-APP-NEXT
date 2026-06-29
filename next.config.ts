import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'export',
    headers: async () => [
        {
            source: "/(.*)",
            headers: [{ key: "X-Robots-Tag", value: "index, follow" }],
        },
    ],
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "raw.githubusercontent.com",
                pathname: "/PokeAPI/sprites/**",
            },
            {
                protocol: "https",
                hostname: "assets.pokemon.com",
                pathname: "/**",
            },
        ],
        unoptimized: true,
    },
};

export default nextConfig;