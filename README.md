# Full-Stack Blog Application

A comprehensive, role-based full-stack blog application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Vite.

## Features

- **Role-Based Access Control**: Distinct features and permissions for Users, Authors, and Admins.
- **Authentication & Authorization**: Secure user registration and login using JWT (JSON Web Tokens) and bcrypt password hashing.
- **Content Management**: Authors can write, edit, and manage their articles. Users can read articles.
- **Media Upload**: Integration with Cloudinary via Multer for handling image uploads seamlessly.
- **Responsive Design**: Modern and responsive user interface styled with Tailwind CSS.
- **State Management**: Efficient frontend global state management using Zustand.

## Tech Stack

### Frontend (`blog-app-frontend`)
- **Framework**: React 19 built with Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router v7
- **State Management**: Zustand
- **Forms**: React Hook Form
- **API Client**: Axios
- **Notifications**: React Hot Toast

### Backend (`blog-app-backend`)
- **Runtime & Framework**: Node.js, Express v5
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: jsonwebtoken, bcryptjs, cookie-parser
- **File Uploads**: multer, cloudinary
- **CORS handling**: cors

## Project Structure

This project is structured as a monorepo:

```text
BlogApp-main/
├── blog-app-backend/     # Express backend REST API
├── blog-app-frontend/    # React/Vite frontend application
├── package.json          # Root package.json with workspace scripts
└── render.yaml           # Render deployment configuration
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- A MongoDB cluster (e.g., MongoDB Atlas) or local instance
- A Cloudinary account for media hosting

### Installation

1. Navigate to the project root:
   ```bash
   cd BlogApp-main
   ```

2. Install dependencies for the root, backend, and frontend at once using the root script:
   ```bash
   npm run install-all
   ```

### Environment Variables

You must set up environment variables for both the backend and frontend to run the application correctly.

**Backend (`blog-app-backend/.env`)**
Create a `.env` file in the `blog-app-backend` directory and configure the following:
```env
PORT=4000
DB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

**Frontend (`blog-app-frontend/.env`)**
Create a `.env` file in the `blog-app-frontend` directory:
```env
VITE_API_URL=http://localhost:4000
```

### Running the Application Locally

1. **Start the Backend:**
   Open a terminal, navigate to the backend, and start the server:
   ```bash
   cd blog-app-backend
   npm start
   ```

2. **Start the Frontend:**
   Open a new terminal, navigate to the frontend, and run the development server:
   ```bash
   cd blog-app-frontend
   npm run dev
   ```

## Deployment

This repository includes a `render.yaml` configuration file to facilitate automated deployment of both the frontend and backend services on [Render](https://render.com). 

To deploy:
1. Connect your GitHub repository to Render.
2. Render will use the `render.yaml` file to provision the necessary Web Services.
3. Ensure you add the required environment variables (like `DB_URL`, `JWT_SECRET`, and Cloudinary credentials) in the Render dashboard for your backend service.
