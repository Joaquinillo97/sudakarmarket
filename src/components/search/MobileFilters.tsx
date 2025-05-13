
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CardFilters from "@/components/search/CardFilters";

interface MobileFiltersProps {
  onApplyFilters: (filters: any) => void;
}

const MobileFilters = ({ onApplyFilters }: MobileFiltersProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          Filtros
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filtros</SheetTitle>
        </SheetHeader>
        <Separator className="my-4" />
        <div className="py-4 pr-6">
          <CardFilters 
            onApplyFilters={(newFilters) => {
              onApplyFilters(newFilters);
              document.querySelector<HTMLButtonElement>('.sheet-close-button')?.click();
            }} 
          />
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button className="sheet-close-button">Cerrar</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default MobileFilters;
