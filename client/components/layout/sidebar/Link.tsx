import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface SideBarLinkProps {
  link: {
    name: string;
    icon: ({
      className,
      active,
    }: {
      className: string;
      active: boolean;
    }) => JSX.Element;
    href: string;
    admin: boolean;
  };
  expandNav: boolean;
}

const SideBarLink: React.FC<SideBarLinkProps> = ({ link, expandNav }) => {
  const router = useRouter();

  return (
    <li
      key={link.name}
      className={`w-20 items-center rounded-full group lg:active:bg-orange-700/90  lg:hover:bg-orange-600/90 transition-all overflow-hidden ${
        link.href === router.pathname ? "lg:bg-orange-600/90" : "lg:bg-gray-900"
      } ${
        expandNav ? "lg:rounded-xl" : "lg:rounded-full"
      } lg:cursor-pointer lg:height-auto lg:hover:rounded-xl lg:transition lg:w-full`}
    >
      <Link
        href={link.href}
        className={`p-1 flex flex-col justify-center items-center lg:p-3 lg:justify-start lg:flex-row`}
      >
        {link.icon({
          className: `text-2xl group-hover:text-white transition ${
            link.href === router.pathname
              ? "text-white"
              : "text-white lg:text-orange-500/90"
          } lg:text-xl`,
          active: link.href === router.pathname,
        } as any)}
        <span
          className={`text-xsm group-hover:text-white transition ${
            link.href === router.pathname ? "text-white" : "text-gray-300"
          } ${
            expandNav ? "lg:opacity-100 lg:delay-75" : "lg:opacity-0"
          } lg:w-0 lg:transition lg:uppercase lg:font-semibold`}
        >
          <span className="hidden lg:inline">&nbsp;&nbsp;</span>
          {link.name}
        </span>
      </Link>
    </li>
  );
};

export default SideBarLink;
