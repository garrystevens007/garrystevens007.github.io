import Image from "next/image";
import type { CaseImage } from "@/lib/data";

// Device frames for product screenshots. Desktop shots are 1920×1200 (16:10), phone shots 780×1688.

export function LaptopFrame({ image, priority = false }: { image: CaseImage; priority?: boolean }) {
  return (
    <div>
      <div className="rounded-t-[18px] bg-[#1d232c] px-[1.2%] pt-[1.2%] shadow-device">
        <Image
          src={image.src}
          alt={image.alt}
          width={1920}
          height={1200}
          priority={priority}
          sizes="(min-width: 1160px) 1000px, 90vw"
          className="block h-auto w-full rounded-t-md"
        />
      </div>
      <div className="mx-[-3%] h-[14px] rounded-b-[14px] bg-gradient-to-b from-[#d9dde3] to-[#b4bac4] dark:from-[#4a5363] dark:to-[#2e3542]" />
    </div>
  );
}

export function PhoneFrame({ image, priority = false }: { image: CaseImage; priority?: boolean }) {
  return (
    <div className="rounded-[42px] bg-[#111] p-[4.5%] shadow-phone">
      <Image
        src={image.src}
        alt={image.alt}
        width={780}
        height={1688}
        priority={priority}
        sizes="(min-width: 1160px) 280px, 40vw"
        className="block h-auto w-full rounded-[32px]"
      />
    </div>
  );
}

// Laptop with the phone overlapping its lower right corner, the case study's hero.
export function DeviceShowcase({ desktop, phone }: { desktop?: CaseImage; phone?: CaseImage }) {
  if (!desktop && !phone) return null;
  return (
    <div className="relative pb-6 pt-4 sm:pb-16">
      {desktop && (
        <div className={phone ? "sm:w-[86%]" : ""}>
          <LaptopFrame image={desktop} priority />
        </div>
      )}
      {phone && (
        <div className="mx-auto mt-10 w-[58%] max-w-[280px] sm:absolute sm:bottom-6 sm:right-0 sm:mt-0 sm:w-[24%]">
          <PhoneFrame image={phone} priority />
        </div>
      )}
    </div>
  );
}
