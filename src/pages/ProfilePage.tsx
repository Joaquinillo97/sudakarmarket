
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import CardGrid from "@/components/cards/CardGrid";
import { ImportIcon, PlusIcon, StarIcon, Loader } from "lucide-react";

const ProfilePage = () => {
  const [activeTab, setActiveTab] = useState("inventory");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTab, setEditTab] = useState("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingRecovery, setIsProcessingRecovery] = useState(false);
  
  // Profile form state
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
  });
  
  // Password form state
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const { user, isAuthenticated, isLoading: authLoading, updateProfile, updatePassword } = useAuth();
  const { toast } = useToast();
  const location = useLocation();

  // Check for password recovery tokens in URL
  useEffect(() => {
    const hashParams = new URLSearchParams(location.hash.substring(1));
    
    console.log("Checking URL hash params:", Object.fromEntries(hashParams));
    
    // Check for errors in the hash (expired tokens, etc.)
    const error = hashParams.get('error');
    const errorCode = hashParams.get('error_code');
    
    if (error && errorCode === 'otp_expired') {
      toast({
        title: "Enlace expirado",
        description: "El enlace de recuperación ha expirado. Solicita uno nuevo.",
        variant: "destructive",
      });
      return;
    }
    
    // Check for Supabase recovery tokens in hash
    const recoveryType = hashParams.get('type');
    const accessToken = hashParams.get('access_token');
    
    console.log("Recovery check:", { recoveryType, hasAccessToken: !!accessToken });
    
    if (recoveryType === 'recovery' && accessToken) {
      console.log('Recovery tokens detected, processing...');
      setIsProcessingRecovery(true);
      
      // Process the recovery session automatically
      const processRecoverySession = async () => {
        try {
          // First, try to get the session which should be established by Supabase
          const { data: { session }, error } = await supabase.auth.getSession();
          
          console.log("Session check:", { hasSession: !!session, error });
          
          if (error) {
            console.error('Error getting recovery session:', error);
            toast({
              title: "Error de recuperación",
              description: "No se pudo procesar el enlace de recuperación.",
              variant: "destructive",
            });
          } else if (session) {
            console.log('Recovery session established successfully');
            // Open modal with password tab immediately
            setIsEditModalOpen(true);
            setEditTab("password");
            toast({
              title: "Cambiar contraseña",
              description: "Ingresa tu nueva contraseña para completar la recuperación.",
            });
          } else {
            console.log('No session found, trying to establish one...');
            // If no session, the tokens might need to be processed
            toast({
              title: "Procesando...",
              description: "Estableciendo sesión de recuperación...",
            });
            
            // Wait a bit and try again
            setTimeout(async () => {
              const { data: { session: retrySession } } = await supabase.auth.getSession();
              if (retrySession) {
                setIsEditModalOpen(true);
                setEditTab("password");
                toast({
                  title: "Cambiar contraseña",
                  description: "Ingresa tu nueva contraseña para completar la recuperación.",
                });
              } else {
                toast({
                  title: "Error",
                  description: "No se pudo establecer la sesión de recuperación.",
                  variant: "destructive",
                });
              }
            }, 2000);
          }
        } catch (error) {
          console.error('Error processing recovery session:', error);
          toast({
            title: "Error",
            description: "Ocurrió un error al procesar la recuperación.",
            variant: "destructive",
          });
        } finally {
          setIsProcessingRecovery(false);
        }
      };
      
      processRecoverySession();
    }
  }, [location.hash, toast]);

  // Update profile form when user data changes
  useEffect(() => {
    if (user) {
      setProfileForm({
        username: user.username || "",
        email: user.email || "",
      });
    }
  }, [user]);

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await updateProfile({
        username: profileForm.username,
        email: profileForm.email,
      });
      setIsEditModalOpen(false);
      toast({
        title: "Perfil actualizado",
        description: "Tu perfil se ha actualizado correctamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar el perfil",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle password update
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }
      if (passwordForm.newPassword.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }

      await updatePassword(passwordForm.newPassword);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña se ha actualizado correctamente.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al actualizar la contraseña",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Edit Profile Modal Component
  const EditProfileModal = () => (
    <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Editar perfil
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar perfil</DialogTitle>
          <DialogDescription>
            Actualiza tu información personal y configuración de seguridad.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={editTab} onValueChange={setEditTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Información</TabsTrigger>
            <TabsTrigger value="password">Contraseña</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="space-y-4">
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  type="text"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                  placeholder="Tu nombre de usuario"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={profileForm.email}
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  placeholder="tu@email.com"
                  disabled={isSubmitting}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar cambios
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="password" className="space-y-4">
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva contraseña</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  required
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
                  Actualizar contraseña
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );

  // Fetch user's inventory
  const { data: inventory = [], isLoading: inventoryLoading } = useQuery({
    queryKey: ['userInventory', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_inventory')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      return data.map((item) => ({
        id: item.id,
        name: `Carta ${item.card_id}`, // Placeholder name since we don't have card details
        set: 'Set desconocido',
        imageUrl: '',
        price: item.price,
        seller: { 
          id: user.id, 
          name: user.username || 'Mi colección',
          rating: 5.0
        },
        condition: item.condition,
        language: item.language,
        quantity: item.quantity,
        color: "colorless", // Default color
      }));
    },
    enabled: !!user?.id && isAuthenticated
  });

  // Fetch user's wishlist
  const { data: wishlist = [], isLoading: wishlistLoading } = useQuery({
    queryKey: ['userWishlist', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      return data.map((item) => ({
        id: item.id,
        name: `Carta ${item.card_id}`, // Placeholder name since we don't have card details
        set: 'Set desconocido',
        imageUrl: '',
        price: 0, // Wishlist items don't have prices
        seller: { 
          id: user.id, 
          name: user.username || 'Mi wishlist',
          rating: 5.0
        },
        condition: "NM",
        language: "Inglés",
        color: "colorless", // Default color
      }));
    },
    enabled: !!user?.id && isAuthenticated
  });

  if (authLoading || isProcessingRecovery) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>{isProcessingRecovery ? "Procesando recuperación..." : "Cargando..."}</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <p>Debes iniciar sesión para ver tu perfil</p>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_3fr] gap-8">
          {/* Profile sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="text-center">
                <Avatar className="h-24 w-24 mx-auto mb-4">
                  <AvatarImage src={user.avatar_url} alt={user.username} />
                  <AvatarFallback>{user.username?.charAt(0) || user.email.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{user.username || 'Usuario sin nombre'}</CardTitle>
                <CardDescription className="flex flex-col items-center gap-2">
                  <span>@{user.username || 'usuario'}</span>
                  <Badge variant="outline">Argentina</Badge>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rating</span>
                  <span className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-500 mr-1 inline" />
                    5.0/5
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transacciones</span>
                  <span>0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Miembro desde</span>
                  <span>2024</span>
                </div>
                <Separator />
                <div className="pt-2">
                  <EditProfileModal />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Main content area */}
          <div>
            <Tabs defaultValue="inventory" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="inventory">Inventario</TabsTrigger>
                  <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
                </TabsList>
                
                <div className="flex gap-2">
                  {activeTab === "inventory" && (
                    <>
                      <Button variant="outline" size="sm">
                        <ImportIcon className="h-4 w-4 mr-1" />
                        Importar de Moxfield
                      </Button>
                      <Button size="sm">
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Agregar carta
                      </Button>
                    </>
                  )}
                  {activeTab === "wishlist" && (
                    <Button size="sm">
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Agregar a wishlist
                    </Button>
                  )}
                </div>
              </div>
              
              <TabsContent value="inventory" className="mt-0">
                <h2 className="text-xl font-semibold mb-4">Mi inventario</h2>
                {inventoryLoading ? (
                  <p>Cargando inventario...</p>
                ) : inventory.length > 0 ? (
                  <CardGrid cards={inventory} />
                ) : (
                  <Card className="bg-muted">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground text-center mb-4">
                        No tienes cartas en tu inventario todavía
                      </p>
                      <Button>
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Agregar carta
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="wishlist" className="mt-0">
                <h2 className="text-xl font-semibold mb-4">Mi wishlist</h2>
                {wishlistLoading ? (
                  <p>Cargando wishlist...</p>
                ) : wishlist.length > 0 ? (
                  <CardGrid cards={wishlist} />
                ) : (
                  <Card className="bg-muted">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <p className="text-muted-foreground text-center mb-4">
                        No tienes cartas en tu wishlist todavía
                      </p>
                      <Button>
                        <PlusIcon className="h-4 w-4 mr-1" />
                        Agregar carta a wishlist
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
