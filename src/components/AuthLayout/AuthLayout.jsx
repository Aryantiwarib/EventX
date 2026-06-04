import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

export default function Protected({children, authentication = true, adminOnly = false}) {

    const navigate = useNavigate()
    const [loader, setLoader] = useState(true)
    const authStatus = useSelector(state => state.auth.status)
    const userData = useSelector(state => state.auth.userData)

    const checkIsAdmin = (user) => {
        if (!user) return false;
        return (
            user.labels?.includes('admin') ||
            user.prefs?.role === 'admin' ||
            user.prefs?.isAdmin === true ||
            user.email?.endsWith('@eventx-admin.com')
        );
    };

    useEffect(() => {
        if (authentication && authStatus !== authentication) {
            navigate("/login")
        } else if (!authentication && authStatus !== authentication) {
            navigate("/")
        } else if (authentication && authStatus && adminOnly && !checkIsAdmin(userData)) {
            // Redirect non-admins trying to access admin-only pages
            navigate("/")
        }
        setLoader(false)
    }, [authStatus, userData, navigate, authentication, adminOnly])

  return loader ? (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  ) : <>{children}</>
}
