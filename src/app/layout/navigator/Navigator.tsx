import { routes } from "@/app/router/routes";
import { Button } from "@/components/ui/button";
import useAuth from "@/shared/store/useAuth";
import { useNavigate } from "react-router-dom";

function Navigator() {

    const navigate = useNavigate();
    
    const { user, clearUser } = useAuth();

    const handleLogOut = () => {
        clearUser();
    }
    
    return (
        <div className="w-full h-full">
            {
                user ? (
                    <>
                        <Button onClick={() => navigate(routes.home)}>Home</Button>
                        <Button onClick={() => navigate(routes.profile)}>Perfil</Button>
                        <Button onClick={handleLogOut}>Logout</Button>
                    </>
                ) : (
                    <>
                        <div>Logeate</div>
                    </>
                )
            }
        </div>
    )
}

export default Navigator;