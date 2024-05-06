import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoutes = ({user}) => {
    return (
        <>
        {
            user != null ?
                <Outlet/>//Renderizame el componente por el que se te consulto.
            :
                <Navigate to="/"/>
        }
        </>
    )
}

export default ProtectedRoutes