import Hero from "@/components/Hero";
import PositionBrief from "@/components/PositionBrief";
import Problem from "@/components/Problem";
import Solutions from "@/components/Solutions";
import Parallax from "@/components/Parallax";
import Layers from "@/components/Layers";
import HowWeWork from "@/components/HowWeWork";
import Practice from "@/components/Practice";
import Close from "@/components/Close";

export default function Home() {
  return (
    <main>
      <Hero />
      <PositionBrief />
      <Problem />
      <Solutions />
      <Parallax />
      <Layers />
      <HowWeWork />
      <Practice />
      <Close />
    </main>
  );
}
