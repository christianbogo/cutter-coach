import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  User,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  // eslint-disable-next-line
  AuthProvider as FirebaseAuthProvider,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { app } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

const adminEmailString = process.env.REACT_APP_ADMIN_EMAILS || "";
const adminEmails: string[] = adminEmailString
  .split(",")
  .map((email) => email.trim())
  .filter((email) => email);

if (adminEmails.length === 0 && process.env.NODE_ENV === "development") {
  console.warn(
    "AuthContext: No admin emails found. Check your .env file and REACT_APP_ADMIN_EMAILS variable. " +
      "No users will be recognized as admin."
  );
}

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  loadingAuth: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  console.log(adminEmails);
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loadingAuth, setLoadingAuth] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (user && user.email) {
        const userIsAdmin = adminEmails.includes(user.email);
        setIsAdmin(userIsAdmin);
        if (process.env.NODE_ENV === "development") {
          console.log(
            `AuthContext: User ${user.email} signed in. Admin status: ${userIsAdmin}`
          );
        }
      } else {
        setIsAdmin(false);
        if (process.env.NODE_ENV === "development" && user) {
          console.log(
            `AuthContext: User ${user.uid} signed in but has no email. Cannot determine admin status.`
          );
        } else if (process.env.NODE_ENV === "development") {
          console.log("AuthContext: No user signed in.");
        }
      }
      setLoadingAuth(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<void> => {
    setLoadingAuth(true);
    try {
      await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      setLoadingAuth(false);
    }
  };

  const signOutUser = async (): Promise<void> => {
    setLoadingAuth(true);
    try {
      await firebaseSignOut(auth);
      navigate("/");
    } catch (error) {
      console.error("Sign Out Error:", error);
      setLoadingAuth(false);
    }
  };

  const value = {
    currentUser,
    isAdmin,
    signInWithGoogle,
    signOutUser,
    loadingAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
