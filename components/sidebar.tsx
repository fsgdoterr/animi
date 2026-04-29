'use client';
import AccountButton from "@/components/account-button";
import Navbar from "@/components/navbar";
import ChangeTheme from "@/components/ui/change-theme";
import Input from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { Search } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const isAdmin = pathname.startsWith('/admin');

    return(
        <div className="w-72 bg-(--bg-1) py-6 px-6 flex flex-col items-start gap-4">
            <div className="flex items-center justify-between w-full">
                <Logo />
                <ChangeTheme />
            </div>
            {!isAdmin && (
                <Input 
                    rootClassName="w-full"
                    name="search"
                    placeholder="Пошук..."
                    icon={<Search />}
                />
            )}
            <Navbar />
            <div className="flex-1"></div>
            {!isAdmin &&(
                <AccountButton />
            )}
        </div>
    );
}