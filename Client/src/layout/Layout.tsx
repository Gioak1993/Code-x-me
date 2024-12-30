import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";

type LayoutProps = {
  children: React.ReactNode;
  className: string;
};

export function Layout({ children, className }: LayoutProps) {
  return (
    <div
      className={`min-h-screen min-w-full bg-white antialiased dark:bg-gray-900 ${className}`}
    >
      <Header></Header>
      {children}
      <Footer></Footer>
    </div>
  );
}
