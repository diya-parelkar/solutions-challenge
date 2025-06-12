import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useThemeContext } from './ThemeProvider';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import BookLogo from "../assets/book.png";
import SignUp from "../pages/signup";

export default function LoginModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(open);
  const { getClasses, getCombinedClasses, mode } = useThemeContext();

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in with Google:", result.user);
      onClose();
    } catch (error: any) {
      console.error("Error signing in with Google:", error.message);
      alert(error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("User signed in:", userCredential.user);
      onClose();
    } catch (error: any) {
      console.error("Error signing in:", error.message);
      alert(error.message);
    }
  };

  const handleOpenSignUp = () => {
    onClose();
    setTimeout(() => setIsSignUpOpen(true), 200); // slight delay for smooth transition
  };
  const handleCloseSignUp = () => setIsSignUpOpen(false);

  // For seamless login flow from signup
  const handleOpenLogin = () => {
    setIsSignUpOpen(false);
    setTimeout(() => {
      setShowEmailForm(false);
      setIsLoginOpen(true);
    }, 200);
  };

  // Determine if login modal should be open
  const loginModalOpen = (open && !isSignUpOpen) || isLoginOpen;

  if (!loginModalOpen && !isSignUpOpen) return null;

  return (
    <>
      {loginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div style={{ backgroundColor: mode === 'dark' ? '#101828' : 'white' }} className={getCombinedClasses('background.card', 'rounded-2xl shadow-2xl p-8 w-full max-w-md relative border border-emerald-500/10')}>
            <button
              className={getCombinedClasses('text.secondary', 'absolute top-3 right-3 hover:text-foreground text-xl')}
              onClick={() => { setIsLoginOpen(false); onClose(); }}
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex flex-col items-center mb-8">
              <img
                src={BookLogo}
                alt="EduGen Logo"
                className="w-12 h-12 rounded-lg shadow-lg bg-gradient-to-br from-white/80 to-emerald-100 p-2 dark:bg-gradient-to-br dark:from-white/60 dark:to-emerald-200 border border-white/70 dark:border-white/20 mb-3"
              />
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent mb-1">EduGen</h1>
              <p className={getCombinedClasses('text.secondary', 'text-sm')}>Sign in to your account</p>
            </div>
            {!showEmailForm ? (
              <div className="space-y-4">
                <Button
                  className={getCombinedClasses('background.card', 'w-full h-12 text-lg border border-emerald-500/20 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-xl shadow-md flex items-center justify-center gap-2')}
                  onClick={handleGoogleSignIn}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#4285F4" d="M46.06 24.56c0-1.6-.14-3.14-.38-4.64H24v9.4h12.74c-.6 3.12-2.42 5.8-5.06 7.58v6.28h8.18c4.8-4.42 7.6-10.94 7.6-18.62Z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.94-2.14 15.92-5.78l-8.18-6.28c-2.24 1.5-5.06 2.38-7.74 2.38-5.96 0-10.98-4-12.8-9.38H2.96v6.48C7 42.08 14.9 48 24 48Z" />
                    <path fill="#FBBC05" d="M11.2 28.94c-.6-1.5-.96-3.16-.96-4.94s.34-3.42.96-4.94v-6.48L2.96 13.62A23.99 23.99 0 0 0 0 24c0 3.94.96 7.72 2.96 11.28l8.24-6.34Z" />
                    <path fill="#EA4335" d="M24 9.42c3.42 0 6.42 1.2 8.82 3.52l6.54-6.54C34.98 2.14 29.52 0 24 0 14.9 0 7 5.92 2.96 13.62l8.24 6.42c1.82-5.42 6.84-9.42 12.8-9.42Z" />
                  </svg>
                  <span className={getCombinedClasses('text.primary', '')}>Sign in with Google</span>
                </Button>
                <div className="flex items-center gap-2 my-2">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <span className={getCombinedClasses('text.secondary', 'text-xs')}>or</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>
                <Button
                  className="w-full h-12 text-lg bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md"
                  onClick={() => setShowEmailForm(true)}
                >
                  Sign in with Email
                </Button>
                <div className="mt-6 text-center">
                  <span className={getCombinedClasses('text.secondary', 'text-sm')}>Don't have an account?</span>
                  <Button variant="link" className="text-emerald-600 dark:text-emerald-400 ml-1 text-sm" onClick={handleOpenSignUp}>Sign up now</Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className={getCombinedClasses('text.primary', 'block text-sm font-medium mb-1')}>
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={getCombinedClasses('background.input', 'h-12')}
                  />
                </div>
                <div>
                  <label htmlFor="password" className={getCombinedClasses('text.primary', 'block text-sm font-medium mb-1')}>
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={getCombinedClasses('background.input', 'h-12')}
                  />
                </div>
                <Button type="submit" className="w-full h-12 text-lg bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md">Sign In</Button>
                <Button variant="link" className="w-full text-emerald-600 dark:text-emerald-400 text-sm mt-2" onClick={() => setShowEmailForm(false)}>
                  Back to options
                </Button>
                <div className="mt-4 text-center">
                  <span className={getCombinedClasses('text.secondary', 'text-sm')}>Don't have an account?</span>
                  <Button variant="link" className="text-emerald-600 dark:text-emerald-400 ml-1 text-sm" onClick={handleOpenSignUp}>Sign up now</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
      <SignUp open={isSignUpOpen} onClose={handleCloseSignUp} onLogin={handleOpenLogin} />
    </>
  );
} 