import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Zap, Users, Trophy, Calendar } from "lucide-react";
import { useState } from "react";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";
import { SecretDraftSecureABI } from "@/lib/contractABI";
import { encryptData, generateFHEPublicKey } from "@/lib/fheEncryption";
import { toast } from "sonner";

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // Replace with actual contract address

const CreateLeague = () => {
  const { address, isConnected } = useAccount();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sport: "",
    maxPlayers: "",
    entryFee: "",
    draftDate: "",
    encryptPicks: true,
    lateSwap: false
  });

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleCreateLeague = async () => {
    if (!isConnected) {
      toast.error("Please connect your wallet first");
      return;
    }

    if (!formData.name || !formData.entryFee || !formData.maxPlayers) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      // Generate FHE public key for encryption
      const fhePublicKey = generateFHEPublicKey();
      
      // Encrypt league settings
      const leagueSettings = {
        name: formData.name,
        description: formData.description,
        sport: formData.sport,
        encryptPicks: formData.encryptPicks,
        lateSwap: formData.lateSwap,
        fhePublicKey
      };
      
      const encryptedSettings = await encryptData(leagueSettings);
      
      const entryFeeWei = parseEther(formData.entryFee);
      const draftDeadline = Math.floor(new Date(formData.draftDate || Date.now() + 7 * 24 * 60 * 60 * 1000).getTime() / 1000);
      const lineupDeadline = draftDeadline + 24 * 60 * 60; // 24 hours after draft

      writeContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: SecretDraftSecureABI,
        functionName: 'createLeague',
        args: [
          formData.name,
          entryFeeWei,
          BigInt(formData.maxPlayers),
          BigInt(draftDeadline),
          BigInt(lineupDeadline)
        ],
        value: entryFeeWei,
      });

      toast.success("FHE-encrypted league created! Transaction submitted for confirmation.");
      console.log("Encrypted league settings:", encryptedSettings);
    } catch (err) {
      console.error("Error creating league:", err);
      toast.error("Failed to create league. Please try again.");
    }
  };

  // Show success message when transaction is confirmed
  if (isConfirmed) {
    toast.success("League created successfully!");
  }

  // Show error message if transaction fails
  if (error) {
    toast.error(`Transaction failed: ${error.message}`);
  }
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New League</h1>
            <p className="text-muted-foreground">Set up your encrypted fantasy league with custom rules</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-crypto" />
                    League Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="league-name">League Name *</Label>
                    <Input 
                      id="league-name" 
                      placeholder="Enter league name"
                      className="bg-background border-border/50"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea 
                      id="description" 
                      placeholder="Describe your league..."
                      className="bg-background border-border/50"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="sport">Sport</Label>
                      <Select value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                        <SelectTrigger className="bg-background border-border/50">
                          <SelectValue placeholder="Select sport" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nfl">NFL</SelectItem>
                          <SelectItem value="nba">NBA</SelectItem>
                          <SelectItem value="mlb">MLB</SelectItem>
                          <SelectItem value="nhl">NHL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="max-players">Max Players *</Label>
                      <Select value={formData.maxPlayers} onValueChange={(value) => handleInputChange("maxPlayers", value)}>
                        <SelectTrigger className="bg-background border-border/50">
                          <SelectValue placeholder="Select max players" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 Players</SelectItem>
                          <SelectItem value="10">10 Players</SelectItem>
                          <SelectItem value="12">12 Players</SelectItem>
                          <SelectItem value="20">20 Players</SelectItem>
                          <SelectItem value="50">50 Players</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="entry-fee">Entry Fee (ETH) *</Label>
                      <Input 
                        id="entry-fee" 
                        type="number"
                        step="0.001"
                        placeholder="0.025"
                        className="bg-background border-border/50"
                        value={formData.entryFee}
                        onChange={(e) => handleInputChange("entryFee", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="draft-date">Draft Date</Label>
                      <Input 
                        id="draft-date" 
                        type="datetime-local"
                        className="bg-background border-border/50"
                        value={formData.draftDate}
                        onChange={(e) => handleInputChange("draftDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-encrypted" />
                      FHE Settings
                    </h3>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="encrypt-picks">Encrypt All Picks</Label>
                        <p className="text-sm text-muted-foreground">Hide player selections until game start</p>
                      </div>
                      <Switch 
                        id="encrypt-picks" 
                        checked={formData.encryptPicks}
                        onCheckedChange={(checked) => handleInputChange("encryptPicks", checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="late-swap">Allow Late Swaps</Label>
                        <p className="text-sm text-muted-foreground">Enable lineup changes after encryption</p>
                      </div>
                      <Switch 
                        id="late-swap" 
                        checked={formData.lateSwap}
                        onCheckedChange={(checked) => handleInputChange("lateSwap", checked)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="bg-gradient-card border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-crypto" />
                    League Preview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-crypto/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Trophy className="h-8 w-8 text-crypto" />
                    </div>
                    <h3 className="font-semibold mb-2">Your League Name</h3>
                    <p className="text-sm text-muted-foreground">Preview will appear here</p>
                  </div>

                  <div className="space-y-3 border-t border-border/50 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Sport:</span>
                      <span>Not selected</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Max Players:</span>
                      <span>Not selected</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Entry Fee:</span>
                      <span className="text-success">$0.00</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">FHE:</span>
                      <div className="flex items-center gap-1">
                        <Zap className="h-3 w-3 text-encrypted" />
                        <span className="text-encrypted">Enabled</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    variant="crypto" 
                    className="w-full mt-6"
                    onClick={handleCreateLeague}
                    disabled={isPending || isConfirming}
                  >
                    {isPending || isConfirming ? "Creating..." : "Create League"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateLeague;