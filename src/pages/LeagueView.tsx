import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Zap, Users, Trophy, Calendar, DollarSign, Eye, 
  Lock, Clock, User, Target, Award, Activity 
} from "lucide-react";
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { SecretDraftSecureABI } from "@/lib/contractABI";
import { encryptLineup, generateEncryptedLineupHash, validateLineup } from "@/lib/fheEncryption";
import { toast } from "sonner";

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual contract address

interface LeagueDetails {
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

interface Player {
  address: string;
  name: string;
  score: number;
  lineup: number[];
  isEncrypted: boolean;
}

const LeagueView = () => {
  const { id } = useParams<{ id: string }>();
  const { address, isConnected } = useAccount();
  const [league, setLeague] = useState<LeagueDetails | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const { writeContract: joinLeague, data: joinHash, isPending: isJoining, error: joinError } = useWriteContract();
  const { writeContract: draftPlayer, data: draftHash, isPending: isDrafting, error: draftError } = useWriteContract();
  const { writeContract: submitLineup, data: lineupHash, isPending: isSubmitting, error: lineupError } = useWriteContract();

  const { isLoading: isConfirmingJoin, isSuccess: isJoinConfirmed } = useWaitForTransactionReceipt({
    hash: joinHash,
  });

  const { isLoading: isConfirmingDraft, isSuccess: isDraftConfirmed } = useWaitForTransactionReceipt({
    hash: draftHash,
  });

  const { isLoading: isConfirmingLineup, isSuccess: isLineupConfirmed } = useWaitForTransactionReceipt({
    hash: lineupHash,
  });

  // Mock data for demonstration
  const mockLeague: LeagueDetails = {
    id: parseInt(id || "1"),
    name: "Sunday Showdown",
    creator: "0x1234...5678",
    entryFee: parseEther("0.025"),
    maxPlayers: 12,
    currentPlayers: 8,
    totalPrizePool: parseEther("0.2"),
    isActive: true,
    draftDeadline: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
    lineupDeadline: Math.floor(Date.now() / 1000) + 8 * 24 * 60 * 60
  };

  const mockPlayers: Player[] = [
    {
      address: "0x1234...5678",
      name: "CryptoKing",
      score: 0,
      lineup: [1, 2, 3, 4, 5],
      isEncrypted: true
    },
    {
      address: "0x8765...4321",
      name: "BlockchainBeast",
      score: 0,
      lineup: [6, 7, 8, 9, 10],
      isEncrypted: true
    },
    {
      address: "0xabcd...efgh",
      name: "DeFiDominator",
      score: 0,
      lineup: [11, 12, 13, 14, 15],
      isEncrypted: true
    }
  ];

  useEffect(() => {
    // Simulate loading league data
    setTimeout(() => {
      setLeague(mockLeague);
      setPlayers(mockPlayers);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleJoinLeague = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!league) return;

    try {
      joinLeague({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: SecretDraftSecureABI,
        functionName: 'joinLeague',
        args: [BigInt(league.id)],
        value: league.entryFee,
      });

      toast.success("Joining league... Please confirm transaction.");
    } catch (err) {
      console.error("Error joining league:", err);
      toast.error("Failed to join league. Please try again.");
    }
  };

  const handleDraftPlayer = async (playerId: number, round: number) => {
    if (!isConnected || !league) return;

    try {
      draftPlayer({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: SecretDraftSecureABI,
        functionName: 'draftPlayer',
        args: [BigInt(league.id), BigInt(playerId), BigInt(round)],
      });

      toast.success("Drafting player... Please confirm transaction.");
    } catch (err) {
      console.error("Error drafting player:", err);
      toast.error("Failed to draft player. Please try again.");
    }
  };

  const handleSubmitLineup = async () => {
    if (!isConnected || !league) return;

    try {
      // Create a sample lineup for demonstration
      const lineupData = {
        playerIds: [1, 2, 3, 4, 5],
        positions: [1, 2, 3, 4, 5],
        captain: 1,
        viceCaptain: 2
      };

      // Validate lineup
      if (!validateLineup(lineupData)) {
        toast.error("Invalid lineup data");
        return;
      }

      // Generate encrypted lineup hash
      const encryptedLineupHash = await generateEncryptedLineupHash(lineupData);
      
      // Encrypt the full lineup data
      const { encryptedData, commitment } = await encryptLineup(lineupData);

      submitLineup({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: SecretDraftSecureABI,
        functionName: 'submitLineup',
        args: [BigInt(league.id), encryptedLineupHash as `0x${string}`],
      });

      toast.success("FHE-encrypted lineup submitted! Please confirm transaction.");
      console.log("Encrypted lineup data:", { encryptedData, commitment });
    } catch (err) {
      console.error("Error submitting lineup:", err);
      toast.error("Failed to submit lineup. Please try again.");
    }
  };

  const getLeagueStatus = () => {
    if (!league) return "Loading...";
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

  const isUserInLeague = league?.creator.toLowerCase() === address?.toLowerCase();
  const canJoin = getLeagueStatus() === "Open" || getLeagueStatus() === "Almost Full";

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-crypto mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading league details...</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">League not found</h3>
              <p className="text-muted-foreground mb-4">The league you're looking for doesn't exist.</p>
              <Link to="/leagues">
                <Button variant="crypto">Back to Leagues</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* League Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link to="/leagues">
                <Button variant="outline" size="sm">← Back to Leagues</Button>
              </Link>
              <Badge variant={getStatusColor(getLeagueStatus()) as any}>
                {getLeagueStatus()}
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-2">{league.name}</h1>
            <p className="text-muted-foreground">FHE-encrypted fantasy sports league</p>
          </div>

          {/* League Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-crypto" />
                  <div>
                    <p className="text-sm text-muted-foreground">Players</p>
                    <p className="text-2xl font-bold">{league.currentPlayers}/{league.maxPlayers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <DollarSign className="h-8 w-8 text-success" />
                  <div>
                    <p className="text-sm text-muted-foreground">Prize Pool</p>
                    <p className="text-2xl font-bold">{formatEther(league.totalPrizePool)} ETH</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-8 w-8 text-warning" />
                  <div>
                    <p className="text-sm text-muted-foreground">Draft Deadline</p>
                    <p className="text-sm font-medium">
                      {new Date(league.draftDeadline * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Zap className="h-8 w-8 text-encrypted" />
                  <div>
                    <p className="text-sm text-muted-foreground">FHE Status</p>
                    <p className="text-sm font-medium text-encrypted">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 mb-8">
            {canJoin && !isUserInLeague && (
              <Button 
                variant="crypto" 
                size="lg"
                onClick={handleJoinLeague}
                disabled={isJoining || isConfirmingJoin}
              >
                {isJoining || isConfirmingJoin ? "Joining..." : `Join League (${formatEther(league.entryFee)} ETH)`}
              </Button>
            )}
            {isUserInLeague && (
              <Button variant="secondary" size="lg" disabled>
                Your League
              </Button>
            )}
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="players">Players</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="lineup">Lineup</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-crypto" />
                      League Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Entry Fee:</span>
                      <span className="font-medium">{formatEther(league.entryFee)} ETH</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Creator:</span>
                      <span className="font-mono text-sm">
                        {league.creator.slice(0, 6)}...{league.creator.slice(-4)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Draft Deadline:</span>
                      <span className="text-sm">
                        {new Date(league.draftDeadline * 1000).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lineup Deadline:</span>
                      <span className="text-sm">
                        {new Date(league.lineupDeadline * 1000).toLocaleString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-card border-border/50">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-encrypted" />
                      FHE Encryption
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-encrypted" />
                      <span className="text-sm">All player selections are encrypted</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-encrypted" />
                      <span className="text-sm">Lineups revealed at game time</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-encrypted" />
                      <span className="text-sm">Zero-knowledge verification</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="players" className="mt-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-crypto" />
                    League Participants
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {players.map((player, index) => (
                      <div key={player.address} className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 bg-crypto/20 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-crypto" />
                          </div>
                          <div>
                            <p className="font-medium">{player.name}</p>
                            <p className="text-sm text-muted-foreground font-mono">
                              {player.address.slice(0, 6)}...{player.address.slice(-4)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">Score</p>
                            <p className="font-medium">{player.score}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            {player.isEncrypted ? (
                              <Lock className="h-4 w-4 text-encrypted" />
                            ) : (
                              <Eye className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="draft" className="mt-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-crypto" />
                    Draft Room
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Draft Coming Soon</h3>
                    <p className="text-muted-foreground">
                      The draft will begin at {new Date(league.draftDeadline * 1000).toLocaleString()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lineup" className="mt-6">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-crypto" />
                    Lineup Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Lock className="h-12 w-12 text-encrypted mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Encrypted Lineup</h3>
                    <p className="text-muted-foreground mb-4">
                      Your lineup is encrypted and will be revealed at game time
                    </p>
                    <Button variant="crypto" onClick={handleSubmitLineup}>
                      Submit FHE-Encrypted Lineup
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default LeagueView;
