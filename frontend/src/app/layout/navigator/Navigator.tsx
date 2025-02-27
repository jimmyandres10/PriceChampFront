import { routes } from "@/app/router/routes";
import { Button } from "@/components/ui/button";
import useAuth from "@/shared/store/useAuth";
import { useNavigate } from "react-router-dom";
import Logo from "/LogoTexto.svg"

function Navigator() {

    const navigate = useNavigate();
    
    const { user, clearUser } = useAuth();

    const handleLogOut = () => {
        clearUser();
    }
    
    return (
        <div className="w-full h-full bg-primary-color flex">
            <div className="h-full p-2">
                <img src={Logo} className="h-full max-h-full" alt='mySvgImage' />
            </div>
            {
                user ? (
                    <>
                        <Button onClick={() => navigate(routes.home)}>Home</Button>
                        <Button onClick={() => navigate(routes.profile)}>Perfil</Button>
                        <Button onClick={() => navigate(routes.ventas)}>Ventas</Button>
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