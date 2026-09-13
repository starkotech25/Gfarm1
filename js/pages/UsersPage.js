import { UserEditModal } from "../modals/UserEditModal.js";
import { ConfirmModal } from "../components/ConfirmModal.js";

export function UsersPage({ users, setUsers, onUpdateUser }) {
    let editingUser = null;
    let deletingUser = null;

    const root = document.createElement("div");
    root.className = "panel";

    const pendingUsers = users.filter(
        (u) => u.status === "pending"
    );

    const panelHead = document.createElement("div");
    panelHead.className = "panel-head";

    const heading = document.createElement("h2");
    heading.textContent = "User & Worker Accounts";

    if (pendingUsers.length > 0) {
        const pendingCount = document.createElement("span");
        pendingCount.className = "pending-count";
        pendingCount.textContent =
            `${pendingUsers.length} Pending Approval`;

        heading.appendChild(pendingCount);
    }

    panelHead.appendChild(heading);
    root.appendChild(panelHead);

    const content = document.createElement("div");
    root.appendChild(content);

    function updateUserStatus(id, newStatus) {
        const userToUpdate = users.find(
            (u) => u.id === id
        );

        if (!userToUpdate) return;

        const updated = {
            ...userToUpdate,
            status: newStatus,
        };

        setUsers(
            users.map((u) =>
                u.id === id ? updated : u
            )
        );

        if (onUpdateUser) {
            onUpdateUser(updated);
        }
    }

    function handleSaveUser(updatedUser) {
        setUsers(
            users.map((u) =>
                u.id === updatedUser.id
                    ? updatedUser
                    : u
            )
        );

        if (onUpdateUser) {
            onUpdateUser(updatedUser);
        }

        editingUser = null;
        render();
    }

    function handleDeleteUser(id) {
        setUsers(
            users.filter((u) => u.id !== id)
        );

        deletingUser = null;
        render();
    }

    function createIcon(type, size = 20) {
        const wrapper = document.createElement("span");

        const icons = {
            user: `
                <svg width="${size}" height="${size}" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 20a6 6 0 0 0-12 0"/>
                    <circle cx="12" cy="10" r="4"/>
                </svg>
            `,
            pencil: `
                <svg width="${size}" height="${size}" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M12 20h9"/>
                    <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>
                </svg>
            `,
            trash: `
                <svg width="${size}" height="${size}" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <path d="M3 6h18"/>
                    <path d="M8 6V4h8v2"/>
                    <path d="M19 6l-1 14H6L5 6"/>
                    <path d="M10 11v5"/>
                    <path d="M14 11v5"/>
                </svg>
            `,
        };

        wrapper.innerHTML = icons[type] || "";
        return wrapper.firstElementChild;
    }

    function render() {
        content.innerHTML = "";

        if (users.length === 0) {
            const empty = document.createElement("div");
            empty.className = "detail-empty";
            empty.textContent =
                "No worker accounts have registered yet.";

            content.appendChild(empty);
            return;
        }

        const userList = document.createElement("div");
        userList.className = "user-list";

        const sortedUsers = users
            .slice()
            .sort((a, b) =>
                a.status === "pending" ? -1 : 1
            );

        sortedUsers.forEach((u) => {
            const badgeColors = {
                approved: {
                    bg: "#E8EFE7",
                    fg: "#2C4A3B",
                },
                rejected: {
                    bg: "#F5E6E2",
                    fg: "#8A3A24",
                },
                pending: {
                    bg: "#FBF0DC",
                    fg: "#8A5A00",
                },
            };

            const bc =
                badgeColors[u.status] ||
                badgeColors.pending;

            const userRow =
                document.createElement("div");

            userRow.className = "user-row";

            // User icon
            const userIcon =
                document.createElement("div");

            userIcon.className = "user-icon";
            userIcon.appendChild(
                createIcon("user", 20)
            );

            userRow.appendChild(userIcon);

            // User information
            const userInfo =
                document.createElement("div");

            userInfo.style.flex = "1";

            const userName =
                document.createElement("div");

            userName.className = "user-name";
            userName.textContent = u.name;

            const username =
                document.createElement("div");

            username.className = "goat-meta";
            username.textContent = `@${u.username}`;

            userInfo.appendChild(userName);
            userInfo.appendChild(username);

            userRow.appendChild(userInfo);

            // Status
            const statusBadge =
                document.createElement("span");

            statusBadge.className = "status-badge";
            statusBadge.style.background = bc.bg;
            statusBadge.style.color = bc.fg;
            statusBadge.textContent = u.status;

            userRow.appendChild(statusBadge);

            // Actions
            const actions =
                document.createElement("div");

            actions.className = "user-actions";

            // Approve
            if (u.status !== "approved") {
                const approve =
                    document.createElement("button");

                approve.className = "btn-outline";
                approve.textContent = "Approve";
                approve.title =
                    "Approve worker access";

                approve.addEventListener("click", () => {
                    updateUserStatus(
                        u.id,
                        "approved"
                    );
                });

                actions.appendChild(approve);
            }

            // Reject
            if (u.status !== "rejected") {
                const reject =
                    document.createElement("button");

                reject.className =
                    "btn-outline danger";

                reject.textContent = "Reject";
                reject.title =
                    "Reject worker access";

                reject.addEventListener("click", () => {
                    updateUserStatus(
                        u.id,
                        "rejected"
                    );
                });

                actions.appendChild(reject);
            }

            // Edit
            const edit =
                document.createElement("button");

            edit.className = "btn-outline";
            edit.title = "Edit user profile";

            edit.style.display = "inline-flex";
            edit.style.alignItems = "center";
            edit.style.gap = "4px";

            edit.appendChild(
                createIcon("pencil", 13)
            );

            edit.appendChild(
                document.createTextNode(" Edit")
            );

            edit.addEventListener("click", () => {
                editingUser = u;

                const modal =
                    UserEditModal({
                        user: editingUser,
                        users,
                        onClose: () => {
                            editingUser = null;
                        },
                        onSave: handleSaveUser,
                    });

                document.body.appendChild(modal);
            });

            actions.appendChild(edit);

            // Delete
            const deleteButton =
                document.createElement("button");

            deleteButton.className =
                "icon-btn row-delete";

            deleteButton.title =
                "Delete user account";

            deleteButton.appendChild(
                createIcon("trash", 15)
            );

            deleteButton.addEventListener("click", () => {
                deletingUser = u;

                const modal =
                    ConfirmModal({
                        title: "Delete Worker Account",
                        message:
                            `Are you sure you want to permanently delete the account for "${deletingUser.name}" (@${deletingUser.username})?`,
                        onCancel: () => {
                            deletingUser = null;
                        },
                        onConfirm: () => {
                            handleDeleteUser(
                                deletingUser.id
                            );
                            modal.remove();
                        },
                    });

                document.body.appendChild(modal);
            });

            actions.appendChild(deleteButton);

            userRow.appendChild(actions);
            userList.appendChild(userRow);
        });

        content.appendChild(userList);
    }

    render();

    return root;
}

export default UsersPage;