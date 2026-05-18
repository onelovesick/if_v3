import Hero from "@/components/Hero";
import PositionBrief from "@/components/PositionBrief";
import Layers from "@/components/Layers";
import HowWeWork from "@/components/HowWeWork";
import BridgeStudy from "@/components/BridgeStudy";
import Practice from "@/components/Practice";
import Close from "@/components/Close";

export default function Home() {
  return (
    <main>
      <Hero />
      <PositionBrief />
      <BridgeStudy />
      <Layers />
      <HowWeWork />
      <Practice />
      <Close />
    </main>
  );
}
