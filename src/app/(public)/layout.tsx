import Header from "@/components/public/Header";
import Footer from "@/components/public/Footer";
import WhatsAppButton from "@/components/public/WhatsAppButton";
import CartDrawer from "@/components/public/CartDrawer";
import GrillCartDrawer from "@/components/public/GrillCartDrawer";
import CheckoutModal from "@/components/public/CheckoutModal";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow pt-24">{children}</main>
      <Footer />
      <WhatsAppButton />
      <CartDrawer />
      <GrillCartDrawer />
      <CheckoutModal />
    </div>
  );
}
