export const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
    fire:     { bg: "#FEF3C7", text: "#92400E", border: "#F59E0B" },
    water:    { bg: "#DBEAFE", text: "#1E40AF", border: "#3B82F6" },
    grass:    { bg: "#D1FAE5", text: "#065F46", border: "#10B981" },
    electric: { bg: "#FEF9C3", text: "#713F12", border: "#EAB308" },
    ice:      { bg: "#E0F2FE", text: "#0C4A6E", border: "#0EA5E9" },
    fighting: { bg: "#FFE4E6", text: "#881337", border: "#F43F5E" },
    poison:   { bg: "#F3E8FF", text: "#581C87", border: "#A855F7" },
    ground:   { bg: "#FEF3C7", text: "#78350F", border: "#D97706" },
    flying:   { bg: "#E0E7FF", text: "#1E1B4B", border: "#818CF8" },
    psychic:  { bg: "#FCE7F3", text: "#831843", border: "#EC4899" },
    bug:      { bg: "#ECFCCB", text: "#365314", border: "#84CC16" },
    rock:     { bg: "#F5F5F4", text: "#292524", border: "#A8A29E" },
    ghost:    { bg: "#EDE9FE", text: "#2E1065", border: "#7C3AED" },
    dragon:   { bg: "#DBEAFE", text: "#1E3A8A", border: "#2563EB" },
    dark:     { bg: "#1C1917", text: "#E7E5E4", border: "#57534E" },
    steel:    { bg: "#F1F5F9", text: "#1E293B", border: "#94A3B8" },
    fairy:    { bg: "#FDF2F8", text: "#701A75", border: "#E879F9" },
    normal:   { bg: "#F5F5F5", text: "#3F3F46", border: "#A1A1AA" },
};

export function getTypeColor(type: string) {
    return TYPE_COLORS[type] ?? TYPE_COLORS["normal"];
}