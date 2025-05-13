
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Loader2, FileText, FileSpreadsheet, Upload, Check } from "lucide-react";

interface BulkImportProps {
  onSuccess: () => void;
}

// Mock data for sample cards
const SAMPLE_IMPORT_DATA = [
  { name: "Lightning Bolt", set: "Beta", quantity: 2, condition: "LP", language: "Inglés", price: 25000 },
  { name: "Sol Ring", set: "Commander 2021", quantity: 1, condition: "NM", language: "Español", price: 3500 },
  { name: "Birds of Paradise", set: "Fourth Edition", quantity: 4, condition: "MP", language: "Inglés", price: 8000 },
  { name: "Counterspell", set: "Tempest", quantity: 3, condition: "EX", language: "Inglés", price: 1200 },
  { name: "Llanowar Elves", set: "Alpha", quantity: 1, condition: "HP", language: "Inglés", price: 15000 },
];

const BulkImport = ({ onSuccess }: BulkImportProps) => {
  const [importStep, setImportStep] = useState<"upload" | "review" | "processing">("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"csv" | "txt" | "xlsx" | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [importedData, setImportedData] = useState(SAMPLE_IMPORT_DATA);
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      setSelectedFile(file);
      // Determine file type
      if (file.name.endsWith(".csv")) {
        setFileType("csv");
      } else if (file.name.endsWith(".txt")) {
        setFileType("txt");
      } else if (file.name.endsWith(".xlsx")) {
        setFileType("xlsx");
      }
      
      // In a real app, we'd parse the file here
      // For now, we'll just use the mock data
      setImportStep("review");
    }
  };
  
  const handleImport = () => {
    setImportStep("processing");
    
    // Simulate processing delay
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };
  
  // Render different content based on current step
  const renderStepContent = () => {
    switch (importStep) {
      case "upload":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-muted/40 hover:bg-muted/60 transition-colors rounded-lg p-4 border-2 border-dashed border-muted-foreground/25 cursor-pointer text-center">
                <input
                  type="file"
                  id="csv-upload"
                  className="hidden"
                  accept=".csv"
                  onChange={handleFileChange}
                />
                <Label 
                  htmlFor="csv-upload" 
                  className="flex flex-col items-center justify-center h-full cursor-pointer"
                >
                  <FileText className="h-8 w-8 mb-2 text-primary" />
                  <span className="font-medium">CSV de Moxfield</span>
                  <span className="text-xs text-muted-foreground mt-1">Arrastrá o hacé clic para subir</span>
                </Label>
              </div>
              
              <div className="bg-muted/40 hover:bg-muted/60 transition-colors rounded-lg p-4 border-2 border-dashed border-muted-foreground/25 cursor-pointer text-center">
                <input
                  type="file"
                  id="txt-upload"
                  className="hidden"
                  accept=".txt"
                  onChange={handleFileChange}
                />
                <Label 
                  htmlFor="txt-upload" 
                  className="flex flex-col items-center justify-center h-full cursor-pointer"
                >
                  <FileText className="h-8 w-8 mb-2 text-primary" />
                  <span className="font-medium">TXT Plano</span>
                  <span className="text-xs text-muted-foreground mt-1">Una carta por línea</span>
                </Label>
              </div>
              
              <div className="bg-muted/40 hover:bg-muted/60 transition-colors rounded-lg p-4 border-2 border-dashed border-muted-foreground/25 cursor-pointer text-center">
                <input
                  type="file"
                  id="xlsx-upload"
                  className="hidden"
                  accept=".xlsx"
                  onChange={handleFileChange}
                />
                <Label 
                  htmlFor="xlsx-upload" 
                  className="flex flex-col items-center justify-center h-full cursor-pointer"
                >
                  <FileSpreadsheet className="h-8 w-8 mb-2 text-primary" />
                  <span className="font-medium">Excel (XLSX)</span>
                  <span className="text-xs text-muted-foreground mt-1">Planilla con formato específico</span>
                </Label>
              </div>
            </div>
            
            <div className="bg-muted p-4 rounded-md">
              <h3 className="font-medium text-sm">Consejos para importar:</h3>
              <ul className="text-xs text-muted-foreground mt-2 list-disc pl-5 space-y-1">
                <li>Para CSV de Moxfield, exportá tu colección desde Settings &gt; Export Collection.</li>
                <li>Para archivos TXT, incluí una carta por línea con el formato "Cantidad x Nombre".</li>
                <li>Para Excel, usá columnas para Nombre, Edición, Cantidad, Estado, Idioma y Precio.</li>
              </ul>
              <div className="mt-3">
                <Button variant="outline" size="sm" onClick={() => setShowPreview(true)}>
                  Ver ejemplos
                </Button>
              </div>
            </div>
          </div>
        );
        
      case "review":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-md bg-muted/50 p-3">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <div className="flex-1">
                <p className="text-sm font-medium">
                  {selectedFile?.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {fileType === "csv" ? "CSV de Moxfield" : 
                   fileType === "txt" ? "Archivo de texto plano" : 
                   "Archivo Excel"}
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setImportStep("upload")}
              >
                Cambiar
              </Button>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Vista previa de importación:</h3>
              <div className="border rounded-md overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Carta</TableHead>
                      <TableHead>Edición</TableHead>
                      <TableHead>Cant.</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Idioma</TableHead>
                      <TableHead className="text-right">Precio (ARS)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {importedData.map((card, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{card.name}</TableCell>
                        <TableCell>{card.set}</TableCell>
                        <TableCell>{card.quantity}</TableCell>
                        <TableCell>{card.condition}</TableCell>
                        <TableCell>{card.language}</TableCell>
                        <TableCell className="text-right">${card.price.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Se encontraron {importedData.length} cartas en el archivo. Verificá que los datos sean correctos antes de importar.
              </p>
            </div>
          </div>
        );
        
      case "processing":
        return (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="bg-primary/10 rounded-full p-3 mb-4">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
            <h3 className="text-xl font-medium">Importando tu colección...</h3>
            <p className="text-muted-foreground mt-2">
              Estamos procesando {importedData.length} cartas. Esto puede demorar unos segundos.
            </p>
          </div>
        );
    }
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Importar Colección</CardTitle>
          <CardDescription>
            Importá tus cartas desde archivos CSV, TXT o Excel para cargar tu colección rápidamente
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepContent()}
        </CardContent>
        <CardFooter className="justify-between">
          {importStep === "upload" ? (
            <p className="text-xs text-muted-foreground">
              Soportamos formatos de Moxfield, Deckbox y otros sitios populares
            </p>
          ) : importStep === "review" ? (
            <div className="w-full flex justify-end">
              <Button onClick={handleImport}>
                Importar {importedData.length} cartas
              </Button>
            </div>
          ) : null}
        </CardFooter>
      </Card>
      
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ejemplos de formatos soportados</DialogTitle>
            <DialogDescription>
              Así deben verse tus archivos para una importación correcta
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div>
              <h3 className="font-medium mb-2">Ejemplo de CSV de Moxfield</h3>
              <div className="bg-muted p-3 rounded text-xs font-mono overflow-x-auto whitespace-nowrap">
                Count,Name,Edition,Condition,Language,Price<br />
                2,Lightning Bolt,Beta,LP,English,25000<br />
                1,Sol Ring,Commander 2021,NM,Spanish,3500<br />
                4,Birds of Paradise,Fourth Edition,MP,English,8000
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Ejemplo de TXT Plano</h3>
              <div className="bg-muted p-3 rounded text-xs font-mono">
                2x Lightning Bolt<br />
                1x Sol Ring<br />
                4x Birds of Paradise
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Ejemplo de Excel (XLSX)</h3>
              <AspectRatio ratio={16/9} className="bg-muted rounded overflow-hidden">
                <div className="h-full w-full flex items-center justify-center">
                  <div className="text-center">
                    <FileSpreadsheet className="h-16 w-16 mx-auto text-muted-foreground/70" />
                    <p className="text-xs text-muted-foreground mt-2">
                      Excel con columnas: Nombre, Edición, Cantidad, Estado, Idioma, Precio
                    </p>
                  </div>
                </div>
              </AspectRatio>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BulkImport;
