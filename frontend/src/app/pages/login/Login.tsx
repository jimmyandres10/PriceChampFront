import { Button } from "@/components/ui/button";
import useAuth from "@/shared/store/useAuth";

function Login() {

    const { setUser } = useAuth();

    const handleLogin = () => {
        setUser(
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiQW5nZWxpY2EifQ.2XIxRGBvz11j4NBtgUm5RAOPiP9U-lk_gvUhdNm1DQM"
        )
    }

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            Logeate
            <Button onClick={handleLogin}>Iniciar login</Button>
        </div>
    )
}

export default Login;