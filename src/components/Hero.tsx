import { Button } from "@/components/ui/button";
import { Zap, Lock, Eye, Users } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-fantasy.jpg";

export function Hero() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero/90"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-card/20 backdrop-blur-sm border border-crypto/30 rounded-full px-4 py-2 mb-6">
            <Zap className="h-4 w-4 text-crypto" />
            <span className="text-sm text-muted-foreground">FHE-Powered Fantasy Sports</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Draft Your Team
            </span>
            <br />
            <span className="text-foreground">in Secret</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Revolutionary fantasy sports where your picks stay encrypted until game day. 
            No more lineup copying, just pure strategy and skill.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm border border-encrypted/30 rounded-full px-4 py-2">
              <Lock className="h-4 w-4 text-encrypted" />
              <span className="text-sm">Encrypted Picks</span>
            </div>
            <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm border border-crypto/30 rounded-full px-4 py-2">
              <Eye className="h-4 w-4 text-crypto" />
              <span className="text-sm">Zero Copy Protection</span>
            </div>
            <div className="flex items-center gap-2 bg-card/30 backdrop-blur-sm border border-success/30 rounded-full px-4 py-2">
              <Users className="h-4 w-4 text-success" />
              <span className="text-sm">Decentralized Leagues</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/create-league">
              <Button variant="hero" size="lg" className="text-lg px-8 py-6">
                Create League
              </Button>
            </Link>
            <Link to="/leagues">
              <Button variant="crypto" size="lg" className="text-lg px-8 py-6">
                Join Existing League
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-md mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-crypto">256</div>
              <div className="text-sm text-muted-foreground">Bit Encryption</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-encrypted">1,247</div>
              <div className="text-sm text-muted-foreground">Active Players</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">$2.1M</div>
              <div className="text-sm text-muted-foreground">Total Prizes</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}