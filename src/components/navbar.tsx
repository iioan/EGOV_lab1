import React from "react";

import Image from "next/image";
import {Heading} from "@radix-ui/themes";

export const Navbar = () => {
  return (
    <nav
      aria-label="Main Navigation"
      className="sm:h-22 px-32 flex items-center justify-between bg-black/10"
    >
      <a href="#" title="My product">
        <Image src="/upb_logo.png"
               width={80}
               height={80}
               alt="Picture of the author"/>
      </a>
      <div>
        <Heading className="text-xl md:text-xl font-bold">
          Plată taxe universitate
        </Heading>
      </div>
      <div className="gap-3 items-center hidden md:flex">
        <a
          href="#"
          className="inline-flex px-5 py-2 blink-text-primary hover:bg-blinkGray400 dark:hover:bg-blinkGray800 rounded-full"
        >
          Formular
        </a>
        <a
          href="/payments"
          className="inline-flex px-5 py-2 blink-text-primary bg-blinkGray400 hover:bg-blinkGray500 dark:bg-blinkGray800 dark:hover:bg-blinkGray700 rounded-full"
        >
          Plati
        </a>
      </div>
    </nav>
  );
};
