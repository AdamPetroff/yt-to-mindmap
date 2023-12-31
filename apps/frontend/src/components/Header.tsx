"use client";
import { Fragment, useState } from "react";
import Link from "./Link";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <nav
        className="container mx-auto flex items-center justify-between border-b py-3"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">MindmapGPT</span>
            <img className="h-16 w-auto rotate-90" src="/icon-1.svg" alt="" />
          </a>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            {/* <Bars3Icon className="h-6 w-6" aria-hidden="true" /> */}
          </button>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link
            href="/"
            className="font-roboto text-sm font-semibold leading-6 text-gray-900"
          >
            Mindmap List
          </Link>
          <Link
            href="/search"
            className="font-roboto text-sm font-semibold leading-6 text-gray-900"
          >
            Search
          </Link>
          {/* <a
            href="#"
            className="font-sans text-sm font-semibold leading-6 text-gray-900"
          >
            Company
          </a> */}
        </div>
      </nav>
    </header>
  );
}
