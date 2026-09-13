import { Modal } from "../components/Modal.js";
import { uid } from "../helpers.js";

export function FeedingModal({ goat, onClose, onAdd }) {
    const form = {
        date: new Date().toISOString().slice(0, 10),
        feedType: "Green fodder",
        quantity: "",
        cost: "",
    };

    const content = document.createElement("div");

    // Date + Feed Type
    const row1 = document.createElement("div");
    row1.className = "row-2";

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

    const feedLabel = document.createElement("label");
    feedLabel.textContent = "Feed Type";

    const feedSelect = document.createElement("select");

    const feedOptions = [
        "Green fodder (Lucerne, Napier)",
        "Dry fodder (Wheat straw, Hay)",
        "Concentrate mix",
        "Mineral mixture & salt",
        "Silage",
    ];

    feedOptions.forEach((text) => {
        const option = document.createElement("option");
        option.textContent = text;
        option.value = text;
        feedSelect.appendChild(option);
    });

    feedSelect.value = form.feedType;

    feedSelect.addEventListener("change", (e) => {
        form.feedType = e.target.value;
    });

    feedLabel.appendChild(feedSelect);

    row1.appendChild(dateLabel);
    row1.appendChild(feedLabel);

    // Quantity + Cost
    const row2 = document.createElement("div");
    row2.className = "row-2";

    const quantityLabel = document.createElement("label");
    quantityLabel.textContent = "Quantity (kg)";

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.step = "0.1";
    quantityInput.value = form.quantity;
    quantityInput.placeholder = "2.5";
    quantityInput.required = true;

    quantityInput.addEventListener("input", (e) => {
        form.quantity = e.target.value;
    });

    quantityLabel.appendChild(quantityInput);

    const costLabel = document.createElement("label");
    costLabel.textContent = "Cost (₹)";

    const costInput = document.createElement("input");
    costInput.type = "number";
    costInput.value = form.cost;
    costInput.placeholder = "60";

    costInput.addEventListener("input", (e) => {
        form.cost = e.target.value;
    });

    costLabel.appendChild(costInput);

    row2.appendChild(quantityLabel);
    row2.appendChild(costLabel);

    content.appendChild(row1);
    content.appendChild(row2);

    const handleSubmit = () => {
        if (!form.date || !form.quantity) return;

        onAdd({
            id: uid("f"),
            ...form,
            quantity: Number(form.quantity),
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
        title: `Log Feeding Record — ${goat.id}`,
        onClose,
        children: content,
        footer,
    });
}