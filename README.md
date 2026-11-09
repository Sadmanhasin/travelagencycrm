# Aero CRM — Travel Agency CRM (Frontend)

A frontend-only admin panel for a travel agency CRM, built around one workflow:
**Lead → Relationship → Conversion → Customer Retention**.

No backend and no build step. Open `index.html` in a browser to run it. Icons and the Inter font load from a CDN, so the first load needs an internet connection.

## Pages
- **CRM Workspace:** Dashboard, Leads & Inquiries, Lead Details, Customers, Customer Profile, Sales Pipeline (drag-and-drop Kanban), Follow-ups & Tasks, Bookings & Tickets, Communication Inbox
- **Team & Performance:** Employee Management, Sales Performance, Sales Targets
- **Administration:** Notifications, Roles & Permissions, Activity Logs, CRM Settings

## Shortcuts
- `Ctrl/⌘ + K`: global search (leads, customers, bookings, pages)
- `N`: new lead

## Structure
```
index.html        App shell and sidebar
css/styles.css    Design tokens (light/dark), components, responsive layout
js/data.js        Demo data (dates are relative to today)
js/ui.js          Formatting helpers, components, charts, modals, toasts
js/pages.js       All pages
js/app.js         Hash router, command palette, theme, notifications
```

All data is demo data kept in memory. Changes reset when the page is refreshed.
