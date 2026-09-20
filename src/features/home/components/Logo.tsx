import Link from "next/link";
import { GraduationCap } from "lucide-react";
import Image from "next/image";

interface LogoProps {
  showTagline?: boolean;
  className?: string;
}

export function Logo({ showTagline = true, className = "" }: LogoProps) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`}>
      <Image src={"/logo-light.png"} alt="EduWay-logo" width={60} height={60} />
    </Link>
  );
}
