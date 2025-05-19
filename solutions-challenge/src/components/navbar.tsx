import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import LoginModal from "./LoginModal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { auth } from "@/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useThemeContext } from './ThemeProvider';

function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { getClasses, getCombinedClasses } = useThemeContext();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className={getCombinedClasses('background.header', 'border-b')}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2">
            <img src="/book.png" alt="EduGen Logo" className="w-8 h-8 rounded-lg shadow-lg bg-gradient-to-br from-white/80 to-emerald-100 p-1 dark:bg-gradient-to-br dark:from-white/60 dark:to-emerald-200 border border-white/70 dark:border-white/20" />
          </span>
          <Link to="/" className={getCombinedClasses('text.primary', 'font-bold text-xl')}>EduGen</Link>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link to="/about" className={getCombinedClasses('text.secondary', 'text-sm hover:text-foreground transition-colors')}>About</Link>
          <Link to="/how-to-use" className={getCombinedClasses('text.secondary', 'text-sm hover:text-foreground transition-colors')}>How To Use</Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Avatar className="cursor-pointer border">
                    <AvatarImage src={user.photoURL || ""} alt="User Profile" />
                    <AvatarFallback>{user.displayName?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className={getCombinedClasses('background.card', 'w-48 shadow-lg rounded-md border z-[9999]')}>
                <DropdownMenuItem className={getCombinedClasses('text.primary', 'px-4 py-2 text-sm font-medium')}>{user.displayName || "Profile"}</DropdownMenuItem>
                <DropdownMenuItem className={getCombinedClasses('text.primary', 'px-4 py-2 text-sm font-medium text-red-500 hover:bg-gray-100')} onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button 
                onClick={() => setIsLoginOpen(true)}
                className={getCombinedClasses('text.primary', 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800')}
              >
                Login
              </Button>
              <LoginModal open={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
            </>
          )}
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={getCombinedClasses('text.primary', '')}>
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
          </svg>
        </Button>
      </div>
    </header>
  );
}

export default Navbar;
