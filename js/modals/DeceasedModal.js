import { Modal } from "../components/Modal.js";

export function DeceasedModal({ goat, onClose, onConfirm }) {
    const form = {
        date: new Date().toISOString().slice(0, 10),
        reason: "",
    };

    const content = document.createElement("div");

    // Date of Death
    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Date of Death";

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = form.date;
    dateInput.required = true;

    dateInput.addEventListener("input", (e) => {
        form.date = e.target.value;
    });

    dateLabel.appendChild(dateInput);

    // Cause / Medical Notes
    const reasonLabel = document.createElement("label");
    reasonLabel.textContent = "Cause / Medical Notes";

    const reasonInput = document.createElement("input");
    reasonInput.value = form.reason;
    reasonInput.placeholder =
        "e.g. Sudden illness, bloat, predator, age";

    reasonInput.addEventListener("input", (e) => {
        form.reason = e.target.value;
    });

    reasonLabel.appendChild(reasonInput);

    content.appendChild(dateLabel);
    content.appendChild(reasonLabel);

    const handleConfirm = () => {
        if (!form.date) return;

        onConfirm(form);
        onClose();
    };

    const footer = document.createElement("div");

    const cancelButton = document.createElement("button");
    cancelButton.className = "btn-ghost";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", onClose);

    const confirmButton = document.createElement("button");
    confirmButton.className = "btn-danger";
    confirmButton.textContent = "Confirm Record";
    confirmButton.addEventListener("click", handleConfirm);

    footer.appendChild(cancelButton);
    footer.appendChild(confirmButton);

    return Modal({
        title: `Record Death — ${goat.id} (${goat.name || "Unnamed"})`,
        onClose,
        children: content,
        footer,
    });
}