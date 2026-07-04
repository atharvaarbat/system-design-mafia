// import App from "@/components/diagram/diagram";
import Diagram from "@/components/diagram/diagram";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-zinc-50 font-sans dark:bg-black">
      <Diagram />
    </div>
  );
}
