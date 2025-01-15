import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return <div className="text-center container mx-auto">
    <h1 className="text-3xl mb-4">Home Page</h1>
    <Button>
      Sign In Demo
    </Button>
   
    </div>
}
