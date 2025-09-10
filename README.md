# Role-Based-Authentication

This project is a mini-application that demonstrates core full-stack concepts using the **MERN** (MongoDB, Express, React, Node.js) stack. It focuses on **authentication**, **role-based access control**, and **CRUD** (Create, Read, Update, Delete) operations.

---

### Features

* **Authentication**: Secure user signup and login with hashed passwords using **bcrypt** and JWT (JSON Web Token) for session management.
* **Role-Based Access**: The application distinguishes between two user roles: `Admin` and `Student`. Access to certain features and APIs is restricted based on the user's role.
* **Protected Routes**: Sensitive dashboards and API endpoints are protected, ensuring that only authenticated users with the correct permissions can access them.
* **Admin Dashboard**: Provides a comprehensive view of all student records. Admins can perform full **CRUD** operations—adding, editing, and deleting student profiles.
* **Student Dashboard**: Allows a student to view and update their own profile information, including their name, email, and course details.

---

### Tech Stack

* **Frontend**: React, React Router, Axios, and `jwt-decode`.
* **Backend**: Node.js, Express, `bcryptjs`, `jsonwebtoken`, and `better-sqlite3` for the database.

---

### Getting Started

Follow these steps to set up and run the project locally.

#### 1. Clone the repository

Clone the repository to your local machine.

#### 2. Backend Setup

Navigate to the `backend` directory, install the required packages, and start the server. The backend server will be running on `http://localhost:5000`.

#### 3. Frontend Setup

In a separate terminal, navigate to the `frontend` directory, install its dependencies, and launch the development server. The frontend application will be accessible at `http://localhost:5173`.

---

### Usage

1.  **Sign Up**: Create a new user account via the signup page. By default, new users are assigned the `student` role.
2.  **Login**: Use the credentials from your new account to log in.
3.  **Dashboard Access**:
    * A **Student** user will be automatically redirected to their personal dashboard to manage their profile.
    * An **Admin** user (the role can be set manually in the database) will be redirected to the Admin Dashboard, which provides an interface to manage all student records.
