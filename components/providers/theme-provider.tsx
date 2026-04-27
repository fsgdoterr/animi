import {ThemeProvider as ModuleThemeProvider} from "next-themes"

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    return (
        <ModuleThemeProvider
            attribute="data-theme"
            defaultTheme="dark"
            enableSystem={false}
        >
            {children}
        </ModuleThemeProvider>
    );
}