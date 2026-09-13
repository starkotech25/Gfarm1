/**
 * EarTag Component
 *
 * Renders a farm animal identification ear tag
 * with an eyelet hole.
 *
 * @param {string} id - Animal Tag ID
 * @param {Object} style - Optional inline style overrides
 * @returns {HTMLElement}
 */

export function EarTag(id, style = {}) {

    const tag = document.createElement("span");

    tag.className = "eartag";

    Object.assign(tag.style, style);

    const hole = document.createElement("span");

    hole.className = "eartag-hole";

    tag.appendChild(hole);

    tag.appendChild(
        document.createTextNode(id || "")
    );

    return tag;
}