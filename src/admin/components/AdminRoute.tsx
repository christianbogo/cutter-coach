import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminRoute: React.FC = () => {
  const { currentUser, isAdmin, signOutUser, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Loading authentication...</p>
      </div>
    );
  }

  if (!currentUser) {
    console.log(
      "AdminRoute: User not logged in. Redirecting to / from",
      location.pathname
    );
    return (
      <Navigate
        to="/"
        state={{
          from: location,
          message: "You must be logged in to access this page.",
        }}
        replace
      />
    );
  }

  if (!isAdmin) {
    console.warn(
      `AdminRoute: Unauthorized access attempt to ${location.pathname} by ${currentUser.email}. Signing out.`
    );
    signOutUser();
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <p>Unauthorized access. Redirecting...</p>
      </div>
    );
  }

  if (process.env.NODE_ENV === "development") {
    console.log(
      `AdminRoute: User ${currentUser.email} is admin. Allowing access to ${location.pathname}`
    );
  }
  return <Outlet />;
};

export default AdminRoute;
