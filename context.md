**Role:** You are an expert Full-Stack Software Architect and Lead Developer specializing in the MERN stack (MongoDB, Express.js, React, Node.js) and Python. We are at a hackathon building "SmartRent," a next-generation Rental Management System.

**Objective:** Build a functional, end-to-end rental platform that handles complex booking logic. The development must follow a strict phased approach: **Core Requirements first**, then **Advanced Features** only if time permits.

---

### **PHASE 1: The Core "Must-Have" System (Strictly per Problem Statement)**
*Do not implement AI or advanced complex features yet. Focus on stability and flow.*

**1. Tech Stack:**
* **Full Stack:** NextJS for the entire app, Tailwind for styling, Libraries for animations and icons.
* **Database:** MongoDB (Mongoose).
* **Auth:** JWT with 3 Roles: `Customer`, `Vendor`, `Admin`.

**2. Database Schema Requirements:**
* **Users:** Name, Email, Password, Role, GSTIN (for invoices).
* **Products:** Name, Category, Base Price, Rental Period (Hourly/Daily/Weekly), Total Stock, `isRentable` boolean.
* **Orders/Reservations:** CustomerID, ProductID, StartDate, EndDate, Status (`Quote`, `Confirmed`, `PickedUp`, `Returned`, `Cancelled`).
* **Invoices:** Linked to Order, Amount, PaymentStatus (`Unpaid`, `Partial`, `Paid`).

**3. Functional Workflows to Build:**
* **Authentication:** Sign up/Login for all 3 roles.
* **Vendor Dashboard:** CRUD operations for Products (Add/Edit/Delete stock).
* **Customer Journey:**
    1.  **Browse:** View products with filters.
    2.  **Quotation:** Add to cart → Creates a "Draft Quote".
    3.  **Order:** Confirm Quote → Converts to "Rental Order" → **Deducts Inventory**.
* **Operations:**
    * **Pickup:** Admin marks order as "Picked Up" (Stock moves to 'With Customer').
    * **Return:** Admin marks as "Returned" (Stock restores).
* **Invoicing:** Auto-generate an invoice entry when an order is confirmed.

**CRITICAL LOGIC (Phase 1):** Implement the **"Overlapping Date Check."** A user *cannot* book a product if `(Total Stock - Active Reservations for that Date Range) <= 0`.

---

### **PHASE 2: UI Polish & Logistics**
*Once Phase 1 is bug-free, implement these specific UI improvements.*

* **Dashboards:**
    * **Admin:** Total Revenue chart, "Products Currently Rented" list.
    * **Vendor:** List of "Pending Pickups" for today.
    * **Customer:** "My Orders" history with status badges.
* **PDF Generation:** Use a library (like `jspdf` or `react-pdf`) to allow users to download their Invoice as a PDF.

---

### **PHASE 3: The "Wow" Factors (AI & Advanced Features)**
*ONLY proceed to this section after Phase 1 & 2 are fully functional. These are the differentiators.*

**1. Feature: "Velox" Voice Assistant (Voice-First Search)**
* **Goal:** Allow users to book via voice commands.
* **Implementation:** Add a microphone icon to the search bar.
    * Use the Web Speech API (browser native) for Speech-to-Text.
    * **Logic:** Parse the string for keywords (e.g., "Projector", "Tomorrow").
    * **Action:** Auto-filter the product list or auto-fill the search bar based on the transcript.

**2. Feature: Visual Availability Heatmap**
* **Goal:** Visualise the "Overlapping Date Check" logic from Phase 1.
* **Implementation:** On the Product Details page, replace the standard date picker with a color-coded calendar.
    * **Red:** Stock = 0 (Fully Booked).
    * **Green:** Stock > 0 (Available).
    * **Logic:** Fetch the `reservations` array for that product and map it to the calendar UI.

**3. Feature: Dynamic Pricing Badge**
* **Goal:** Simulate an AI pricing engine.
* **Implementation:** If `Available Stock < 20%` for a selected date range, increase the displayed price by 15% and show a "High Demand" badge next to the price.

---

### **Instructions for Execution:**

1.  Start by giving me the **Mongoose Schema definitions** for `User`, `Product`, and `Order` that specifically support the "Overlapping Date Check" logic.
2.  Next, generate the **API Routes** for the "Quotation to Order" conversion.
3.  Wait for my confirmation before generating Frontend code.