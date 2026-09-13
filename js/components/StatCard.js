/**
 * StatCard Component
 *
 * Displays a high-level metric card with:
 * - Icon
 * - Numeric/value metric
 * - Label
 * - Optional subtitle
 * - Accent color
 *
 * @param {Object} options
 * @param {HTMLElement} options.icon - Icon element
 * @param {string} options.label - Metric name / title
 * @param {string|number} options.value - Primary metric value
 * @param {string} options.sub - Optional subtitle
 * @param {string} options.accent - Accent color
 * @returns {HTMLElement}
 */

export function StatCard({
    icon,
    label,
    value,
    sub,
    accent = "#2C4A3B"
}) {

    const card = document.createElement("div");

    card.className = "stat-card";

    card.style.setProperty(
        "--accent",
        accent
    );


    const iconBox = document.createElement("div");

    iconBox.className = "stat-icon";

    iconBox.style.background =
        `${accent}1a`;

    iconBox.style.color =
        accent;


    /*
     * The icon is supplied as an HTMLElement
     * because React components are no longer being used.
     */
    if (icon) {
        iconBox.appendChild(icon);
    }


    const content = document.createElement("div");


    const valueElement =
        document.createElement("div");

    valueElement.className =
        "stat-value";

    valueElement.textContent =
        value ?? "";


    const labelElement =
        document.createElement("div");

    labelElement.className =
        "stat-label";

    labelElement.textContent =
        label ?? "";


    content.appendChild(valueElement);
    content.appendChild(labelElement);


    if (sub) {

        const subElement =
            document.createElement("div");

        subElement.className =
            "stat-sub";

        subElement.textContent =
            sub;

        content.appendChild(subElement);
    }


    card.appendChild(iconBox);
    card.appendChild(content);


    return card;
}