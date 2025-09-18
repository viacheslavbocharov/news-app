import { Outlet } from "react-router-dom";
import Container from "@/components/Container";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Layout() {
  return (
    <div className="min-h-dvh flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <Container>
          <Outlet />
        </Container>
      </main>
      <Footer />
    </div>
  );
}
