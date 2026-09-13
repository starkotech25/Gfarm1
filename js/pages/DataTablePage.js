import { statusColor } from "../mockData.js";

export function DataTablePage({
    goats,
    query,
    setQuery,
    filter,
    setFilter,
    sortConfig,
    setSortConfig,
}) {
    const columns = [
        { key: "id", label: "Tag ID" },
        { key: "name", label: "Name" },
        { key: "sex", label: "Sex" },
        { key: "breed", label: "Breed" },
        { key: "dob", label: "DOB" },
        { key: "status", label: "Status" },
        { key: "source", label: "Source" },
        { key: "purchasePrice", label: "Purchase ₹" },
        { key: "salePrice", label: "Sale ₹" },
        { key: "weight", label: "Latest kg" },
    ];

    const toggleSort = (key) => {
        setSortConfig(
            sortConfig.key === key
                ? {
                    key,
                    dir: sortConfig.dir === "asc" ? "desc" : "asc",
                }
                : {
                    key,
                    dir: "asc",
                }
        );
    };

    const getRows = () => {
        const list = goats
            .filter((g) => {
                const matchesQuery =
                    `${g.name || ""} ${g.id || ""} ${g.breed || ""}`
                        .toLowerCase()
                        .includes(query.toLowerCase());

                const matchesFilter =
                    filter === "all" || g.status === filter;

                return matchesQuery && matchesFilter;
            })
            .map((g) => ({
                ...g,
                weight:
                    g.weights && g.weights.length
                        ? g.weights[g.weights.length - 1].w
                        : 0,
            }));

        list.sort((a, b) => {
            let av = a[sortConfig.key];
            let bv = b[sortConfig.key];

            if (typeof av === "string") av = av.toLowerCase();
            if (typeof bv === "string") bv = bv.toLowerCase();

            if (av == null) av = "";
            if (bv == null) bv = "";

            if (av < bv) {
                return sortConfig.dir === "asc" ? -1 : 1;
            }

            if (av > bv) {
                return sortConfig.dir === "asc" ? 1 : -1;
            }

            return 0;
        });

        return list;
    };

    const root = document.createElement("div");
    root.className = "panel";

    const panelHead = document.createElement("div");
    panelHead.className = "panel-head";

    const heading = document.createElement("h2");

    panelHead.appendChild(heading);
    root.appendChild(panelHead);

    const toolbar = document.createElement("div");
    toolbar.className = "toolbar";

    const searchBox = document.createElement("div");
    searchBox.className = "search-box";

    searchBox.innerHTML = `
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#6B6357"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
        >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
        </svg>
    `;

    const searchInput = document.createElement("input");
    searchInput.placeholder = "Search by ID, name, breed…";
    searchInput.value = query;

    searchInput.addEventListener("input", (e) => {
        setQuery(e.target.value);
        renderTable();
    });

    searchBox.appendChild(searchInput);
    toolbar.appendChild(searchBox);

    const filterPills = document.createElement("div");
    filterPills.className = "filter-pills";

    const filterValues = [
        "all",
        "active",
        "pregnant",
        "kid",
        "sold",
        "deceased",
    ];

    filterValues.forEach((f) => {
        const button = document.createElement("button");

        button.className =
            `pill ${filter === f ? "active" : ""}`;

        button.textContent = f.toUpperCase();

        button.addEventListener("click", () => {
            setFilter(f);
            renderTable();
        });

        filterPills.appendChild(button);
    });

    toolbar.appendChild(filterPills);
    root.appendChild(toolbar);

    const tableScroll = document.createElement("div");
    tableScroll.className = "table-scroll";

    const table = document.createElement("table");
    table.className = "data-table";

    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    columns.forEach((column) => {
        const th = document.createElement("th");

        th.addEventListener("click", () => {
            toggleSort(column.key);
            renderTable();
        });

        headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    tableScroll.appendChild(table);
    root.appendChild(tableScroll);

    function renderTable() {
        const rows = getRows();

        heading.textContent =
            `Goat Master Data Table (${rows.length} Records)`;

        searchInput.value = query;

        [...filterPills.children].forEach((button, index) => {
            button.className =
                `pill ${filter === filterValues[index] ? "active" : ""}`;
        });

        [...headerRow.children].forEach((th, index) => {
            const column = columns[index];

            th.textContent = column.label;

            if (sortConfig.key === column.key) {
                th.textContent +=
                    sortConfig.dir === "asc"
                        ? " ▲"
                        : " ▼";
            }
        });

        tbody.innerHTML = "";

        if (rows.length === 0) {
            const row = document.createElement("tr");
            const cell = document.createElement("td");

            cell.colSpan = columns.length;
            cell.style.textAlign = "center";
            cell.style.padding = "24px";
            cell.style.color = "var(--ink-soft)";
            cell.textContent =
                "No goat records match your search query.";

            row.appendChild(cell);
            tbody.appendChild(row);

            return;
        }

        rows.forEach((g) => {
            const sc =
                statusColor[g.status] ||
                statusColor.active;

            const row = document.createElement("tr");

            // Tag ID
            const idCell = document.createElement("td");

            const tag = document.createElement("span");
            tag.className = "eartag";
            tag.style.fontSize = "10px";

            const hole = document.createElement("span");
            hole.className = "eartag-hole";

            tag.appendChild(hole);
            tag.appendChild(
                document.createTextNode(g.id)
            );

            idCell.appendChild(tag);
            row.appendChild(idCell);

            // Name
            const nameCell = document.createElement("td");
            nameCell.textContent = g.name || "—";
            row.appendChild(nameCell);

            // Sex
            const sexCell = document.createElement("td");
            sexCell.style.textTransform = "capitalize";
            sexCell.textContent = g.sex;
            row.appendChild(sexCell);

            // Breed
            const breedCell = document.createElement("td");
            breedCell.textContent = g.breed;
            row.appendChild(breedCell);

            // DOB
            const dobCell = document.createElement("td");
            dobCell.textContent = g.dob || "—";
            row.appendChild(dobCell);

            // Status
            const statusCell = document.createElement("td");

            const statusBadge =
                document.createElement("span");

            statusBadge.className = "status-badge";
            statusBadge.style.background = sc.bg;
            statusBadge.style.color = sc.fg;

            const statusDot =
                document.createElement("span");

            statusDot.className = "status-dot";
            statusDot.style.background = sc.dot;

            statusBadge.appendChild(statusDot);
            statusBadge.appendChild(
                document.createTextNode(g.status)
            );

            statusCell.appendChild(statusBadge);
            row.appendChild(statusCell);

            // Source
            const sourceCell = document.createElement("td");

            sourceCell.textContent =
                g.source === "purchased"
                    ? "Purchased"
                    : "Born on Farm";

            row.appendChild(sourceCell);

            // Purchase Price
            const purchaseCell =
                document.createElement("td");

            purchaseCell.textContent =
                g.purchasePrice
                    ? `₹${g.purchasePrice.toLocaleString("en-IN")}`
                    : "—";

            row.appendChild(purchaseCell);

            // Sale Price
            const saleCell =
                document.createElement("td");

            saleCell.textContent =
                g.salePrice
                    ? `₹${g.salePrice.toLocaleString("en-IN")}`
                    : "—";

            row.appendChild(saleCell);

            // Weight
            const weightCell =
                document.createElement("td");

            weightCell.textContent =
                g.weight
                    ? `${g.weight} kg`
                    : "—";

            row.appendChild(weightCell);

            tbody.appendChild(row);
        });
    }

    renderTable();

    return root;
}

export default DataTablePage;