# Role-Based-Authentication
## Project Description

This is a S.E.R.N. (SQLite3, Express, React, Node.js) stack mini-project that demonstrates a complete web application with **user authentication** and **role-based access control**.

The project works by separating the application into two parts: a **backend server** and a **frontend client**.

### Backend Functionality

The backend, built with Node.js and Express, handles all the core logic.

* **Authentication**: It manages user data (email, hashed passwords) in an SQLite3 database. When a user logs in, it validates their credentials and generates a **JSON Web Token (JWT)**, which acts as a digital key.
* **Role-Based Access**: The JWT contains the user's role (either `admin` or `student`). This allows the server to protect specific routes. For example, a request to delete a student record is checked to ensure the user has the `admin` role.
* **APIs**: It provides RESTful APIs for different functionalities:
    * **Public APIs** for user signup and login.
    * **Protected APIs** for `admin` access, enabling **CRUD** (Create, Read, Update, Delete) operations on student records.
    * **Protected APIs** for `student` access, allowing them to view and update their own profile.

### Frontend Functionality

The frontend, built with React, provides the user interface.

* **Routing**: It uses React Router to manage different pages, such as the login, signup, and dashboard pages.
* **Authentication Flow**: After a successful login, the frontend stores the JWT in **localStorage**. This token is then attached to all subsequent requests to the backend to prove the user's identity.
* **Role Redirection**: It decodes the JWT to identify the user's role and redirects them to the appropriate dashboard (`/admin-dashboard` or `/student-dashboard`).
* **Protected Pages**: The dashboard routes are "protected." If a user tries to access them without a valid JWT, they are automatically sent back to the login page.
* **Dashboard UI**: It presents different UIs based on the user's role, with forms and tables to interact with the backend APIs. Admins see a full list of students, while a student sees only their own profile.
