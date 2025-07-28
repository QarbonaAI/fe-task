import React from "react";
import { ModeToggle } from "./mode-toggle";

export default function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between border-b bg-background p-4">
      <div className="ml-auto">
        <ModeToggle />
      </div>
    </div>
  );
}
