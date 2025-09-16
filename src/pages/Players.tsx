import { Header } from "@/components/Header";
import { EncryptedCard } from "@/components/EncryptedCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, SortAsc } from "lucide-react";

const allPlayers = [
  {
    playerName: "Patrick Mahomes",
    team: "KC Chiefs",
    position: "QB",
    points: 24.6,
    isEncrypted: false,
    salary: 8500
  },
  {
    playerName: "Josh Allen",
    team: "Buffalo Bills",
    position: "QB",
    points: 23.2,
    isEncrypted: false,
    salary: 8300
  },
  {
    playerName: "████████████",
    team: "███████",
    position: "RB",
    isEncrypted: true,
    timeUntilReveal: "2h 15m",
    salary: 7200
  },
  {
    playerName: "████████████",
    team: "███████",
    position: "WR",
    isEncrypted: true,
    timeUntilReveal: "2h 15m",
    salary: 6800
  },
  {
    playerName: "Travis Kelce",
    team: "KC Chiefs",
    position: "TE",
    points: 18.3,
    isEncrypted: false,
    salary: 7500
  },
  {
    playerName: "Tyreek Hill",
    team: "Miami Dolphins",
    position: "WR",
    points: 20.1,
    isEncrypted: false,
    salary: 7800
  },
  {
    playerName: "████████████",
    team: "███████",
    position: "RB",
    isEncrypted: true,
    timeUntilReveal: "1h 45m",
    salary: 6500
  },
  {
    playerName: "████████████",
    team: "███████",
    position: "WR",
    isEncrypted: true,
    timeUntilReveal: "1h 45m",
    salary: 5900
  }
];

const positions = ["All", "QB", "RB", "WR", "TE", "K", "DEF"];

const Players = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Player Pool</h1>
            <p className="text-muted-foreground">Browse and analyze available players for your lineup</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search players..." 
                className="pl-10 bg-card border-border/50"
              />
            </div>
            <div className="flex gap-2">
              {positions.map((position) => (
                <Badge 
                  key={position} 
                  variant={position === "All" ? "default" : "outline"}
                  className="cursor-pointer hover:bg-crypto/20"
                >
                  {position}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {allPlayers.map((player, index) => (
              <EncryptedCard key={index} {...player} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Players;