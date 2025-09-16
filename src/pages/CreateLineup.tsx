import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EncryptedCard } from "@/components/EncryptedCard";
import { Shield, DollarSign, Users, Clock, Plus, Minus } from "lucide-react";

const positions = [
  { name: "QB", slots: 1, filled: 0 },
  { name: "RB", slots: 2, filled: 1 },
  { name: "WR", slots: 3, filled: 2 },
  { name: "TE", slots: 1, filled: 1 },
  { name: "FLEX", slots: 1, filled: 0 },
  { name: "K", slots: 1, filled: 0 },
  { name: "DEF", slots: 1, filled: 0 }
];

const selectedPlayers = [
  {
    playerName: "Derrick Henry",
    team: "Tennessee Titans",
    position: "RB",
    points: 22.4,
    isEncrypted: false,
    salary: 7800
  },
  {
    playerName: "Cooper Kupp",
    team: "LA Rams",
    position: "WR",
    points: 19.6,
    isEncrypted: false,
    salary: 8200
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

const CreateLineup = () => {
  const totalSalary = selectedPlayers.reduce((sum, player) => sum + player.salary, 0);
  const remainingSalary = 50000 - totalSalary;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Lineup</h1>
            <p className="text-muted-foreground">Build your encrypted fantasy lineup within salary cap</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Lineup Builder */}
            <div className="lg:col-span-2">
              <Card className="bg-gradient-card border-border/50 mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-crypto" />
                      Lineup Positions
                    </span>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Shield className="h-3 w-3 text-encrypted" />
                      {selectedPlayers.filter(p => p.isEncrypted).length} Encrypted
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {positions.map((position) => (
                      <div 
                        key={position.name}
                        className="border border-border/50 rounded-lg p-4 bg-background/50"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold">{position.name}</h3>
                          <Badge variant={position.filled === position.slots ? "default" : "outline"}>
                            {position.filled}/{position.slots}
                          </Badge>
                        </div>
                        <div className="space-y-2">
                          {Array.from({ length: position.slots }, (_, i) => (
                            <div 
                              key={i}
                              className="border border-dashed border-border/50 rounded p-3 text-center text-sm text-muted-foreground hover:border-crypto/50 transition-colors cursor-pointer"
                            >
                              {i < position.filled ? (
                                <span className="text-crypto">Player Selected</span>
                              ) : (
                                <span>+ Add {position.name}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle>Selected Players</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPlayers.map((player, index) => (
                      <div key={index} className="relative">
                        <EncryptedCard {...player} />
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="absolute top-2 right-2 bg-background/80"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Salary Cap */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-success" />
                    Salary Cap
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Used:</span>
                    <span className="font-semibold">${totalSalary.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Remaining:</span>
                    <span className={`font-semibold ${remainingSalary < 0 ? 'text-destructive' : 'text-success'}`}>
                      ${remainingSalary.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border/50 pt-2">
                    <span className="text-muted-foreground">Total Cap:</span>
                    <span className="font-semibold">$50,000</span>
                  </div>
                  <div className="w-full bg-background rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        totalSalary > 50000 ? 'bg-destructive' : 'bg-success'
                      }`}
                      style={{ width: `${Math.min((totalSalary / 50000) * 100, 100)}%` }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Encryption Settings */}
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-encrypted" />
                    Encryption Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Encrypted Picks:</span>
                    <span className="text-encrypted font-semibold">
                      {selectedPlayers.filter(p => p.isEncrypted).length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Public Picks:</span>
                    <span className="font-semibold">
                      {selectedPlayers.filter(p => !p.isEncrypted).length}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-warning" />
                    <span className="text-muted-foreground">Reveals in: 2h 15m</span>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Lineup */}
              <Card className="bg-gradient-card border-border/50">
                <CardContent className="pt-6">
                  <Button 
                    variant="crypto" 
                    className="w-full mb-3"
                    disabled={selectedPlayers.length < 9 || remainingSalary < 0}
                  >
                    Submit Lineup
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save Draft
                  </Button>
                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    Lineup will be encrypted until game start
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateLineup;