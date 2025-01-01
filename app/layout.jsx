import { Poppins } from "next/font/google";
import "./globals.css";
import NavBar from "./component/NavBar";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "Phoenix/Write",
  description: "App by Pocket/Phoenix",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.class} antialiased`}
      >
        <NavBar/>
        {children}
      </body>
    </html>
  );
}
