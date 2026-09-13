import { Modal } from "../components/Modal.js";
import { uid } from "../helpers.js";

export function BreedingModal({ goat, onClose, onAdd }) {
    const form = {
        matingDate: new Date().toISOString().slice(0, 10),
        sireId: "",
        expectedDelivery: "",
        notes: "",
    };

    const content = document.createElement("div");

    // Mating Date + Sire ID
    const row = document.createElement("div");
    row.className = "row-2";

    const matingDateLabel = document.createElement("label");
    matingDateLabel.textContent = "Mating Date";

    const matingDateInput = document.createElement("input");
    matingDateInput.type = "date";
    matingDateInput.value = form.matingDate;
    matingDateInput.required = true;

    matingDateInput.addEventListener("input", (e) => {
        form.matingDate = e.target.value;
    });

    matingDateLabel.appendChild(matingDateInput);

    const sireLabel = document.createElement("label");
    sireLabel.textContent = "Sire ID (Buck Tag)";

    const sireInput = document.createElement("input");
    sireInput.value = form.sireId;
    sireInput.placeholder = "e.g. GF-002";

    sireInput.addEventListener("input", (e) => {
        form.sireId = e.target.value;
    });

    sireLabel.appendChild(sireInput);

    row.appendChild(matingDateLabel);
    row.appendChild(sireLabel);

    // Expected Delivery
    const deliveryLabel = document.createElement("label");
    deliveryLabel.textContent =
        "Expected Delivery Date (~150 days gestation)";

    const deliveryInput = document.createElement("input");
    deliveryInput.type = "date";
    deliveryInput.value = form.expectedDelivery;

    deliveryInput.addEventListener("input", (e) => {
        form.expectedDelivery = e.target.value;
    });

    deliveryLabel.appendChild(deliveryInput);

    // Notes
    const notesLabel = document.createElement("label");
    notesLabel.textContent = "Notes & Pregnancy Observations";

    const notesInput = document.createElement("input");
    notesInput.value = form.notes;
    notesInput.placeholder = "e.g. First pregnancy, twins expected";

    notesInput.addEventListener("input", (e) => {
        form.notes = e.target.value;
    });

    notesLabel.appendChild(notesInput);

    content.appendChild(row);
    content.appendChild(deliveryLabel);
    content.appendChild(notesLabel);

    const handleSubmit = () => {
        if (!form.matingDate) return;

        onAdd({
            id: uid("b"),
            ...form,
        });

        onClose();
    };

    const footer = document.createElement("div");

    const cancelButton = document.createElement("button");
    cancelButton.className = "btn-ghost";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", onClose);

    const saveButton = document.createElement("button");
    saveButton.className = "btn-primary";
    saveButton.textContent = "Save Record";
    saveButton.addEventListener("click", handleSubmit);

    footer.appendChild(cancelButton);
    footer.appendChild(saveButton);

    return Modal({
        title: `Log Breeding Record — ${goat.id} (${goat.name || "Doe"})`,
        onClose,
        children: content,
        footer,
    });
}