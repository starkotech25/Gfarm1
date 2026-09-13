/**
 * @file helpers.js
 * @description Utility functions for date calculations, unique ID generation,
 * and multi-sheet Excel report exports.
 */

import * as XLSX from "https://cdn.sheetjs.com/xlsx-0.20.3/package/xlsx.mjs";

import { healthTypeLabel } from "./mockData.js";


/**
 * Calculates a friendly human-readable age string from a date of birth.
 *
 * @param {string} dob - Date of birth (YYYY-MM-DD)
 * @returns {string} - e.g. "5 mo", "1y 2mo", "2y", or "—"
 */
export function ageFromDob(dob) {

    if (!dob) {
        return "—";
    }

    const months = Math.floor(
        (
            Date.now() -
            new Date(dob).getTime()
        ) /
        (
            1000 *
            60 *
            60 *
            24 *
            30.44
        )
    );

    if (months < 0) {
        return "0 mo";
    }

    if (months < 12) {
        return `${months} mo`;
    }

    const y = Math.floor(months / 12);
    const m = months % 12;

    return m
        ? `${y}y ${m}mo`
        : `${y}y`;
}


/**
 * Generates a short unique identifier.
 *
 * @param {string} prefix
 * @returns {string}
 */
export function uid(prefix = "id") {

    return `${prefix}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
}


/**
 * Generates and downloads a comprehensive
 * multi-sheet Excel workbook.
 *
 * Sheets:
 * 1. Goats
 * 2. Weight Log
 * 3. Health & Vaccination
 * 4. Feeding Log
 * 5. Breeding Log
 * 6. Farm Summary
 *
 * @param {Array} goats
 */
export function exportToExcel(goats) {

    const wb = XLSX.utils.book_new();


    /* =====================================================
       1. GOATS SHEET
       ===================================================== */

    const goatRows = goats.map((g) => ({

        "Tag ID": g.id,

        "Name":
            g.name || "—",

        "Sex":
            g.sex,

        "Breed":
            g.breed,

        "Date of Birth":
            g.dob,

        "Status":
            g.status,

        "Source":
            g.source === "purchased"
                ? "Purchased"
                : "Born on farm",

        "Purchase Date":
            g.purchaseDate || "",

        "Purchase Price (₹)":
            g.purchasePrice || 0,

        "Sale Date":
            g.saleDate || "",

        "Sale Price (₹)":
            g.salePrice || "",

        "Buyer":
            g.buyer || "",

        "Latest Weight (kg)":
            g.weights && g.weights.length
                ? g.weights[g.weights.length - 1].w
                : "",
    }));


    XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(goatRows),
        "Goats"
    );


    /* =====================================================
       2. WEIGHT LOG
       ===================================================== */

    const weightRows = goats.flatMap((g) =>

        (g.weights || []).map((w) => ({

            "Tag ID":
                g.id,

            "Name":
                g.name || "—",

            "Date":
                w.d,

            "Weight (kg)":
                w.w,
        }))
    );


    XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(weightRows),
        "Weight Log"
    );


    /* =====================================================
       3. HEALTH & VACCINATION
       ===================================================== */

    const healthRows = goats.flatMap((g) =>

        (g.health || []).map((h) => ({

            "Tag ID":
                g.id,

            "Name":
                g.name || "—",

            "Date":
                h.date,

            "Type":
                healthTypeLabel[h.type] || h.type,

            "Description":
                h.description,

            "Cost (₹)":
                h.cost || 0,
        }))
    );


    XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(healthRows),
        "Health & Vaccination"
    );


    /* =====================================================
       4. FEEDING LOG
       ===================================================== */

    const feedingRows = goats.flatMap((g) =>

        (g.feeding || []).map((f) => ({

            "Tag ID":
                g.id,

            "Name":
                g.name || "—",

            "Date":
                f.date,

            "Feed Type":
                f.feedType,

            "Quantity (kg)":
                f.quantity,

            "Cost (₹)":
                f.cost || 0,
        }))
    );


    XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(feedingRows),
        "Feeding Log"
    );


    /* =====================================================
       5. BREEDING LOG
       ===================================================== */

    const breedingRows = goats.flatMap((g) =>

        (g.breeding || []).map((b) => ({

            "Tag ID":
                g.id,

            "Name":
                g.name || "—",

            "Mating Date":
                b.matingDate,

            "Sire ID":
                b.sireId || "—",

            "Expected Delivery":
                b.expectedDelivery || "—",

            "Notes":
                b.notes || "",
        }))
    );


    XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(breedingRows),
        "Breeding Log"
    );


    /* =====================================================
       6. FARM SUMMARY
       ===================================================== */

    const totalInvestment =
        goats.reduce(
            (sum, g) =>
                sum +
                (g.purchasePrice || 0),
            0
        );


    const totalSales =
        goats.reduce(
            (sum, g) =>
                sum +
                (g.salePrice || 0),
            0
        );


    const totalHealthSpend =
        goats.reduce(
            (sum, g) =>
                sum +
                (g.health || []).reduce(
                    (healthSum, h) =>
                        healthSum +
                        (h.cost || 0),
                    0
                ),
            0
        );


    const totalFeedSpend =
        goats.reduce(
            (sum, g) =>
                sum +
                (g.feeding || []).reduce(
                    (feedSum, f) =>
                        feedSum +
                        (f.cost || 0),
                    0
                ),
            0
        );


    const activeGoatsCount =
        goats.filter(
            (g) =>
                g.status !== "sold" &&
                g.status !== "deceased"
        ).length;


    const summaryRows = [

        {
            "Metric":
                "Total Goats Registered",

            "Value":
                goats.length,
        },

        {
            "Metric":
                "Active Goats on Farm",

            "Value":
                activeGoatsCount,
        },

        {
            "Metric":
                "Total Herd Investment (₹)",

            "Value":
                totalInvestment,
        },

        {
            "Metric":
                "Total Sales Realized (₹)",

            "Value":
                totalSales,
        },

        {
            "Metric":
                "Total Health & Medical Spend (₹)",

            "Value":
                totalHealthSpend,
        },

        {
            "Metric":
                "Total Feed & Nutrition Spend (₹)",

            "Value":
                totalFeedSpend,
        },

        {
            "Metric":
                "Net Herd Balance (₹)",

            "Value":
                totalSales -
                totalInvestment -
                totalHealthSpend -
                totalFeedSpend,
        },
    ];


    XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(summaryRows),
        "Farm Summary"
    );


    /* =====================================================
       DOWNLOAD EXCEL FILE
       ===================================================== */

    const dateStr =
        new Date()
            .toISOString()
            .slice(0, 10);


    XLSX.writeFile(
        wb,
        `Starko_Goat_Farm_Report_${dateStr}.xlsx`
    );
}


/**
 * Health labels will be connected to mockData.js
 * later in the conversion.
 *
 * This fallback keeps the helper working until
 * the data file is converted.
 */
function getHealthTypeLabel(type) {

    const labels = {

        vaccination: "Vaccination",
        treatment: "Treatment",
        deworming: "Deworming",
        checkup: "Checkup",
        medicine: "Medicine",
        other: "Other",

    };

    return labels[type] || type;
}