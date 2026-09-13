import { Modal } from "../components/Modal.js";
import { uid } from "../helpers.js";

export function HealthModal({ goat, onClose, onAdd }) {
    const form = {
        date: new Date().toISOString().slice(0, 10),
        type: "vaccination",
        description: "",
        cost: "",
    };

    const content = document.createElement("div");

    // Date + Treatment Type
    const row = document.createElement("div");
    row.className = "row-2";

    const dateLabel = document.createElement("label");
    dateLabel.textContent = "Date";

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.value = form.date;
    dateInput.required = true;

    dateInput.addEventListener("input", (e) => {
        form.date = e.target.value;
    });

    dateLabel.appendChild(dateInput);

    const typeLabel = document.createElement("label");
    typeLabel.textContent = "Treatment Type";

    const typeSelect = document.createElement("select");

    const options = [
        ["vaccination", "Vaccination (PPR, FMD, ET)"],
        ["deworming", "Deworming"],
        ["medicine", "Medicine / Treatment"],
        ["checkup", "General Checkup"],
    ];

    options.forEach(([value, text]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        typeSelect.appendChild(option);
    });

    typeSelect.value = form.type;

    typeSelect.addEventListener("change", (e) => {
        form.type = e.target.value;
    });

    typeLabel.appendChild(typeSelect);

    row.appendChild(dateLabel);
    row.appendChild(typeLabel);

    // Description
    const descriptionLabel = document.createElement("label");
    descriptionLabel.textContent = "Description / Drug Name";

    const descriptionInput = document.createElement("input");
    descriptionInput.value = form.description;
    descriptionInput.placeholder =
        "e.g. PPR vaccine dose 2, Albendazole deworming";
    descriptionInput.required = true;

    descriptionInput.addEventListener("input", (e) => {
        form.description = e.target.value;
    });

    descriptionLabel.appendChild(descriptionInput);

    // Cost
    const costLabel = document.createElement("label");
    costLabel.textContent = "Cost (₹)";

    const costInput = document.createElement("input");
    costInput.type = "number";
    costInput.value = form.cost;
    costInput.placeholder = "150";

    costInput.addEventListener("input", (e) => {
        form.cost = e.target.value;
    });

    costLabel.appendChild(costInput);

    content.appendChild(row);
    content.appendChild(descriptionLabel);
    content.appendChild(costLabel);

    const handleSubmit = () => {
        if (!form.date || !form.description) return;

        onAdd({
            id: uid("h"),
            ...form,
            cost: Number(form.cost) || 0,
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
        title: `Log Health Record — ${goat.id}`,
        onClose,
        children: content,
        footer,
    });
}