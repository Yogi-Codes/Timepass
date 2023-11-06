import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "./firebase";
import { getDoc,doc } from "firebase/firestore";

function ProtectedRoute(props) {
  const [shouldLoad, setShouldLoad] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            console.log("Authorized");
            setShouldLoad(true);
          } else {
            console.log("User not authorized.");
            navigate("/login");
          }
        } catch (error) {
          console.error("Error checking user authorization:", error);
          window.location.href="/login"
        }
      } else {
        console.log("User not authenticated.");
        window.location.href="/login"
      }
    });

    return () => {
      unsubscribe(); // Cleanup the listener when the component unmounts.
    };
  }, []);

  return shouldLoad ? <props.Component /> : null;
}

export default ProtectedRoute;
