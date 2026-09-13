/**
 * FarmSeal Component
 *
 * Creates the circular farm seal crest.
 *
 * @param {string} initials - Initials displayed in the center.
 * @returns {HTMLElement}
 */

export function FarmSeal(initials = "SGF") {

    const container = document.createElement("div");

    container.className = "farm-seal";
    container.setAttribute("aria-hidden", "true");

    container.innerHTML = `
        <svg viewBox="0 0 100 100" width="52" height="52">

            <circle
                cx="50"
                cy="50"
                r="46"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-dasharray="4 3"
            ></circle>

            <circle
                cx="50"
                cy="50"
                r="37"
                fill="none"
                stroke="currentColor"
                stroke-width="1"
            ></circle>

            <text
                x="50"
                y="56"
                text-anchor="middle"
                font-family="'Roboto Slab', serif"
                font-weight="700"
                font-size="22"
                fill="currentColor"
            >${initials}</text>

        </svg>
    `;

    return container;
}