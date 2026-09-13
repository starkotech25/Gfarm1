import { Modal } from "../components/Modal.js";

export function SellModal({ goat, onClose, onSell }) {
    const form = {
        saleDate: new Date().toISOString().slice(0, 10),
        salePrice: "",
        buyer: "",
    };

    const content = document.createElement("div");

    // Sale Date
    const saleDateLabel = document.createElement("label");
    saleDateLabel.textContent = "Sale Date";

    const saleDateInput = document.createElement("input");
    saleDateInput.type = "date";
    saleDateInput.value = form.saleDate;
    saleDateInput.required = true;

    saleDateLabel.appendChild(saleDateInput);

    // Sale Price
    const salePriceLabel = document.createElement("label");
    salePriceLabel.textContent = "Sale Price (₹)";

    const salePriceInput = document.createElement("input");
    salePriceInput.type = "number";
    salePriceInput.value = form.salePrice;
    salePriceInput.placeholder = "15000";
    salePriceInput.required = true;

    salePriceLabel.appendChild(salePriceInput);

    // Buyer
    const buyerLabel = document.createElement("label");
    buyerLabel.textContent = "Buyer Name / Trader";

    const buyerInput = document.createElement("input");
    buyerInput.value = form.buyer;
    buyerInput.placeholder = "e.g. Ramesh Traders, local buyer";

    buyerLabel.appendChild(buyerInput);

    content.appendChild(saleDateLabel);
    content.appendChild(salePriceLabel);
    content.appendChild(buyerLabel);

    const handleSubmit = () => {
        if (!saleDateInput.value || !salePriceInput.value) {
            return;
        }

        onSell({
            saleDate: saleDateInput.value,
            salePrice: Number(salePriceInput.value) || 0,
            buyer: buyerInput.value,
            status: "sold",
        });

        onClose();
    };

    const footer = document.createElement("div");

    const cancelButton = document.createElement("button");
    cancelButton.className = "btn-ghost";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", onClose);

    const confirmButton = document.createElement("button");
    confirmButton.className = "btn-primary";
    confirmButton.textContent = "Confirm Sale";
    confirmButton.addEventListener("click", handleSubmit);

    footer.appendChild(cancelButton);
    footer.appendChild(confirmButton);

    return Modal({
        title: `Record Sale — ${goat.id} (${goat.name || "Unnamed"})`,
        onClose,
        children: content,
        footer,
    });
}