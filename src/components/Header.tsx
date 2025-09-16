import { Lock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { WalletConnect } from "./WalletConnect";
import logo from "@/assets/logo.png";

export function Header() {
  const location = useLocation();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Secret Draft Secure" className="h-8 w-8" />
            <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Secret Draft Secure
            </h1>
          </Link>
          <div className="hidden md:flex items-center gap-1 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Picks Encrypted</span>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link 
            to="/dashboard" 
            className={`transition-colors ${
              location.pathname === '/dashboard' 
                ? 'text-crypto font-medium' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/leagues" 
            className={`transition-colors ${
              location.pathname === '/leagues' 
                ? 'text-crypto font-medium' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Leagues
          </Link>
          <Link 
            to="/players" 
            className={`transition-colors ${
              location.pathname === '/players' 
                ? 'text-crypto font-medium' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Players
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <WalletConnect />
        </div>
      </div>
    </header>
  );
}