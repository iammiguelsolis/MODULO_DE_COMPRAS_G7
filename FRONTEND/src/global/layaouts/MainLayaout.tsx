import { Outlet } from "react-router-dom";
import Sidebar from "../componets/organisms/Sidebar";

const MainLayaout = () => {
  return (
    <div className='flex h-screen overflow-hidden'>

      <h1>
        <Sidebar />
      </h1>

      <main className='flex-1 h-full overflow-y-auto'>
        <Outlet />
      </main>

    </div>
  )
}

export default MainLayaout;