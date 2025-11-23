import { Outlet } from "react-router-dom";

export const MainLayaout = () => {
  return (
    <div className='flex h-screen'>

      <h1>
        A LA IZQUIERDA
      </h1>

      <main className='flex-1 h-full'>
        <Outlet />
      </main>

    </div>
  )
}