import { Header } from "../components/Header.tsx";
import { Footer } from "../components/Footer.tsx";

type LayoutProps = {
    children: React.ReactNode,
    className: string,
};

export function Layout ({children, className} : LayoutProps) {

    return (
        <div className={`min-h-screen bg-white dark:bg-gray-900 antialiased min-w-full ${className}`}>
        <Header></Header>
         {children}
         <Footer></Footer>
        </div >
    )


}