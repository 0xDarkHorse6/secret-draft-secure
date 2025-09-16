import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Users, Trophy, Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const leagues = [
  {
    id: 1,
    name: "Sunday Showdown",
    players: 12,
    maxPlayers: 12,
    prizePool: "$1,500",
    entryFee: "$25",
    status: "Live",
    encrypted: 8,
    sport: "NFL"
  },
  {
    id: 2,
    name: "Crypto Cup Elite",
    players: 45,
    maxPlayers: 50,
    prizePool: "$10,000",
    entryFee: "$200",
    status: "Draft",
    encrypted: 45,
    sport: "NFL"
  },
  {
    id: 3,
    name: "Weekend Warriors",
    players: 8,
    maxPlayers: 20,
    prizePool: "$500",
    entryFee: "$15",
    status: "Open",
    encrypted: 6,
    sport: "NBA"
  }
];

const Leagues = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Leagues</h1>
              <p className="text-muted-foreground">Join encrypted fantasy leagues and compete with others</p>
            </div>
            <Button variant="crypto" className="gap-2">
              <Plus className="h-4 w-4" />
              Create League
            </Button>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search leagues..." 
                className="pl-10 bg-card border-border/50"
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {leagues.map((league) => (
              <Card key={league.id} className="bg-gradient-card border-border/50 hover:border-crypto/50 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{league.name}</CardTitle>
                      <Badge variant="secondary" className="mb-2">{league.sport}</Badge>
                    </div>
                    <Badge variant={league.status === "Live" ? "default" : league.status === "Open" ? "secondary" : "outline"}>
                      {league.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Players:</span>
                    <span>{league.players}/{league.maxPlayers}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Entry Fee:</span>
                    <span className="text-warning font-medium">{league.entryFee}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Prize Pool:</span>
                    <span className="text-success font-medium">{league.prizePool}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Encrypted:</span>
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-encrypted" />
                      <span className="text-encrypted">{league.encrypted}</span>
                    </div>
                  </div>
                  <Button 
                    variant={league.status === "Open" ? "crypto" : "outline"} 
                    className="w-full"
                  >
                    {league.status === "Open" ? "Join League" : "View League"}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Leagues;