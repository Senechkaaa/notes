import { Route, Routes } from 'react-router-dom'
import Layout from './Layout/Layout.tsx'
import HomePage from '../pages/HomePage/HomePage.tsx'
import RegistrationPage from '../pages/RegistrationPage/RegistrationPage.tsx'
import Login from '../pages/Login/Login.tsx'
import Notes from '../pages/Notes/Notes.tsx'
import Profile from '../pages/Profile/Profile.tsx'
import Edit from '../pages/Edit/Edit.tsx'

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<HomePage />} />
            </Route>
            <Route path="registration" element={<RegistrationPage />} />
            <Route path="login" element={<Login />} />
            <Route path="notes" element={<Notes />} />
            <Route path="notes/profile" element={<Profile />} />
            <Route path="/edit" element={<Edit />} />
        </Routes>
    )
}

export default AppRouter
