import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Contact } from "@/components/sections/contact";
import { Help } from "@/components/sections/help";
import { Hero } from "@/components/sections/hero";
import { Problem } from "@/components/sections/problem";
import { Trusted } from "@/components/sections/trusted";
import { Work } from "@/components/sections/work";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Work />
        <Problem />
        <Help />
        <Trusted />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
