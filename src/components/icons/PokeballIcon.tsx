interface PokeballIconProps {
    size?: number;
    className?: string;
    spinning?: boolean;
    color?: string;
}

export function PokeballIcon({
    size = 24,
    className = "",
    color = "#E3350D",
}: PokeballIconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Top half */}
            <path
                d="M12 2C7.03 2 2.9 5.46 2.1 10h19.8C21.1 5.46 16.97 2 12 2z"
                fill={color}
            />
            {/* Bottom half */}
            <path
                d="M2.1 14c.8 4.54 4.93 8 9.9 8s9.1-3.46 9.9-8H2.1z"
                fill="white"
                stroke="#e5e7eb"
                strokeWidth="0.5"
            />
            {/* Middle band */}
            <rect x="2" y="10" width="20" height="4" fill="#1f2937"/>
            {/* Center button outer */}
            <circle cx="12" cy="12" r="3.2" fill="white" stroke="#1f2937" strokeWidth="1.5"/>
            {/* Center button inner */}
            <circle cx="12" cy="12" r="1.5" fill="#1f2937"/>
            {/* Outer border */}
            <circle cx="12" cy="12" r="10" stroke="#1f2937" strokeWidth="1.5" fill="none"/>
        </svg>
    );
}