# Email Sequence Builder project:

**Email Sequence Builder:**
A full-stack web application for creating and managing automated email sequences with a visual flow-based interface

## 🎥 Demo Video
Click to watch the demonstration video of project: [https://youtu.be/umvuFC0hkxQ](https://youtu.be/umvuFC0hkxQ)

## Project Overview:
This application allows users to design email automation sequences through an intuitive drag-and-drop interface. Users can create complex email workflows with conditional logic, delays, and different types of nodes, then schedule them for automated execution.

**Features:**
Visual Sequence Editor: Drag-and-drop interface for building email sequences

**Multiple Node Types:**
* Email nodes for composing messages
* Delay nodes for scheduling wait times
* Lead source nodes for sequence entry points

**User Authentication:** Secure login and registration system <br/>
**Sequence Management:** Create, edit, view, and delete email sequences <br/>
**Email Scheduling:** Automated email delivery based on the designed flow <br/>
**Responsive UI:** Clean, modern interface built with React and Tailwind CSS <br/>

# Tech Stack

### Frontend:
* React (v19.0.0)
* React Router (v7.5.0)
* ReactFlow for the visual editor
* Tailwind CSS for styling
* Axios for API requests
* React Icons for UI elements
* Vite as the build tool

### Backend:
* Node.js
* Express.js
* MongoDB (with Mongoose)
* JWT for authentication
* Nodemailer for email sending
* Agenda.js for job scheduling
* bcrypt.js for password hashing

# Installation and Setup:
Prerequisites
Node.js (v14+)
MongoDB

### Backend Setup: <br/>
Clone the repository <br/>
Navigate to the backend directory <br/>
cd email-sequence-backend <br/>

Install dependencies <br/>
```bash 
npm install
```

### Create a .env file in the root directory with the following variables:
```bash
PORT=5000
MONGO_URI=mongodb://localhost:27017/email-sequence
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
EMAIL_FROM=your_email@example.com
```

### Start the server
```bash
npm run dev
```


# Frontend Setup
Navigate to the frontend directory 
```bash
cd email-sequence-frontend
```

Install dependencies
```bash
npm install
```

Start the development server
```bash
npm run dev
```

# API Endpoints
### Authentication
POST /api/auth/register - Register a new user <br/>
POST /api/auth/login - Login existing user <br/>
GET /api/auth/me - Get current user data <br/>

### Sequences
GET /api/sequences - Get all user sequences <br/>
GET /api/sequences/:id - Get a specific sequence <br/>
POST /api/sequences - Create a new sequence <br/>
PUT /api/sequences/:id - Update a sequence <br/>
DELETE /api/sequences/:id - Delete a sequence <br/>

## Screenshots
![Screenshot (552)](https://github.com/user-attachments/assets/853ef34e-36c1-4faa-bf50-2f1a2862d574)
![Image](https://github.com/user-attachments/assets/f04e9454-09ec-47f8-9fbd-78b58d250e23)
![Screenshot (554)](https://github.com/user-attachments/assets/fa6c1709-5586-4cb0-91a2-0e5ba9881754)
![Screenshot (555)](https://github.com/user-attachments/assets/1955dc5f-ba60-41c3-866c-9309c8740b84)
![Screenshot (556)](https://github.com/user-attachments/assets/97f7adac-e815-45a2-8c93-11831c517d44)


