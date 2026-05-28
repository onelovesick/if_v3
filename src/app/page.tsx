import Hero from "@/components/Hero";
import PositionBrief from "@/components/PositionBrief";
import Problem from "@/components/Problem";
import Solutions from "@/components/Solutions";
import Parallax from "@/components/Parallax";
import Industries from "@/components/Industries";

export default function Home() {
  return (
    <main>
      <Hero />
      <PositionBrief />
      <Problem />
      <Solutions />
      <Parallax />
      <Industries />
    </main>
  );
}
