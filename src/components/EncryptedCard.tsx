import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Clock, Star } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface EncryptedCardProps {
  playerName: string;
  team: string;
  position: string;
  points?: number;
  isEncrypted: boolean;
  timeUntilReveal?: string;
  salary?: number;
}

export function EncryptedCard({ 
  playerName, 
  team, 
  position, 
  points, 
  isEncrypted, 
  timeUntilReveal,
  salary 
}: EncryptedCardProps) {
  const [isSelected, setIsSelected] = useState(false);

  return (
    <Card className={`
      bg-gradient-card border-border/50 backdrop-blur-sm transition-all duration-300 hover:shadow-card
      ${isSelected ? 'border-crypto shadow-glow' : ''}
      ${isEncrypted ? 'shadow-encrypted' : ''}
    `}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isEncrypted ? (
              <Lock className="h-4 w-4 text-encrypted animate-pulse" />
            ) : (
              <Unlock className="h-4 w-4 text-success animate-unlock" />
            )}
            <Badge variant={isEncrypted ? "secondary" : "default"} className="text-xs">
              {position}
            </Badge>
          </div>
          {salary && (
            <div className="text-sm font-medium text-crypto">
              ${salary.toLocaleString()}
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isEncrypted ? (
          <div className="space-y-3">
            <div className="h-6 bg-muted/50 rounded animate-pulse"></div>
            <div className="h-4 bg-muted/30 rounded w-2/3 animate-pulse"></div>
            
            {timeUntilReveal && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Reveals in {timeUntilReveal}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-foreground">{playerName}</h3>
            <p className="text-sm text-muted-foreground">{team}</p>
            
            {points !== undefined && (
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-warning" />
                <span className="text-sm font-medium">{points} pts</span>
              </div>
            )}
          </div>
        )}

        <Button 
          variant={isSelected ? "crypto" : "outline"}
          className="w-full"
          onClick={() => setIsSelected(!isSelected)}
        >
          {isSelected ? "Selected" : isEncrypted ? "Draft Encrypted" : "Draft Player"}
        </Button>
      </CardContent>
    </Card>
  );
}