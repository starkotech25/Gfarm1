# 🐐 Starko Goat Farm Management Dashboard

A comprehensive web application built with **HTML, CSS, JavaScript, and Firebase** for managing goat herd registration, health and vaccinations, feed nutrition tracking, breeding schedules, financial analytics, user management, and Excel reporting.

---

## ⚡ Quick Start

### Working Application

The application can be run locally using **VS Code Live Server**.

Open the `Gfarm1` project folder in VS Code and start `index.html` with Live Server.

Then open the local address provided by Live Server in your browser.

> **Note:** This project uses JavaScript ES modules and Firebase CDN imports, so it should be run through a local HTTP server such as Live Server rather than opening `index.html` directly with `file://`.

---

## 📂 Architecture Overview

* **`index.html`**

  * Main HTML entry point
  * Loads the application CSS and JavaScript files

* **`css/`**

  * `index.css`: Global/base styles
  * `dashboard.css`: Main dashboard theme, layout, components, tables, forms, and responsive design

* **`js/pages/`**

  * `RoleGate.js`: Authentication, worker registration, and admin login
  * `DashboardPage.js`: KPIs, goat registry, search/filtering, and goat details
  * `DataTablePage.js`: Sortable spreadsheet-style goat data view
  * `ReportsPage.js`: Monthly expense analytics and individual goat growth charts
  * `UsersPage.js`: Admin user review, approval, editing, and deletion

* **`js/components/`**

  * `FarmSeal.js`: Farm branding/seal
  * `EarTag.js`: Goat ear-tag component
  * `StatCard.js`: Dashboard statistics cards
  * `Modal.js`: Reusable modal component
  * `ConfirmModal.js`: Confirmation dialog

* **`js/modals/`**

  * `GoatFormModal.js`: Register/edit goats
  * `SellModal.js`: Record goat sales
  * `DeceasedModal.js`: Record deceased goats
  * `WeightModal.js`: Record goat weight
  * `HealthModal.js`: Record health/vaccination events
  * `FeedingModal.js`: Record feeding information
  * `BreedingModal.js`: Record breeding information
  * `UserEditModal.js`: Edit worker information

* **`js/firebase.js`**

  * Firebase initialization
  * Firebase Authentication
  * Firestore database connection

* **`js/storage.js`**

  * Authentication and user management
  * Goat data storage
  * Expense data storage
  * Firestore read/write operations

* **`js/helpers.js`**

  * Date utilities
  * UID generation
  * SheetJS Excel export

* **`js/mockData.js`**

  * Sample seed data for reference
  * Status colors and health labels
  * Configuration constants

* **`js/app.js`**

  * Main application state
  * Page navigation
  * Firebase data loading/saving
  * Application rendering and actions

* **`js/main.js`**

  * Main JavaScript entry point

---

## 🔥 Firebase

The application uses **Firebase Authentication** and **Cloud Firestore** for data storage and user management.

The main Firebase configuration is located in:

```text
js/firebase.js
```

Firestore stores data using the farm structure:

```text
farms/
└── default/
    ├── goats/
    ├── users/
    └── expenses/
```

---

## 📊 Main Features

* Goat registration and management
* Goat identification using ear tags
* Goat status tracking
* Weight history
* Health and vaccination records
* Feeding records
* Breeding records
* Goat sales
* Deceased goat records
* Monthly expense tracking
* Dashboard KPI statistics
* Search and filtering
* Sortable goat data table
* Individual goat growth charts
* User/worker management
* Admin approval system
* Firebase Authentication
* Cloud Firestore database
* Excel report generation

---

## 📁 Project Structure

```text
Gfarm1/
│
├── index.html
│
├── css/
│   ├── index.css
│   └── dashboard.css
│
└── js/
    ├── main.js
    ├── app.js
    ├── firebase.js
    ├── storage.js
    ├── helpers.js
    ├── mockData.js
    │
    ├── components/
    │   ├── FarmSeal.js
    │   ├── EarTag.js
    │   ├── StatCard.js
    │   ├── Modal.js
    │   └── ConfirmModal.js
    │
    ├── modals/
    │   ├── GoatFormModal.js
    │   ├── SellModal.js
    │   ├── DeceasedModal.js
    │   ├── WeightModal.js
    │   ├── HealthModal.js
    │   ├── FeedingModal.js
    │   ├── BreedingModal.js
    │   └── UserEditModal.js
    │
    └── pages/
        ├── RoleGate.js
        ├── DashboardPage.js
        ├── DataTablePage.js
        ├── ReportsPage.js
        └── UsersPage.js
```

---

## 🛠️ Technologies Used

* HTML5
* CSS3
* JavaScript ES Modules
* Firebase Authentication
* Firebase Cloud Firestore
* SheetJS
* SVG charts
* Google Fonts

The application does **not require React, Vite, Node.js, or npm** to run the frontend.

---

## 📖 Documentation Notes

The source files listed above are the current project documentation. Live goat,
user, and expense records are loaded from Firebase; the sample values in
`js/mockData.js` are not automatically imported into Firestore.
