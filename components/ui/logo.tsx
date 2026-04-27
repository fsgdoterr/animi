'use client'
import Link from "next/link";

export default function Logo() {
    return(
        <Link 
            href="/"
            className="flex gap-2 items-center group"
        >
            <p className="text-4xl font-bold uppercase">
                <span className="text-(--flame-1) group-hover:text-(--flame-2)">ANI</span>
                <span className="text-(--flame-2) group-hover:text-(--flame-3)">MI</span>
            </p>
        </Link>
    );
}