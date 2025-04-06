import { useState } from "react";
import { auth } from "@/firebase";
import { getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import SignUp from "../pages/signup"; 


interface LoginModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginModal({ open, onClose }: LoginModalProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Get the ID token
      const token = await user.getIdToken();
      console.log("Firebase ID token:", token);
  
      // Optional: store in localStorage or use in API headers
      localStorage.setItem("token", token);
  
      navigate("/dashboard");
      onClose();
    } catch (err) {
      setError("Invalid credentials. Please check your email and password.");
    } finally {
      setLoading(false);
    }
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">Login</DialogTitle>
        </DialogHeader>

        <Card className="shadow-lg">
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to="/forgot-password" className="text-sm font-medium text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <Input 
                  id="password" 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="relative my-4 text-center">
                <span className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </span>
                <span className="relative bg-white px-2 text-sm text-muted-foreground">or</span>
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

              <Button type="submit" className="w-full font-medium" disabled={loading} onClick={handleLogin}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex justify-center">
            <p className="text-sm">
              Don't have an account?{" "}
              <button className="text-blue-600 hover:underline" onClick={() => setIsSignUpOpen(true)}>Sign Up</button>
              <SignUp open={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
            </p>
          </CardFooter>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
