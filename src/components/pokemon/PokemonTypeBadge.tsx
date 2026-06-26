import { getTypeColor } from "@/lib/typeColors";

interface PokemonTypeBadgeProps {
    type: string;
    size?: "sm" | "md";
}

export function PokemonTypeBadge({ type, size = "md" }: PokemonTypeBadgeProps) {
    const colors = getTypeColor(type);

    const sizeClass = size === "sm"
        ? "text-[8px] px-2 py-0.5"
        : "text-xs px-3 py-1";

    return (
        <span
            className={`inline-block rounded-full font-semibold capitalize font-display ${sizeClass}`}
            style={{
                backgroundColor: colors.bg,
                color: colors.text,
                border: `1px solid ${colors.border}`,
            }}
        >
      {type}
    </span>
    );
}