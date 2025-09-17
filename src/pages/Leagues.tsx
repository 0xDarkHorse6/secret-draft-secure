import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Users, Trophy, Plus, Search, Eye, Calendar, DollarSign } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { SecretDraftSecureABI } from "@/lib/contractABI";
import { encryptPlayerSelection } from "@/lib/fheEncryption";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual contract address

interface League {
  id: number;
  name: string;
  creator: string;
  entryFee: bigint;
  maxPlayers: number;
  currentPlayers: number;
  totalPrizePool: bigint;
  isActive: boolean;
  draftDeadline: number;
  lineupDeadline: number;
}

const Leagues = () => {
  const { address, isConnected } = useAccount();
  const [searchTerm, setSearchTerm] = useState("");
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - replace with actual contract calls
  const mockLeagues: League[] = [
    {
      id: 1,
      name: "Sunday Showdown",
      creator: "0x1234...5678",
      entryFee: parseEther("0.025"),
      maxPlayers: 12,
      currentPlayers: 8,
      totalPrizePool: parseEther("0.2"),
      isActive: true,
      draftDeadline: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
      lineupDeadline: Math.floor(Date.now() / 1000) + 8 * 24 * 60 * 60
    },
    {
      id: 2,
      name: "Crypto Cup Elite",
      creator: "0x8765...4321",
      entryFee: parseEther("0.2"),
      maxPlayers: 50,
      currentPlayers: 45,
      totalPrizePool: parseEther("9.0"),
      isActive: true,
      draftDeadline: Math.floor(Date.now() / 1000) + 3 * 24 * 60 * 60,
      lineupDeadline: Math.floor(Date.now() / 1000) + 4 * 24 * 60 * 60
    },
    {
      id: 3,
      name: "Weekend Warriors",
      creator: "0xabcd...efgh",
      entryFee: parseEther("0.015"),
      maxPlayers: 20,
      currentPlayers: 8,
      totalPrizePool: parseEther("0.12"),
      isActive: true,
      draftDeadline: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60,
      lineupDeadline: Math.floor(Date.now() / 1000) + 6 * 24 * 60 * 60
    }
  ];

  const { writeContract: joinLeague, data: joinHash, isPending: isJoining, error: joinError } = useWriteContract();
  
  const { isLoading: isConfirmingJoin, isSuccess: isJoinConfirmed } = useWaitForTransactionReceipt({
    hash: joinHash,
  });

  useEffect(() => {
    // Simulate loading leagues from contract
    setTimeout(() => {
      setLeagues(mockLeagues);
      setLoading(false);
    }, 1000);
  }, []);

  const handleJoinLeague = async (leagueId: number, entryFee: bigint) => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    try {
      // Encrypt join request data
      const joinData = {
        leagueId,
        userAddress: address,
        timestamp: Date.now(),
        entryFee: entryFee.toString()
      };
      
      const encryptedJoinData = await encryptPlayerSelection(leagueId, 0);
      console.log("Encrypted join data:", encryptedJoinData);

      joinLeague({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: SecretDraftSecureABI,
        functionName: 'joinLeague',
        args: [BigInt(leagueId)],
        value: entryFee,
      });

      toast.success("FHE-encrypted join request submitted! Please confirm transaction.");
    } catch (err) {
      console.error("Error joining league:", err);
      toast.error("Failed to join league. Please try again.");
    }
  };

  const getLeagueStatus = (league: League) => {
    const now = Math.floor(Date.now() / 1000);
    if (league.currentPlayers >= league.maxPlayers) return "Full";
    if (now > league.draftDeadline) return "Draft Closed";
    if (now > league.lineupDeadline) return "Lineup Closed";
    if (league.currentPlayers >= league.maxPlayers * 0.8) return "Almost Full";
    return "Open";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "secondary";
      case "Almost Full": return "default";
      case "Full": return "destructive";
      case "Draft Closed": return "outline";
      case "Lineup Closed": return "outline";
      default: return "secondary";
    }
  };

  const filteredLeagues = leagues.filter(league =>
    league.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Show success message when join transaction is confirmed
  if (isJoinConfirmed) {
    toast.success("Successfully joined the league!");
  }

  // Show error message if join transaction fails
  if (joinError) {
    toast.error(`Failed to join league: ${joinError.message}`);
  }
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Leagues</h1>
              <p className="text-muted-foreground">Join FHE-encrypted fantasy leagues and compete with others</p>
            </div>
            <Link to="/create-league">
              <Button variant="crypto" className="gap-2">
                <Plus className="h-4 w-4" />
                Create League
              </Button>
            </Link>
          </div>

          <div className="flex gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search leagues..." 
                className="pl-10 bg-card border-border/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline">Filter</Button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading leagues...</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredLeagues.map((league) => {
                const status = getLeagueStatus(league);
                const isUserInLeague = league.creator.toLowerCase() === address?.toLowerCase();
                const canJoin = status === "Open" || status === "Almost Full";
                
                return (
                  <Card key={league.id} className="bg-gradient-card border-border/50 hover:border-crypto/50 transition-colors">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl mb-2">{league.name}</CardTitle>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">Fantasy Sports</Badge>
                            <div className="flex items-center gap-1">
                              <Zap className="h-3 w-3 text-encrypted" />
                              <span className="text-xs text-encrypted">FHE</span>
                            </div>
                          </div>
                        </div>
                        <Badge variant={getStatusColor(status) as any}>
                          {status}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Players:</span>
                        <span>{league.currentPlayers}/{league.maxPlayers}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Entry Fee:</span>
                        <span className="text-warning font-medium">{formatEther(league.entryFee)} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Prize Pool:</span>
                        <span className="text-success font-medium">{formatEther(league.totalPrizePool)} ETH</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Draft Deadline:</span>
                        <span className="text-xs">
                          {new Date(league.draftDeadline * 1000).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Creator:</span>
                        <span className="text-xs font-mono">
                          {league.creator.slice(0, 6)}...{league.creator.slice(-4)}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link to={`/league/${league.id}`} className="flex-1">
                          <Button variant="outline" className="w-full gap-2">
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </Link>
                        {canJoin && !isUserInLeague && (
                          <Button 
                            variant="crypto" 
                            className="flex-1"
                            onClick={() => handleJoinLeague(league.id, league.entryFee)}
                            disabled={isJoining || isConfirmingJoin}
                          >
                            {isJoining || isConfirmingJoin ? "Joining..." : "Join League"}
                          </Button>
                        )}
                        {isUserInLeague && (
                          <Button variant="secondary" className="flex-1" disabled>
                            Your League
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {!loading && filteredLeagues.length === 0 && (
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No leagues found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search terms" : "Be the first to create a league!"}
              </p>
              <Link to="/create-league">
                <Button variant="crypto">Create League</Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Leagues;