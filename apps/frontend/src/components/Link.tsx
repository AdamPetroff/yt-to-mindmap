"use client";
import { cn } from "@/lib/utils";
import NextLink from "next/link";
import { usePathname } from "next/navigation";

export default function Link({
  ...linkProps
}: React.ComponentProps<typeof NextLink>) {
  const pathname = usePathname();

  const isActive = pathname === linkProps.href;

  return (
    <NextLink {...linkProps} className={cn(isActive ? "font-bold" : "")} />
  );
}
