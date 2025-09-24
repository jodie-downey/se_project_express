# WTWR (What to Wear) – Backend API

This repository contains the backend API for **WTWR (What to Wear)**, a full-stack web application that provides clothing recommendations based on weather conditions. This server was built using **Node.js**, **Express**, and **MongoDB** to support secure data storage, user authentication, and a structured REST API.

This backend project focuses on:

- Building a RESTful API using Express
- Integrating a MongoDB database with Mongoose
- Implementing centralized error handling and validation
- Establishing secure authentication with JWT
- Structuring a scalable codebase for deployment

---

## Deployed Domain

[domain](https://wtwr.flowtemp.ro/)
[domain](https://www.wtwr.flowtemp.ro/)

## FrontEnd Repository

[repository](https://github.com/jodie-downey/se_project_react)

## 🧰 Technologies Used

- **Node.js & Express.js** – Core server framework
- **MongoDB & Mongoose** – Database and ODM
- **bcryptjs** – Password hashing
- **jsonwebtoken (JWT)** – Secure user authentication
- **Celebrate/Joi** – Schema validation middleware
- **dotenv** – Environment variable management
- **CORS** – Cross-Origin Resource Sharing configuration
- **ESLint & Prettier** – Code formatting and quality tools

---

## 🌐 API Overview

| Method   | Endpoint         | Description                   | Auth Required    |
| -------- | ---------------- | ----------------------------- | ---------------- |
| `GET`    | `/items`         | Fetch all clothing items      | No               |
| `POST`   | `/items`         | Create a new clothing item    | Yes              |
| `DELETE` | `/items/:itemId` | Delete a clothing item by ID  | Yes (owner only) |
| `POST`   | `/signup`        | Register a new user           | No               |
| `POST`   | `/signin`        | Log in an existing user       | No               |
| `GET`    | `/users/me`      | Get current user's profile    | Yes              |
| `PATCH`  | `/users/me`      | Update current user's profile | Yes              |

---

## 🛠️ Project Structure

```bash
se_project_express/
├── app.js
├── package.json
├── .env
├── /controllers
├── /models
├── /routes
├── /middlewares
├── /utils
└── /validators
controllers/ – Handles request logic (e.g. creating items, users)

models/ – Mongoose schemas for User and Item

routes/ – Route definitions split by resource

middlewares/ – Custom middleware for errors, auth, and validation

utils/ – Reusable utility functions

validators/ – Joi schemas for input validation

🔐 Authentication & Authorization
Passwords are hashed using bcryptjs before storage.

Login issues a secure JWT stored in cookies or headers.

Protected routes verify user identity using middleware.

🧪 Error Handling
The app uses centralized error handling with custom messages for:

Validation errors

Authentication failures

Not found errors

Server errors (500)

Each error type is logged and returned in a developer-readable format during development and safely masked in production.

✅ Validation
All input data is validated using Celebrate and Joi schemas:

User inputs (email, password, name)

Item inputs (name, weather type, image URL)

This helps prevent malformed data from entering the system and enhances security.

🚀 Deployment-Ready
This project was structured with deployment in mind:

Clean, modular architecture

.env configuration for environment separation

Scalable route and controller structure

Clear division between app logic and server startup

📄 License
This project is licensed under the MIT License.

👋 Acknowledgments
This project is part of the curriculum at TripleTen Software Engineering Bootcamp. The backend pairs with the WTWR front-end project.
```
