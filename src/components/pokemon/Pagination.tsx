"use client";

import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    isLoading?: boolean;
}

/**
 * Generates the page numbers to display, with ellipsis for large ranges.
 * Always shows: first, last, current, and 1 neighbour on each side.
 * Example (page 6 of 20): [1, "…", 5, 6, 7, "…", 20]
 */
function getPageRange(current: number, total: number): (number | "…")[] {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const pages: (number | "…")[] = [];
    const addPage = (p: number) => {
        if (!pages.includes(p)) pages.push(p);
    };

    addPage(1);
    if (current > 3) pages.push("…");
    for (let p = Math.max(2, current - 1); p <= Math.min(total - 1, current + 1); p++) {
        addPage(p);
    }
    if (current < total - 2) pages.push("…");
    addPage(total);

    return pages;
}

export function Pagination({ currentPage, totalPages, onPageChange, isLoading }: PaginationProps) {
    if (totalPages <= 1) return null;

    const pages = getPageRange(currentPage, totalPages);
    const canPrev = currentPage > 1 && !isLoading;
    const canNext = currentPage < totalPages && !isLoading;

    return (
        <nav
            aria-label="Pokémon pagination"
            className="flex items-center justify-center gap-1.5 py-8 px-4 flex-wrap"
        >
            {/* Previous */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!canPrev}
                aria-label="Previous page"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200
                           bg-white text-gray-500 transition-all duration-150
                           hover:border-[#E3350D] hover:text-[#E3350D] hover:shadow-sm
                           disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200
                           disabled:hover:text-gray-500 disabled:hover:shadow-none"
            >
                <CaretLeftIcon size={16} weight="bold" />
            </button>

            {/* Page numbers */}
            {pages.map((page, i) =>
                page === "…" ? (
                    <span
                        key={`ellipsis-${i}`}
                        className="w-9 h-9 flex items-center justify-center text-gray-400
                                   text-xs font-bold font-display select-none"
                    >
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        disabled={isLoading}
                        aria-label={`Go to page ${page}`}
                        aria-current={page === currentPage ? "page" : undefined}
                        className={[
                            "w-9 h-9 flex items-center justify-center rounded-xl text-xs font-bold font-display",
                            "transition-all duration-150 border",
                            page === currentPage
                                ? "bg-[#E3350D] text-white border-[#E3350D] shadow-md scale-105 cursor-default"
                                : "bg-white text-gray-600 border-gray-200 hover:border-[#E3350D] hover:text-[#E3350D] hover:shadow-sm",
                            isLoading && page !== currentPage ? "opacity-50 cursor-not-allowed" : "",
                        ].join(" ")}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!canNext}
                aria-label="Next page"
                className="w-9 h-9 flex items-center justify-center rounded-xl border border-gray-200
                           bg-white text-gray-500 transition-all duration-150
                           hover:border-[#E3350D] hover:text-[#E3350D] hover:shadow-sm
                           disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200
                           disabled:hover:text-gray-500 disabled:hover:shadow-none"
            >
                <CaretRightIcon size={16} weight="bold" />
            </button>
        </nav>
    );
}