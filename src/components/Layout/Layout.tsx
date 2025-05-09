import { Outlet } from 'react-router-dom'
import Header from '../Headers/Header.tsx'

const Layout = () => {
    return (
        <>
            <Header />
            <Outlet />
        </>
    )
}

export default Layout
