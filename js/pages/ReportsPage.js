export function ReportsPage({ goats, chartData, summary }) {
    let reportGoatId = goats[0]?.id || "";

    const root = document.createElement("div");

    function createSvgElement(tag, attributes = {}) {
        const element = document.createElementNS(
            "http://www.w3.org/2000/svg",
            tag
        );

        Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
        });

        return element;
    }

    function createChartContainer(height = 260) {
        const container = document.createElement("div");
        container.style.width = "100%";
        container.style.height = `${height}px`;
        container.style.position = "relative";
        container.style.overflow = "hidden";

        return container;
    }

    function createTooltip() {
        const tooltip = document.createElement("div");

        tooltip.style.position = "absolute";
        tooltip.style.display = "none";
        tooltip.style.pointerEvents = "none";
        tooltip.style.background = "#FFFFFF";
        tooltip.style.fontSize = "12px";
        tooltip.style.fontFamily = "'Inter', sans-serif";
        tooltip.style.border = "1px solid #E4DDCE";
        tooltip.style.borderRadius = "8px";
        tooltip.style.padding = "8px 10px";
        tooltip.style.zIndex = "10";

        return tooltip;
    }

    function drawExpenseChart(container) {
        container.innerHTML = "";

        if (!chartData || chartData.length === 0) {
            return;
        }

        const width = Math.max(
            container.clientWidth || 700,
            500
        );

        const height = 260;

        const margin = {
            top: 10,
            right: 10,
            bottom: 35,
            left: 48,
        };

        const chartWidth =
            width - margin.left - margin.right;

        const chartHeight =
            height - margin.top - margin.bottom;

        const svg = createSvgElement("svg", {
            width: "100%",
            height: height,
            viewBox: `0 0 ${width} ${height}`,
            preserveAspectRatio: "none",
        });

        // Find maximum expense
        const maxValue =
            Math.max(
                ...chartData.map((item) =>
                    Number(item.total) || 0
                )
            ) || 1000;

        const yMax = Math.ceil(maxValue / 1000) * 1000;

        const xPosition = (index) => {
            if (chartData.length === 1) {
                return margin.left + chartWidth / 2;
            }

            return (
                margin.left +
                (index / (chartData.length - 1)) *
                    chartWidth
            );
        };

        const yPosition = (value) => {
            return (
                margin.top +
                chartHeight -
                (Number(value) / yMax) * chartHeight
            );
        };

        // Horizontal grid lines
        for (let i = 0; i <= 5; i++) {
            const value = (yMax / 5) * i;
            const y = yPosition(value);

            const line = createSvgElement("line", {
                x1: margin.left,
                y1: y,
                x2: width - margin.right,
                y2: y,
                stroke: "#E4DDCE",
                "stroke-dasharray": "3 3",
            });

            svg.appendChild(line);

            const label = createSvgElement("text", {
                x: margin.left - 7,
                y: y + 4,
                "text-anchor": "end",
                fill: "#6B6357",
                "font-size": "11",
                "font-family": "'JetBrains Mono', monospace",
            });

            label.textContent =
                `₹${value / 1000}k`;

            svg.appendChild(label);
        }

        // X-axis
        const axis = createSvgElement("line", {
            x1: margin.left,
            y1: height - margin.bottom,
            x2: width - margin.right,
            y2: height - margin.bottom,
            stroke: "#E4DDCE",
        });

        svg.appendChild(axis);

        // X labels
        chartData.forEach((item, index) => {
            const label = createSvgElement("text", {
                x: xPosition(index),
                y: height - 12,
                "text-anchor": "middle",
                fill: "#6B6357",
                "font-size": "11",
                "font-family": "'JetBrains Mono', monospace",
            });

            label.textContent = item.month;

            svg.appendChild(label);
        });

        // Create points
        const totalPoints = chartData.map(
            (item, index) => ({
                x: xPosition(index),
                y: yPosition(item.total),
                item,
            })
        );

        // Area
        if (totalPoints.length > 0) {
            let areaPath =
                `M ${totalPoints[0].x} ${height - margin.bottom}`;

            totalPoints.forEach((point) => {
                areaPath +=
                    ` L ${point.x} ${point.y}`;
            });

            areaPath +=
                ` L ${totalPoints[totalPoints.length - 1].x} ${height - margin.bottom} Z`;

            const area = createSvgElement("path", {
                d: areaPath,
                fill: "#A8452C",
                "fill-opacity": "0.08",
                stroke: "none",
            });

            svg.appendChild(area);
        }

        // Total expense line
        if (totalPoints.length > 0) {
            let path =
                `M ${totalPoints[0].x} ${totalPoints[0].y}`;

            for (let i = 1; i < totalPoints.length; i++) {
                path +=
                    ` L ${totalPoints[i].x} ${totalPoints[i].y}`;
            }

            const line = createSvgElement("path", {
                d: path,
                fill: "none",
                stroke: "#A8452C",
                "stroke-width": "2.5",
            });

            svg.appendChild(line);
        }

        // Total dots
        totalPoints.forEach((point) => {
            const circle = createSvgElement("circle", {
                cx: point.x,
                cy: point.y,
                r: "4",
                fill: "#A8452C",
            });

            svg.appendChild(circle);
        });

        // Feed line
        const feedPoints = chartData.map(
            (item, index) => ({
                x: xPosition(index),
                y: yPosition(item.feed || 0),
            })
        );

        if (feedPoints.length > 0) {
            let path =
                `M ${feedPoints[0].x} ${feedPoints[0].y}`;

            for (let i = 1; i < feedPoints.length; i++) {
                path +=
                    ` L ${feedPoints[i].x} ${feedPoints[i].y}`;
            }

            const line = createSvgElement("path", {
                d: path,
                fill: "none",
                stroke: "#C9A227",
                "stroke-width": "1.5",
                "stroke-dasharray": "4 3",
            });

            svg.appendChild(line);
        }

        // Health line
        const healthPoints = chartData.map(
            (item, index) => ({
                x: xPosition(index),
                y: yPosition(item.health || 0),
            })
        );

        if (healthPoints.length > 0) {
            let path =
                `M ${healthPoints[0].x} ${healthPoints[0].y}`;

            for (let i = 1; i < healthPoints.length; i++) {
                path +=
                    ` L ${healthPoints[i].x} ${healthPoints[i].y}`;
            }

            const line = createSvgElement("path", {
                d: path,
                fill: "none",
                stroke: "#3F84A6",
                "stroke-width": "1.5",
                "stroke-dasharray": "2 2",
            });

            svg.appendChild(line);
        }

        // Tooltip
        const tooltip = createTooltip();
        container.appendChild(tooltip);

        totalPoints.forEach((point) => {
            const hitArea = createSvgElement("circle", {
                cx: point.x,
                cy: point.y,
                r: "10",
                fill: "transparent",
            });

            hitArea.addEventListener("mouseenter", () => {
                const item = point.item;

                tooltip.innerHTML = `
                    <div><strong>${item.month}</strong></div>
                    <div>Total Expenses: ₹${Number(item.total || 0).toLocaleString("en-IN")}</div>
                    <div>Feed: ₹${Number(item.feed || 0).toLocaleString("en-IN")}</div>
                    <div>Health / Medical: ₹${Number(item.health || 0).toLocaleString("en-IN")}</div>
                `;

                tooltip.style.display = "block";
                tooltip.style.left = `${point.x + 10}px`;
                tooltip.style.top = `${Math.max(point.y - 70, 5)}px`;
            });

            hitArea.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });

            svg.appendChild(hitArea);
        });

        container.appendChild(svg);
    }

    function drawWeightChart(container, goat) {
        container.innerHTML = "";

        if (
            !goat ||
            !goat.weights ||
            goat.weights.length === 0
        ) {
            const empty = document.createElement("div");
            empty.className = "detail-empty";
            empty.textContent =
                "No weight milestones recorded for this goat yet.";

            container.appendChild(empty);
            return;
        }

        const weights = goat.weights;

        const width = Math.max(
            container.clientWidth || 700,
            500
        );

        const height = 260;

        const margin = {
            top: 10,
            right: 10,
            bottom: 35,
            left: 38,
        };

        const chartWidth =
            width - margin.left - margin.right;

        const chartHeight =
            height - margin.top - margin.bottom;

        const minWeight =
            Math.min(
                ...weights.map((item) => Number(item.w) || 0)
            );

        const maxWeight =
            Math.max(
                ...weights.map((item) => Number(item.w) || 0)
            );

        const range =
            maxWeight - minWeight || 10;

        const yMin =
            Math.max(
                0,
                Math.floor((minWeight - range * 0.15) / 5) * 5
            );

        const yMax =
            Math.ceil((maxWeight + range * 0.15) / 5) * 5;

        const xPosition = (index) => {
            if (weights.length === 1) {
                return margin.left + chartWidth / 2;
            }

            return (
                margin.left +
                (index / (weights.length - 1)) *
                    chartWidth
            );
        };

        const yPosition = (value) => {
            return (
                margin.top +
                chartHeight -
                ((Number(value) - yMin) /
                    (yMax - yMin)) *
                    chartHeight
            );
        };

        const svg = createSvgElement("svg", {
            width: "100%",
            height: height,
            viewBox: `0 0 ${width} ${height}`,
            preserveAspectRatio: "none",
        });

        // Horizontal grid
        for (let i = 0; i <= 5; i++) {
            const value =
                yMin + ((yMax - yMin) / 5) * i;

            const y = yPosition(value);

            const grid = createSvgElement("line", {
                x1: margin.left,
                y1: y,
                x2: width - margin.right,
                y2: y,
                stroke: "#E4DDCE",
                "stroke-dasharray": "3 3",
            });

            svg.appendChild(grid);

            const label = createSvgElement("text", {
                x: margin.left - 7,
                y: y + 4,
                "text-anchor": "end",
                fill: "#6B6357",
                "font-size": "11",
                "font-family": "'JetBrains Mono', monospace",
            });

            label.textContent =
                `${Math.round(value)}kg`;

            svg.appendChild(label);
        }

        // X-axis
        const axis = createSvgElement("line", {
            x1: margin.left,
            y1: height - margin.bottom,
            x2: width - margin.right,
            y2: height - margin.bottom,
            stroke: "#E4DDCE",
        });

        svg.appendChild(axis);

        // X labels
        weights.forEach((item, index) => {
            const label = createSvgElement("text", {
                x: xPosition(index),
                y: height - 12,
                "text-anchor": "middle",
                fill: "#6B6357",
                "font-size": "11",
                "font-family": "'JetBrains Mono', monospace",
            });

            label.textContent = item.d;

            svg.appendChild(label);
        });

        const points = weights.map(
            (item, index) => ({
                x: xPosition(index),
                y: yPosition(item.w),
                item,
            })
        );

        // Line
        if (points.length > 0) {
            let path =
                `M ${points[0].x} ${points[0].y}`;

            for (let i = 1; i < points.length; i++) {
                path +=
                    ` L ${points[i].x} ${points[i].y}`;
            }

            const line = createSvgElement("path", {
                d: path,
                fill: "none",
                stroke: "#2C4A3B",
                "stroke-width": "2.5",
            });

            svg.appendChild(line);
        }

        // Dots + tooltip
        const tooltip = createTooltip();
        container.appendChild(tooltip);

        points.forEach((point) => {
            const circle = createSvgElement("circle", {
                cx: point.x,
                cy: point.y,
                r: "5",
                fill: "#2C4A3B",
            });

            svg.appendChild(circle);

            const hitArea = createSvgElement("circle", {
                cx: point.x,
                cy: point.y,
                r: "10",
                fill: "transparent",
            });

            hitArea.addEventListener("mouseenter", () => {
                tooltip.innerHTML = `
                    <div><strong>${point.item.d}</strong></div>
                    <div>Weight: ${point.item.w} kg</div>
                `;

                tooltip.style.display = "block";
                tooltip.style.left = `${point.x + 10}px`;
                tooltip.style.top = `${Math.max(point.y - 50, 5)}px`;
            });

            hitArea.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });

            svg.appendChild(hitArea);
        });

        container.appendChild(svg);
    }

    // =========================================
    // Monthly Expense Panel
    // =========================================

    const expensePanel = document.createElement("div");
    expensePanel.className = "panel";
    expensePanel.style.marginBottom = "20px";

    const expenseHead = document.createElement("div");
    expenseHead.className = "panel-head";

    const expenseTitle = document.createElement("h2");
    expenseTitle.textContent =
        "Monthly Operational Expenditure (₹)";

    expenseHead.appendChild(expenseTitle);
    expensePanel.appendChild(expenseHead);

    const expenseChart =
        createChartContainer(260);

    expensePanel.appendChild(expenseChart);

    root.appendChild(expensePanel);

    // =========================================
    // Goat Weight Panel
    // =========================================

    const weightPanel = document.createElement("div");
    weightPanel.className = "panel";

    const weightHead = document.createElement("div");
    weightHead.className = "panel-head";

    const weightTitle = document.createElement("h2");
    weightTitle.textContent =
        "Individual Goat Weight Progression";

    const goatSelect =
        document.createElement("select");

    goatSelect.className = "report-select";

    goats.forEach((g) => {
        const option =
            document.createElement("option");

        option.value = g.id;
        option.textContent =
            `${g.id} — ${g.name || "Unnamed"} (${g.breed})`;

        goatSelect.appendChild(option);
    });

    goatSelect.value = reportGoatId;

    goatSelect.addEventListener("change", (e) => {
        reportGoatId = e.target.value;

        const selectedGoat =
            goats.find(
                (g) => g.id === reportGoatId
            ) || goats[0];

        drawWeightChart(
            weightChart,
            selectedGoat
        );
    });

    weightHead.appendChild(weightTitle);
    weightHead.appendChild(goatSelect);

    weightPanel.appendChild(weightHead);

    const weightChart =
        createChartContainer(260);

    weightPanel.appendChild(weightChart);

    root.appendChild(weightPanel);

    // Initial charts
    requestAnimationFrame(() => {
        drawExpenseChart(expenseChart);

        const reportGoat =
            goats.find(
                (g) => g.id === reportGoatId
            ) || goats[0];

        drawWeightChart(
            weightChart,
            reportGoat
        );
    });

    return root;
}

export default ReportsPage;