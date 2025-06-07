
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import ManualCardEntry from "@/components/collection/ManualCardEntry";
import BulkImport from "@/components/collection/BulkImport";
import CollectionView from "@/components/collection/CollectionView";
import PageHeader from "@/components/layout/PageHeader";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { PlusCircle, FileUp } from "lucide-react";

const CollectionPage = () => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState("view");
  
  // Mock function to simulate successful card addition
  const handleCardAddSuccess = () => {
    toast({
      title: "¡Carta agregada!",
      description: "La carta ha sido añadida a tu colección.",
      duration: 3000,
    });
    setActiveTab("view");
  };

  // Mock function to simulate successful bulk import
  const handleBulkImportSuccess = () => {
    toast({
      title: "¡Tu bulk fue cargado con éxito!",
      description: "Ya estás más cerca de hacer un trade 😎",
      duration: 5000,
    });
    setActiveTab("view");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="container px-4 py-6 md:py-8 max-w-7xl mx-auto flex-1">
        <PageHeader
          title="Mi Colección"
          description="Gestiona tus cartas y publícalas para venta o intercambio"
        />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="view">Ver Colección</TabsTrigger>
              <TabsTrigger value="add">Agregar Carta</TabsTrigger>
              <TabsTrigger value="import">Importar Bulk</TabsTrigger>
            </TabsList>
            
            {activeTab === "view" && (
              <div className="flex gap-2">
                <Button 
                  variant="default" 
                  size={isMobile ? "sm" : "default"}
                  onClick={() => setActiveTab("add")}
                  className="whitespace-nowrap"
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  {isMobile ? "Cargar" : "Cargar carta"}
                </Button>
                <Button 
                  variant="outline" 
                  size={isMobile ? "sm" : "default"}
                  onClick={() => setActiveTab("import")}
                  className="whitespace-nowrap"
                >
                  <FileUp className="mr-2 h-4 w-4" />
                  {isMobile ? "Importar" : "Importar bulk"}
                </Button>
              </div>
            )}
          </div>
      
          <TabsContent value="view" className="mt-0">
            <CollectionView />
          </TabsContent>
      
          <TabsContent value="add" className="mt-0">
            <ManualCardEntry />
          </TabsContent>
      
          <TabsContent value="import" className="mt-0">
            <BulkImport />
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default CollectionPage;
