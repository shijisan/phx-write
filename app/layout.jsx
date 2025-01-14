import { Roboto_Flex, Ubuntu } from "next/font/google";
import "./globals.css";
import Nav from "@/components/Nav";

const robotoFlex = Roboto_Flex({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900", "1000"],
  subsets: ["latin"],
});

const ubuntu = Ubuntu({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
})


export const metadata = {
  title: "Phx/Write",
  description: "Web App by shijisan",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${robotoFlex.class} ${ubuntu.class}`}
      >
        <Nav />
        {children}
      </body>
    </html>
  );
}
