import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Outlet } from 'react-router-dom'
import authService from './appwrite/auth'
import { login, logout } from './store/authSlice'
import { Header, Fotter } from './components'
import { Toaster } from 'sonner'

function App() {
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    authService.getCurrentUser()
    .then((userData) => {
      if (userData) {
        dispatch(login({userData}))
      } else {
        dispatch(logout())
      }
    })
    .finally(() => setLoading(false))
  }, [dispatch])
  
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-white'>
      <Toaster richColors position="top-right" closeButton />
      <div className='w-full block'>
        <div className="print:hidden">
          <Header />
        </div>
        <main>
        <Outlet />
        </main>
        <div className="print:hidden">
          <Fotter />
        </div>
      </div>
    </div>
  ) : null
}

export default App