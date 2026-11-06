import Image from "next/image";

export function Foto({ src, alt = "", className = "", priority = false, sizes = "430px" }: { src: string; alt?: string; className?: string; priority?: boolean; sizes?: string }) {
  return (
    <div className={`relative overflow-hidden bg-linea ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}
