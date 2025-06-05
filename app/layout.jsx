import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

export const metadata = {
  title: "موسسه روبه راه",
  description: "موسسه روبه راه",
  icons: {
    icon: '/logo-white.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`antialiased bg-primary text-white`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
