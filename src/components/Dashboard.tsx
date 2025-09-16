import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EncryptedCard } from "@/components/EncryptedCard";
import { Shield, Trophy, Users, Clock, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockPlayers = [
  {
    playerName: "Patrick Mahomes",
    team: "KC Chiefs",
    position: "QB",
    points: 24.6,
    isEncrypted: false,
    salary: 8500
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
  }
];

const activeLeagues = [
  {
    name: "Sunday Showdown",
    players: 12,
    prizePool: "$1,500",
    status: "Live",
    encrypted: 8
  },
  {
    name: "Crypto Cup Elite",
    players: 50,
    prizePool: "$10,000",
    status: "Draft",
    encrypted: 45
  }
];

export function Dashboard() {
  return (
    <section className="py-12 px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Dashboard Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Fantasy Dashboard</h2>
          <p className="text-muted-foreground">Manage your encrypted lineups and track performance</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Leagues</CardTitle>
              <Users className="h-4 w-4 text-crypto" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-crypto">3</div>
              <p className="text-xs text-muted-foreground">+2 from last week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Encrypted Picks</CardTitle>
              <Shield className="h-4 w-4 text-encrypted" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-encrypted">24</div>
              <p className="text-xs text-muted-foreground">Awaiting reveal</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Winnings</CardTitle>
              <Trophy className="h-4 w-4 text-success" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-success">$2,847</div>
              <p className="text-xs text-muted-foreground">+$320 this week</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Next Reveal</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">2h 15m</div>
              <p className="text-xs text-muted-foreground">Sunday games</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Available Players */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Available Players</h3>
              <Button variant="crypto" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Lineup
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mockPlayers.map((player, index) => (
                <EncryptedCard key={index} {...player} />
              ))}
            </div>
          </div>

          {/* Active Leagues */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Active Leagues</h3>
            <div className="space-y-4">
              {activeLeagues.map((league, index) => (
                <Card key={index} className="bg-gradient-card border-border/50">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{league.name}</CardTitle>
                      <Badge variant={league.status === "Live" ? "default" : "secondary"}>
                        {league.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Players:</span>
                      <span>{league.players}</span>
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
                    <Button variant="outline" className="w-full mt-3">
                      View League
                    </Button>
                  </CardContent>
                </Card>
              ))}

              <Button variant="encrypted" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Join New League
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}