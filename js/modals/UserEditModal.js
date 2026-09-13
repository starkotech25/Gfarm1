import { Modal } from "../components/Modal.js";

export function UserEditModal({ user, users, onClose, onSave }) {
    const form = {
        name: user?.name || "",
        username: user?.username || "",
        password: user?.password || "",
        status: user?.status || "pending",
    };

    let error = null;

    const content = document.createElement("div");

    // Error message
    const errorMessage = document.createElement("div");
    errorMessage.className = "gate-message error";
    errorMessage.style.margin = "0 0 10px";
    errorMessage.style.fontSize = "12px";
    errorMessage.style.display = "flex";
    errorMessage.style.alignItems = "center";
    errorMessage.style.gap = "6px";
    errorMessage.style.display = "none";

    errorMessage.innerHTML = `
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <span></span>
    `;

    content.appendChild(errorMessage);

    const showError = (message) => {
        error = message;
        errorMessage.querySelector("span").textContent = message;
        errorMessage.style.display = "flex";
    };

    const clearError = () => {
        error = null;
        errorMessage.querySelector("span").textContent = "";
        errorMessage.style.display = "none";
    };

    const createField = (
        labelText,
        type,
        value,
        placeholder,
        field,
        required = true
    ) => {
        const label = document.createElement("label");
        label.textContent = labelText;

        const input = document.createElement("input");
        input.type = type;
        input.value = value;
        input.placeholder = placeholder;
        input.required = required;

        input.addEventListener("input", (e) => {
            form[field] = e.target.value;
            clearError();
        });

        label.appendChild(input);
        content.appendChild(label);

        return input;
    };

    // Full Name
    createField(
        "Full Name",
        "text",
        form.name,
        "e.g. Ramesh Kumar",
        "name"
    );

    // Username
    createField(
        "Username",
        "text",
        form.username,
        "e.g. ramesh",
        "username"
    );

    // Password
    createField(
        "Password",
        "text",
        form.password,
        "Worker login password",
        "password"
    );

    // Account Approval Status
    const statusLabel = document.createElement("label");
    statusLabel.textContent = "Account Approval Status";

    const statusSelect = document.createElement("select");

    const statusOptions = [
        ["approved", "Approved (Can Sign In)"],
        ["pending", "Pending (Awaiting Approval)"],
        ["rejected", "Rejected (Access Denied)"],
    ];

    statusOptions.forEach(([value, text]) => {
        const option = document.createElement("option");
        option.value = value;
        option.textContent = text;
        statusSelect.appendChild(option);
    });

    statusSelect.value = form.status;

    statusSelect.addEventListener("change", (e) => {
        form.status = e.target.value;
        clearError();
    });

    statusLabel.appendChild(statusSelect);
    content.appendChild(statusLabel);

    const handleSave = () => {
        const name = form.name.trim();
        const username = form.username.trim();
        const password = form.password;

        if (!name || !username || !password) {
            showError(
                "All fields (Full Name, Username, and Password) are required."
            );
            return;
        }

        // Check if username is taken by another account
        const isDuplicate = users.some(
            (u) =>
                u.id !== user.id &&
                u.username.toLowerCase() === username.toLowerCase()
        );

        if (isDuplicate) {
            showError(
                `The username "${username}" is already taken by another account.`
            );
            return;
        }

        onSave({
            ...user,
            name,
            username,
            password,
            status: form.status,
        });

        onClose();
    };

    const footer = document.createElement("div");

    const cancelButton = document.createElement("button");
    cancelButton.className = "btn-ghost";
    cancelButton.type = "button";
    cancelButton.textContent = "Cancel";
    cancelButton.addEventListener("click", onClose);

    const saveButton = document.createElement("button");
    saveButton.className = "btn-primary";
    saveButton.type = "button";

    saveButton.innerHTML = `
        <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <polyline points="16 11 18 13 22 9"></polyline>
        </svg>
        Save Changes
    `;

    saveButton.addEventListener("click", handleSave);

    footer.appendChild(cancelButton);
    footer.appendChild(saveButton);

    return Modal({
        title: `Edit Profile — @${user.username}`,
        onClose,
        children: content,
        footer,
    });
}