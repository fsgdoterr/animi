import { ThemeProvider } from "next-themes";
import { PropsWithChildren } from "react";

export default function Providers({children}: PropsWithChildren) {
    return(
        <ThemeProvider
            attribute="data-theme"
            defaultTheme="dark"
            enableSystem={false}
        >
            {children}
        </ThemeProvider>
    );
}