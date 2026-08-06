import { Outlet } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useStore } from "@/context/StoreContext";

export function PublicLayout() {
  const store = useStore();

  return (
    <div className="min-h-screen flex flex-col">
      <Header storeName={store.name} whatsapp={store.whatsapp} logoUrl={store.logoUrl} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer store={store} />
    </div>
  );
}
