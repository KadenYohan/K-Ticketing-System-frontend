# K-Ticketing System – Final Project Plan

This document is the single source of truth for both the frontend and backend teams.  
It includes the architecture, database schema, complete API specification, user flows, server‑side processes, testing strategy, and a task breakdown with dependencies.

---

## 1. Project Overview

The K‑Ticketing System is a local‑network bus ticket booking and validation solution for a P2P bus terminal.  
All buses depart from a single origin and travel to one of **three destinations**.  
Each bus has exactly **50 seats**, numbered 1–50. There are **8 departures per destination per day** (24 buses total on a given date).  

Passengers can buy tickets for multiple seats on the same bus, either from a self‑service kiosk or via their own mobile phone (web app).  
The kiosk also supports cash payment (simulated). A conductor uses a mobile QR scanner to validate tickets before boarding.  

The system prevents double booking through temporary seat reservations and atomic database operations.

---

## 2. Repositories & Architecture

- **Two Git repositories** (GitHub):
  - `k-ticketing-backend` – Node.js (TypeScript), Express, PostgreSQL
  - `k-ticketing-frontend` – React (JavaScript), Vite, html5-qrcode

- **Single‑Page Application** with three routes:

| URL       | Interface           | Device                        |
|-----------|---------------------|-------------------------------|
| `/kiosk`  | Terminal Kiosk      | Host PC (Chromium `--kiosk`)  |
| `/book`   | Passenger Web App   | Passenger’s mobile browser    |
| `/scanner`| Conductor Scanner   | Conductor’s mobile browser    |

- **Host Machine**: A single Lubuntu PC runs the backend, PostgreSQL, and serves the built kiosk frontend.
  In production, the React app is built and served by the same Express server (port **3000**). The kiosk opens `http://localhost:3000/kiosk` in Chromium `--kiosk` mode.
  All devices connect via a Wi‑Fi router (LAN). The host’s local IP is used by passenger phones and the conductor phone.
- **Internet**: All devices have internet, but only the backend communicates with the PayMongo API. Ticketing logic operates entirely over the LAN.
- **Bootable USB Submission**: Lubuntu environment, source code, and PostgreSQL database delivered on a persistent ext4 USB.
  On boot, PostgreSQL, the backend, and the kiosk frontend start automatically.
- **CORS Configuration**: The Express backend must enable CORS for cross‑origin requests from passenger phones and the conductor scanner. Use the `cors` npm package with a permissive policy (`origin: '*'`) in the prototype.

---

## 3. Technology Stack

| Layer           | Technology                                        |
|-----------------|---------------------------------------------------|
| Backend runtime | Node.js + Express                                 |
| Backend language| TypeScript                                        |
| Database        | PostgreSQL (row‑level locking, serializable txns) |
| Frontend        | React, JavaScript (JSX), Vite                     |
| QR library      | `html5-qrcode` (scanning), `qrcode` (Node.js generation), `qrcode.react` (frontend display) |
| Payment         | PayMongo API (GCash); polling, no webhooks        |
| Deployment      | Lubuntu 24.04 LTS, Chromium Kiosk mode            |

---

## 4. Database Schema

### `buses`
| Column         | Type                                          | Description |
|----------------|-----------------------------------------------|-------------|
| id             | UUID PRIMARY KEY (server‑generated)           |             |
| destination    | VARCHAR(100) NOT NULL                         | e.g. “Manila” |
| departure_date | DATE NOT NULL                                 |             |
| departure_time | TIME NOT NULL                                 |             |
| total_seats    | INTEGER NOT NULL DEFAULT 50                   |             |
| seat_price     | DECIMAL(10,2) NOT NULL                        | Price per seat in PHP |
| status         | ENUM('scheduled','departed','cancelled')      | Only ‘scheduled’ and ‘departed’ are used automatically; ‘cancelled’ exists for schema completeness. |

The `buses` table must have a UNIQUE constraint on (`destination`, `departure_date`, `departure_time`).

### `reservations`
| Column     | Type               | Description |
|------------|--------------------|-------------|
| id         | UUID PRIMARY KEY   |             |
| expires_at | TIMESTAMP NOT NULL |             |
| created_at | TIMESTAMP NOT NULL DEFAULT NOW() |       |

Reservation rows are **ephemeral**: deleted when a ticket is created or when they expire.  
No status column – a reservation either exists (active) or it doesn’t.

### `seats`
| Column         | Type                                          | Description |
|----------------|-----------------------------------------------|-------------|
| id             | SERIAL PRIMARY KEY                            |             |
| bus_id         | UUID NOT NULL (FK → buses.id)                 |             |
| seat_number    | INTEGER NOT NULL CHECK (1–50)                 |             |
| status         | ENUM('available','reserved','booked','boarded') NOT NULL DEFAULT 'available' |       |
| reservation_id | UUID FK → reservations.id (NULLABLE)          | Only set while seat is reserved. Constraint must include `ON DELETE SET NULL`. |
| ticket_id      | UUID FK → tickets.id (NULLABLE)               | Only set after booking          |

The `seats` table must have a UNIQUE constraint on (`bus_id`, `seat_number`).
### `tickets`
| Column          | Type                      | Description |
|-----------------|---------------------------|-------------|
| id              | UUID PRIMARY KEY          |             |
| bus_id          | UUID NOT NULL (FK)        |             |
| payment_method  | VARCHAR(10) NOT NULL      | 'gcash' or 'cash' |
| payment_status  | ENUM('pending','paid','failed') NOT NULL |       |
| passenger_count | INTEGER NOT NULL          | Number of seats booked |
| total_amount    | DECIMAL(10,2) NOT NULL    |             |
| qr_code         | VARCHAR(36) NOT NULL UNIQUE | Same as ticket id |
| created_at      | TIMESTAMP NOT NULL DEFAULT NOW() |       |
| used_at         | TIMESTAMP NULL            | Set when conductor taps “Check In” |

### `payments`
| Column          | Type                      | Description |
|-----------------|---------------------------|-------------|
| id              | UUID PRIMARY KEY          | Internal payment identifier |
| paymongo_id     | VARCHAR(255) NOT NULL     | PayMongo source ID for polling |
| reservation_id  | UUID FK → reservations.id (NULLABLE, ON DELETE SET NULL) | Links to the reservation this payment is for |
| bus_id          | UUID FK → buses.id (NOT NULL) | Direct bus reference so orphaned payments remain traceable after reservation expiry |
| amount          | DECIMAL(10,2) NOT NULL    | Amount in PHP |
| status          | ENUM('pending','paid','failed') NOT NULL DEFAULT 'pending' | Updated by polling |
| created_at      | TIMESTAMP NOT NULL DEFAULT NOW() | |
| updated_at      | TIMESTAMP NOT NULL DEFAULT NOW() | |
---

## 5. API Specification (OpenAPI 3.0.3)

```yaml
openapi: 3.0.3
info:
  title: K-Ticketing API
  version: 1.0.0
  description: |
    All endpoints return JSON. The frontend never communicates with PayMongo directly.
    All payment actions are proxied through this API.

servers:
  - url: http://{host}:3000
    variables:
      host:
        default: localhost
        description: Host machine LAN IP in production.

paths:
  /destinations:
    get:
      summary: List unique destination names
      responses:
        '200':
          description: Array of destination strings
          content:
            application/json:
              schema:
                type: array
                items:
                  type: string

  /buses:
    get:
      summary: Get available buses
      parameters:
        - name: destination
          in: query
          required: false
          schema:
            type: string
        - name: date
          in: query
          required: true
          schema:
            type: string
            format: date
        - name: min_time
          in: query
          schema:
            type: string
            format: time
          description: Optional earliest departure time (HH:MM)
        - name: max_time
          in: query
          schema:
            type: string
            format: time
          description: Optional latest departure time (HH:MM)
      responses:
        '200':
          description: List of buses sorted by departure_time ascending
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/BusSummary'

  /buses/{busId}/seats:
    get:
      summary: Get seat map for a bus
      parameters:
        - name: busId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Array of seat objects
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/SeatDetail'
        '404':
          description: Bus not found

  /reservations:
    post:
      summary: Reserve one or more seats (starts payment window)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [busId, seatIds]
              properties:
                busId:
                  type: string
                  format: uuid
                seatIds:
                  type: array
                  items:
                    type: integer
                  description: Seat numbers (1–50), not database primary keys
      responses:
        '200':
          description: Reservation created
          content:
            application/json:
              schema:
                type: object
                required: [reservationId, expiresAt]
                properties:
                  reservationId:
                    type: string
                    format: uuid
                  expiresAt:
                    type: string
                    format: date-time
        '409':
          description: One or more seats are no longer available
          content:
            application/json:
              schema:
                type: object
                required: [message, conflictingSeatIds]
                properties:
                  message:
                    type: string
                    example: "Seats 12,13 are not available"
                  conflictingSeatIds:
                    type: array
                    items:
                      type: integer
                    description: Seat IDs that were taken, so the frontend can remove them from selection
        '404':
          description: Bus not found

  /reservations/{reservationId}:
    delete:
      parameters:
        - name: reservationId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      summary: Cancel an active reservation
      responses:
        '200':
          description: Seats released
        '404':
          description: Reservation not found

  /payments:
    post:
      summary: Initiate GCash payment via PayMongo
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [reservationId, amount]
              properties:
                reservationId:
                  type: string
                  format: uuid
                amount:
                  type: number
      responses:
        '200':
          description: Payment created
          content:
            application/json:
              schema:
                type: object
                required: [paymentId, qrImageUrl, redirectUrl]
                properties:
                  paymentId:
                    type: string
                    format: uuid
                  qrImageUrl:
                    type: string
                    format: uri
                    description: Data URL of a QR code of the checkout URL (for kiosk display)
                  redirectUrl:
                    type: string
                    format: uri
                    description: The PayMongo checkout URL that the passenger app should open directly
        '400':
          description: Invalid reservation or amount

  /payments/{paymentId}/status:
    get:
      summary: Poll payment status (backend checks PayMongo and updates local payments table)
      description: |
        On each call, the backend queries PayMongo for the latest source status.
        If the status has changed since the last poll, the backend updates the local
        `payments` row (both `status` and `updated_at`) before returning the result.
        This ensures that `POST /tickets` can read the confirmed status from the database.
      parameters:
        - name: paymentId
          in: path
          required: true
          schema:
            type: string
            format: uuid
      responses:
        '200':
          description: Payment status
          content:
            application/json:
              schema:
                type: object
                required: [status]
                properties:
                  status:
                    type: string
                    enum: ['pending', 'paid', 'failed']
        '404':
          description: Payment ID not found

  /tickets:
    post:
      summary: Finalise booking (cash or after GCash payment)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [reservationId, paymentMethod]
              properties:
                reservationId:
                  type: string
                  format: uuid
                paymentMethod:
                  type: string
                  enum: ['gcash', 'cash']
                paymentRef:
                  type: string
                  description: For GCash, the paymentId returned by /payments
      responses:
        '200':
          description: Ticket created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TicketResponse'
        '400':
          description: Payment not confirmed or invalid reservation
        '410':
          description: Reservation expired
        '409':
          description: Reservation already used

  /validate:
    post:
      summary: Scan a ticket QR (read‑only validation)
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [qrData, busId]
              properties:
                qrData:
                  type: string
                  description: Contents of the QR code (the ticket UUID)
                busId:
                  type: string
                  format: uuid
      responses:
        '200':
          description: Validation result
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ValidationResult'
        '400':
          description: Invalid QR data or bus ID

  /checkin:
    post:
      summary: Mark ticket/seats as boarded
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required: [ticketId, busId]
              properties:
                ticketId:
                  type: string
                  format: uuid
                busId:
                  type: string
                  format: uuid
      responses:
        '200':
          description: Boarding confirmed (or already boarded — idempotent)
          content:
            application/json:
              schema:
                type: object
                required: [success, seats, alreadyBoarded]
                properties:
                  success:
                    type: boolean
                  seats:
                    type: array
                    items:
                      type: integer
                  alreadyBoarded:
                    type: boolean
                    description: True if this ticket was already checked in previously
        '400':
          description: Invalid request (ticket not found, ticket is for a different bus, or bus has already departed)

components:
  schemas:
    BusSummary:
      type: object
      required: [id, destination, departureTime, status, seatsAvailable, seatsReserved, seatsBooked, seatPrice]
      properties:
        id:
          type: string
          format: uuid
        destination:
          type: string
        departureTime:
          type: string
          format: time
        status:
          type: string
          enum: ['scheduled', 'departed', 'cancelled']
        seatPrice:
          type: number
          format: decimal
        seatsAvailable:
          type: integer
        seatsReserved:
          type: integer
        seatsBooked:
          type: integer
          description: Count of seats with status 'booked' OR 'boarded' (both represent taken seats)

    SeatDetail:
      type: object
      required: [seatId, seatNumber, status]
      properties:
        seatId:
          type: integer
        seatNumber:
          type: integer
        status:
          type: string
          enum: ['available', 'reserved', 'booked', 'boarded']
        reservationExpiresAt:
          type: string
          format: date-time
          description: Only present if status is 'reserved'

    TicketResponse:
      type: object
      required: [ticketId, busId, seats, passengerCount, totalAmount, paymentMethod, qrCode, destination, departureTime, departureDate]
      properties:
        ticketId:
          type: string
          format: uuid
        busId:
          type: string
          format: uuid
        seats:
          type: array
          items:
            type: integer
        passengerCount:
          type: integer
        totalAmount:
          type: number
        paymentMethod:
          type: string
        qrCode:
          type: string
          description: The ticket UUID to encode in the QR
        destination:
          type: string
          description: Bus destination for ticket display
        departureTime:
          type: string
          format: time
          description: Bus departure time for ticket display
        departureDate:
          type: string
          format: date
          description: Bus departure date for ticket display

    ValidationResult:
      type: object
      required: [valid, reason, seats, remainingUnboarded]
      properties:
        valid:
          type: boolean
        reason:
          type: string
          description: Empty if valid; otherwise a human‑readable message
        seats:
          type: array
          items:
            type: integer
          description: Seat numbers on the ticket (for display)
        remainingUnboarded:
          type: integer
          description: Number of booked-but-not-boarded seats on the bus (excludes available/reserved seats, and excludes the seats on the ticket currently being scanned)
```

---

## 6. Detailed User Flows

### 6.1 Kiosk (`/kiosk`)

1. **Choose Destination**  
   - Kiosk calls `GET /destinations` and displays a list of destinations.

2. **Select Date** – defaults to today (frontend sends current date from browser, but the backend validates it). No future date restrictions are enforced beyond the seats available.

3. **Browse Buses**  
   - Frontend calls `GET /buses?destination={dest}&date={date}`.  
   - Displays a list of departures with seat availability counts, sorted earliest to latest.

4. **Seat Selection**  
   - User picks a bus; kiosk calls `GET /buses/{busId}/seats`.  
   - Displays a grid of 50 seats. Colours: green = available, grey = reserved, red = booked/boarded (the latter two are indistinguishable to the passenger).  
   - User taps multiple seats (no upper limit).  
   - A **Refresh** button re‑fetches the seat map manually. No automatic refresh during this phase.

5. **Proceed to Payment**  
   - User taps “Proceed to Payment”.  
   - Kiosk calls `POST /reservations` with `{busId, seatIds}`.  
     - On success → reservation stored in frontend state, step 6 appears.  
     - On 409 → error message shown, seat map refreshed, any still‑available seats from the original selection remain selected.

6. **Payment Screen**  
   - Two mutually‑exclusive options are displayed:  
     - **Pay with GCash** → calls `POST /payments` → the backend generates a QR code from PayMongo’s checkout URL and returns it as a data URL (`qrImageUrl`). The kiosk displays that QR image.
 Frontend starts polling `GET /payments/{id}/status` every 2 seconds.  
       - On `paid` status → calls `POST /tickets` with `paymentMethod: 'gcash'` and `paymentRef`.  
       - On `failed` → shows error; reservation expires naturally or user can retry.  
     - **Pay with Cash** → shows total amount and a large button **“I have paid ₱XXX in cash – Print Ticket”**. Clicking it calls `POST /tickets` with `paymentMethod: 'cash'` (no paymentRef).

7. **Ticket Display**  
   - On successful ticket creation, the kiosk shows:
     - Departure time and destination
     - List of seat numbers
     - Passenger count
     - Payment method
     - QR code (generated from the `qrCode` string)
   - A 30‑second countdown timer and a manual **“Return to Start”** button appear.  
   - When the timer expires or the button is pressed, the kiosk navigates back to step 1.  
   - **No inactivity timer** exists during seat selection or payment. The only automatic return is after ticket display.

### 6.2 Passenger Web App (`/book`)

Identical to the kiosk flow except:
- The interface is mobile‑optimised.
- **Only GCash** payment is available (no cash).
- After ticket creation, the passenger is asked to **take a screenshot** of the ticket and QR code.
- There is no automatic return timer; the user navigates away manually.
- Payment QR code is shown on the same screen; the user can scan it with another device (or, if supported, use GCash’s in‑app scanner on the same phone).

### 6.3 Conductor Scanner (`/scanner`)

1. **Bus Selection**  
   - App opens, calls `GET /buses?date={today's date in YYYY-MM-DD format}` (without destination filter, so all scheduled buses are shown).
   - A dropdown lists all departures (destination + time).  
   - The conductor picks the bus they are boarding. The `busId` is stored in React state (not persisted; reload clears it).

2. **Scanning View**  
   - The camera starts using `html5-qrcode`, continuously scanning.  
   - When a QR code is detected, the scanner calls `POST /validate` with `{qrData, busId}`.  
   - No network requests other than the validation call.

3. **Validation Result**  
   - **Valid (green):**  
     - Shows list of seats on the ticket.  
     - Shows “Seats remaining to board: X” where X is the `remainingUnboarded` value.  
     - Two buttons: **“Check In”** → calls `POST /checkin` (confirms boarding); **“Cancel”** → returns to scanning.  
   - **Invalid (red):**  
     - Shows reason (e.g. “Already used”, “Ticket is for a different bus”, “Bus has already departed”). Only a **Cancel** button.

4. **Post Check‑In**  
   - The `used_at` column is set on the ticket, seats become `boarded`.  
   - Rescanning the same ticket results in a red invalid screen.

   **Note:** The system never shows a “partial” boarding warning. All seats on a ticket are always boarded together. The `POST /checkin` operation is idempotent: calling it again on an already‑boarded ticket does nothing harmful.

---

## 7. Server‑Side Processes

### 7.1 Automatic Bus Departure

A periodic job runs every 60 seconds (set via Node.js timer):

```sql
-- The server obtains the current timestamp either from MOCK_DATETIME or the real clock.
-- It injects that value as a query parameter to avoid relying on PostgreSQL’s NOW().
UPDATE buses 
SET status = 'departed' 
WHERE departure_date = $CURRENT_DATE
  AND departure_time < $MOCKED_NOW_TIMESTAMP
  AND status = 'scheduled';
```

If the environment variable `MOCK_DATETIME` is set, the server uses that value instead of the real clock.
The timestamp is passed to the SQL query as a parameter (`$MOCKED_NOW_TIMESTAMP`) so that the mock time applies to database operations as well.

### 7.2 Reservation Cleanup

Every 60 seconds, the server runs (using the server‑side mock timestamp if `MOCK_DATETIME` is set):

```sql
-- Delete expired reservations, using server‑supplied timestamp
DELETE FROM reservations WHERE expires_at < $MOCKED_NOW_TIMESTAMP;

-- Reset orphaned seats
UPDATE seats 
SET status = 'available', reservation_id = NULL
WHERE reservation_id IS NOT NULL 
  AND reservation_id NOT IN (SELECT id FROM reservations);
```

The cleanup job deletes expired reservations and resets orphaned seats. Because the job runs at most once per minute, seats may remain reserved for a short time after expiry. To avoid booking expired seats, the reservation process must also check reservation expiry when evaluating seat availability (i.e. treat seats whose reservation has expired as available).

### 7.3 Seeding & Reset Script

- A Node.js script (`scripts/seed.js`) located in the backend repo.
- It accepts environment variables:
  - `SEED_DATE` (default: today’s date)
  - `SEED_DESTINATION` (optional: if set, only seeds that destination)
- When run:
  - Deletes all tickets, reservations, and payments; resets all seats to `available`.
  - Inserts bus rows for the given date: 8 departure times (e.g. 06:00, 08:00, 10:00, 12:00, 14:00, 16:00, 18:00, 20:00) for each destination (unless filtered). Destinations are hard‑coded as e.g. “Manila”, “Baguio”, “Pampanga”.
  - For each bus, inserts 50 seat rows (seat_number 1–50, status `available`).
  - Prints a summary of created rows.

Example usage:
```bash
# Seed all 24 buses for today
node scripts/seed.js

# Seed only Manila for tomorrow (to test date filtering)
SEED_DATE=2026-05-21 SEED_DESTINATION=Manila node scripts/seed.js
```

---

## 8. Mock System for Frontend Testing

The frontend repo contains an `src/mock/` folder:
- `data.js` – static bus, seat, reservation, ticket data. Functions to simulate status changes (e.g. reserving a seat, payment succeeded).
- `api.js` – exports the same functions as the real API module (`getDestinations`, `getBuses`, `getSeats`, `reserveSeats`, `cancelReservation`, `initiatePayment`, `pollPaymentStatus`, `createTicket`, `validateTicket`, `checkin`). All functions return Promises resolving with mock data.

A config variable `USE_MOCK` in `src/config.js` (default `true`) switches between mock and real API modules. The real API module is a thin wrapper around `fetch` that hits the backend endpoints.

**No PostgreSQL or backend** is needed for frontend development. Mock data covers all possible states and scenarios.

To switch to the live backend during integration:
- Set `USE_MOCK = false`
- Set `API_BASE_URL = 'http://<host-ip>:3000'`

---

## 9. Time/Date Handling

- The **backend clock** is the only source of truth for business logic.
- For testing, set environment variable `MOCK_DATETIME` to an ISO‑8601 string; the server will use that instead of `new Date()` everywhere.
- In production, the system clock is used.
- The **frontend** displays times provided by backend responses. Visual countdown timers (e.g. reservation expiry) are derived from server‑supplied `expiresAt` values and `Date.now()` for UX purposes – this is acceptable. The frontend must **never** use its own clock to make business‑logic decisions (e.g. “is this seat still valid?”) – those decisions must rely on a fresh API call.

---

## 10. Key Design Decisions & Clarifications

This section is a reference for developers to understand **why** certain choices were made and to avoid assuming that something is a mistake or oversight.

| Decision | Explanation |
|----------|-------------|
| **No late boarding** | Buses become `departed` exactly at their scheduled time. There is no grace period. |
| **No manual bus departure** | The conductor cannot manually mark a bus as departed. Departure is entirely automatic. |
| **No ticket cancellation / refund** | Once a ticket is created, it cannot be cancelled or refunded. This is out of scope for the prototype. |
| **No authentication** | The scanner has no login; any device on the LAN can select a bus and scan tickets. This is a security simplification for demonstration purposes. |
| **Multi‑scanner overlap allowed** | Two scanners can technically be used on the same bus simultaneously. Boarding is idempotent, so no data corruption occurs. We assume only one conductor scans per bus in practice. |
| **One ticket = multiple seats** | A single ticket can contain any number of seats, but all seats are boarded together when the ticket is scanned. Group members cannot board separately. |
| **QR code on passenger’s own phone** | For GCash payment, the passenger sees a QR code on their screen. They may need a second device to scan it. This is an acceptable UX trade‑off. |
| **Cash payment simulation** | There is no cash acceptor hardware. The kiosk has a button that simulates payment confirmation. |
| **GCash is real via PayMongo** | The system integrates PayMongo API. Payment status is obtained by polling PayMongo; no webhooks are used. Internet is required. |
| **Seat status terminology** | Only `available`, `reserved`, `booked`, `boarded` are used in the database and code. |
| **Seat numbers are integers** | Seats are numbered 1–50, with no letter suffixes. |
| **No separate destination table** | Destinations are stored as a VARCHAR on the `buses` table. This keeps the schema simple. |
| **Only today’s buses are bookable**   | The passenger UI defaults to today. The backend does **not** enforce this restriction; it allows booking for future dates as well, but those buses may not exist unless seeded. |
| **30‑second ticket display timer** | The kiosk returns to the selection screen 30 seconds after showing a ticket, or immediately when the passenger presses a button. |
| **Reservation timeout: 5 minutes** | Once a reservation is created, the passenger has 5 minutes to complete payment. After that, the reservation is deleted and seats become available again. |
| **GCash payment may exceed reservation window** | If a passenger completes GCash payment after their 5-minute reservation expires, `POST /tickets` returns 410. The money is collected by PayMongo but there is no refund mechanism in this prototype. The frontend must display: "Your reservation expired before payment was confirmed. Please contact staff for a refund." |
| **Polling interval for payment status: 2 seconds** | The frontend checks `GET /payments/{id}/status` every 2 seconds until the status is no longer `pending`. |

---

## 11. Task Breakdown & Dependencies

The tasks are ordered logically to minimise idle time and maximise parallel work.  
Where a frontend task lists a backend dependency, the **mock layer (T5)** allows it to start earlier — the dependency is only needed for final integration.

### 11.1 Dependency Summary

| ID  | Task                                        | Area    | After         |
|-----|---------------------------------------------|---------|---------------|
| T1  | Backend project skeleton                    | Backend | –             |
| T2  | Frontend project skeleton                   | Frontend| –             |
| T3  | Database schema creation & migration        | Backend | T1            |
| T4  | Seeding & reset script                      | Backend | T3            |
| T5  | Mock data for frontend                      | Frontend| T2            |
| T6  | GET /destinations endpoint                  | Backend | T1, T3        |
| T7  | GET /buses endpoint (with filtering)        | Backend | T1, T3        |
| T8  | GET /buses/:id/seats endpoint               | Backend | T1, T3        |
| T9  | Bus browsing & seat selection UI            | Frontend| T5 (mocks), API spec; integration needs T6–T8 |
| T10 | POST /reservations endpoint                 | Backend | T1, T3        |
| T11 | DELETE /reservations/:id endpoint           | Backend | T10           |
| T12 | Reservation cleanup job                     | Backend | T11           |
| T13 | Proceed-to-payment flow (frontend)          | Frontend| T9, T10, T11  |
| T14 | POST /payments endpoint (PayMongo)          | Backend | T1, T3, T13   |
| T15 | GET /payments/:id/status endpoint           | Backend | T14           |
| T16 | GCash payment flow (frontend kiosk & book)  | Frontend| T13, T14, T15 |
| T17 | POST /tickets endpoint                      | Backend | T1, T3, T13, T14, T15 |
| T18 | Cash payment flow (kiosk only)              | Frontend| T13, T17      |
| T19 | Ticket display screen (kiosk & web app)     | Frontend| T17, T18      |
| T20 | POST /validate endpoint                     | Backend | T1, T3        |
| T21 | POST /checkin endpoint                      | Backend | T20           |
| T22 | Conductor scanner UI (bus select & scan)    | Frontend| T5, T6, T7    |
| T23 | Scanner result screen & check‑in            | Frontend| T20, T21, T22 |
| T24 | Automatic bus departure job                 | Backend | T1, T3        |
| T25 | Integration & end‑to‑end testing            | Both    | T9–T24        |
| T26 | Bootable USB setup & auto‑start             | Ops     | T1, T2, T24   |
| T27 | Documentation & research paper              | –       | –             |

---

### 11.2 Detailed Task Descriptions

#### T1 – Backend project skeleton
**Area:** Backend  
**After:** –  

- Initialise Node.js/Express + TypeScript project.  
- Set up ESLint, Prettier, `tsconfig.json`, `nodemon.json`.  
- Environment variable handling (`dotenv`).  
- Create the folder structure shown in Section 12.1.  
- **Testing:** Verify the server starts with `npm run dev` and responds to a health-check route.

#### T2 – Frontend project skeleton
**Area:** Frontend  
**After:** –  

- Initialise React project with Vite.  
- Install React Router, `html5-qrcode`, `qrcode.react`.  
- Create route stubs for `/kiosk`, `/book`, `/scanner`.  
- Set up `config/index.js` with `USE_MOCK` flag and `API_BASE_URL`.  
- Create the folder structure shown in Section 12.2.  
- **Testing:** Each path renders a placeholder component.

#### T3 – Database schema creation & migration
**Area:** Backend  
**After:** T1  

- Write numbered SQL files in `migrations/` (order: buses → tickets → seats → reservations → payments).  
- Implement `db/migrate.ts` that runs them in order on server startup.  
- **Testing:** Run migrations; verify tables and constraints exist via `psql` or pgAdmin.

#### T4 – Seeding & reset script
**Area:** Backend  
**After:** T3  

- Implement `scripts/seed.ts` as described in Section 7.3.  
- Accept `SEED_DATE` and `SEED_DESTINATION` environment variables.  
- Delete all tickets, reservations, payments; reset seats to `available`; insert 24 buses and 50 seats each.  
- **Testing:** Run the script with different dates/destinations; check row counts and seat statuses.

#### T5 – Mock data for frontend
**Area:** Frontend  
**After:** T2  

- Build `src/mock/data.js` with static buses, seats, tickets, payments.  
- Build `src/mock/api.js` with functions that mirror the real API signatures and return Promises with mock data.  
- Cover all possible response states (success, 409 conflict, payment pending/paid/failed, expired reservation).  
- **Testing:** Import mock API in a test page; verify each function returns expected shapes.

#### T6 – `GET /destinations` endpoint
**Area:** Backend  
**After:** T1, T3  

- Route, service, model to return a deduplicated list of destination strings from the `buses` table.  
- **Testing:** Use Postman/curl; seeded data should return the three hard-coded destinations.

#### T7 – `GET /buses` endpoint (with filtering)
**Area:** Backend  
**After:** T1, T3  

- Support query parameters `destination`, `date` (required), optional `min_time`/`max_time`.  
- Return buses sorted by `departure_time` ascending.  
- Include computed seat counts (available, reserved, booked+boarded).  
- **Testing:** Filter by date, destination, time range; verify seat counts sum correctly.

#### T8 – `GET /buses/:id/seats` endpoint
**Area:** Backend  
**After:** T1, T3  

- Return array of seat objects with `seatNumber`, `status`, and optional `reservationExpiresAt`.  
- **Testing:** Fetch seat map; verify statuses match seeded data.

#### T9 – Bus browsing & seat selection UI
**Area:** Frontend  
**After:** T5 (mock data) and API specification; final integration requires T6–T8  

- Implement the full booking flow up to seat selection for `/kiosk` and `/book`.  
- Destination picker, date picker (defaults to today), bus list with availability counts, seat grid (green/ grey/red).  
- Multiple seat selection, manual refresh button, “Proceed to Payment” button.  
- **Testing:** Using mock data, walk through all steps; test the 409 conflict display (mock returns 409 for specific seats).

#### T10 – `POST /reservations` endpoint
**Area:** Backend  
**After:** T1, T3  

- Accept `busId` and `seatIds` (seat numbers, 1–50).  
- Use `SELECT … FOR UPDATE` to atomically reserve seats.  
- Create a `reservations` row with `expiresAt = NOW() + 5 minutes`.  
- On conflict, return 409 with `conflictingSeatIds` array.  
- **Testing:** Concurrent requests from two clients; verify only one succeeds per seat.

#### T11 – `DELETE /reservations/:id` endpoint
**Area:** Backend  
**After:** T10  

- Delete reservation, release seats (set `status = 'available'`, `reservation_id = NULL`).  
- Return 404 if reservation not found.  
- **Testing:** Delete an active reservation; check seats become available.

#### T12 – Reservation cleanup job
**Area:** Backend  
**After:** T11  

- Interval every 60 seconds: delete expired reservations, reset orphaned seats.  
- Uses `getCurrentTime()` from config (respects `MOCK_DATETIME`).  
- **Testing:** Set `MOCK_DATETIME` to a point after expiry; verify cleanup runs and seats released.

#### T13 – Proceed-to-payment flow (frontend)
**Area:** Frontend  
**After:** T9, T10, T11 (backend needed for live requests; mock for early dev)  

- Wire the “Proceed to Payment” button to call `POST /reservations`.  
- On 409: display message, refresh seat map, keep still-available seats selected.  
- Show reservation expiry countdown using `useReservationTimer` hook.  
- Cancel reservation on expiry or user tap.  
- **Testing:** With mocks, simulate success, 409, and expiry; verify UI updates.

#### T14 – `POST /payments` endpoint (PayMongo GCash)
**Area:** Backend  
**After:** T1, T3, T13  

- Validate reservation; call PayMongo API to create a GCash source.  
- Store payment row with `paymongo_id`, `bus_id`, `amount`, `status = 'pending'`.  
- Generate a QR code from the PayMongo checkout URL using the `qrcode` package; return `qrImageUrl` and `redirectUrl`.  
- **Testing:** Use PayMongo sandbox; check payment row created, QR image returned.

#### T15 – `GET /payments/:id/status` endpoint
**Area:** Backend  
**After:** T14  

- Query PayMongo for source status.  
- **Update the local `payments.status` and `updated_at`** before returning the status.  
- Return `{ status }`.  
- **Testing:** Poll after creating a test payment; status should transition from `pending` to `paid` in sandbox.

#### T16 – GCash payment flow (frontend kiosk & book)
**Area:** Frontend  
**After:** T13, T14, T15  

- Kiosk: call `POST /payments`, display QR image, poll every 2s via `usePaymentPolling`.  
- Book (passenger): call `POST /payments`, open `redirectUrl` in the mobile browser (or show QR for another device).  
- On `paid`: proceed to `POST /tickets`. On `failed`: show error.  
- **Testing:** End-to-end with mock; verify polling stops on `paid`/`failed`.

#### T17 – `POST /tickets` endpoint
**Area:** Backend  
**After:** T1, T3, T13, T14, T15  

- Validate reservation, check payment status in `payments` table (for GCash, also re-verify with PayMongo).  
- Create ticket, update seats (`status = 'booked'`, set `ticket_id`), delete reservation, return `TicketResponse` (including `destination`, `departureTime`, `departureDate`).  
- **Testing:** Create cash ticket (no payment ref) and GCash ticket (after payment confirmed); verify seat statuses change.

#### T18 – Cash payment flow (kiosk only)
**Area:** Frontend  
**After:** T13, T17  

- Kiosk payment screen: show total amount and a “I have paid ₱XXX in cash – Print Ticket” button.  
- Clicking the button calls `POST /tickets` with `paymentMethod: 'cash'`.  
- **Testing:** Verify button calls correct API and ticket creation succeeds.

#### T19 – Ticket display screen (kiosk & web app)
**Area:** Frontend  
**After:** T17, T18  

- Show ticket details: destination, departure time, seat numbers, passenger count, payment method.  
- Render QR code of the ticket UUID using `qrcode.react`.  
- Kiosk: start a 30-second countdown (manual “Return to Start” button also works).  
- Web app: prompt passenger to take a screenshot; no auto-return.  
- **Testing:** Verify QR is scannable by the conductor scanner; countdown works.

#### T20 – `POST /validate` endpoint
**Area:** Backend  
**After:** T1, T3  

- Read-only endpoint: look up ticket by QR data (ticket UUID), check it belongs to the given bus, bus is not departed, and seats are not already boarded.  
- Return `valid`, `reason`, `seats`, `remainingUnboarded`.  
- **Testing:** Scan a valid ticket, a ticket for wrong bus, an already-boarded ticket; verify responses.

#### T21 – `POST /checkin` endpoint
**Area:** Backend  
**After:** T20  

- Mark all seats on the ticket as `boarded`, set `ticket.used_at`.  
- **Idempotent:** if ticket is already boarded, return `{alreadyBoarded: true}` with success.  
- **Testing:** Board a ticket, then call check-in again; should still return 200 with `alreadyBoarded: true`.

#### T22 – Conductor scanner UI (bus selection & scanning)
**Area:** Frontend  
**After:** T5, T6, T7 (for bus list endpoint; mock works)  

- Dropdown of all scheduled buses (from `GET /buses?date={today}`).  
- Store selected bus ID in React state; optionally persist to `sessionStorage`.  
- Start `html5-qrcode` camera; on detection call `POST /validate`.  
- **Testing:** Switch bus selection; scan a fake QR containing a known ticket UUID (mock); verify validation call is made.

#### T23 – Scanner result screen & check‑in
**Area:** Frontend  
**After:** T20, T21, T22  

- Green result: show seats, remaining unboarded count, “Check In” and “Cancel” buttons.  
- Red result: show reason, only “Cancel” button.  
- “Check In” calls `POST /checkin`; after success return to scanning.  
- **Testing:** Scan a valid ticket, press Check In; rescan same ticket should show already-boarded (idempotent check).

#### T24 – Automatic bus departure job
**Area:** Backend  
**After:** T1, T3  

- Interval every 60 seconds: update buses to `departed` where `departure_date = current date` and `departure_time < getCurrentTime()`.  
- Uses the server-supplied timestamp (respects `MOCK_DATETIME`).  
- **Testing:** Set `MOCK_DATETIME` to after a departure time; run job; verify bus status changes.

#### T25 – Integration & end‑to‑end testing
**Area:** Both  
**After:** T9–T24  

- Full flow with real devices on LAN: kiosk booking (cash + GCash), passenger booking via phone, conductor scanning.  
- Test concurrency: two users trying to reserve the same seats at the same time.  
- Test reservation expiration: wait 5 minutes, verify seats released.  
- Test scanner with wrong bus ID, already-departed bus, already-boarded ticket.  
- **Document any bugs or edge cases found.**

#### T26 – Bootable USB setup & auto‑start
**Area:** Operations  
**After:** T1, T2, T24  

- Configure Lubuntu persistent USB with PostgreSQL, Node.js, and the built frontend.  
- Set up systemd services (or equivalent) to auto-start PostgreSQL, the backend server, and Chromium in kiosk mode pointing to `http://localhost:3000/kiosk`.  
- **Testing:** Boot from USB; verify everything starts automatically and the kiosk loads.

#### T27 – Documentation & research paper
**Area:** –  
**After:** –  

- Produce final research paper, presentation slides, and a short MP4 simulation video.  
- Can proceed in parallel with all other tasks.  
- **No software testing required.**

## 12. Folder Structure Guide

### 12.1 Backend — `k-ticketing-backend`

```
k-ticketing-backend/
├── .env.example
├── .eslintrc.json
├── .prettierrc
├── tsconfig.json
├── package.json
├── nodemon.json
│
├── scripts/
│   └── seed.ts                  # Seeding & reset (T4)
│
├── migrations/
│   ├── 001_create_buses.sql
│   ├── 002_create_tickets.sql
│   ├── 003_create_seats.sql
│   ├── 004_create_reservations.sql
│   └── 005_create_payments.sql
│
└── src/
    ├── app.ts                   # Express app setup, middleware, CORS, route mounting
    ├── server.ts                # Entry point — app.listen(), starts jobs
    │
    ├── config/
    │   └── index.ts             # Reads environment variables, exports getCurrentTime()
    │
    ├── db/
    │   ├── index.ts             # pg Pool and query helper
    │   └── migrate.ts           # Runs SQL migration files in order on startup
    │
    ├── jobs/
    │   ├── departurJob.ts       # Automatic bus departure every 60s (T24)
    │   └── reservationCleanup.ts # Reservation expiry cleanup every 60s (T12)
    │
    ├── routes/
    │   ├── destinations.ts      # GET /destinations
    │   ├── buses.ts             # GET /buses, GET /buses/:id/seats
    │   ├── reservations.ts      # POST /reservations, DELETE /reservations/:id
    │   ├── payments.ts          # POST /payments, GET /payments/:id/status
    │   ├── tickets.ts           # POST /tickets
    │   └── scanner.ts           # POST /validate, POST /checkin
    │
    ├── services/
    │   ├── destinationService.ts
    │   ├── busService.ts
    │   ├── reservationService.ts
    │   ├── paymentService.ts    # PayMongo API wrapper
    │   ├── ticketService.ts
    │   └── scannerService.ts
    │
    ├── models/
    │   ├── busModel.ts          # Raw DB queries for buses/seats
    │   ├── reservationModel.ts
    │   ├── paymentModel.ts
    │   ├── ticketModel.ts
    │   └── scannerModel.ts
    │
    ├── middleware/
    │   └── errorHandler.ts      # Global error handler
    │
    └── types/
        └── index.ts             # Shared TypeScript interfaces (Bus, Seat, Ticket, etc.)
```

**Important files:**

- **`config/index.ts`** – Reads `MOCK_DATETIME` from environment and exports a `getCurrentTime()` helper used by all business logic and jobs; never call `new Date()` directly outside this file.
- **`db/migrate.ts`** – Runs numbered SQL files in order on server startup (no external migration framework needed). Creates the full schema from scratch.
- **`jobs/`** – Both periodic jobs are started in `server.ts` after the database is ready.
- **`routes → services → models`** – Strict three-layer chain. Routes parse request/response only. Services hold business logic. Models only execute SQL.
- **`scripts/seed.js`** – Truncates and re-populates buses, seats, tickets, reservations, payments for the given date, using the `SEED_DATE` and `SEED_DESTINATION` environment variables.

---

### 12.2 Frontend — `k-ticketing-frontend`

```
k-ticketing-frontend/
├── .eslintrc.json
├── .prettierrc
├── vite.config.js
├── package.json
├── index.html
│
└── src/
    ├── main.jsx                     # React root, BrowserRouter
    ├── App.jsx                      # Route definitions: /kiosk, /book, /scanner
    │
    ├── config/
    │   └── index.js                 # USE_MOCK flag, API_BASE_URL
    │
    ├── api/
    │   ├── index.js                 # All API functions; switches real/mock based on USE_MOCK
    │   └── real.js                  # Thin fetch() wrappers for backend endpoints
    │
    ├── mock/
    │   ├── data.js                  # Static buses, seats, tickets, payments; mutation helpers
    │   └── api.js                   # Functions matching real.js signatures, returns Promises
    │
    ├── pages/
    │   ├── kiosk/
    │   │   ├── KioskPage.jsx            # Top-level state machine (currentStep, reservationId, etc.)
    │   │   ├── DestinationStep.jsx
    │   │   ├── DateStep.jsx
    │   │   ├── BusListStep.jsx
    │   │   ├── SeatSelectionStep.jsx
    │   │   ├── PaymentStep.jsx          # Renders Cash or GCash sub-components
    │   │   └── TicketStep.jsx           # Ticket display + 30s countdown
    │   │
    │   ├── book/
    │   │   ├── BookPage.jsx             # Same step flow, GCash only, no cash
    │   │   ├── DestinationStep.jsx
    │   │   ├── BusListStep.jsx
    │   │   ├── SeatSelectionStep.jsx
    │   │   ├── PaymentStep.jsx          # GCash redirect flow for mobile
    │   │   └── TicketStep.jsx           # Screenshot prompt instead of auto-return
    │   │
    │   └── scanner/
    │       ├── ScannerPage.jsx          # Owns busId state (sessionStorage for resilience)
    │       ├── BusSelectStep.jsx
    │       ├── ScanStep.jsx             # html5-qrcode camera view
    │       └── ResultStep.jsx           # Green/red result, Check In / Cancel buttons
    │
    ├── components/
    │   ├── SeatGrid.jsx                 # 50-seat grid (shared by kiosk & book)
    │   ├── QRCodeDisplay.jsx            # Renders ticket QR using qrcode.react
    │   ├── CountdownTimer.jsx           # Kiosk ticket screen countdown
    │   ├── BusList.jsx                  # Bus cards with availability counts
    │   └── StatusBadge.jsx              # Coloured valid/invalid indicator for scanner
    │
    └── hooks/
        ├── usePaymentPolling.js         # Polls /payments/:id/status every 2s, cleans on unmount
        └── useReservationTimer.js       # Counts down from expiresAt, cancels on timeout
```

**Important files and folders:**

- **`config/index.js`** – Contains `USE_MOCK` (default `true`) and `API_BASE_URL`. Toggling `USE_MOCK` switches between mock and real API calls for the entire app.
- **`api/index.js`** – The only API import used by any page or component. It re-exports all functions from either `real.js` or `mock/api.js`.
- **`mock/data.js`** – Contains a set of static bus/seat/ticket/reservation/payment data and simple state-mutation functions so all frontend flows can be tested without a backend.
- **`pages/kiosk/` and `pages/book/`** – Kept separate even though their flows are similar. Shared logic is extracted into `components/` and `hooks/` rather than merging the two into one parameterised page.
- **`hooks/`** – Encapsulate timing/polling logic with cleanup on unmount, keeping step components simple.
- **`ScannerPage.jsx`** – Persists the selected bus ID in `sessionStorage` so the selection survives accidental page reloads (optional but recommended).


