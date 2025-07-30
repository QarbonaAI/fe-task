import React from "react";
import { ModeToggle } from "./mode-toggle";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="border-b p-4">
      <div className="container mx-auto flex items-center justify-between">
        <Image src="/Logo.svg" width={70} height={70} alt="Logo" />
        <div className="ml-auto">
          <ModeToggle />
        </div>
      </div>
    </div>
  );
}
