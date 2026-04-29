import { Bookmark, Eye, Home, LayoutDashboard, Logs, Tag, Users } from "lucide-react";

export const publicRoutes = [
    {icon: Home, name: "Головна", href: "/"},
    {icon: Logs, name: "Аніме", href: "/anime"},
    {icon: Bookmark, name: "Збережені", href: "/saved"},
    {icon: Eye, name: "Переглянуті", href: "/watched"},
];

export const adminRoutes = [
    {icon: LayoutDashboard, name: "Дашборд", href: "/admin"},
    {icon: Logs, name: "Аніме", href: "/admin/animes"},
    {icon: Tag, name: "Жанри", href: "/admin/genres"},
    {icon: Users, name: "Користувачі", href: "/admin/users"},
]