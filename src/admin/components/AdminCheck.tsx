import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AdminCheck: React.FC = () => {
  const { currentUser, isAdmin, signInWithGoogle, signOutUser, loadingAuth } =
    useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loadingAuth) return;
    if (currentUser) {
      if (isAdmin) {
        navigate("/admin", { replace: true });
      } else {
        signOutUser();
      }
    }
  }, [currentUser, isAdmin, loadingAuth, navigate, signOutUser]);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("AdminCheck: Error during sign-in attempt:", error);
    }
  };

  if (loadingAuth) {
    return <div>Loading authentication status...</div>;
  }

  if (currentUser && isAdmin) {
    return <div>Authenticated as Admin. Redirecting to Admin Dashboard...</div>;
  }

  if (currentUser && !isAdmin) {
    return (
      <div>You are not authorized to access the admin area. Signing out...</div>
    );
  }

  if (!currentUser) {
    return (
      <div>
        <h2>Admin Access</h2>
        <p>Please sign in with Google to verify your admin credentials.</p>
        <button onClick={handleSignIn}>Sign In with Google</button>
        {location.state?.message && <p>{location.state.message}</p>}
      </div>
    );
  }

  return null;
};

export default AdminCheck;
