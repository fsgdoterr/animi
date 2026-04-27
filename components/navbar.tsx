'use client'

import { publicRoutes } from "@/lib/frontend/utils/routes";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    return(
        <nav className="flex flex-col gap-2 w-full">
            {publicRoutes.map(({icon: Icon, name, href}) => {
                const isActive = href === pathname || (href !== '/' && pathname.startsWith(href));
                return(
                    <Link 
                        href={href} 
                        key={name}
                        className={clsx(
                            "flex gap-2 items-center py-2 px-4 text-(--text-1)",
                            isActive && "bg-(--bg-2) rounded-lg"
                        )}
                    >
                        <Icon size={28}/>
                        {name}
                    </Link>
                );
            })}
        </nav>
    );
}