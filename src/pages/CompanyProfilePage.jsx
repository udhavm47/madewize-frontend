import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import CompanyProfile from '../components/CompanyProfile'

const CompanyProfilePage = () => {
  const { id } = useParams()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://localhost:3000/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          if (data.success) {
            setUser(data.data)
          }
        }
      } catch (err) {
        console.error('Failed to fetch user data:', err)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const handleUpdateUser = () => {
    // Handle user updates if needed
  }

  return (
    <CompanyProfile 
      companyId={id}
      user={user}
      onLogout={handleLogout}
      onUpdateUser={handleUpdateUser}
    />
  )
}

export default CompanyProfilePage