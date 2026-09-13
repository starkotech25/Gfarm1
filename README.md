# Gfarm1 Static Frontend

This is a readable, modular browser frontend for Starko Goat Farm.

## Structure

- `index.html` - browser entry point
- `css/styles.css` - application styles
- `js/app.js` - application state and routing
- `js/firebase.js` - Firebase Authentication and Firestore access
- `js/pages/` - login, dashboard, table, reports, and users views
- `js/components/` - shared layout and UI helpers
- `js/utils/` - formatting and rendering helpers
- `assets/` - original compiled fallback bundle

## Run

Serve this folder with any static server, then open the provided URL. ES modules and Firebase should be served over `http://` or `https://`; opening the file directly with `file://` may be blocked by browser security rules.

Firebase Authentication and Firestore remain the backend. The original `Gfarm` project is separate and was not modified.
