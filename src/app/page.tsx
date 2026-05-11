import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import CardStack from "@/components/CardStack";
import Mission from "@/components/Mission";
import Stats from "@/components/Stats";
import Feature from "@/components/Feature";
import CapsTabs from "@/components/CapsTabs";
import Sectors from "@/components/Sectors";
import Partners from "@/components/Partners";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CardStack />
        <Mission />
        <Stats />
        <Feature />
        <CapsTabs />
        <Sectors />
        <Partners />
      </main>
      <Footer />
    </>
  );
}
