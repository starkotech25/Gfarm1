/**
 * Modal Component
 *
 * Base modal shell containing:
 * - Animated popup dialog
 * - Header
 * - Close button
 * - Body content
 * - Optional footer actions
 *
 * @param {Object} options
 * @param {string} options.title - Modal title
 * @param {Function} options.onClose - Callback when closing
 * @param {HTMLElement|string} options.children - Modal body content
 * @param {HTMLElement|string} options.footer - Optional footer content
 * @param {boolean} options.wide - Whether to use the wider modal
 * @returns {HTMLElement}
 */

export function Modal({
    title,
    onClose,
    children,
    footer = null,
    wide = false
}) {

    const overlay =
        document.createElement("div");

    overlay.className =
        "modal-overlay";


    /* Close when clicking the overlay */
    overlay.addEventListener(
        "click",
        () => {

            if (typeof onClose === "function") {
                onClose();
            }

        }
    );


    const modal =
        document.createElement("div");

    modal.className =
        wide
            ? "modal modal-wide"
            : "modal";


    /* Prevent modal click from closing it */
    modal.addEventListener(
        "click",
        (event) => {
            event.stopPropagation();
        }
    );


    /* ==============================
       MODAL HEADER
       ============================== */

    const header =
        document.createElement("div");

    header.className =
        "modal-head";


    const heading =
        document.createElement("h3");

    heading.textContent =
        title || "";


    const closeButton =
        document.createElement("button");

    closeButton.className =
        "icon-btn";

    closeButton.setAttribute(
        "aria-label",
        "Close modal"
    );


    /*
     * Lucide X icon is created directly
     * instead of using lucide-react.
     */
    closeButton.innerHTML = `
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M18 6 6 18"></path>
            <path d="m6 6 12 12"></path>
        </svg>
    `;


    closeButton.addEventListener(
        "click",
        () => {

            if (typeof onClose === "function") {
                onClose();
            }

        }
    );


    header.appendChild(heading);
    header.appendChild(closeButton);


    /* ==============================
       MODAL BODY
       ============================== */

    const body =
        document.createElement("div");

    body.className =
        "modal-body";


    if (children instanceof Node) {

        body.appendChild(children);

    } else if (children != null) {

        body.innerHTML =
            String(children);
    }


    /* ==============================
       MODAL FOOTER
       ============================== */

    if (footer) {

        const footerElement =
            document.createElement("div");

        footerElement.className =
            "modal-foot";


        if (footer instanceof Node) {

            footerElement.appendChild(
                footer
            );

        } else {

            footerElement.innerHTML =
                String(footer);
        }


        modal.appendChild(
            footerElement
        );
    }


    /* ==============================
       ASSEMBLE MODAL
       ============================== */

    modal.insertBefore(
        header,
        modal.firstChild
    );

    modal.appendChild(body);

    overlay.appendChild(modal);


    return overlay;
}