import { FarmSeal } from "../components/FarmSeal.js";

export function RoleGate({
    onAdminLogin,
    onUserLogin,
    onRegister,
    sessionNotice
}) {
    let tab = "signin";
    let adminPw = "";
    let loginForm = {
        username: "",
        password: ""
    };
    let regForm = {
        name: "",
        username: "",
        password: ""
    };

    let isRegistering = false;
    let registrationInFlight = false;
    let message = sessionNotice
        ? { type: "error", text: sessionNotice }
        : null;

    const container = document.createElement("div");
    container.className = "gate-app";

    const wrap = document.createElement("div");
    wrap.className = "gate-wrap";

    const seal = FarmSeal();
    wrap.appendChild(seal);

    const eyebrow = document.createElement("div");
    eyebrow.className = "gate-eyebrow";
    eyebrow.textContent = "Starko Goat Farm";

    const title = document.createElement("h1");
    title.className = "gate-title";
    title.textContent = "Farm Management Portal";

    const sub = document.createElement("p");
    sub.className = "gate-sub";
    sub.textContent =
        "Admins have full access. Workers need an approved account.";

    const card = document.createElement("div");
    card.className = "gate-single-card";

    const tabs = document.createElement("div");
    tabs.className = "gate-tabs";

    const signInTab = document.createElement("button");
    const registerTab = document.createElement("button");
    const adminTab = document.createElement("button");

    signInTab.className = "gate-tab active";
    registerTab.className = "gate-tab";
    adminTab.className = "gate-tab";

    signInTab.textContent = "Sign In";
    registerTab.textContent = "Register";
    adminTab.textContent = "Admin";

    tabs.appendChild(signInTab);
    tabs.appendChild(registerTab);
    tabs.appendChild(adminTab);

    const content = document.createElement("div");

    const clearMessage = () => {
        if (!message) {
            return;
        }

        message = null;

        const messageElement =
            container.querySelector(".gate-message");

        if (messageElement) {
            messageElement.remove();
        }
    };

    const setMessage = (type, text) => {
        message = { type, text };
        render();
    };

    const createIcon = (type) => {
        const svg = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "svg"
        );

        svg.setAttribute("width", "15");
        svg.setAttribute("height", "15");
        svg.setAttribute("viewBox", "0 0 24 24");
        svg.setAttribute("fill", "none");
        svg.setAttribute("stroke", "currentColor");
        svg.setAttribute("stroke-width", "2");
        svg.setAttribute("stroke-linecap", "round");
        svg.setAttribute("stroke-linejoin", "round");

        if (type === "user") {
            svg.innerHTML = `
                <path d="M20 21a8 8 0 0 0-16 0"></path>
                <circle cx="12" cy="7" r="4"></circle>
            `;
        }

        if (type === "plus") {
            svg.innerHTML = `
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
            `;
        }

        if (type === "lock") {
            svg.innerHTML = `
                <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            `;
        }

        return svg;
    };

    const createLabel = ({
        text,
        type = "text",
        value = "",
        placeholder = "",
        onInput,
        onFocus,
        onKeyDown,
        autoFocus = false
    }) => {
        const label = document.createElement("label");
        label.textContent = text;

        const input = document.createElement("input");
        input.type = type;
        input.value = value;
        input.placeholder = placeholder;

        if (autoFocus) {
            input.autofocus = true;
        }

        input.addEventListener("input", onInput);

        if (onFocus) {
            input.addEventListener("focus", onFocus);
        }

        if (onKeyDown) {
            input.addEventListener("keydown", onKeyDown);
        }

        label.appendChild(input);

        return label;
    };

    const submitAdmin = async () => {
        try {
            if (await onAdminLogin(adminPw)) return;
        } catch (error) {
            console.error("gfarm: admin sign-in failed", error);
        }

        setMessage("error", "Incorrect admin password.");
    };

    const submitLogin = async () => {
        if (!loginForm.username.trim() || !loginForm.password) {
            setMessage(
                "error",
                "Please enter your username and password."
            );
            return;
        }

        if (loginForm.password.length < 6) {
            setMessage(
                "error",
                "Password must be at least 6 characters."
            );
            return;
        }

        let result;

        try {
            result = await onUserLogin(
                loginForm.username.trim(),
                loginForm.password
            );
        } catch (error) {
            console.error("gfarm: worker sign-in failed", error);
            result = "invalid";
        }

        if (result === "ok") return;

        if (result === "pending") {
            setMessage(
                "error",
                "Your registration is pending approval by the farm admin."
            );
        } else if (result === "rejected") {
            setMessage(
                "error",
                "This registration request was rejected by the admin."
            );
        } else {
            setMessage("error", "Invalid username or password.");
        }
    };

    const submitRegister = async () => {
        if (registrationInFlight) return;

        registrationInFlight = true;
        isRegistering = true;
        render();

        try {
            const submittedForm = { ...regForm };

            regForm = {
                name: "",
                username: "",
                password: ""
            };

            if (
                !submittedForm.name.trim() ||
                !submittedForm.username.trim() ||
                !submittedForm.password
            ) {
                setMessage(
                    "error",
                    "Please fill in all fields (name, username, password)."
                );
                return;
            }

            if (submittedForm.password.length < 6) {
                setMessage(
                    "error",
                    "Password must be at least 6 characters."
                );
                return;
            }

            let registered;

            try {
                registered = await onRegister({
                    name: submittedForm.name.trim(),
                    username: submittedForm.username.trim(),
                    password: submittedForm.password
                });
            } catch (error) {
                console.error(
                    "gfarm: worker registration failed",
                    error
                );

                setMessage(
                    "error",
                    error.message ||
                    "Registration could not be completed. Please try again."
                );
                return;
            }

            if (
                registered?.status === "duplicate" ||
                registered === "already-registered" ||
                registered === false
            ) {
                setMessage(
                    "error",
                    "This user is already registered. Please use a different username or sign in."
                );
                return;
            }

            if (
                registered?.status === "invalid-username" ||
                registered === "invalid-username"
            ) {
                setMessage(
                    "error",
                    "Please use a username with letters, numbers, underscores, or spaces only."
                );
                return;
            }

            if (
                registered?.status === "short-password" ||
                registered === "short-password"
            ) {
                setMessage(
                    "error",
                    "Password must be at least 6 characters."
                );
                return;
            }

            if (
                registered?.status === "database-error" ||
                registered === "database-permission"
            ) {
                setMessage(
                    "error",
                    "Firebase could not save your registration. Please contact the farm admin."
                );
                return;
            }

            if (registered?.status !== "success") {
                setMessage(
                    "error",
                    `Registration failed (${registered?.code || "unknown error"}). Please try again.`
                );
                return;
            }

            setMessage(
                "success",
                "User created successfully! Please wait for admin approval before signing in."
            );
        } finally {
            registrationInFlight = false;
            isRegistering = false;
            render();
        }
    };

    const createMessage = () => {
        if (!message) return null;

        const element = document.createElement("div");
        element.className = `gate-message ${message.type}`;
        element.textContent = message.text;

        return element;
    };

    const createSignIn = () => {
        const form = document.createElement("div");
        form.className = "gate-login";

        form.appendChild(
            createLabel({
                text: "Username",
                value: loginForm.username,
                placeholder: "Enter your username",
                onInput: (e) => {
                    loginForm.username = e.target.value;
                },
                onFocus: clearMessage
            })
        );

        form.appendChild(
            createLabel({
                text: "Password",
                type: "password",
                value: loginForm.password,
                placeholder: "Enter your password",
                onInput: (e) => {
                    loginForm.password = e.target.value;
                },
                onFocus: clearMessage,
                onKeyDown: (e) => {
                    if (e.key === "Enter") submitLogin();
                }
            })
        );

        const msg = createMessage();
        if (msg) form.appendChild(msg);

        const button = document.createElement("button");
        button.className = "btn-primary gate-btn";

        button.appendChild(createIcon("user"));
        button.appendChild(document.createTextNode(" Sign In"));

        button.addEventListener("click", submitLogin);

        form.appendChild(button);

        return form;
    };

    const createRegister = () => {
        const form = document.createElement("div");
        form.className = "gate-login";

        form.appendChild(
            createLabel({
                text: "Full Name",
                value: regForm.name,
                placeholder: "Enter your full name",
                onInput: (e) => {
                    regForm.name = e.target.value;
                },
                onFocus: clearMessage
            })
        );

        form.appendChild(
            createLabel({
                text: "Choose a Username",
                value: regForm.username,
                placeholder: "Enter your username",
                onInput: (e) => {
                    regForm.username = e.target.value;
                },
                onFocus: clearMessage
            })
        );

        form.appendChild(
            createLabel({
                text: "Choose a Password",
                type: "password",
                value: regForm.password,
                placeholder: "Enter your password",
                onInput: (e) => {
                    regForm.password = e.target.value;
                },
                onFocus: clearMessage,
                onKeyDown: (e) => {
                    if (e.key === "Enter") submitRegister();
                }
            })
        );

        const msg = createMessage();
        if (msg) form.appendChild(msg);

        const button = document.createElement("button");
        button.className = "btn-primary gate-btn";
        button.disabled = isRegistering;

        button.appendChild(createIcon("plus"));
        button.appendChild(
            document.createTextNode(
                isRegistering
                    ? " Creating User..."
                    : " Submit Registration"
            )
        );

        button.addEventListener("click", submitRegister);

        form.appendChild(button);

        const hint = document.createElement("div");
        hint.className = "gate-hint";
        hint.textContent =
            "Account requires admin approval before you can log in.";

        form.appendChild(hint);

        return form;
    };

    const createAdmin = () => {
        const form = document.createElement("div");
        form.className = "gate-login";

        form.appendChild(
            createLabel({
                text: "Admin Password",
                type: "password",
                value: adminPw,
                placeholder: "Enter admin password",
                autoFocus: true,
                onInput: (e) => {
                    adminPw = e.target.value;
                },
                onFocus: clearMessage,
                onKeyDown: (e) => {
                    if (e.key === "Enter") submitAdmin();
                }
            })
        );

        const msg = createMessage();
        if (msg) form.appendChild(msg);

        const button = document.createElement("button");
        button.className = "btn-primary gate-btn";

        button.appendChild(createIcon("lock"));
        button.appendChild(document.createTextNode(" Admin Sign In"));

        button.addEventListener("click", submitAdmin);

        form.appendChild(button);

        return form;
    };

    const render = () => {
        signInTab.className =
            `gate-tab ${tab === "signin" ? "active" : ""}`;

        registerTab.className =
            `gate-tab ${tab === "register" ? "active" : ""}`;

        adminTab.className =
            `gate-tab ${tab === "admin" ? "active" : ""}`;

        content.innerHTML = "";

        if (tab === "signin") {
            content.appendChild(createSignIn());
        } else if (tab === "register") {
            content.appendChild(createRegister());
        } else {
            content.appendChild(createAdmin());
        }
    };

    const switchTab = (newTab) => {
        tab = newTab;
        message = null;
        render();
    };

    signInTab.addEventListener("click", () => switchTab("signin"));
    registerTab.addEventListener("click", () => switchTab("register"));
    adminTab.addEventListener("click", () => switchTab("admin"));

    card.appendChild(tabs);
    card.appendChild(content);

    wrap.appendChild(eyebrow);
    wrap.appendChild(title);
    wrap.appendChild(sub);
    wrap.appendChild(card);

    container.appendChild(wrap);

    render();

    return container;
}