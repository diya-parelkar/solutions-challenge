import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { auth } from "../firebase";
import { getAuth, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const SignUp = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert("Signup successful!");
      onClose(); // Close modal on success
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError("");
    const authInstance = getAuth();
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(authInstance, provider);
      alert("Google Sign-In successful!");
      onClose(); // Close modal on success
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      setError("An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-semibold">Sign Up</DialogTitle>
        </DialogHeader>
        <Card className="w-full">
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>
            <div className="relative my-4">
              <hr className="border-gray-300" />
              <p className="absolute top-[-10px] left-1/2 bg-white px-2 text-sm transform -translate-x-1/2">or</p>
            </div>
            <Button variant="outline" className="w-full flex items-center gap-2" onClick={handleGoogleSignIn}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                <path fill="#4285F4" d="M46.06 24.56c0-1.6-.14-3.14-.38-4.64H24v9.4h12.74c-.6 3.12-2.42 5.8-5.06 7.58v6.28h8.18c4.8-4.42 7.6-10.94 7.6-18.62Z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.94-2.14 15.92-5.78l-8.18-6.28c-2.24 1.5-5.06 2.38-7.74 2.38-5.96 0-10.98-4-12.8-9.38H2.96v6.48C7 42.08 14.9 48 24 48Z" />
                <path fill="#FBBC05" d="M11.2 28.94c-.6-1.5-.96-3.16-.96-4.94s.34-3.42.96-4.94v-6.48H2.96A23.99 23.99 0 0 0 0 24c0 3.94.96 7.72 2.96 11.28l8.24-6.34Z" />
                <path fill="#EA4335" d="M24 9.42c3.42 0 6.42 1.2 8.82 3.52l6.54-6.54C34.98 2.14 29.52 0 24 0 14.9 0 7 5.92 2.96 13.62l8.24 6.42c1.82-5.42 6.84-9.42 12.8-9.42Z" />
              </svg>
              Continue with Google
            </Button>
            <p className="text-sm text-center mt-4">
              Already have an account? <button className="text-blue-600 hover:underline" onClick={onClose}>Login</button>
            </p>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
};

export default SignUp;
