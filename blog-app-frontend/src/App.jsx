import { createBrowserRouter, RouterProvider } from "react-router";
import RootLayout from "./components/RootLayout";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import UserProfile from "./components/UserProfile";
import AdminProfile from "./components/AdminProfile";
import UsersList from "./components/UsersList";
import AuthorList from "./components/AuthorList";
import AuthorProfile from "./components/AuthorProfile";
import AuthorArticles from "./components/AuthorArticles";
import EditArticle from './components/EditArticle'
import WriteArticles from "./components/WriteArticles";
import ArticleByID from "./components/ArticleById";
import {Toaster} from 'react-hot-toast'
import ProtectedRoute from "./components/ProtectedRoute";
import Unauthorized from "./components/Unauthorized";

const routerObj = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "user-profile",
        element: (
          <ProtectedRoute allowedRoles={["USER"]}>
            <UserProfile />
          </ProtectedRoute>
        )
      },
      {
        path: "author-profile",
        element: (
          <ProtectedRoute allowedRoles={["AUTHOR"]}>
            <AuthorProfile />
          </ProtectedRoute>
        ),

        children: [
          {
            index: true,
            element: <AuthorArticles />,
          },
          {
            path: "articles",
            element: <AuthorArticles />,
          },
          {
            path: "write-article",
            element: <WriteArticles />,
          },
        ],
      },
      {
        path: "admin-profile",
        element: (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminProfile />
          </ProtectedRoute>
        ),
        children: [
          {
            index: true,
            element: <UsersList />,
          },
          {
            path: "users",
            element: <UsersList />,
          },
          {
            path: "authors",
            element: <AuthorList />,
          }
        ]
      },
      {
        path: "article/:id",
        element: (
          <ProtectedRoute allowedRoles={["USER", "AUTHOR"]}>
            <ArticleByID />
          </ProtectedRoute>
        ),
      },
      {
        path: "edit-article",
        element: (
          <ProtectedRoute allowedRoles={["AUTHOR"]}>
            <EditArticle />
          </ProtectedRoute>
        ),
      },
      {
        path: 'unauthorized',
        element: <Unauthorized />
      }
    ],
  },
]);

function App() {
  return (
    <div>
        <Toaster position="top-center" reverseOrder={false}/>
        <RouterProvider router={routerObj} />
    </div>
  );
}

export default App;