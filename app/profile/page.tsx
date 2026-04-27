'use client';
import { Button } from "@/components/ui/button";
import { useLazyLogoutQuery } from "@/lib/frontend/store/api/auth-api";

export default function ProfilePage() {
    const [logout, { isLoading }] = useLazyLogoutQuery();

    const logoutHandler = async () => {
        try {   
            await logout().unwrap();
        } catch {}
    }

    return(
        <div>
            ProfilePage

            <Button variant="danger" onClick={logoutHandler} loading={isLoading}>
                logout
            </Button>
        </div>
    );
}