
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

interface MatchedCard {
  id: string;
  name: string;
  condition: string;
  price: number;
  card_id: string;
}

interface UserMatch {
  userId: string;
  userName: string;
  userImage: string;
  cards: MatchedCard[];
}

interface UserMatchesProps {
  matches: UserMatch[];
  isLoading?: boolean;
}

const UserMatches = ({ matches, isLoading = false }: UserMatchesProps) => {
  const { toast } = useToast();

  const handleContactUser = (userId: string, userName: string) => {
    // For now, just show a toast. Later this could open a chat or contact modal
    toast({
      title: "Contactar usuario",
      description: `Funcionalidad de contacto con ${userName} próximamente disponible`,
      duration: 3000,
    });
  };

  if (isLoading) {
    return (
      <Card className="mb-8 bg-muted/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">
            Buscando matches...
          </CardTitle>
          <CardDescription>
            Verificando si hay usuarios con cartas de tu wishlist
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white dark:bg-black/20 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-full bg-muted"></div>
                  <div className="space-y-2">
                    <div className="h-4 w-24 bg-muted rounded"></div>
                    <div className="h-3 w-32 bg-muted rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-8 w-full bg-muted rounded"></div>
                  <div className="h-8 w-full bg-muted rounded"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

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
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://avatar.vercel.sh/${match.userName}`;
                    }}
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
                  onClick={() => handleContactUser(match.userId, match.userName)}
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
