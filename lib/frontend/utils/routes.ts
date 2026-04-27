import { Bookmark, Eye, Home, Logs } from "lucide-react";

export const publicRoutes = [
    {icon: Home, name: "Головна", href: "/"},
    {icon: Logs, name: "Аніме", href: "/anime"},
    {icon: Bookmark, name: "Збережені", href: "/saved"},
    {icon: Eye, name: "Переглянуті", href: "/watched"},
];