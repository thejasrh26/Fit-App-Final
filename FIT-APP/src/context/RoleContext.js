import React, { createContext, useContext, useState, useEffect } from "react";
import { auth, db } from "../config/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user role from Firestore
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserRole(userDoc.data().role || "member");
          } else {
            // Default role is member
            setUserRole("member");
          }
        } catch (err) {
          console.error("Error fetching user role:", err);
          setUserRole("member");
        }
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Save user role to Firestore
  const saveUserRole = async (uid, role) => {
    try {
      await setDoc(
        doc(db, "users", uid),
        { role, createdAt: new Date() },
        { merge: true }
      );
      setUserRole(role);
    } catch (err) {
      console.error("Error saving user role:", err);
    }
  };

  return (
    <RoleContext.Provider value={{ userRole, loading, saveUserRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within RoleProvider");
  }
  return context;
};
