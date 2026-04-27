import StoreProvider from "@/components/providers/store-provider";
import ThemeProvider from "@/components/providers/theme-provider";
import { PropsWithChildren } from "react";

export default function Providers({children}: PropsWithChildren) {
    return(
        <ThemeProvider>
            <StoreProvider>
                {children}
            </StoreProvider>
        </ThemeProvider>
    );
}