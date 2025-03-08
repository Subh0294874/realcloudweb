import { useState, useEffect } from "react";
import { Link } from "wouter";
import { SiDiscord } from "react-icons/si";
import { Button } from "@/components/ui/button";

export function NavBar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdmin = () => {
      const adminStatus = localStorage.getItem('isAdmin') === 'true';
      setIsAdmin(adminStatus);
    };

    checkAdmin();
    // Listen for storage changes in case admin logs in/out in another tab
    window.addEventListener('storage', checkAdmin);

    return () => {
      window.removeEventListener('storage', checkAdmin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    window.location.reload();
  };

  return (
    <nav className="border-b bg-background/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center">
          <div className="relative z-20 flex items-center text-lg font-medium">
            <SiDiscord className="mr-2 h-5 w-5 text-primary" />
            RealCloud
          </div>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <Link to="/" className="font-medium transition-colors hover:text-foreground/80 text-foreground/60">
            Home
          </Link>
          <Link to="/news" className="font-medium transition-colors hover:text-foreground/80 text-foreground/60">
            News
          </Link>
          <Link to="/about" className="font-medium transition-colors hover:text-foreground/80 text-foreground/60">
            About
          </Link>
          {isAdmin && (
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
}

// Add default export
export default NavBar;