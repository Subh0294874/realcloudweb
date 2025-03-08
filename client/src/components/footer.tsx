import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card">
      <div className="container py-8">
        <Separator className="mb-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
          <div className="text-sm text-muted-foreground w-full text-center md:text-left">
            © {new Date().getFullYear()} RealCloud. All rights reserved.
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground w-full justify-center md:justify-end">
            Made with <Heart className="h-4 w-4 text-red-500" /> by Subh
          </div>
        </div>
      </div>
    </footer>
  );
}