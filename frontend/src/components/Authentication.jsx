import { useEffect, useState } from "react";
import {
  SignedIn,
  SignedOut,
  useUser,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import useAuthStore from "../store/authStore";

export default function Authentication() {
  const { isSignedIn, user } = useUser();
  const { signupRequest } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [signupComplete, setSignupComplete] = useState(false);

  useEffect(() => {
    const sendUserData = async () => {
      if (isSignedIn && user) {
        try {
          setLoading(true);
          const userData = {
            clerkId: user.id,
            name: user.fullName || user.firstName || "No name",
            email: user.primaryEmailAddress?.emailAddress || "",
          };

          const res = await signupRequest(userData);
          console.log("✅ User synced to backend:", res.data);
          setSignupComplete(true);
        } catch (err) {
          console.error("❌ Error sending user data:", err);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };

    sendUserData();
  }, [isSignedIn, user, signupRequest]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-medium">Setting things up...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  if (signupComplete) {
    return (
      <header>
        <SignedIn>
          <p className="text-white">You are signed in!</p>
        </SignedIn>
      </header>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <p className="text-lg font-medium">
        Failed to sync user. Please try again.
      </p>
    </div>
  );
}
