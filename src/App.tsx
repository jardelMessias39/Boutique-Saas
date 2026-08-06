import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PublicLayout } from "@/components/layout/PublicLayout";
import { StoreAdminLayout } from "@/components/layout/StoreAdminLayout";
import { RequireAuth } from "@/components/layout/RequireAuth";
import { StoreProvider } from "@/context/StoreContext";
import { StoreGate } from "@/components/layout/StoreGate";
import { AuthProvider } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";

import { Home } from "@/pages/public/Home";
import { CategoryPage } from "@/pages/public/Category";
import { ProductPage } from "@/pages/public/Product";
import { LooksPage } from "@/pages/public/Looks";
import { LookDetailPage } from "@/pages/public/LookDetail";
import { AboutPage } from "@/pages/public/About";
import { HowToBuyPage } from "@/pages/public/HowToBuy";
import { ContactPage } from "@/pages/public/Contact";
import { NoveltiesPage } from "@/pages/public/Novidades";
import { SearchPage } from "@/pages/public/Search";
import { CartPage } from "@/pages/public/Cart";
import { NotFoundPage } from "@/pages/public/NotFound";

import { LoginPage } from "@/pages/store/Login";
import { DashboardPage } from "@/pages/store/Dashboard";
import { ProductsPage } from "@/pages/store/Products";
import { ProductEditorPage } from "@/pages/store/ProductEditor";
import { CategoriesPage } from "@/pages/store/Categories";
import { LooksAdminPage } from "@/pages/store/LooksAdmin";
import { LookEditorPage } from "@/pages/store/LookEditor";
import { BannerPage } from "@/pages/store/Banner";
import { ReviewsPage } from "@/pages/store/Reviews";
import { RevenuePage } from "@/pages/store/Revenue";
import { SettingsPage } from "@/pages/store/Settings";

function App() {
  return (
    <StoreProvider>
      <StoreGate>
        <AuthProvider>
          <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Site público */}
              <Route element={<PublicLayout />}>
                <Route index element={<Home />} />
                <Route path="categoria/:slug" element={<CategoryPage />} />
                <Route path="produto/:id" element={<ProductPage />} />
                <Route path="looks" element={<LooksPage />} />
                <Route path="look/:id" element={<LookDetailPage />} />
                <Route path="sobre" element={<AboutPage />} />
                <Route path="como-comprar" element={<HowToBuyPage />} />
                <Route path="contato" element={<ContactPage />} />
                <Route path="novidades" element={<NoveltiesPage />} />
                <Route path="busca" element={<SearchPage />} />
                <Route path="carrinho" element={<CartPage />} />
              </Route>

              {/* Login do painel (fora da proteção de RequireAuth) */}
              <Route path="minha-loja/login" element={<LoginPage />} />

              {/* Painel "Minha Loja" — protegido */}
              <Route
                path="minha-loja"
                element={
                  <RequireAuth>
                    <StoreAdminLayout />
                  </RequireAuth>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="produtos" element={<ProductsPage />} />
                <Route path="produtos/novo" element={<ProductEditorPage />} />
                <Route path="produtos/:id/editar" element={<ProductEditorPage />} />
                <Route path="categorias" element={<CategoriesPage />} />
                <Route path="looks" element={<LooksAdminPage />} />
                <Route path="looks/novo" element={<LookEditorPage />} />
                <Route path="banner" element={<BannerPage />} />
                <Route path="avaliacoes" element={<ReviewsPage />} />
                <Route path="faturamento" element={<RevenuePage />} />
                <Route path="configuracoes" element={<SettingsPage />} />
              </Route>

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </StoreGate>
    </StoreProvider>
  );
}

export default App;
