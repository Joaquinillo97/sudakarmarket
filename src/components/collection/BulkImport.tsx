
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const BulkImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Temporarily disable bulk import functionality
      toast({
        title: "Funcionalidad deshabilitada",
        description: "La importación masiva está temporalmente deshabilitada",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error during bulk import:', error);
      toast({
        title: "Error en la importación",
        description: "Hubo un problema al procesar el archivo",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Importación masiva
        </CardTitle>
        <CardDescription>
          Importa múltiples cartas desde un archivo CSV o Excel
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta funcionalidad está temporalmente deshabilitada mientras se actualiza el sistema.
          </AlertDescription>
        </Alert>
        
        <div className="space-y-2">
          <label htmlFor="csv-file" className="block text-sm font-medium">
            Archivo CSV/Excel
          </label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            disabled
          />
          <p className="text-xs text-muted-foreground">
            Formato requerido: Nombre, Edición, Cantidad, Estado, Idioma, Precio
          </p>
        </div>

        <Button 
          onClick={handleImport} 
          disabled={!file || isProcessing}
          className="w-full"
        >
          {isProcessing ? "Procesando..." : "Importar cartas"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default BulkImport;
