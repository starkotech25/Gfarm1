/**
 * @file app.js
 * @description Main application orchestrator for Starko Goat Farm Dashboard.
 *
 * Pure JavaScript version of the original React App.jsx.
 * No React, Vite, Node.js, or lucide-react required.
 */

import { exportToExcel } from "./helpers.js";

import {
    loadGoats,
    saveGoats,
    loadUsers,
    loadExpenses,
    saveUsers,
    loadAuthenticatedProfile,
    signInAdmin,
    signInWorker,
    registerWorker,
    isRegistrationInProgress,
    signOutUser,
    subscribeToAuthState,
} from "./storage.js";

import { ADMIN_EMAIL } from "./firebase.js";

import { FarmSeal } from "./components/FarmSeal.js";
import { ConfirmModal } from "./components/ConfirmModal.js";

import { GoatFormModal } from "./modals/GoatFormModal.js";
import { SellModal } from "./modals/SellModal.js";
import { DeceasedModal } from "./modals/DeceasedModal.js";
import { WeightModal } from "./modals/WeightModal.js";
import { HealthModal } from "./modals/HealthModal.js";
import { FeedingModal } from "./modals/FeedingModal.js";
import { BreedingModal } from "./modals/BreedingModal.js";

import { RoleGate } from "./pages/RoleGate.js";
import { DashboardPage } from "./pages/DashboardPage.js";
import { DataTablePage } from "./pages/DataTablePage.js";
import { ReportsPage } from "./pages/ReportsPage.js";
import { UsersPage } from "./pages/UsersPage.js";


// ============================================================================
// Application State
// ============================================================================

const state = {
    role: null,
    users: [],
    currentUser: null,
    sessionNotice: null,

    goats: [],
    goatsLoading: true,
    expenses: [],
    usersLoaded: false,

    page: "dashboard",

    sortConfig: {
        key: "id",
        dir: "asc",
    },

    query: "",
    filter: "all",

    selectedId: null,

    modal: null,

    pendingDeleteId: null,

    lastActivity: Date.now(),

    authUnsubscribe: null,
    inactivityInterval: null,
};


// ============================================================================
// Root
// ============================================================================

const root = document.getElementById("root");


// ============================================================================
// Utility
// ============================================================================

function setRoot(content) {
    root.innerHTML = "";

    if (content instanceof Node) {
        root.appendChild(content);
    } else if (typeof content === "string") {
        root.innerHTML = content;
    }
}


function createElementFromHTML(html) {
    const template = document.createElement("template");
    template.innerHTML = html.trim();
    return template.content.firstElementChild;
}


function createSvgIcon(name, size = 14) {
    const icons = {
        users: `
            <svg viewBox="0 0 24 24" width="${size}" height="${size}"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
        `,

        search: `
            <svg viewBox="0 0 24 24" width="${size}" height="${size}"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <path d="m21 21-4.3-4.3"/>
            </svg>
        `,

        trendingUp: `
            <svg viewBox="0 0 24 24" width="${size}" height="${size}"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
            </svg>
        `,

        shieldCheck: `
            <svg viewBox="0 0 24 24" width="${size}" height="${size}"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <path d="m9 12 2 2 4-4"/>
            </svg>
        `,

        userCircle: `
            <svg viewBox="0 0 24 24" width="${size}" height="${size}"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <circle cx="12" cy="8" r="3"/>
                <path d="M6.5 19a6 6 0 0 1 11 0"/>
            </svg>
        `,

        download: `
            <svg viewBox="0 0 24 24" width="${size}" height="${size}"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3v12"/>
                <path d="m7 10 5 5 5-5"/>
                <path d="M5 21h14"/>
            </svg>
        `,

        logout: `
            <svg viewBox="0 0 24 24" width="${size}" height="${size}"
                fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round">
                <path d="M10 17l5-5-5-5"/>
                <path d="M15 12H3"/>
                <path d="M21 19V5a2 2 0 0 0-2-2h-6"/>
            </svg>
        `,
    };

    return createElementFromHTML(icons[name] || "");
}


// ============================================================================
// Current Selected Goat
// ============================================================================

function getSelectedGoat() {
    return state.goats.find(
        (goat) => goat.id === state.selectedId
    ) || null;
}


function getPendingDeleteGoat() {
    return state.goats.find(
        (goat) => goat.id === state.pendingDeleteId
    ) || null;
}


// ============================================================================
// Goat Mutations
// ============================================================================

function updateGoat(id, patch) {
    state.goats = state.goats.map((goat) =>
        goat.id === id
            ? { ...goat, ...patch }
            : goat
    );

    saveGoatsToFirebase();
    renderApplication();
}


function deleteGoat(id) {
    state.goats = state.goats.filter(
        (goat) => goat.id !== id
    );

    if (state.selectedId === id) {
        state.selectedId = null;
    }

    saveGoatsToFirebase();
    renderApplication();
}


function addGoat(newGoat) {
    state.goats = [
        ...state.goats,
        newGoat,
    ];

    saveGoatsToFirebase();
    renderApplication();
}


function addWeight(id, entry) {
    const goat = state.goats.find(
        (item) => item.id === id
    );

    if (!goat) return;

    updateGoat(id, {
        weights: [
            ...(goat.weights || []),
            entry,
        ],
    });
}


function addHealth(id, entry) {
    const goat = state.goats.find(
        (item) => item.id === id
    );

    if (!goat) return;

    updateGoat(id, {
        health: [
            ...(goat.health || []),
            entry,
        ],
    });
}


function addFeeding(id, entry) {
    const goat = state.goats.find(
        (item) => item.id === id
    );

    if (!goat) return;

    updateGoat(id, {
        feeding: [
            ...(goat.feeding || []),
            entry,
        ],
    });
}


function addBreeding(id, entry) {
    const goat = state.goats.find(
        (item) => item.id === id
    );

    if (!goat) return;

    updateGoat(id, {
        breeding: [
            ...(goat.breeding || []),
            entry,
        ],
    });
}


// ============================================================================
// Firebase Saving
// ============================================================================

async function saveGoatsToFirebase() {
    if (!state.role || state.goatsLoading) {
        return;
    }

    try {
        await saveGoats(state.goats);
    } catch (error) {
        console.error(
            "gfarm: could not save goats to Firebase",
            error
        );
    }
}


async function saveUsersToFirebase() {
    if (
        state.role !== "admin" ||
        !state.usersLoaded
    ) {
        return;
    }

    try {
        await saveUsers(state.users);
    } catch (error) {
        console.error(
            "gfarm: could not save users to Firebase",
            error
        );
    }
}


// ============================================================================
// User Profile
// ============================================================================

function handleUpdateUserProfile(updatedUser) {
    if (
        state.currentUser &&
        state.currentUser.id === updatedUser.id
    ) {
        state.currentUser = updatedUser;
    }

    renderApplication();
}


// ============================================================================
// Summary
// ============================================================================

function calculateSummary() {
    const active = state.goats.filter(
        (goat) =>
            goat.status !== "sold" &&
            goat.status !== "deceased"
    );

    const male = active.filter(
        (goat) => goat.sex === "male"
    ).length;

    const female = active.filter(
        (goat) => goat.sex === "female"
    ).length;

    const kids = active.filter(
        (goat) => goat.status === "kid"
    ).length;

    const pregnant = active.filter(
        (goat) => goat.status === "pregnant"
    ).length;

    const investment = state.goats.reduce(
        (sum, goat) =>
            sum + (goat.purchasePrice || 0),
        0
    );

    const sales = state.goats
        .filter((goat) => goat.status === "sold")
        .reduce(
            (sum, goat) =>
                sum + (goat.salePrice || 0),
            0
        );

    const healthSpend = state.goats.reduce(
        (sum, goat) =>
            sum +
            (goat.health || []).reduce(
                (healthSum, health) =>
                    healthSum + (health.cost || 0),
                0
            ),
        0
    );

    const feedSpend = state.goats.reduce(
        (sum, goat) =>
            sum +
            (goat.feeding || []).reduce(
                (feedSum, feed) =>
                    feedSum + (feed.cost || 0),
                0
            ),
        0
    );

    const latestMonth =
        state.expenses[state.expenses.length - 1] || {
            feed: 0,
            health: 0,
            other: 0,
        };

    const monthExpense =
        (latestMonth.feed || 0) +
        (latestMonth.health || 0) +
        (latestMonth.other || 0);

    return {
        total: active.length,
        male,
        female,
        kids,
        pregnant,
        investment,
        sales,
        monthExpense,
        healthSpend,
        feedSpend,
    };
}


function getChartData() {
    return state.expenses.map((month) => ({
        ...month,
        total:
            (month.feed || 0) +
            (month.health || 0) +
            (month.other || 0),
    }));
}


// ============================================================================
// Modal Handling
// ============================================================================

function closeModal() {
    state.modal = null;
    renderApplication();
}


function openModal(type) {
    state.modal = {
        type,
    };

    renderApplication();
}


// ============================================================================
// Logout
// ============================================================================

async function handleLogout(notice = null) {
    try {
        await signOutUser();
    } catch (error) {
        console.error(
            "gfarm: sign-out failed",
            error
        );
    }

    state.role = null;
    state.currentUser = null;
    state.sessionNotice = notice;
    state.selectedId = null;
    state.modal = null;
    state.pendingDeleteId = null;

    stopInactivityTracker();

    renderApplication();
}


// ============================================================================
// Authentication
// ============================================================================

async function handleAdminLogin(password) {
    try {
        await signInAdmin(password);

        state.sessionNotice = null;

        return true;
    } catch (error) {
        console.error(
            "gfarm: admin sign-in failed",
            error
        );

        return false;
    }
}


async function handleUserLogin(username, password) {
    try {
        await signInWorker(
            username,
            password
        );

        state.sessionNotice = null;

        return "ok";
    } catch (error) {
        if (
            error.code ===
            "profile/pending"
        ) {
            return "pending";
        }

        if (
            error.code ===
            "profile/rejected"
        ) {
            return "rejected";
        }

        return "invalid";
    }
}


async function handleRegister(user) {
    try {
        await registerWorker(user);

        return {
            status: "success",
        };
    } catch (error) {
        if (
            error.code ===
            "auth/email-already-in-use"
        ) {
            return {
                status: "duplicate",
            };
        }

        if (
            error.code ===
            "auth/invalid-email"
        ) {
            return {
                status: "invalid-username",
            };
        }

        if (
            error.code ===
            "auth/password-too-short"
        ) {
            return {
                status: "short-password",
            };
        }

        if (
            error.code ===
            "permission-denied" ||
            error.code ===
            "profile/not-saved"
        ) {
            return {
                status: "database-error",
            };
        }

        console.error(
            "gfarm: worker registration failed",
            error
        );

        return {
            status: "error",
            code: error.code || "unknown",
        };
    }
}


// ============================================================================
// Firebase Authentication Listener
// ============================================================================

function initializeAuthentication() {
    state.authUnsubscribe =
        subscribeToAuthState(
            async (firebaseUser) => {

                if (
                    isRegistrationInProgress()
                ) {
                    return;
                }

                if (!firebaseUser) {
                    state.role = null;
                    state.currentUser = null;

                    renderApplication();

                    return;
                }

                if (
                    firebaseUser.email ===
                    ADMIN_EMAIL
                ) {
                    state.role = "admin";
                    state.currentUser = null;

                    renderApplication();

                    await initializeApplicationData();

                    return;
                }

                try {
                    const profile =
                        await loadAuthenticatedProfile(
                            firebaseUser.uid
                        );

                    if (
                        profile?.status ===
                        "approved"
                    ) {
                        state.role = "user";
                        state.currentUser = profile;

                        renderApplication();

                        await initializeApplicationData();
                    } else {
                        await signOutUser();

                        state.role = null;
                        state.currentUser = null;

                        renderApplication();
                    }

                } catch (error) {
                    console.error(
                        "gfarm: could not restore authentication profile",
                        error
                    );

                    await signOutUser();

                    state.role = null;
                    state.currentUser = null;

                    renderApplication();
                }
            }
        );
}


// ============================================================================
// Firebase Data Initialization
// ============================================================================

let dataLoadVersion = 0;

async function initializeApplicationData() {
    if (!state.role) {
        return;
    }

    const currentLoad =
        ++dataLoadVersion;

    state.goatsLoading = true;
    state.usersLoaded = false;

    renderApplication();

    try {
        const [
            goatData,
            expenseData,
            userData,
        ] = await Promise.all([
            loadGoats(),
            loadExpenses(),
            state.role === "admin"
                ? loadUsers()
                : Promise.resolve([]),
        ]);

        if (
            currentLoad !==
            dataLoadVersion
        ) {
            return;
        }

        state.goats = goatData || [];
        state.expenses = expenseData || [];
        state.users = userData || [];
        state.usersLoaded = true;

    } catch (error) {
        console.error(
            "gfarm: could not initialize Firebase data",
            error
        );

    } finally {
        if (
            currentLoad ===
            dataLoadVersion
        ) {
            state.goatsLoading = false;

            renderApplication();

            startInactivityTracker();
        }
    }
}


// ============================================================================
// Inactivity Tracker
// ============================================================================

function recordActivity() {
    state.lastActivity =
        Date.now();
}


function startInactivityTracker() {
    stopInactivityTracker();

    if (!state.role) {
        return;
    }

    state.lastActivity =
        Date.now();

    const events = [
        "mousemove",
        "mousedown",
        "keydown",
        "scroll",
        "touchstart",
        "click",
    ];

    events.forEach((eventName) => {
        window.addEventListener(
            eventName,
            recordActivity,
            {
                passive: true,
            }
        );
    });

    state.inactivityInterval =
        setInterval(() => {

            if (!state.role) {
                return;
            }

            if (
                Date.now() -
                state.lastActivity >
                5 * 60 * 1000
            ) {
                handleLogout(
                    "Your session expired due to 5 minutes of inactivity. Please sign in again."
                );
            }

        }, 3000);

    const handleVisibilityChange =
        () => {

            if (
                document.visibilityState !==
                "visible"
            ) {
                return;
            }

            if (
                Date.now() -
                state.lastActivity >
                5 * 60 * 1000
            ) {
                handleLogout(
                    "Your session expired due to 5 minutes of inactivity. Please sign in again."
                );
            } else {
                recordActivity();
            }
        };

    state._visibilityHandler =
        handleVisibilityChange;

    document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
    );

    window.addEventListener(
        "focus",
        handleVisibilityChange
    );
}


function stopInactivityTracker() {
    const events = [
        "mousemove",
        "mousedown",
        "keydown",
        "scroll",
        "touchstart",
        "click",
    ];

    events.forEach((eventName) => {
        window.removeEventListener(
            eventName,
            recordActivity
        );
    });

    if (
        state.inactivityInterval
    ) {
        clearInterval(
            state.inactivityInterval
        );

        state.inactivityInterval =
            null;
    }

    if (
        state._visibilityHandler
    ) {
        document.removeEventListener(
            "visibilitychange",
            state._visibilityHandler
        );

        window.removeEventListener(
            "focus",
            state._visibilityHandler
        );

        state._visibilityHandler =
            null;
    }
}


// ============================================================================
// Header
// ============================================================================

function renderHeader(isAdmin) {
    const header =
        document.createElement("header");

    header.className =
        "header";

    const headerLeft =
        document.createElement("div");

    headerLeft.className =
        "header-left";

    const seal =
        FarmSeal();

    headerLeft.appendChild(seal);

    const titleArea =
        document.createElement("div");

    const eyebrow =
        document.createElement("div");

    eyebrow.className =
        "eyebrow";

    eyebrow.innerHTML =
        "Starko Goat Farm · Registry &amp; Reports";

    const title =
        document.createElement("h1");

    title.textContent =
        "Farm Dashboard";

    titleArea.appendChild(
        eyebrow
    );

    titleArea.appendChild(
        title
    );

    headerLeft.appendChild(
        titleArea
    );

    header.appendChild(
        headerLeft
    );


    const headerRight =
        document.createElement("div");

    Object.assign(
        headerRight.style,
        {
            display: "flex",
            alignItems: "center",
            gap: "10px",
        }
    );


    const date =
        document.createElement("div");

    date.className =
        "header-date";

    date.textContent =
        new Date().toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );

    headerRight.appendChild(
        date
    );


    const roleBadge =
        document.createElement("span");

    roleBadge.className =
        `role-badge ${isAdmin
            ? "admin"
            : "worker"
        }`;

    const roleIcon =
        isAdmin
            ? createSvgIcon(
                "shieldCheck",
                13
            )
            : createSvgIcon(
                "userCircle",
                13
            );

    roleBadge.appendChild(
        roleIcon
    );

    roleBadge.appendChild(
        document.createTextNode(
            isAdmin
                ? " Admin"
                : ` ${state.currentUser?.name ||
                "Worker"
                }`
        )
    );

    headerRight.appendChild(
        roleBadge
    );


    if (isAdmin) {
        const exportButton =
            document.createElement(
                "button"
            );

        exportButton.className =
            "btn-add";

        exportButton.appendChild(
            createSvgIcon(
                "download",
                14
            )
        );

        exportButton.appendChild(
            document.createTextNode(
                " Export Excel"
            )
        );

        exportButton.addEventListener(
            "click",
            () => {
                exportToExcel(
                    state.goats
                );
            }
        );

        headerRight.appendChild(
            exportButton
        );
    }


    const logoutButton =
        document.createElement(
            "button"
        );

    logoutButton.className =
        "icon-btn";

    logoutButton.title =
        "Sign Out / Switch User";

    logoutButton.appendChild(
        createSvgIcon(
            "logout",
            16
        )
    );

    logoutButton.addEventListener(
        "click",
        () => handleLogout()
    );

    headerRight.appendChild(
        logoutButton
    );


    header.appendChild(
        headerRight
    );

    return header;
}


// ============================================================================
// Navigation
// ============================================================================

function renderNavigation(isAdmin) {
    const nav =
        document.createElement("nav");

    nav.className =
        "nav-bar";


    const dashboardButton =
        createNavButton(
            "dashboard",
            "users",
            "Dashboard"
        );

    const dataButton =
        createNavButton(
            "data",
            "search",
            "Data Table"
        );

    const reportsButton =
        createNavButton(
            "reports",
            "trendingUp",
            "Reports"
        );

    nav.appendChild(
        dashboardButton
    );

    nav.appendChild(
        dataButton
    );

    nav.appendChild(
        reportsButton
    );


    if (isAdmin) {
        const usersButton =
            createNavButton(
                "users",
                "shieldCheck",
                "Users"
            );

        const pendingCount =
            state.users.filter(
                (user) =>
                    user.status ===
                    "pending"
            ).length;

        if (pendingCount > 0) {
            const pending =
                document.createElement(
                    "span"
                );

            pending.className =
                "nav-pending";

            pending.textContent =
                pendingCount;

            usersButton.appendChild(
                pending
            );
        }

        nav.appendChild(
            usersButton
        );
    }

    return nav;
}


function createNavButton(
    pageName,
    iconName,
    label
) {
    const button =
        document.createElement(
            "button"
        );

    button.className =
        `nav-tab ${state.page === pageName
            ? "active"
            : ""
        }`;

    button.appendChild(
        createSvgIcon(
            iconName,
            14
        )
    );

    button.appendChild(
        document.createTextNode(
            ` ${label}`
        )
    );

    button.addEventListener(
        "click",
        () => {
            state.page =
                pageName;

            renderApplication();
        }
    );

    return button;
}


function updateSearchQuery(value) {
    const activeInput = document.activeElement;
    const shouldRestoreFocus =
        activeInput instanceof HTMLInputElement &&
        activeInput.closest(".search-box");
    const selectionStart = activeInput?.selectionStart ?? value.length;
    const selectionEnd = activeInput?.selectionEnd ?? value.length;

    state.query =
        typeof value === "function"
            ? value(state.query)
            : value;

    renderApplication();

    if (shouldRestoreFocus) {
        const nextInput = root.querySelector(".search-box input");

        if (nextInput) {
            nextInput.focus();
            nextInput.setSelectionRange(selectionStart, selectionEnd);
        }
    }
}


// ============================================================================
// Page Rendering
// ============================================================================

function renderCurrentPage(
    main,
    isAdmin
) {
    const selected =
        getSelectedGoat();

    const summary =
        calculateSummary();

    const chartData =
        getChartData();


    if (
        state.page ===
        "dashboard"
    ) {
        const page =
            DashboardPage({
                goats: state.goats,
                summary,

                query: state.query,
                setQuery: (value) => {
                    updateSearchQuery(value);
                },

                filter: state.filter,
                setFilter: (value) => {
                    state.filter =
                        typeof value ===
                            "function"
                            ? value(
                                state.filter
                            )
                            : value;

                    renderApplication();
                },

                selectedId:
                    state.selectedId,

                setSelectedId:
                    (value) => {
                        state.selectedId =
                            typeof value ===
                                "function"
                                ? value(
                                    state.selectedId
                                )
                                : value;

                        renderApplication();
                    },

                selected,

                isAdmin,

                setModal: (value) => {
                    state.modal =
                        typeof value ===
                            "function"
                            ? value(
                                state.modal
                            )
                            : value;

                    renderApplication();
                },

                setPendingDeleteId:
                    (value) => {
                        state.pendingDeleteId =
                            typeof value ===
                                "function"
                                ? value(
                                    state.pendingDeleteId
                                )
                                : value;

                        renderApplication();
                    },
            });

        appendPage(
            main,
            page
        );

        return;
    }


    if (
        state.page ===
        "data"
    ) {
        const page =
            DataTablePage({
                goats: state.goats,

                query: state.query,
                setQuery: (value) => {
                    updateSearchQuery(value);
                },

                filter: state.filter,
                setFilter: (value) => {
                    state.filter =
                        typeof value ===
                            "function"
                            ? value(
                                state.filter
                            )
                            : value;

                    renderApplication();
                },

                sortConfig:
                    state.sortConfig,

                setSortConfig:
                    (value) => {
                        state.sortConfig =
                            typeof value ===
                                "function"
                                ? value(
                                    state.sortConfig
                                )
                                : value;

                        renderApplication();
                    },
            });

        appendPage(
            main,
            page
        );

        return;
    }


    if (
        state.page ===
        "reports"
    ) {
        const page =
            ReportsPage({
                goats: state.goats,
                chartData,
                summary,
            });

        appendPage(
            main,
            page
        );

        return;
    }


    if (
        state.page ===
        "users" &&
        isAdmin
    ) {
        const page =
            UsersPage({
                users: state.users,

                setUsers:
                    (value) => {
                        state.users =
                            typeof value ===
                                "function"
                                ? value(
                                    state.users
                                )
                                : value;

                        saveUsersToFirebase();

                        renderApplication();
                    },

                onUpdateUser:
                    handleUpdateUserProfile,
            });

        appendPage(
            main,
            page
        );
    }
}


function appendPage(
    main,
    page
) {
    if (!page) {
        return;
    }

    if (page instanceof Node) {
        main.appendChild(page);
    } else {
        main.innerHTML =
            String(page);
    }
}


// ============================================================================
// Action Modals
// ============================================================================

function renderActionModal() {
    if (!state.modal) {
        return null;
    }

    const selected =
        getSelectedGoat();

    const modalType =
        state.modal.type;


    // ------------------------------------------------------------------------
    // Add Goat
    // ------------------------------------------------------------------------

    if (
        modalType ===
        "add"
    ) {
        return GoatFormModal({
            existingGoats: state.goats,
            onClose: closeModal,

            onSave: (newGoat) => {
                addGoat(newGoat);
                closeModal();
            },
        });
    }


    // ------------------------------------------------------------------------
    // Edit Goat
    // ------------------------------------------------------------------------

    if (
        modalType ===
        "edit" &&
        selected
    ) {
        return GoatFormModal({
            isEdit: true,

            initial: selected,

            onClose:
                closeModal,

            onSave: (patch) => {
                updateGoat(
                    selected.id,
                    patch
                );

                closeModal();
            },
        });
    }


    // ------------------------------------------------------------------------
    // Sell Goat
    // ------------------------------------------------------------------------

    if (
        modalType ===
        "sell" &&
        selected
    ) {
        return SellModal({
            goat: selected,

            onClose:
                closeModal,

            onSell: (patch) => {
                updateGoat(
                    selected.id,
                    patch
                );

                closeModal();
            },
        });
    }


    // ------------------------------------------------------------------------
    // Deceased Goat
    // ------------------------------------------------------------------------

    if (
        modalType ===
        "deceased" &&
        selected
    ) {
        return DeceasedModal({
            goat: selected,

            onClose:
                closeModal,

            onConfirm: (form) => {
                updateGoat(
                    selected.id,
                    {
                        status:
                            "deceased",

                        deceasedDate:
                            form.date,

                        deceasedReason:
                            form.reason,
                    }
                );

                closeModal();
            },
        });
    }


    // ------------------------------------------------------------------------
    // Weight
    // ------------------------------------------------------------------------

    if (
        modalType ===
        "weight" &&
        selected
    ) {
        return WeightModal({
            goat: selected,

            onClose:
                closeModal,

            onAdd: (entry) => {
                addWeight(
                    selected.id,
                    entry
                );

                closeModal();
            },
        });
    }


    // ------------------------------------------------------------------------
    // Health
    // ------------------------------------------------------------------------

    if (
        modalType ===
        "health" &&
        selected
    ) {
        return HealthModal({
            goat: selected,

            onClose:
                closeModal,

            onAdd: (entry) => {
                addHealth(
                    selected.id,
                    entry
                );

                closeModal();
            },
        });
    }


    // ------------------------------------------------------------------------
    // Feeding
    // ------------------------------------------------------------------------

    if (
        modalType ===
        "feeding" &&
        selected
    ) {
        return FeedingModal({
            goat: selected,

            onClose:
                closeModal,

            onAdd: (entry) => {
                addFeeding(
                    selected.id,
                    entry
                );

                closeModal();
            },
        });
    }


    // ------------------------------------------------------------------------
    // Breeding
    // ------------------------------------------------------------------------

    if (
        modalType ===
        "breeding" &&
        selected
    ) {
        return BreedingModal({
            goat: selected,

            onClose:
                closeModal,

            onAdd: (entry) => {
                addBreeding(
                    selected.id,
                    entry
                );

                closeModal();
            },
        });
    }

    return null;
}


// ============================================================================
// Delete Confirmation
// ============================================================================

function renderDeleteConfirmation() {
    const goat =
        getPendingDeleteGoat();

    if (!goat) {
        return null;
    }

    const message =
        `This will permanently delete ${goat.id
        }${goat.name
            ? ` (${goat.name})`
            : ""
        } and all of its weight, medical, feeding, and breeding history. This action cannot be undone.`;

    return ConfirmModal({
        title:
            "Delete Goat Record",

        message,

        onCancel: () => {
            state.pendingDeleteId =
                null;

            renderApplication();
        },

        onConfirm: () => {
            deleteGoat(
                goat.id
            );

            state.pendingDeleteId =
                null;

            renderApplication();
        },
    });
}


// ============================================================================
// Role Gate
// ============================================================================

function renderRoleGate() {
    return RoleGate({
        sessionNotice:
            state.sessionNotice,

        onAdminLogin:
            handleAdminLogin,

        onUserLogin:
            handleUserLogin,

        onRegister:
            handleRegister,
    });
}


// ============================================================================
// Loading Screen
// ============================================================================

function renderLoadingScreen() {
    const app =
        document.createElement(
            "div"
        );

    app.className =
        "app";

    const main =
        document.createElement(
            "main"
        );

    Object.assign(
        main.style,
        {
            padding: "40px",
            textAlign: "center",
        }
    );

    main.textContent =
        "Loading goat records...";

    app.appendChild(
        main
    );

    return app;
}


// ============================================================================
// Main Application Render
// ============================================================================

function renderApplication() {

    // ------------------------------------------------------------------------
    // Not logged in
    // ------------------------------------------------------------------------

    if (!state.role) {
        setRoot(
            renderRoleGate()
        );

        return;
    }


    // ------------------------------------------------------------------------
    // Loading
    // ------------------------------------------------------------------------

    if (state.goatsLoading) {
        setRoot(
            renderLoadingScreen()
        );

        return;
    }


    const isAdmin =
        state.role === "admin";


    // ------------------------------------------------------------------------
    // Main Application
    // ------------------------------------------------------------------------

    const app =
        document.createElement(
            "div"
        );

    app.className =
        "app";


    // Header
    app.appendChild(
        renderHeader(
            isAdmin
        )
    );


    // Navigation
    app.appendChild(
        renderNavigation(
            isAdmin
        )
    );


    // Main pages
    const main =
        document.createElement(
            "main"
        );

    renderCurrentPage(
        main,
        isAdmin
    );

    app.appendChild(
        main
    );


    // ------------------------------------------------------------------------
    // Action modal
    // ------------------------------------------------------------------------

    const actionModal =
        renderActionModal();

    if (actionModal) {
        appendPage(
            app,
            actionModal
        );
    }


    // ------------------------------------------------------------------------
    // Delete confirmation
    // ------------------------------------------------------------------------

    const deleteModal =
        renderDeleteConfirmation();

    if (deleteModal) {
        appendPage(
            app,
            deleteModal
        );
    }


    setRoot(app);
}


// ============================================================================
// Application Startup
// ============================================================================

function initializeApplication() {
    renderApplication();

    initializeAuthentication();
}


// Start after HTML has loaded.
if (
    document.readyState ===
    "loading"
) {
    document.addEventListener(
        "DOMContentLoaded",
        initializeApplication,
        {
            once: true,
        }
    );
} else {
    initializeApplication();
}


// ============================================================================
// Export
// ============================================================================

export {
    state,
    renderApplication,
    updateGoat,
    deleteGoat,
    addGoat,
    addWeight,
    addHealth,
    addFeeding,
    addBreeding,
    handleLogout,
    openModal,
    closeModal,
};