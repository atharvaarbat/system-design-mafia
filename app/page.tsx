import Diagram from "@/components/diagram/diagram";
import { sampleArchitecture } from "@/components/diagram/data/sample";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <Diagram design={sampleArchitecture} editable={true} />
    </div>
  );
}
