/**
 * ConfirmModal Component
 *
 * Confirmation dialog for destructive actions.
 *
 * @param {Object} options
 * @param {string} options.title - Dialog title
 * @param {string} options.message - Warning message
 * @param {Function} options.onCancel - Cancel callback
 * @param {Function} options.onConfirm - Confirm callback
 * @returns {HTMLElement}
 */

import { Modal } from "./Modal.js";

export function ConfirmModal({
    title,
    message,
    onCancel,
    onConfirm
}) {

    const content =
        document.createElement("div");

    content.style.display = "flex";
    content.style.gap = "12px";
    content.style.alignItems = "flex-start";


    /* Alert Triangle icon */
    const icon =
        document.createElement("span");

    icon.innerHTML = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#A8452C"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.46 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
            <path d="M12 9v4"></path>
            <path d="M12 17h.01"></path>
        </svg>
    `;

    icon.style.flexShrink = "0";
    icon.style.marginTop = "2px";


    /* Warning message */
    const messageElement =
        document.createElement("div");

    messageElement.style.fontSize =
        "13px";

    messageElement.style.color =
        "var(--ink)";

    messageElement.style.lineHeight =
        "1.5";

    messageElement.textContent =
        message || "";


    content.appendChild(icon);
    content.appendChild(messageElement);


    /* Footer buttons */
    const footer =
        document.createElement("div");


    const cancelButton =
        document.createElement("button");

    cancelButton.className =
        "btn-ghost";

    cancelButton.textContent =
        "Cancel";

    cancelButton.addEventListener(
        "click",
        () => {

            if (typeof onCancel === "function") {
                onCancel();
            }

        }
    );


    const confirmButton =
        document.createElement("button");

    confirmButton.className =
        "btn-danger";

    confirmButton.textContent =
        "Delete permanently";

    confirmButton.addEventListener(
        "click",
        () => {

            if (typeof onConfirm === "function") {
                onConfirm();
            }

        }
    );


    footer.appendChild(cancelButton);
    footer.appendChild(confirmButton);


    /*
     * Modal.js accepts the footer as a DOM element.
     */
    return Modal({
        title,
        onClose: onCancel,
        children: content,
        footer
    });
}