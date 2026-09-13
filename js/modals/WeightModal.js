import { Modal } from "../components/Modal.js";

export function WeightModal({ goat, onClose, onAdd }) {
    const form = {
        date: new Date().toISOString().slice(0, 7),
        w: "",
    };

    const content = document.createElement("div");

    // Measurement Period / Date
    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Measurement Period / Date";

    const dateInput = document.createElement("input");
    dateInput.type = "month";
    dateInput.value = form.date;
    dateInput.required = true;

    dateInput.addEventListener("input", (e) => {
        form.date = e.target.value;
    });

    dateLabel.appendChild(dateInput);

    // Weight
    const weightLabel = document.createElement("label");
    weightLabel.textContent = "Weight (kg)";

    const weightInput = document.createElement("input");
    weightInput.type = "number";
    weightInput.step = "0.1";
    weightInput.value = form.w;
    weightInput.placeholder = "e.g. 32.5";
    weightInput.required = true;

    weightInput.addEventListener("input", (e) => {
        form.w = e.target.value;
    });

    weightLabel.appendChild(weightInput);

    content.appendChild(dateLabel);
    content.appendChild(weightLabel);

    const handleSubmit = () => {
        if (!form.date || !form.w) return;

        onAdd({
            d: form.date,
            w: Number(form.w),
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
    saveButton.textContent = "Save Weight";
    saveButton.addEventListener("click", handleSubmit);

    footer.appendChild(cancelButton);
    footer.appendChild(saveButton);

    return Modal({
        title: `Log Weight Milestone — ${goat.id}`,
        onClose,
        children: content,
        footer,
    });
}