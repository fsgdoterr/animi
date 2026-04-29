import { ReactNode } from "react";

interface Props {
    title: string;
    subtitle?: string;
    icon: ReactNode;
}

export default function AdminPageHeader({ title, subtitle, icon }: Props) {
    return (
        <div className="flex gap-4 items-center">
            <div className="w-28 h-28 bg-(--bg-1) rounded-2xl border border-(--bg-3) flex items-center justify-center shadow-2xl">
                {icon}
            </div>
            <div>
                <h1 className="text-4xl font-bold">{title}</h1>
                {subtitle && <p className="text-(--text-2)">{subtitle}</p>}
            </div>
        </div>
    );
}
