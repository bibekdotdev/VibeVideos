import { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  UserButton,
  RedirectToSignIn,
  useUser, // ✅ hook to access Clerk user
} from "@clerk/clerk-react";
import axios from "axios";
import useAuthStore from "../store/authStore";
export default function Authentication() {
  const { isSignedIn, user } = useUser();
  const { signupRequest } = useAuthStore();
  useEffect(() => {
    // Run when user logs in
    if (isSignedIn && user) {
      const sendUserData = async () => {
        try {
          const userData = {
            clerkId: user.id,
            name: user.fullName || user.firstName || "No name",
            email: user.primaryEmailAddress?.emailAddress || "",
          };

          // Send to your backend API
          const res = await signupRequest(userData);
          console.log("User synced to backend:", res.data);
        } catch (err) {
          console.error("Error sending user data:", err);
        }
      };

      sendUserData();
    }
  }, [isSignedIn, user]);

  return (
    <header>
      {/* If user is logged out, automatically redirect to Clerk Sign In */}
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      {/* If user is logged in, show UserButton */}
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
