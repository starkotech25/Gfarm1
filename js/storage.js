/**
 * @file storage.js
 * @description Firebase Auth and Firestore access for farm records.
 */

import {
    createUserWithEmailAndPassword,
    deleteUser,
    onAuthStateChanged,
    signInWithEmailAndPassword,
    signOut,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";

import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    query,
    serverTimestamp,
    setDoc,
    writeBatch,
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

import {
    ADMIN_EMAIL,
    auth,
    db,
    FARM_ID,
    usernameToEmail
} from "./firebase.js";


/* =========================================================
   AUTO LOGOUT
   ========================================================= */

export const AUTO_LOGOUT_TIME_MS = 5 * 60 * 1000;

let registrationInProgress = false;


export function isRegistrationInProgress() {
    return registrationInProgress;
}


/* =========================================================
   FIRESTORE REFERENCES
   ========================================================= */

const farmRef = doc(db, "farms", FARM_ID);

const goatsRef = collection(
    farmRef,
    "goats"
);

const usersRef = collection(
    farmRef,
    "users"
);

const expensesRef = collection(
    farmRef,
    "expenses"
);


/* =========================================================
   USER NORMALIZATION
   ========================================================= */

function normalizeUser(snapshot) {

    const data = snapshot.data();

    return {
        id: snapshot.id,
        ...data,

        // Password is never loaded from Firestore.
        password: "",
    };
}


/* =========================================================
   AUTH ERROR
   ========================================================= */

function authErrorCode(error) {
    return error?.code || "auth/unknown";
}


/* =========================================================
   LOAD GOATS
   ========================================================= */

export async function loadGoats() {

    const snapshot = await getDocs(goatsRef);

    return snapshot.docs.map((item) => {

        const data = item.data();

        return {
            id: item.id,

            name: "",
            breed: "",
            sex: "female",
            dob: "",
            status: "active",
            source: "born_on_farm",

            purchasePrice: 0,
            salePrice: 0,

            weights: [],
            health: [],
            feeding: [],
            breeding: [],

            ...data,
        };
    });
}


/* =========================================================
   SAVE GOATS
   ========================================================= */

export async function saveGoats(goats) {

    const existing = await getDocs(goatsRef);

    const nextIds = new Set(
        goats.map((goat) => goat.id)
    );

    const batch = writeBatch(db);


    /*
     * Delete goats that no longer exist
     * in the current application data.
     */
    existing.docs.forEach((item) => {

        if (!nextIds.has(item.id)) {
            batch.delete(item.ref);
        }

    });


    /*
     * Save current goats.
     */
    goats.forEach((goat) => {

        batch.set(
            doc(goatsRef, goat.id),
            {
                ...goat,

                updatedAt: serverTimestamp(),

                updatedBy:
                    auth.currentUser?.uid || null,
            },
            {
                merge: true
            }
        );

    });


    await batch.commit();
}


/* =========================================================
   LOAD USERS
   ========================================================= */

export async function loadUsers() {

    const snapshot = await getDocs(usersRef);

    return snapshot.docs.map(normalizeUser);
}


/* =========================================================
   SAVE USERS
   ========================================================= */

export async function saveUsers(users) {

    const existing = await getDocs(usersRef);

    const nextIds = new Set(
        users.map((user) => user.id)
    );

    const batch = writeBatch(db);


    /*
     * Remove users that are no longer
     * present in the application data.
     */
    existing.docs.forEach((item) => {

        if (!nextIds.has(item.id)) {
            batch.delete(item.ref);
        }

    });


    /*
     * Save current users.
     */
    users.forEach((user) => {

        const {
            password: _password,
            id,
            ...profile
        } = user;


        batch.set(
            doc(usersRef, id),
            {
                ...profile,

                usernameNormalized:
                    profile.username
                        .trim()
                        .toLowerCase(),

                role: "worker",

                updatedAt:
                    serverTimestamp(),
            },
            {
                merge: true
            }
        );

    });


    await batch.commit();
}


/* =========================================================
   UPDATE USER PROFILE
   ========================================================= */

export async function updateUserProfile(user) {

    const {
        password: _password,
        id,
        ...profile
    } = user;


    await setDoc(
        doc(usersRef, id),
        {
            ...profile,

            usernameNormalized:
                profile.username
                    .trim()
                    .toLowerCase(),

            role: "worker",

            updatedAt:
                serverTimestamp(),
        },
        {
            merge: true
        }
    );
}


/* =========================================================
   DELETE USER PROFILE
   ========================================================= */

export async function deleteUserProfile(id) {

    await deleteDoc(
        doc(usersRef, id)
    );
}


/* =========================================================
   EXPENSE MONTH LABEL
   ========================================================= */

function expenseMonthLabel(date) {

    return new Intl.DateTimeFormat(
        "en",
        {
            month: "short"
        }
    ).format(
        new Date(`${date}T00:00:00`)
    );
}


/* =========================================================
   LOAD EXPENSES
   ========================================================= */

export async function loadExpenses() {

    const snapshot = await getDocs(
        query(expensesRef)
    );

    const grouped = new Map();


    snapshot.docs.forEach((item) => {

        const expense = item.data();

        const monthKey =
            String(
                expense.date || item.id
            ).slice(0, 7);


        const current =
            grouped.get(monthKey) || {

                month:
                    expenseMonthLabel(
                        `${monthKey}-01`
                    ),

                feed: 0,
                health: 0,
                other: 0,
            };


        if (expense.category in current) {

            current[expense.category] +=
                Number(
                    expense.amount || 0
                );
        }


        grouped.set(
            monthKey,
            current
        );
    });


    return [
        ...grouped.entries()
    ]
        .sort(
            ([first], [second]) =>
                first.localeCompare(second)
        )
        .map(
            ([, value]) => value
        );
}


/* =========================================================
   AUTH STATE LISTENER
   ========================================================= */

export function subscribeToAuthState(callback) {

    return onAuthStateChanged(
        auth,
        callback
    );
}


/* =========================================================
   LOAD AUTHENTICATED USER PROFILE
   ========================================================= */

export async function loadAuthenticatedProfile(uid) {

    const profileSnapshot =
        await getDoc(
            doc(usersRef, uid)
        );


    return profileSnapshot.exists()
        ? normalizeUser(profileSnapshot)
        : null;
}


/* =========================================================
   ADMIN LOGIN
   ========================================================= */

export async function signInAdmin(password) {

    try {

        await signInWithEmailAndPassword(
            auth,
            ADMIN_EMAIL,
            password
        );


        return {
            role: "admin",
            currentUser: null,
        };

    } catch (error) {

        error.code =
            authErrorCode(error);

        throw error;
    }
}


/* =========================================================
   WORKER LOGIN
   ========================================================= */

export async function signInWorker(
    username,
    password
) {

    try {

        const credential =
            await signInWithEmailAndPassword(
                auth,
                usernameToEmail(username),
                password
            );


        const profileSnapshot =
            await getDoc(
                doc(
                    usersRef,
                    credential.user.uid
                )
            );


        if (!profileSnapshot.exists()) {

            await signOut(auth);

            const error =
                new Error(
                    "Worker profile not found."
                );

            error.code =
                "profile/not-found";

            throw error;
        }


        const profile =
            normalizeUser(
                profileSnapshot
            );


        if (profile.status !== "approved") {

            await signOut(auth);

            const error =
                new Error(
                    "Worker account is not approved."
                );

            error.code =
                `profile/${profile.status}`;

            throw error;
        }


        return {
            role: "user",
            currentUser: profile,
        };

    } catch (error) {

        error.code =
            authErrorCode(error);

        throw error;
    }
}


/* =========================================================
   WORKER REGISTRATION
   ========================================================= */

export async function registerWorker({
    name,
    username,
    password
}) {

    registrationInProgress = true;


    try {

        /* Password validation */

        if (password.length < 6) {

            const error =
                new Error(
                    "Worker passwords must contain at least 6 characters."
                );

            error.code =
                "auth/password-too-short";

            throw error;
        }


        /* Username validation */

        const normalizedUsername =
            username
                .trim()
                .toLowerCase();


        if (
            !/^[a-z0-9_ ]+$/.test(
                normalizedUsername
            )
        ) {

            const error =
                new Error(
                    "Usernames may contain only letters, numbers, underscores, and spaces."
                );

            error.code =
                "auth/invalid-email";

            throw error;
        }


        const email =
            usernameToEmail(
                normalizedUsername
            );


        let credential;

        let createdAuthAccount =
            false;


        /* Create Firebase Auth account */

        try {

            credential =
                await createUserWithEmailAndPassword(
                    auth,
                    email,
                    password
                );

            createdAuthAccount = true;

        } catch (error) {

            if (
                error.code !==
                "auth/email-already-in-use"
            ) {
                throw error;
            }


            /*
             * Recover an orphaned Firebase Auth account.
             */

            try {

                credential =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        password
                    );


                const existingProfile =
                    await getDoc(
                        doc(
                            usersRef,
                            credential.user.uid
                        )
                    );


                if (
                    existingProfile.exists()
                ) {

                    const duplicateError =
                        new Error(
                            "This user is already registered."
                        );

                    duplicateError.code =
                        "auth/email-already-in-use";

                    throw duplicateError;
                }

            } catch (recoveryError) {

                await signOut(auth)
                    .catch(() => { });


                if (
                    recoveryError.code ===
                    "auth/email-already-in-use"
                ) {
                    throw recoveryError;
                }


                throw error;
            }
        }


        /* Save worker profile */

        try {

            await setDoc(
                doc(
                    usersRef,
                    credential.user.uid
                ),
                {
                    name:
                        name.trim(),

                    username:
                        normalizedUsername,

                    usernameNormalized:
                        normalizedUsername,

                    status: "pending",

                    role: "worker",

                    createdAt:
                        serverTimestamp(),

                    updatedAt:
                        serverTimestamp(),
                }
            );


            const savedProfile =
                await getDoc(
                    doc(
                        usersRef,
                        credential.user.uid
                    )
                );


            if (!savedProfile.exists()) {

                const error =
                    new Error(
                        "Registration profile was not saved."
                    );

                error.code =
                    "profile/not-saved";

                throw error;
            }

        } catch (error) {

            /*
             * Delete only an Auth account
             * created by this registration.
             */

            if (createdAuthAccount) {

                await deleteUser(
                    credential.user
                );
            }


            await signOut(auth)
                .catch(() => { });


            throw error;
        }


        await signOut(auth);

    } finally {

        registrationInProgress =
            false;
    }
}


/* =========================================================
   SIGN OUT
   ========================================================= */

export async function signOutUser() {

    await signOut(auth);
}


/* =========================================================
   DELETE CURRENT USER
   ========================================================= */

export async function deleteCurrentUser() {

    if (auth.currentUser) {

        await deleteUser(
            auth.currentUser
        );
    }
}