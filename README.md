# K-Ticketing System Frontend

This repository contains the frontends for the **K-Ticketing System**, separated into two distinct web applications:

1. **`k-ticketing-frontend`**: The Terminal Kiosk and Conductor Scanner applications.
2. **`K-Ticketing Website frontend`**: The main public website and administrative dashboard.

Both apps share the same backend API and are designed to be run simultaneously to ensure all external links (like from the admin dashboard to the kiosk) resolve perfectly.

## 🚀 Getting Started

When cloning this project on a new computer, follow these simple steps to install all dependencies and run both applications at the same time:

### 1. Install Dependencies
From the root of the repository, run the global install script. This script automatically handles dependency conflicts and securely installs the node modules for **both** projects:
```bash
npm run install:all
```

### 2. Start the Development Servers
From the root of the repository, run the global dev script. This uses `concurrently` to spin up both projects simultaneously in the same terminal window:
```bash
npm run dev
```

### 3. Access the Applications
Once the servers boot up, you can access the applications in your browser:

- **Public Website & Admin Portal**: `http://localhost:5174` (or `5175` depending on port availability)
  - *Note: To access the admin portal, navigate to `/admin`*
- **Terminal Kiosk & Scanner Apps**: `http://localhost:5173`
  - *Note: You can access the scanner at `/scanner`*

## Troubleshooting
If you encounter any module resolution or caching errors during installation, navigate to the specific project folder and run:
```bash
npm install --legacy-peer-deps
```
