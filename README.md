# Node Js App

## Introduction

This project is a secure REST API built with Node.js and Express for managing student records. It implements JWT (JSON Web Token) authentication to protect endpoints and ensure that only authorized users can access and manipulate student data. The API follows RESTful principles, providing a clean and intuitive interface for CRUD (Create, Read, Update, Delete) operations on student resources.

## Requirements

Runtime & Core Dependencies:

- Node.js (v18 or higher recommended)
- Express.js - Web framework for routing and middleware
- JSON Web Tokens (jsonwebtoken) - For authentication
- bcryptjs - Password hashing and verification
- cors - Cross-Origin Resource Sharing support
- dotenv - Environment variable management

## Database:

- SQLite (lightweight option for development/small deployments)

### Development Tools:

- nodemon (optional) - Auto-restart server during development
- Git - Version control

## Deployment:

- Render account (free tier available)
- Environment variables configured on Render dashboard

Environment Variables Required:

```jsx
PORT=3000
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES_IN=24h
DATABASE_URL="./data/db.sqlite"
API_KEY=your-api-key-for-endpoint-protection
NODE_ENV=production
```


# Folder Structure

```bash

API/
├── node_modules/ # Project dependencies (auto-generated, not in version control)
├── src/ # Source code directory
│ ├── controllers/ # Business logic and request handlers
│ │ └── authController.js # Handles authentication logic
│ │
│ ├── middleware/ # Custom middleware functions
│ │ └── auth.js # JWT verification middleware
│ │ └── validate.js # Input validation middleware
│ │ └── errorHandler.js # Global error handling
│ │
│ ├── models/ # Data models and schemas
│ │ └── User.js # User authentication model
│ │
│ ├── routes/ # API route definitions
│ │ └── studentRoutes.js # Student-related endpoints
│ │ └── authRoutes.js # Authentication endpoints
│ │
│ ├── services/ # Business logic and database operations
│ │ └── authService.js # Authentication services
│ │
│ └── index.js # Main application entry point
│
├── .env # Environment variables (NOT in version control)
├── .gitignore # Specifies files to ignore in version control
├── package-lock.json # Locked versions of dependencies
├── package.json # Project metadata and dependencies
└── README.md # Project documentation
```



**Before starting the project**, create a JavaScript file in an empty folder and open it with VS Code. In the terminal, run Node followed by the file name to launch it. If you don't have Node, you can install it by following this link:

[First steps](https://www.notion.so/First-steps-299b87ff4fc1806eaa7bffe9dc8eebb9?pvs=21)

[Start an Express server](https://www.notion.so/Start-an-Express-server-299b87ff4fc180988be3e115a829643b?pvs=21)

[Data flow and middleware](https://www.notion.so/Data-flow-and-middleware-29ab87ff4fc180258267d735833a4cfb?pvs=21)

[Project structure](https://www.notion.so/Project-structure-29ab87ff4fc180dca62ced6dbdfc3019?pvs=21)

[Controllers](https://www.notion.so/Controllers-29ab87ff4fc18016a939f7d0a6e034a7?pvs=21)

[Service Layer](https://www.notion.so/Service-Layer-2a0b87ff4fc180508687c51382fb7a92?pvs=21)

[Express Router](https://www.notion.so/Express-Router-2a0b87ff4fc18013bde1db2039141123?pvs=21)

[Database: SQLite](https://www.notion.so/Database-SQLite-2a0b87ff4fc18073a29dc54af805da54?pvs=21)

[Models](https://www.notion.so/Models-2a0b87ff4fc1807c8b79e0fc1276e817?pvs=21)

[Environment Variables](https://www.notion.so/Environment-Variables-2a0b87ff4fc18020b044dc2d533998b9?pvs=21)

[Deploy to Render](https://www.notion.so/Deploy-to-Render-2a0b87ff4fc1806085f7f8d59625dbeb?pvs=21)

[Your Turn !](https://www.notion.so/Your-Turn-2a0b87ff4fc18078be98f993a1883f97?pvs=21)

