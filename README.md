# Interest-Track
# 📈 Interest Calculator - Full Stack Web App

A full-stack web application designed to calculate and track simple and compound interest. The app includes user authentication and a personal dashboard to save history.

## 🚀 Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (NoSQL)
- **Hosting:** Render

---

## 🏗️ Database Structure (MongoDB)
The application uses two main collections in the `interestDB` database:

### **User Collection**
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique ID for the user |
| `username` | String | Unique username for login |
| `password` | String | User password |

### **Transaction Collection**
| Field | Type | Description |
| :--- | :--- | :--- |
| `_id` | ObjectId | Unique transaction ID |
| `userId` | ObjectId | Reference to the User who created it |
| `amount` | Number | Principal amount entered |
| `rate` | Number | Interest rate percentage |
| `time` | Number | Duration (Years/Months) |
| `total` | Number | Final calculated amount |

---

## 📡 API Documentation

### **Authentication**
- **POST `/api/signup`**
  - Sends: `{ username, password }`
  - Action: Creates a new user in MongoDB.
- **POST `/api/login`**
  - Sends: `{ username, password }`
  - Action: Verifies user and returns `userId`.

### **Calculations (Transactions)**
- **GET `/api/transactions/:userId`**
  - Action: Fetches all saved calculations for a specific user.
- **POST `/api/transactions`**
  - Sends: `{ userId, amount, rate, time, total }`
  - Action: Saves a calculation to the database.
- **DELETE `/api/transactions/:id`**
  - Action: Removes a specific entry by ID.

---

## ⚙️ Setup & Deployment
1. **Clone the Repo:** `git clone <your-repo-link>`
2. **Install Backend:** `cd backend && npm install`
3. **Env Variables:** Create a `.env` file with `MONGODB_URI`.
4. **Run Locally:** `node server.js`
