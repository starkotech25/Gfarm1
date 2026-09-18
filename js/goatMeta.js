export const GOAT_BREEDS = [
    "Sirohi",
    "Boer",
    "Alpine",
    "Nubian",
    "Jamunapari",
    "Beetal",
    "Malabari",
    "Toggenburg",
    "LaMancha",
    "Anglo-Nubian",
    "Kiko",
    "Oberhasli",
    "Saanen",
    "Pashmina",
    "Cashmere",
    "Spanish",
    "Rangeland",
    "Savanna",
    "Nigerian Dwarf",
    "Pygmy",
    "Bengal",
    "Black Bengal",
    "Murciano-Granadina",
    "Rove",
    "Sahel",
    "Marwari",
    "Barbari",
    "Osmanabadi",
    "Mehsana",
    "Jakhrana",
    "British Alpine",
    "American Alpine",
    "Kinder",
    "Fainting Goat",
    "Australian Bush",
    "Guernsey",
    "Damascus",
    "Sarda",
    "Chamois",
    "Pau",
    "Verata",
    "Bharat",
    "Capri",
    "Gaddi",
    "Bharal",
    "Azizi",
    "Maltese"
];

export function getNextSuggestedGoatId(existingIds = [], prefix = "GF") {
    const safeIds = (Array.isArray(existingIds) ? existingIds : [])
        .map((id) => `${id ?? ""}`.trim())
        .filter(Boolean);

    const numericIds = safeIds
        .map((id) => {
            const match = id.match(/(\d+)/);
            return match ? Number(match[1]) : null;
        })
        .filter((value) => Number.isFinite(value) && value > 0);

    if (numericIds.length === 0) {
        return `${prefix}-001`;
    }

    const uniqueSorted = [...new Set(numericIds)].sort((a, b) => a - b);
    const highest = Math.max(...uniqueSorted);

    if (uniqueSorted.length === 1 && uniqueSorted[0] > 1) {
        return `${prefix}-${String(uniqueSorted[0] + 1).padStart(3, "0")}`;
    }

    for (let current = 1; current <= highest + 1; current += 1) {
        if (!uniqueSorted.includes(current)) {
            return `${prefix}-${String(current).padStart(3, "0")}`;
        }
    }

    return `${prefix}-${String(highest + 1).padStart(3, "0")}`;
}
