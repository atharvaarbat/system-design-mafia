import { cn } from "@/lib/utils";

interface Props {
  imageUrl: string;
  className?: string;
  alt?: string;
}

export default function BgFrame({ imageUrl, className, alt = "Image frame" }: Props) {
  return (
    <div
      className={cn(
        "relative dark:bg-accent overflow-hidden",
        className
      )}
    >
      <img
        src={imageUrl}
        alt={alt}
        className="w-full h-full object-cover"
      />
    </div>
  );
}