import { StatCard } from "../components/StatCard.js";
import { EarTag } from "../components/EarTag.js";
import { statusColor, healthTypeLabel } from "../mockData.js";
import { ageFromDob } from "../helpers.js";

function createIcon(type, size = 14, strokeWidth = 2) {
    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.setAttribute("width", size);
    svg.setAttribute("height", size);
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.setAttribute("stroke", "currentColor");
    svg.setAttribute("stroke-width", strokeWidth);
    svg.setAttribute("stroke-linecap", "round");
    svg.setAttribute("stroke-linejoin", "round");

    const paths = {
        users: `
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        `,
        heart: `
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06
            a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"></path>
        `,
        rupee: `
            <path d="M6 3h12"></path>
            <path d="M6 8h12"></path>
            <path d="M10 3a5 5 0 0 1 0 10H6"></path>
            <path d="m6 13 8 8"></path>
        `,
        syringe: `
            <path d="m18 2 4 4"></path>
            <path d="m17 7 3-3"></path>
            <path d="M3 21 14 10"></path>
            <path d="m7 17 3 3"></path>
            <path d="M9 6 6 9"></path>
            <path d="m13 10 5 5"></path>
            <path d="m6 9 9 9"></path>
        `,
        wheat: `
            <path d="M2 22 16 8"></path>
            <path d="M17 13c-1.5-1.5-1.5-4.5 0-6s4.5-1.5 6 0c0 3-3 6-6 6Z"></path>
            <path d="M13 17c-1.5-1.5-1.5-4.5 0-6s4.5-1.5 6 0c0 3-3 6-6 6Z"></path>
            <path d="M9 21c-1.5-1.5-1.5-4.5 0-6s4.5-1.5 6 0c0 3-3 6-6 6Z"></path>
        `,
        trending: `
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
            <polyline points="17 6 23 6 23 12"></polyline>
        `,
        plus: `
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
        `,
        search: `
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        `,
        pencil: `
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"></path>
        `,
        trash: `
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
            <path d="M10 11v6"></path>
            <path d="M14 11v6"></path>
            <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"></path>
        `,
        tag: `
            <path d="M20.59 13.41 11 3.83V3H4v7h.83l9.58 9.59a2 2 0 0 0 2.83 0l3.35-3.35a2 2 0 0 0 0-2.83Z"></path>
            <circle cx="7.5" cy="6.5" r=".5"></circle>
        `,
        skull: `
            <circle cx="12" cy="10" r="8"></circle>
            <path d="M8 18v3"></path>
            <path d="M16 18v3"></path>
            <path d="M8 21h8"></path>
            <circle cx="9" cy="10" r="1"></circle>
            <circle cx="15" cy="10" r="1"></circle>
            <path d="M10 15h4"></path>
        `,
        baby: `
            <circle cx="12" cy="13" r="8"></circle>
            <path d="M12 5V2"></path>
            <path d="M9 2h6"></path>
            <circle cx="9" cy="12" r="1"></circle>
            <circle cx="15" cy="12" r="1"></circle>
            <path d="M9 16c2 1.5 4 1.5 6 0"></path>
        `,
        scale: `
            <path d="M12 3v18"></path>
            <path d="M5 6h14"></path>
            <path d="M5 6 2 13h6L5 6Z"></path>
            <path d="m19 6-3 7h6l-3-7Z"></path>
            <path d="M5 21h14"></path>
        `
    };

    svg.innerHTML = paths[type] || "";
    return svg;
}

function createLineChart(weights) {
    const wrapper = document.createElement("div");
    wrapper.style.width = "100%";
    wrapper.style.height = "130px";
    wrapper.style.position = "relative";

    const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
    );

    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "130");
    svg.setAttribute("viewBox", "0 0 600 130");
    svg.setAttribute("preserveAspectRatio", "none");

    const width = 600;
    const height = 130;
    const left = 38;
    const right = 10;
    const top = 10;
    const bottom = 25;

    const chartWidth = width - left - right;
    const chartHeight = height - top - bottom;

    const values = weights.map((item) => Number(item.w) || 0);
    const min = Math.min(...values);
    const max = Math.max(...values);

    const range = max === min ? 1 : max - min;

    const points = weights.map((item, index) => {
        const x =
            weights.length === 1
                ? left + chartWidth / 2
                : left + (index / (weights.length - 1)) * chartWidth;

        const y =
            top +
            chartHeight -
            ((Number(item.w) - min) / range) * chartHeight;

        return {
            x,
            y,
            value: item.w,
            date: item.d
        };
    });

    // Grid lines
    for (let i = 0; i < 4; i++) {
        const y = top + (i / 3) * chartHeight;

        const line = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
        );

        line.setAttribute("x1", left);
        line.setAttribute("x2", width - right);
        line.setAttribute("y1", y);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "#E4DDCE");
        line.setAttribute("stroke-dasharray", "3 3");

        svg.appendChild(line);
    }

    // Line
    if (points.length > 1) {
        const path = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "path"
        );

        const d = points
            .map(
                (point, index) =>
                    `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
            )
            .join(" ");

        path.setAttribute("d", d);
        path.setAttribute("fill", "none");
        path.setAttribute("stroke", "#2C4A3B");
        path.setAttribute("stroke-width", "2");

        svg.appendChild(path);
    }

    // Points
    points.forEach((point) => {
        const circle = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "circle"
        );

        circle.setAttribute("cx", point.x);
        circle.setAttribute("cy", point.y);
        circle.setAttribute("r", "3");
        circle.setAttribute("fill", "#2C4A3B");

        svg.appendChild(circle);
    });

    // X-axis labels
    points.forEach((point) => {
        const text = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "text"
        );

        text.setAttribute("x", point.x);
        text.setAttribute("y", height - 7);
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("font-size", "10");
        text.setAttribute("fill", "#6B6357");
        text.textContent = point.date;

        svg.appendChild(text);
    });

    wrapper.appendChild(svg);

    return wrapper;
}

function createHealthRow(item) {
    const row = document.createElement("div");
    row.className = "health-row";

    const icon = document.createElement("div");
    icon.className = "health-icon";
    icon.appendChild(createIcon("syringe", 13));

    const description = document.createElement("div");
    description.className = "health-desc";

    const title = document.createElement("div");
    title.textContent = item.description;

    const date = document.createElement("div");
    date.className = "health-date";
    date.textContent =
        `${healthTypeLabel[item.type] || item.type} · ${item.date}`;

    description.appendChild(title);
    description.appendChild(date);

    row.appendChild(icon);
    row.appendChild(description);

    if (item.cost > 0) {
        const cost = document.createElement("div");
        cost.className = "health-cost";
        cost.textContent = `₹${item.cost}`;
        row.appendChild(cost);
    }

    return row;
}

function createFeedingRow(item) {
    const row = document.createElement("div");
    row.className = "health-row";

    const icon = document.createElement("div");
    icon.className = "health-icon";
    icon.style.background = "#FBF0DC";
    icon.style.color = "#8A5A00";
    icon.appendChild(createIcon("wheat", 13));

    const description = document.createElement("div");
    description.className = "health-desc";

    const title = document.createElement("div");
    title.textContent =
        `${item.feedType} — ${item.quantity} kg`;

    const date = document.createElement("div");
    date.className = "health-date";
    date.textContent = item.date;

    description.appendChild(title);
    description.appendChild(date);

    row.appendChild(icon);
    row.appendChild(description);

    if (item.cost > 0) {
        const cost = document.createElement("div");
        cost.className = "health-cost";
        cost.textContent = `₹${item.cost}`;
        row.appendChild(cost);
    }

    return row;
}

function createBreedingRow(item) {
    const row = document.createElement("div");
    row.className = "health-row";

    const icon = document.createElement("div");
    icon.className = "health-icon";
    icon.style.background = "#E9F1F6";
    icon.style.color = "#3F84A6";
    icon.appendChild(createIcon("baby", 13));

    const description = document.createElement("div");
    description.className = "health-desc";

    const title = document.createElement("div");
    title.textContent =
        `Mated on ${item.matingDate}` +
        (item.sireId ? ` with Sire: ${item.sireId}` : "");

    const date = document.createElement("div");
    date.className = "health-date";
    date.textContent =
        `Expected Delivery: ${item.expectedDelivery || "—"}` +
        (item.notes ? ` · ${item.notes}` : "");

    description.appendChild(title);
    description.appendChild(date);

    row.appendChild(icon);
    row.appendChild(description);

    return row;
}

export function DashboardPage({
    goats,
    summary,
    query,
    setQuery,
    filter,
    setFilter,
    selectedId,
    setSelectedId,
    selected,
    isAdmin,
    setModal,
    setPendingDeleteId
}) {
    const filteredGoats = goats.filter((g) => {
        const matchesQuery =
            `${g.name || ""} ${g.id || ""} ${g.breed || ""}`
                .toLowerCase()
                .includes(query.toLowerCase());

        const matchesFilter =
            filter === "all" || g.status === filter;

        return matchesQuery && matchesFilter;
    });

    const page = document.createElement("div");

    // =========================================================
    // KPI CARDS
    // =========================================================

    const statsGrid = document.createElement("div");
    statsGrid.className = "stats-grid";

    const stats = [
        {
            icon: "users",
            label: "Active goats",
            value: summary.total,
            sub: `${summary.male}M · ${summary.female}F`,
            accent: "#2C4A3B"
        },
        {
            icon: "heart",
            label: "Kids / Pregnant",
            value: `${summary.kids} / ${summary.pregnant}`,
            sub: "on farm now",
            accent: "#C9A227"
        },
        {
            icon: "rupee",
            label: "Herd Investment",
            value: `₹${summary.investment.toLocaleString("en-IN")}`,
            sub: `₹${summary.sales.toLocaleString("en-IN")} in sales`,
            accent: "#3F84A6"
        },
        {
            icon: "syringe",
            label: "Health Spend",
            value: `₹${summary.healthSpend.toLocaleString("en-IN")}`,
            sub: "all-time vaccines & meds",
            accent: "#A8452C"
        },
        {
            icon: "wheat",
            label: "Feed Spend",
            value: `₹${summary.feedSpend.toLocaleString("en-IN")}`,
            sub: "logged rations",
            accent: "#8A5A00"
        },
        {
            icon: "trending",
            label: "Monthly Ops",
            value: `₹${summary.monthExpense.toLocaleString("en-IN")}`,
            sub: "feed + health + misc",
            accent: "#3F84A6"
        }
    ];

    stats.forEach((item) => {
        statsGrid.appendChild(
            StatCard({
                icon: createIcon(item.icon, 18, 2),
                label: item.label,
                value: item.value,
                sub: item.sub,
                accent: item.accent
            })
        );
    });

    page.appendChild(statsGrid);

    // =========================================================
    // TWO COLUMN LAYOUT
    // =========================================================

    const grid = document.createElement("div");
    grid.className = "grid-2";

    // =========================================================
    // LEFT - GOAT REGISTRY
    // =========================================================

    const registryPanel = document.createElement("div");
    registryPanel.className = "panel";

    const registryHead = document.createElement("div");
    registryHead.className = "panel-head";

    const registryTitle = document.createElement("h2");
    registryTitle.textContent =
        `Goat Registry (${filteredGoats.length})`;

    const addButton = document.createElement("button");
    addButton.className = "btn-add";
    addButton.appendChild(createIcon("plus"));
    addButton.appendChild(document.createTextNode(" Add Goat"));

    addButton.addEventListener("click", () => {
        setModal({ type: "add" });
    });

    registryHead.appendChild(registryTitle);
    registryHead.appendChild(addButton);

    registryPanel.appendChild(registryHead);

    // Search toolbar
    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";

    const searchBox = document.createElement("div");
    searchBox.className = "search-box";

    const searchIcon = createIcon("search", 14);
    searchIcon.style.color = "#6B6357";

    const searchInput = document.createElement("input");
    searchInput.placeholder = "Search by ID, name, breed…";
    searchInput.value = query;

    searchInput.addEventListener("input", (e) => {
        setQuery(e.target.value);
    });

    searchBox.appendChild(searchIcon);
    searchBox.appendChild(searchInput);
    toolbar.appendChild(searchBox);

    registryPanel.appendChild(toolbar);

    // Filter pills
    const filterPills = document.createElement("div");
    filterPills.className = "filter-pills";
    filterPills.style.marginBottom = "12px";

    ["all", "active", "pregnant", "kid", "sold", "deceased"]
        .forEach((filterValue) => {
            const button = document.createElement("button");

            button.className =
                `pill ${filter === filterValue ? "active" : ""}`;

            button.textContent = filterValue.toUpperCase();

            button.addEventListener("click", () => {
                setFilter(filterValue);
            });

            filterPills.appendChild(button);
        });

    registryPanel.appendChild(filterPills);

    // Goat list
    const goatList = document.createElement("div");
    goatList.className = "goat-list";

    filteredGoats.forEach((g) => {
        const row = document.createElement("div");

        row.className =
            `goat-row ${selectedId === g.id ? "selected" : ""}`;

        row.addEventListener("click", () => {
            setSelectedId(g.id);
        });

        const sc =
            statusColor[g.status] ||
            statusColor.active;

        const lastWeight =
            g.weights &&
            g.weights.length > 0
                ? g.weights[g.weights.length - 1]
                : null;

        row.appendChild(EarTag(g.id));

        const info = document.createElement("div");

        const name = document.createElement("div");
        name.className = "goat-name";
        name.textContent = g.name || "—";

        const meta = document.createElement("div");
        meta.className = "goat-meta";
        meta.textContent =
            `${g.breed} · ${g.sex} · ${ageFromDob(g.dob)}`;

        info.appendChild(name);
        info.appendChild(meta);

        row.appendChild(info);

        const weight = document.createElement("span");
        weight.className = "weight-tag";
        weight.textContent =
            lastWeight ? `${lastWeight.w} kg` : "—";

        row.appendChild(weight);

        const status = document.createElement("span");
        status.className = "status-badge";
        status.style.background = sc.bg;
        status.style.color = sc.fg;

        const dot = document.createElement("span");
        dot.className = "status-dot";
        dot.style.background = sc.dot;

        status.appendChild(dot);
        status.appendChild(
            document.createTextNode(g.status)
        );

        row.appendChild(status);

        if (isAdmin) {
            const deleteButton = document.createElement("button");

            deleteButton.className =
                "icon-btn row-delete";

            deleteButton.title = `Delete ${g.id}`;
            deleteButton.appendChild(createIcon("trash"));

            deleteButton.addEventListener("click", (e) => {
                e.stopPropagation();
                setPendingDeleteId(g.id);
            });

            row.appendChild(deleteButton);
        }

        goatList.appendChild(row);
    });

    if (filteredGoats.length === 0) {
        const empty = document.createElement("div");
        empty.className = "detail-empty";
        empty.textContent =
            "No goats match this filter or search.";

        goatList.appendChild(empty);
    }

    registryPanel.appendChild(goatList);

    // =========================================================
    // RIGHT - GOAT DETAILS
    // =========================================================

    const detailPanel = document.createElement("div");
    detailPanel.className = "panel";

    const detailHead = document.createElement("div");
    detailHead.className = "panel-head";

    const detailTitle = document.createElement("h2");
    detailTitle.textContent = "Goat Detail & Logs";

    detailHead.appendChild(detailTitle);
    detailPanel.appendChild(detailHead);

    if (!selected) {
        const empty = document.createElement("div");
        empty.className = "detail-empty";

        empty.appendChild(
            createIcon("scale", 28, 1.5)
        );

        empty.appendChild(
            document.createTextNode(
                "Select a goat from the registry on the left to view its complete medical, feeding, and breeding history."
            )
        );

        detailPanel.appendChild(empty);
    } else {
        const detail = document.createElement("div");

        // -----------------------------------------------------
        // Profile Header
        // -----------------------------------------------------

        const profileHead = document.createElement("div");
        profileHead.className = "detail-head";

        const profileInfo = document.createElement("div");

        profileInfo.appendChild(EarTag(selected.id));

        const detailName = document.createElement("div");
        detailName.className = "detail-name";
        detailName.textContent =
            selected.name || "Unnamed";

        const detailMeta = document.createElement("div");
        detailMeta.className = "goat-meta";
        detailMeta.textContent =
            `${selected.breed} · ${selected.sex} · Age: ${ageFromDob(selected.dob)}`;

        profileInfo.appendChild(detailName);
        profileInfo.appendChild(detailMeta);

        const selectedStatus =
            statusColor[selected.status] ||
            statusColor.active;

        const statusBadge = document.createElement("span");
        statusBadge.className = "status-badge";
        statusBadge.style.background =
            selectedStatus.bg;
        statusBadge.style.color =
            selectedStatus.fg;

        const statusDot = document.createElement("span");
        statusDot.className = "status-dot";
        statusDot.style.background =
            selectedStatus.dot;

        statusBadge.appendChild(statusDot);
        statusBadge.appendChild(
            document.createTextNode(selected.status)
        );

        profileHead.appendChild(profileInfo);
        profileHead.appendChild(statusBadge);

        detail.appendChild(profileHead);

        // -----------------------------------------------------
        // Action Buttons
        // -----------------------------------------------------

        const actions = document.createElement("div");
        actions.className = "detail-actions";

        const addAction = (
            text,
            icon,
            className,
            callback
        ) => {
            const button = document.createElement("button");

            button.className = className || "btn-outline";

            button.appendChild(createIcon(icon, 13));
            button.appendChild(
                document.createTextNode(` ${text}`)
            );

            button.addEventListener("click", callback);

            actions.appendChild(button);
        };

        if (isAdmin) {
            addAction(
                "Edit",
                "pencil",
                "btn-outline",
                () => setModal({ type: "edit" })
            );
        }

        addAction(
            "Add Weight",
            "scale",
            "btn-outline",
            () => setModal({ type: "weight" })
        );

        addAction(
            "Health Record",
            "syringe",
            "btn-outline",
            () => setModal({ type: "health" })
        );

        addAction(
            "Feeding Record",
            "wheat",
            "btn-outline",
            () => setModal({ type: "feeding" })
        );

        if (selected.sex === "female") {
            addAction(
                "Breeding Record",
                "baby",
                "btn-outline",
                () => setModal({ type: "breeding" })
            );
        }

        if (
            isAdmin &&
            selected.status !== "sold" &&
            selected.status !== "deceased"
        ) {
            addAction(
                "Sell",
                "tag",
                "btn-outline",
                () => setModal({ type: "sell" })
            );
        }

        if (
            isAdmin &&
            selected.status !== "deceased" &&
            selected.status !== "sold"
        ) {
            addAction(
                "Mark Deceased",
                "skull",
                "btn-outline danger",
                () => setModal({ type: "deceased" })
            );
        }

        if (isAdmin) {
            addAction(
                "Delete",
                "trash",
                "btn-outline danger",
                () => setPendingDeleteId(selected.id)
            );
        }

        detail.appendChild(actions);

        // -----------------------------------------------------
        // Key Facts
        // -----------------------------------------------------

        const facts = document.createElement("div");
        facts.className = "detail-facts";

        const addFact = (label, value) => {
            const item = document.createElement("div");

            const factLabel = document.createElement("div");
            factLabel.className = "fact-label";
            factLabel.textContent = label;

            const factValue = document.createElement("div");
            factValue.className = "fact-value";
            factValue.textContent = value;

            item.appendChild(factLabel);
            item.appendChild(factValue);

            facts.appendChild(item);
        };

        addFact(
            "Date of Birth",
            selected.dob || "—"
        );

        addFact(
            "Source",
            selected.source === "purchased"
                ? "Purchased"
                : "Born on Farm"
        );

        const price =
            selected.status === "sold"
                ? selected.salePrice
                : selected.purchasePrice;

        addFact(
            selected.status === "sold"
                ? "Sale Price"
                : "Purchase Price",
            `₹${price?.toLocaleString("en-IN") || "0"}`
        );

        if (selected.status === "sold") {
            addFact(
                "Sale Date",
                selected.saleDate || "—"
            );

            addFact(
                "Buyer",
                selected.buyer || "—"
            );
        }

        detail.appendChild(facts);

        // -----------------------------------------------------
        // Weight Chart
        // -----------------------------------------------------

        if (
            selected.weights &&
            selected.weights.length > 1
        ) {
            const chartSection =
                document.createElement("div");

            chartSection.style.marginBottom = "18px";

            const sectionTitle =
                document.createElement("div");

            sectionTitle.className = "section-title";
            sectionTitle.textContent =
                "Weight Growth Curve (kg)";

            chartSection.appendChild(sectionTitle);
            chartSection.appendChild(
                createLineChart(selected.weights)
            );

            detail.appendChild(chartSection);
        }

        // -----------------------------------------------------
        // Health Log
        // -----------------------------------------------------

        const healthTitle =
            document.createElement("div");

        healthTitle.className = "section-title";
        healthTitle.textContent =
            "Health & Vaccination Log";

        detail.appendChild(healthTitle);

        const healthList =
            document.createElement("div");

        healthList.className = "health-list";
        healthList.style.marginBottom = "18px";

        const healthRecords =
            selected.health || [];

        if (healthRecords.length === 0) {
            const empty =
                document.createElement("div");

            empty.className = "goat-meta";
            empty.textContent =
                "No health or vaccination records yet.";

            healthList.appendChild(empty);
        }

        healthRecords
            .slice()
            .reverse()
            .forEach((item) => {
                healthList.appendChild(
                    createHealthRow(item)
                );
            });

        detail.appendChild(healthList);

        // -----------------------------------------------------
        // Feeding Log
        // -----------------------------------------------------

        const feedingTitle =
            document.createElement("div");

        feedingTitle.className = "section-title";
        feedingTitle.textContent = "Feeding Log";

        detail.appendChild(feedingTitle);

        const feedingList =
            document.createElement("div");

        feedingList.className = "health-list";
        feedingList.style.marginBottom = "18px";

        const feedingRecords =
            selected.feeding || [];

        if (feedingRecords.length === 0) {
            const empty =
                document.createElement("div");

            empty.className = "goat-meta";
            empty.textContent =
                "No feeding logs recorded yet.";

            feedingList.appendChild(empty);
        }

        feedingRecords
            .slice()
            .reverse()
            .forEach((item) => {
                feedingList.appendChild(
                    createFeedingRow(item)
                );
            });

        detail.appendChild(feedingList);

        // -----------------------------------------------------
        // Breeding Log
        // -----------------------------------------------------

        if (selected.sex === "female") {
            const breedingTitle =
                document.createElement("div");

            breedingTitle.className = "section-title";
            breedingTitle.textContent =
                "Breeding & Pregnancy Log";

            detail.appendChild(breedingTitle);

            const breedingList =
                document.createElement("div");

            breedingList.className = "health-list";

            const breedingRecords =
                selected.breeding || [];

            if (breedingRecords.length === 0) {
                const empty =
                    document.createElement("div");

                empty.className = "goat-meta";
                empty.textContent =
                    "No breeding records recorded yet.";

                breedingList.appendChild(empty);
            }

            breedingRecords
                .slice()
                .reverse()
                .forEach((item) => {
                    breedingList.appendChild(
                        createBreedingRow(item)
                    );
                });

            detail.appendChild(breedingList);
        }

        detailPanel.appendChild(detail);
    }

    grid.appendChild(registryPanel);
    grid.appendChild(detailPanel);

    page.appendChild(grid);

    return page;
}