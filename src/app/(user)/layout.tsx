import "./globals.css";
import ResponsiveAppBar from "../components/header/appBar";
import FooterPlay from "../components/footer/footerPlay";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ResponsiveAppBar/>
      {children}
      <FooterPlay/>
    </>   
  );
}
