'use client'

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import clsx from "clsx";

export default function ChangeTheme() {
    const { resolvedTheme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const isDark = resolvedTheme === "dark";

    return (
        <Button
            variant="ghost"
            className="relative w-14 h-8 rounded-full bg-(--bg-2) p-1"
            onClick={() => setTheme(isDark ? "light" : "dark")}
        >
            <div
                className={clsx(
                    "absolute top-1 left-1 w-6 h-6 rounded-full bg-(--bg-1) flex items-center justify-center transition-transform duration-300",
                    isDark ? "translate-x-6" : "translate-x-0"
                )}
            >
                {/* {isDark ? <Sun size={16} /> : <Moon size={16} />} */}
                {isDark ? <Moon size={16} /> : <Sun size={16} />}
            </div>
        </Button>
    );
}