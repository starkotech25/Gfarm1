/**
 * @file mockData.js
 * @description Static seed data, expense numbers, status colors, and
 * configuration constants for the Starko Goat Farm Management Dashboard.
 */


/**
 * Initial sample goats data.
 */
export const seedGoats = [
    {
        id: "GF-001",
        name: "Kaali",
        sex: "female",
        breed: "Sirohi",
        dob: "2023-03-12",
        status: "active",
        source: "purchased",
        purchaseDate: "2023-04-01",
        purchasePrice: 8500,

        weights: [
            { d: "2024-01", w: 22 },
            { d: "2024-04", w: 26 },
            { d: "2024-07", w: 29 },
            { d: "2024-10", w: 32 },
            { d: "2025-01", w: 34 },
        ],

        health: [
            {
                id: "h1",
                date: "2024-06-10",
                type: "vaccination",
                description: "PPR vaccine",
                cost: 150
            },
            {
                id: "h2",
                date: "2024-09-02",
                type: "deworming",
                description: "Routine deworming",
                cost: 80
            },
        ],

        feeding: [
            {
                id: "f1",
                date: "2025-01-05",
                feedType: "Green fodder",
                quantity: 2.5,
                cost: 60
            },
            {
                id: "f2",
                date: "2025-01-12",
                feedType: "Concentrate mix",
                quantity: 1,
                cost: 45
            },
        ],

        breeding: [],
    },

    {
        id: "GF-002",
        name: "Bhoora",
        sex: "male",
        breed: "Beetal",
        dob: "2022-11-02",
        status: "active",
        source: "purchased",
        purchaseDate: "2022-12-01",
        purchasePrice: 12000,

        weights: [
            { d: "2024-01", w: 35 },
            { d: "2024-04", w: 38 },
            { d: "2024-07", w: 41 },
            { d: "2024-10", w: 44 },
            { d: "2025-01", w: 46 },
        ],

        health: [
            {
                id: "h3",
                date: "2024-05-20",
                type: "vaccination",
                description: "FMD vaccine",
                cost: 200
            },
        ],

        feeding: [],
        breeding: [],
    },

    {
        id: "GF-003",
        name: "Chandni",
        sex: "female",
        breed: "Sirohi",
        dob: "2023-06-20",
        status: "pregnant",
        source: "purchased",
        purchaseDate: "2023-07-15",
        purchasePrice: 7800,

        weights: [
            { d: "2024-01", w: 18 },
            { d: "2024-04", w: 22 },
            { d: "2024-07", w: 25 },
            { d: "2024-10", w: 28 },
            { d: "2025-01", w: 30 },
        ],

        health: [
            {
                id: "h4",
                date: "2024-11-01",
                type: "checkup",
                description: "Pregnancy checkup",
                cost: 100
            },
        ],

        feeding: [],

        breeding: [
            {
                id: "b1",
                matingDate: "2024-10-05",
                sireId: "GF-002",
                expectedDelivery: "2025-03-05",
                notes: "First pregnancy"
            },
        ],
    },

    {
        id: "GF-004",
        name: "Moti",
        sex: "male",
        breed: "Jamunapari",
        dob: "2024-08-15",
        status: "kid",
        source: "born_on_farm",
        purchaseDate: "",
        purchasePrice: 0,

        weights: [
            { d: "2024-10", w: 8 },
            { d: "2025-01", w: 14 },
        ],

        health: [],
        feeding: [],
        breeding: [],
    },

    {
        id: "GF-005",
        name: "Gori",
        sex: "female",
        breed: "Beetal",
        dob: "2023-01-08",
        status: "active",
        source: "purchased",
        purchaseDate: "2023-02-10",
        purchasePrice: 9200,

        weights: [
            { d: "2024-01", w: 24 },
            { d: "2024-04", w: 27 },
            { d: "2024-07", w: 30 },
            { d: "2024-10", w: 33 },
            { d: "2025-01", w: 35 },
        ],

        health: [],
        feeding: [],
        breeding: [],
    },

    {
        id: "GF-006",
        name: "Lalu",
        sex: "male",
        breed: "Sirohi",
        dob: "2023-09-30",
        status: "sold",
        source: "purchased",
        purchaseDate: "2023-10-15",
        purchasePrice: 6500,
        saleDate: "2025-01-10",
        salePrice: 15000,
        buyer: "Ramesh Traders",

        weights: [
            { d: "2024-01", w: 20 },
            { d: "2024-04", w: 24 },
            { d: "2024-07", w: 28 },
        ],

        health: [],
        feeding: [],
        breeding: [],
    },
];


/**
 * Monthly aggregate farm operational expenses.
 */
export const monthlyExpense = [
    {
        month: "Mar",
        feed: 4200,
        health: 800,
        other: 300
    },
    {
        month: "Apr",
        feed: 4500,
        health: 1200,
        other: 200
    },
    {
        month: "May",
        feed: 4100,
        health: 600,
        other: 500
    },
    {
        month: "Jun",
        feed: 4800,
        health: 900,
        other: 350
    },
    {
        month: "Jul",
        feed: 5100,
        health: 700,
        other: 400
    },
    {
        month: "Aug",
        feed: 4950,
        health: 1500,
        other: 300
    },
];


/**
 * Visual badge theme colors for each goat status.
 */
export const statusColor = {

    active: {
        bg: "#E8EFE7",
        fg: "#2C4A3B",
        dot: "#3F6B4E"
    },

    pregnant: {
        bg: "#FBF0DC",
        fg: "#8A5A00",
        dot: "#C9A227"
    },

    kid: {
        bg: "#E9F1F6",
        fg: "#2A5A73",
        dot: "#3F84A6"
    },

    sold: {
        bg: "#F0EDE7",
        fg: "#6B6357",
        dot: "#9C9182"
    },

    deceased: {
        bg: "#F5E6E2",
        fg: "#8A3A24",
        dot: "#A8452C"
    },
};


/**
 * Human-friendly labels for medical and health records.
 */
export const healthTypeLabel = {

    vaccination: "Vaccination",

    medicine: "Medicine",

    deworming: "Deworming",

    checkup: "Checkup",
};