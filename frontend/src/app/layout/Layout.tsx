import { Outlet } from "react-router-dom";
import Navigator from "./navigator/Navigator";

function Layout() {
    return (
        <div className="w-screen h-screen flex flex-col">
            <div className="w-full h-20">
                <Navigator/>
            </div>
            <div className="flex-1 bg-blue-100">
                <Outlet/>
            </div>
        </div>
    )
}

export default Layout;