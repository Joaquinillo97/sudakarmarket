
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface MatchedCard {
  id: string;
  name: string;
  condition: string;
  price: number;
}

interface UserMatch {
  userId: string;
  userName: string;
  userImage: string;
  cards: MatchedCard[];
}

interface UserMatchesProps {
  matches: UserMatch[];
  onContactUser: (userId: string) => void;
}

const UserMatches = ({ matches, onContactUser }: UserMatchesProps) => {
  if (!matches || matches.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-700">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg text-green-800 dark:text-green-300">
          ¡Tienes matches! 🎉
        </CardTitle>
        <CardDescription>
          Hay usuarios que tienen cartas de tu wishlist
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {matches.map(match => (
            <div key={match.userId} className="bg-white dark:bg-black/20 p-4 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-full bg-muted overflow-hidden">
                  <img 
                    src={match.userImage} 
                    alt={match.userName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-medium">{match.userName}</h3>
                  <p className="text-sm text-muted-foreground">
                    Tiene {match.cards.length} {match.cards.length === 1 ? 'carta' : 'cartas'} de tu wishlist
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                {match.cards.map(card => (
                  <div key={card.id} className="flex justify-between items-center py-2 border-t">
                    <span className="font-medium">{card.name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">{card.condition}</span>
                      <span className="font-bold">${card.price.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="default" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => onContactUser(match.userId)}
                >
                  Contactar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserMatches;
