// Ubicación: src/app/page.tsx
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <>
      {/* El Navbar ya está en layout.tsx, así que no lo repetimos acá. 
        Solo renderizamos el Dashboard.
      */}
      <Dashboard />
    </>
  );
}