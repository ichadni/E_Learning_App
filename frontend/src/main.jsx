import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { UserContextProvider } from "./context/UserContext.jsx";
import { CourseContextProvider } from "./context/CourseContext.jsx";
import { NotificationProvider } from "./context/NotificationContext.jsx";

export const server = import.meta.env.VITE_API_URL;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserContextProvider>
      <CourseContextProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </CourseContextProvider>
    </UserContextProvider>
  </React.StrictMode>
);