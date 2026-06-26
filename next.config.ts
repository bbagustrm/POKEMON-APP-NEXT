import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
    },
};

export default nextConfig;