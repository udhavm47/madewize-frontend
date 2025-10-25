import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import PublicProfilePage from './pages/PublicProfilePage'
import CompanyProfilePage from './pages/CompanyProfilePage'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Check if user is logged in and fetch fresh data from backend
    const token = localStorage.getItem('token')
    console.log('App.jsx - useEffect triggered, token present:', !!token)
    if (token) {
      // Fetch fresh user data from backend instead of using cached data
      console.log('App.jsx - Fetching fresh user data from backend')
      fetchUserData()
    }
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          console.log('App.jsx - Fresh user data from backend:', data.data)
          console.log('App.jsx - Fresh completion percentage:', data.data.profileCompletionPercentage)
          
          // Force update the user state with fresh data
          setUser(data.data)
          
          // Update localStorage with fresh data
          localStorage.setItem('user', JSON.stringify(data.data))
          
          // Force a re-render by updating state again
          setTimeout(() => {
            setUser(prevUser => ({
              ...prevUser,
              profileCompletionPercentage: data.data.profileCompletionPercentage
            }))
          }, 100)
        }
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
      // Clear storage on error
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
    }
  }

  const handleLoginSuccess = (userData) => {
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  const handleUpdateUser = (updatedUser) => {
    console.log('App.jsx handleUpdateUser called with:', updatedUser);
    console.log('Updated user completion percentage:', updatedUser?.profileCompletionPercentage);
    setUser(updatedUser)
    // Also update localStorage with the fresh data
    localStorage.setItem('user', JSON.stringify(updatedUser))
  }

  const handleProfileUpdate = async () => {
    console.log('App.jsx - Profile updated, fetching fresh data');
    await fetchUserData();
  }

  const handleRefreshUserData = () => {
    console.log('App.jsx - Manual refresh triggered');
    fetchUserData()
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/" 
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LandingPage onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            user ? (
              <DashboardPage 
                user={user} 
                onLogout={handleLogout} 
                onUpdateUser={handleUpdateUser}
                onRefreshUserData={handleRefreshUserData}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/profile" 
          element={
            user ? (
              <ProfilePage 
                user={user} 
                onUpdateUser={handleUpdateUser}
                onProfileUpdate={handleProfileUpdate}
              />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/user/:id" 
          element={
            user ? (
              <PublicProfilePage />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        
        <Route 
          path="/company/:id" 
          element={
            user ? (
              <CompanyProfilePage />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
      </Routes>
    </Router>
  )
}

export default App