import { StoreProvider } from "@/lib/store";
import { Shell } from "@/components/Shell";

/** La app cliente (prototipo) vive aquí, con su marco y sus tabs. */
export default function PrototipoLayout({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <Shell>{children}</Shell>
    </StoreProvider>
  );
}
