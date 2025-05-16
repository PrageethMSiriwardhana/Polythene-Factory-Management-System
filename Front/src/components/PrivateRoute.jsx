import React from 'react'
import { Outlet , Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'    

export default function PrivateRoute() {
 const { currentUser } = useSelector((state) => state.user)
 console.log("Current User:", currentUser);
 return currentUser ? <Outlet /> : <Navigate to="/login" />
}
