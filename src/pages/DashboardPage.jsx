import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import ProfileCompletionModal from '../components/ProfileCompletionModal';
import UserSearch from '../components/UserSearch';

const DashboardPage = ({ user, onLogout, onUpdateUser, onRefreshUserData }) => {
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState('');
  const [showProfileCompletion, setShowProfileCompletion] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const hasFetchedUserData = useRef(false);

  // Fetch fresh user data from backend
  const fetchUserData = async () => {
    const token = localStorage.getItem('token');
    if (!token || hasFetchedUserData.current) return;
    
    // If user prop already has data, don't fetch again
    if (user && user.profileCompletionPercentage) {
      console.log('Dashboard - User prop already has data, skipping fetch');
      return;
    }

    try {
      setLoadingUserData(true);
      hasFetchedUserData.current = true;
      
      // Clear any cached user data to force fresh fetch
      console.log('Dashboard - Clearing cached user data and fetching fresh data');
      localStorage.removeItem('user');
      const response = await authAPI.getProfile();
      console.log('Dashboard - Profile API response:', response.data);
      console.log('Dashboard - Raw API response status:', response.status);
      console.log('Dashboard - Raw API response headers:', response.headers);
      
      if (response.data && response.data.success) {
        const userData = response.data.data;
        console.log('Dashboard - Setting user data with:', userData);
        console.log('Dashboard - User completion percentage from API:', userData.profileCompletionPercentage);
        setCurrentUser(userData);
        setProfileCompletion(userData.profileCompletionPercentage || 0);
        
        // Update parent component with fresh data
        if (onUpdateUser) {
          onUpdateUser(userData);
        }
        
        // Show profile completion modal if profile is less than 80% complete
        const completionPercentage = userData.profileCompletionPercentage || 0;
        console.log('Profile completion percentage:', completionPercentage);
        if (completionPercentage < 80) {
          console.log('Showing profile completion modal');
          setShowProfileCompletion(true);
        } else {
          console.log('Profile completion is 80% or higher, not showing modal');
          setShowProfileCompletion(false);
        }
      }
    } catch (error) {
      console.error('Error fetching user data in dashboard:', error);
      // Continue with existing user data
    } finally {
      setLoadingUserData(false);
    }
  };

  useEffect(() => {
    if (user) {
      setProfileCompletion(user.profileCompletionPercentage || 0);
      setCurrentUser(user);
      
      // Show profile completion modal if profile is less than 80% complete
      const completionPercentage = user.profileCompletionPercentage || 0;
      console.log('Profile completion percentage:', completionPercentage);
      if (completionPercentage < 80) {
        console.log('Showing profile completion modal');
        setShowProfileCompletion(true);
      } else {
        console.log('Profile completion is 80% or higher, not showing modal');
        setShowProfileCompletion(false);
      }
      
      // Only fetch fresh data if user prop doesn't have completion percentage
      if (!user.profileCompletionPercentage) {
        console.log('Dashboard - User prop missing completion percentage, fetching fresh data');
        fetchUserData();
      }
    }
  }, [user]);

  const handleUpdateProfile = (updatedUser) => {
    setCurrentUser(updatedUser);
    setProfileCompletion(updatedUser.profileCompletionPercentage || 0);
    if (onUpdateUser) onUpdateUser(updatedUser);
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post = {
        id: Date.now(),
        content: newPost,
        author: currentUser.username,
        company: currentUser.companyName,
        timestamp: new Date().toISOString(),
        likes: 0,
        comments: []
      };
      setPosts([post, ...posts]);
      setNewPost('');
    }
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                madevize
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search Button */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:block">Search Users</span>
              </button>
              
              {/* Debug buttons for testing modal */}
              <button
                onClick={() => setShowProfileCompletion(true)}
                className="px-3 py-1 text-xs bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
              >
                Test Modal
              </button>
              <button
                onClick={() => {
                  const testUser = { ...currentUser, profileCompletionPercentage: 30 };
                  setCurrentUser(testUser);
                  setProfileCompletion(30);
                  setShowProfileCompletion(true);
                }}
                className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
              >
                Test Low %
              </button>
              <button
                onClick={() => {
                  console.log('Dashboard - Manual refresh triggered');
                  if (onRefreshUserData) {
                    onRefreshUserData();
                  } else {
                    hasFetchedUserData.current = false;
                    localStorage.removeItem('user'); // Clear cache
                    fetchUserData();
                  }
                }}
                disabled={loadingUserData}
                className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors disabled:opacity-50"
              >
                {loadingUserData ? 'Loading...' : 'Refresh Data'}
              </button>
              
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowUserDropdown(!showUserDropdown)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors"
                >
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">
                      {currentUser?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium">{currentUser?.username}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showUserDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-50">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setShowUserDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </button>
                      <button
                        onClick={() => {
                          onLogout();
                          setShowUserDropdown(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {showSearch && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Search Users</h2>
                <button
                  onClick={() => setShowSearch(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <UserSearch onClose={() => setShowSearch(false)} />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loadingUserData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-blue-700">Loading fresh user data...</span>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-700">
                    {currentUser?.username?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{currentUser?.username}</h2>
                <p className="text-gray-600 mb-4">{currentUser?.companyName}</p>
                
                {/* Profile Completion */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Profile Completion</span>
                    <span>{profileCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{posts.length}</div>
                    <div className="text-sm text-gray-600">Posts</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">0</div>
                    <div className="text-sm text-gray-600">Connections</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info */}
            {currentUser?.companyDescription && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About {currentUser?.companyName}</h3>
                <p className="text-gray-600 text-sm">{currentUser?.companyDescription}</p>
                
                {currentUser?.certifications && currentUser.certifications.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Certifications</h4>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.certifications.map((cert, index) => (
                        <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {cert}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Main Content - Feed */}
          <div className="lg:col-span-2">
            {/* Create Post */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <form onSubmit={handlePostSubmit}>
                <div className="flex space-x-4">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-gray-700">
                      {currentUser?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newPost}
                      onChange={(e) => setNewPost(e.target.value)}
                      placeholder="Share an update about your manufacturing..."
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows="3"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Post
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            {/* Posts Feed */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-gray-700">
                        {post.author.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{post.author}</h3>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{post.company}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-500">
                          {new Date(post.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-800 mb-4">{post.content}</p>
                      <div className="flex items-center space-x-6">
                        <button
                          onClick={() => handleLike(post.id)}
                          className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          <span>{post.likes}</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>Comment</span>
                        </button>
                        <button className="flex items-center space-x-2 text-gray-500 hover:text-blue-600 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                          </svg>
                          <span>Share</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {posts.length === 0 && (
                <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
                  <p className="text-gray-600">Share your first manufacturing update to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Completion Modal */}
      {showProfileCompletion && (
        <ProfileCompletionModal
          user={currentUser}
          onClose={() => setShowProfileCompletion(false)}
          onCompleteProfile={() => {
            setShowProfileCompletion(false);
            navigate('/profile');
          }}
        />
      )}

      {/* Click outside to close dropdown */}
      {showUserDropdown && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserDropdown(false)}
        />
      )}
    </div>
  );
};

export default DashboardPage;
