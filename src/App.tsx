import { usePathname } from "@/lib/router";
import DigitalMenuPage from "@/pages/DigitalMenu";
import HomePage from "@/pages/Home";

export default function App() {
  const pathname = usePathname();

  if (pathname.startsWith("/digital-menu")) {
    return <DigitalMenuPage />;
  }

  return <HomePage />;
}
