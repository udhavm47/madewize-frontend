import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, avatarAPI } from '../services/api';
import FileUpload from '../components/FileUpload';

const ProfilePage = ({ user, onUpdateUser, onProfileUpdate }) => {
  
  // Helper function to convert plantImages to correct object format
  const convertPlantImagesToObjects = (images) => {
    if (!Array.isArray(images)) return [];
    return images.map(img => 
      typeof img === 'string' ? { 
        url: img, 
        publicId: img.split('/').pop().split('.')[0], 
        uploadedAt: new Date() 
      } : img
    );
  };
  
  const [formData, setFormData] = useState({
    username: user?.username || '',
    personalEmail: user?.personalEmail || '',
    phoneNumber: user?.phoneNumber || '',
    address: user?.address || '',
    companyName: user?.companyName || '',
    companyDescription: user?.companyDescription || '',
    certifications: user?.certifications || [],
    vendors: user?.vendors || [],
    machines: user?.machines || [],
    productionCapacity: user?.productionCapacity || '',
    establishedOn: user?.establishedOn ? (typeof user.establishedOn === 'string' ? user.establishedOn.split('T')[0] : user.establishedOn) : '',
    companyMotto: user?.companyMotto || '',
    officialEmail: user?.officialEmail || '',
    gstinNumber: user?.gstinNumber || '',
    plantLocation: user?.plantLocation || '',
    plantImages: convertPlantImagesToObjects(user?.plantImages),
    avatar: user?.avatar || null
  });

  // Update form data when user prop changes (only on initial load)
  useEffect(() => {
    if (user && !hasFetchedData.current) {
      setFormData({
        username: user.username || '',
        personalEmail: user.personalEmail || '',
        phoneNumber: user.phoneNumber || '',
        address: user.address || '',
        companyName: user.companyName || '',
        companyDescription: user.companyDescription || '',
        certifications: user.certifications || [],
        vendors: user.vendors || [],
        machines: user.machines || [],
        productionCapacity: user.productionCapacity || '',
        establishedOn: user.establishedOn ? (typeof user.establishedOn === 'string' ? user.establishedOn.split('T')[0] : user.establishedOn) : '',
        companyMotto: user.companyMotto || '',
        officialEmail: user.officialEmail || '',
        gstinNumber: user.gstinNumber || '',
        plantLocation: user.plantLocation || '',
        plantImages: convertPlantImagesToObjects(user.plantImages)
      });
    }
  }, [user]);

  // Helper function to check if a field is empty/pending
  const isFieldEmpty = (value) => {
    if (Array.isArray(value)) {
      return value.length === 0;
    }
    return !value || value.trim() === '';
  };

  // Helper function to count completed and pending fields
  const getCompletionStats = () => {
    const fields = [
      'username',
      'personalEmail', 
      'phoneNumber',
      'address',
      'companyName',
      'companyDescription',
      'certifications',
      'vendors',
      'machines',
      'productionCapacity',
      'establishedOn',
      'companyMotto',
      'officialEmail',
      'gstinNumber',
      'plantLocation',
      'plantImages'
    ];

    const completed = fields.filter(field => !isFieldEmpty(formData[field])).length;
    const pending = fields.filter(field => isFieldEmpty(formData[field])).length;
    
    
    return { completed, pending, total: fields.length };
  };

  // Helper function to get field styling based on completion status and validation errors
  const getFieldStyling = (value, fieldName, isRequired = false) => {
    const isEmpty = isFieldEmpty(value);
    const hasError = fieldErrors[fieldName];
    const baseClasses = "w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200";
    
    if (hasError) {
      // Highlight fields with validation errors
      return `${baseClasses} !border-red-500 !bg-red-50 focus:!ring-red-500 placeholder-red-600`;
    } else if (isEmpty) {
      // Highlight empty fields with red - using !important to ensure it overrides other styles
      return `${baseClasses} !border-red-400 !bg-red-50 focus:!ring-red-500 placeholder-red-600`;
    } else {
      // Normal styling for filled fields
      return `${baseClasses} border-gray-300 focus:ring-blue-500`;
    }
  };

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [fetchingUser, setFetchingUser] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isOnProfilePage, setIsOnProfilePage] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [showCertDropdown, setShowCertDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Valid certifications list
  const validCertifications = [
    'ISO 9001:2015',
    'ISO 14001:2015',
    'ISO 45001:2018',
    'AS9100D',
    'IATF 16949:2016',
    'ISO 13485:2016',
    'FDA Registration',
    'CE Marking',
    'UL Certification',
    'RoHS Compliance',
    'Other'
  ];
  const hasFetchedData = useRef(false);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowCertDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle certification selection from dropdown
  const handleCertificationSelect = (certification) => {
    setFormData(prev => {
      const currentCerts = prev.certifications;
      if (currentCerts.includes(certification)) {
        // Remove if already selected
        return {
          ...prev,
          certifications: currentCerts.filter(cert => cert !== certification)
        };
      } else {
        // Add if not selected
        return {
          ...prev,
          certifications: [...currentCerts, certification]
        };
      }
    });
  };

  // Handle removing a certification
  const removeCertification = (certification) => {
    setFormData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certification)
    }));
  };

  // Cleanup effect to set profile page state
  useEffect(() => {
    return () => {
      setIsOnProfilePage(false);
    };
  }, []);


  // Fetch latest user data from backend only once on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        if (!user) navigate('/');
        return;
      }

      // Prevent multiple fetches
      if (hasFetchedData.current) return;
      hasFetchedData.current = true;

      try {
        setFetchingUser(true);
        const response = await authAPI.getProfile();
        if (response.data && response.data.success) {
          const userData = response.data.data;
          setFormData({
            username: userData.username || '',
            personalEmail: userData.personalEmail || '',
            phoneNumber: userData.phoneNumber || '',
            address: userData.address || '',
            companyName: userData.companyName || '',
            companyDescription: userData.companyDescription || '',
            certifications: userData.certifications || [],
            vendors: userData.vendors || [],
            machines: userData.machines || [],
            productionCapacity: userData.productionCapacity || '',
            establishedOn: userData.establishedOn ? (typeof userData.establishedOn === 'string' ? userData.establishedOn.split('T')[0] : userData.establishedOn) : '',
            companyMotto: userData.companyMotto || '',
            officialEmail: userData.officialEmail || '',
        gstinNumber: userData.gstinNumber || '',
        plantLocation: userData.plantLocation || '',
        plantImages: Array.isArray(userData.plantImages) ? userData.plantImages : []
      });
          
          // Update user data in parent component
          if (onUpdateUser) {
            onUpdateUser(userData);
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        console.error('Error details:', error.response?.data || error.message);
        // Continue with existing user data
      } finally {
        setFetchingUser(false);
      }
    };

    // Only fetch if we have user data and haven't fetched yet
    if (user && !hasFetchedData.current) {
      fetchUserData();
    }
  }, []); // Empty dependency array - only run once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setMessage('File size must be less than 10MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage('Please select an image file');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      const formData = new FormData();
      formData.append('avatar', file);

      const response = await avatarAPI.uploadAvatar(formData);
      
      if (response.data.success) {
        setFormData(prev => ({
          ...prev,
          avatar: response.data.data.avatar
        }));
        setMessage('Avatar uploaded successfully!');
        
        // Update user data in parent component
        if (onUpdateUser) {
          onUpdateUser(prev => ({
            ...prev,
            avatar: response.data.data.avatar
          }));
        }
      } else {
        setMessage('Failed to upload avatar');
      }
    } catch (error) {
      console.error('Avatar upload error:', error);
      setMessage('Failed to upload avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarRemove = async () => {
    try {
      setLoading(true);
      setMessage('');

      // You can add an API call here to remove avatar from server
      // For now, just remove from local state
      setFormData(prev => ({
        ...prev,
        avatar: null
      }));
      
      setMessage('Avatar removed successfully!');
      
      // Update user data in parent component
      if (onUpdateUser) {
        onUpdateUser(prev => ({
          ...prev,
          avatar: null
        }));
      }
    } catch (error) {
      console.error('Avatar removal error:', error);
      setMessage('Failed to remove avatar. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    // Split by comma and trim, but preserve spaces within individual items
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    
    setFormData(prev => ({
      ...prev,
      [name]: array
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  // Handle adding new items to array fields
  const handleAddArrayItem = (fieldName, inputValue) => {
    if (inputValue.trim()) {
      setFormData(prev => ({
        ...prev,
        [fieldName]: [...prev[fieldName], inputValue.trim()]
      }));
    }
  };

  // Handle key press for array inputs
  const handleArrayKeyPress = (e, fieldName) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const inputValue = e.target.value;
      if (inputValue.trim()) {
        handleAddArrayItem(fieldName, inputValue);
        e.target.value = '';
      }
    }
  };


  // Function to update database with current plant images
  const updateDatabaseWithPlantImages = async (newImages) => {
    try {
      const response = await authAPI.updateProfile({
        plantImages: newImages
      });
      
      if (response.data.success) {
        const updatedUser = response.data.data;
        
        // Update localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Update parent component
        if (onUpdateUser) {
          onUpdateUser(updatedUser);
        }
        
        // Update form data to ensure consistency
        const plantImagesFromDb = updatedUser.plantImages || newImages;
        const convertedPlantImages = convertPlantImagesToObjects(plantImagesFromDb);
        
        setFormData(prev => ({
          ...prev,
          plantImages: convertedPlantImages
        }));
        
        return true;
      }
      return false;
    } catch (error) {
      console.error('Database update failed:', error);
      return false;
    }
  };

  const handleRefreshData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      setFetchingUser(true);
      hasFetchedData.current = false; // Reset the flag
      const response = await authAPI.getProfile();
        if (response.data && response.data.success) {
          const userData = response.data.data;
        setFormData({
          username: userData.username || '',
          personalEmail: userData.personalEmail || '',
          phoneNumber: userData.phoneNumber || '',
          address: userData.address || '',
          companyName: userData.companyName || '',
          companyDescription: userData.companyDescription || '',
          certifications: userData.certifications || [],
          vendors: userData.vendors || [],
          machines: userData.machines || [],
          productionCapacity: userData.productionCapacity || '',
          establishedOn: userData.establishedOn ? (typeof userData.establishedOn === 'string' ? userData.establishedOn.split('T')[0] : userData.establishedOn) : '',
          companyMotto: userData.companyMotto || '',
          officialEmail: userData.officialEmail || '',
        gstinNumber: userData.gstinNumber || '',
        plantLocation: userData.plantLocation || '',
        plantImages: convertPlantImagesToObjects(userData.plantImages)
      });
        
        // Update user data in parent component
        if (onUpdateUser) {
          onUpdateUser(userData);
        }
        setMessage('Data refreshed successfully!');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setMessage('Error refreshing data');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setFetchingUser(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    setLoading(true);
    setMessage('');

    try {
      // Call the update profile API
      const response = await authAPI.updateProfile(formData);
      
      if (response.data.success) {
        setMessage('✅ Profile updated successfully! Redirecting to dashboard...');
        
        // Update local user data with the response from backend
        const updatedUser = response.data.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        if (onUpdateUser) {
          onUpdateUser(updatedUser);
        }

        // Call onProfileUpdate to refresh user data from backend
        if (onProfileUpdate) {
          await onProfileUpdate();
        }
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setMessage('❌ Update failed: ' + response.data.message);
      }
    } catch (error) {
      console.error('Profile update error:', error);
      console.error('Error response:', error.response);
      
      // Handle validation errors
      if (error.response?.status === 400) {
        const errorMessage = error.response.data.message;
        
        // Extract field name from error message (format: "fieldName: error message")
        const fieldMatch = errorMessage.match(/^(\w+):\s*(.+)$/);
        if (fieldMatch) {
          const fieldName = fieldMatch[1];
          const errorText = fieldMatch[2];
          
          // Set field-specific error
          setFieldErrors(prev => ({
            ...prev,
            [fieldName]: errorText
          }));
          
          setMessage(`❌ Validation Error: ${errorText}`);
        } else {
          setMessage(`❌ Validation Error: ${errorMessage}`);
        }
      } else {
        setMessage('❌ Update failed: ' + (error.response?.data?.message || error.message));
      }
    } finally {
      setLoading(false);
    }
  };

  // Show error state if there's an error
  if (hasError && !message) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-4">There was an error processing your request.</p>
          <button
            onClick={() => {
              setHasError(false);
              window.location.reload();
            }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
                Edit Profile
              </h1>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    alert('Test button clicked! Check console for form data.');
                  }}
                  className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                >
                  Test Button
                </button>
                <button
                  onClick={() => {
                    alert('Test update clicked! Check console for form data. This will NOT actually update.');
                  }}
                  className="px-3 py-1 text-sm bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 transition-colors"
                >
                  Test Update
                </button>
                <button
                  onClick={handleRefreshData}
                  disabled={fetchingUser}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {fetchingUser ? 'Refreshing...' : 'Refresh Data'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {fetchingUser && (
          <div className="bg-white rounded-lg shadow-sm border p-4 mb-6 text-center">
            <div className="flex items-center justify-center space-x-3">
              <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-gray-600">Loading fresh data...</span>
            </div>
          </div>
        )}
        
        {/* Profile Completion Summary */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>
              Profile Completion
            </h2>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-600">
                {user?.profileCompletionPercentage || 0}%
              </div>
              <div className="text-sm text-gray-500">Complete</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
              style={{ 
                width: `${user?.profileCompletionPercentage || 0}%` 
              }}
            ></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-gray-600">
                {getCompletionStats().completed} Completed
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
              <span className="text-gray-600">
                {getCompletionStats().pending} Pending
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div>
              <span className="text-gray-600">
                {getCompletionStats().total} Total Fields
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-8">
          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.includes('successful') 
                ? 'bg-green-100 text-green-700 border border-green-200' 
                : 'bg-red-100 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Required Fields */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-6 bg-blue-600 mr-3"></div>
                Required Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Username *
                    {!isFieldEmpty(formData.username) && (
                      <span className="ml-2 text-green-600 text-xs flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className={getFieldStyling(formData.username, 'username', true)}
                    placeholder={isFieldEmpty(formData.username) ? "Enter your username" : ""}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Personal Email *
                    {!isFieldEmpty(formData.personalEmail) && (
                      <span className="ml-2 text-green-600 text-xs flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    name="personalEmail"
                    value={formData.personalEmail}
                    onChange={handleChange}
                    required
                    className={getFieldStyling(formData.personalEmail, 'personalEmail', true)}
                    placeholder={isFieldEmpty(formData.personalEmail) ? "Enter your personal email" : ""}
                  />
                  {fieldErrors.personalEmail && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.personalEmail}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Phone Number *
                    {!isFieldEmpty(formData.phoneNumber) && (
                      <span className="ml-2 text-green-600 text-xs flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </span>
                    )}
                  </label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className={getFieldStyling(formData.phoneNumber, 'phoneNumber', true)}
                    placeholder={isFieldEmpty(formData.phoneNumber) ? "Enter your phone number" : ""}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Company Name *
                    {!isFieldEmpty(formData.companyName) && (
                      <span className="ml-2 text-green-600 text-xs flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    required
                    className={getFieldStyling(formData.companyName, 'companyName', true)}
                    placeholder={isFieldEmpty(formData.companyName) ? "Enter your company name" : ""}
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  Address *
                  {!isFieldEmpty(formData.address) && (
                    <span className="ml-2 text-green-600 text-xs flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Completed
                    </span>
                  )}
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  className={getFieldStyling(formData.address, 'address', true)}
                  placeholder={isFieldEmpty(formData.address) ? "Enter your address" : ""}
                />
              </div>
            </div>

            {/* Avatar Upload Section */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-6 bg-purple-600 mr-3"></div>
                Company Logo/Avatar
                <span className="ml-2 text-sm text-gray-500 font-normal">(Optional)</span>
              </h3>
              
              <div className="flex items-center space-x-6">
                {/* Current Avatar Display */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                    {formData.avatar && formData.avatar.url ? (
                      <img 
                        src={formData.avatar.url} 
                        alt="Company logo"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src="/madevize.svg" 
                        alt="Default logo"
                        className="w-12 h-12"
                      />
                    )}
                  </div>
                </div>
                
                {/* Upload Section */}
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Company Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    {formData.avatar && formData.avatar.url && (
                      <button
                        type="button"
                        onClick={handleAvatarRemove}
                        className="px-4 py-2 text-sm text-red-600 hover:text-red-800 border border-red-300 rounded-md hover:bg-red-50"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Upload an image (any dimensions). Max size: 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Fields */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <div className="w-1 h-6 bg-gray-400 mr-3"></div>
                Optional Information
                <span className="ml-2 text-sm text-gray-500 font-normal">(Complete for better reach)</span>
                <span className="ml-4 text-sm text-red-600 font-normal flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  Red fields need completion
                </span>
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Company Description
                    {!isFieldEmpty(formData.companyDescription) && (
                      <span className="ml-2 text-green-600 text-xs flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </span>
                    )}
                  </label>
                  <textarea
                    name="companyDescription"
                    value={formData.companyDescription}
                    onChange={handleChange}
                    rows={4}
                    className={getFieldStyling(formData.companyDescription, 'companyDescription')}
                    placeholder={isFieldEmpty(formData.companyDescription) ? "Describe your company and manufacturing capabilities" : ""}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Certifications
                      {!isFieldEmpty(formData.certifications) && (
                        <span className="ml-2 text-green-600 text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      )}
                    </label>
                    
                    {/* Selected Certifications Display */}
                    {formData.certifications.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {formData.certifications.map((cert, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {cert}
                            <button
                              type="button"
                              onClick={() => removeCertification(cert)}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    {/* Dropdown Button */}
                    <div className="relative" ref={dropdownRef}>
                      <button
                        type="button"
                        onClick={() => setShowCertDropdown(!showCertDropdown)}
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between ${
                          fieldErrors.certifications
                            ? 'border-red-500 bg-red-50 focus:ring-red-500'
                            : isFieldEmpty(formData.certifications)
                              ? 'border-red-400 bg-red-50 focus:ring-red-500'
                              : 'border-gray-300 bg-white focus:ring-blue-500'
                        }`}
                      >
                        <span className={formData.certifications.length === 0 ? "text-gray-400" : "text-gray-900"}>
                          {formData.certifications.length === 0 ? "Select certifications..." : `${formData.certifications.length} selected`}
                        </span>
                        <svg className={`w-5 h-5 transition-transform ${showCertDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {showCertDropdown && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {validCertifications.map((cert) => (
                            <button
                              key={cert}
                              type="button"
                              onClick={() => handleCertificationSelect(cert)}
                              className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors flex items-center ${
                                formData.certifications.includes(cert) ? 'bg-blue-100 text-blue-800' : 'text-gray-900'
                              }`}
                            >
                              <span className="flex-1">{cert}</span>
                              {formData.certifications.includes(cert) && (
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <p className="text-xs text-gray-500 mt-1">
                      Click to select multiple certifications
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Vendors
                      {!isFieldEmpty(formData.vendors) && (
                        <span className="ml-2 text-green-600 text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      )}
                    </label>
                    
                    {/* Selected Vendors Display */}
                    {formData.vendors.length > 0 && (
                      <div className="mb-2 flex flex-wrap gap-2">
                        {formData.vendors.map((vendor, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {vendor}
                            <button
                              type="button"
                              onClick={() => {
                                setFormData(prev => ({
                                  ...prev,
                                  vendors: prev.vendors.filter((_, i) => i !== index)
                                }));
                              }}
                              className="ml-2 text-green-600 hover:text-green-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder={isFieldEmpty(formData.vendors) ? "Enter vendor name and press Enter" : "Add more vendors..."}
                        onKeyPress={(e) => handleArrayKeyPress(e, 'vendors')}
                        className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                          fieldErrors.vendors
                            ? 'border-red-500 bg-red-50 focus:ring-red-500'
                            : 'border-gray-300 bg-white focus:ring-blue-500'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          const input = e.target.previousElementSibling;
                          if (input.value.trim()) {
                            handleAddArrayItem('vendors', input.value);
                            input.value = '';
                          }
                        }}
                        className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Add
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Type vendor name and press Enter or click Add (spaces are allowed)
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Machines
                    {!isFieldEmpty(formData.machines) && (
                      <span className="ml-2 text-green-600 text-xs flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </span>
                    )}
                  </label>
                  
                  {/* Selected Machines Display */}
                  {formData.machines.length > 0 && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {formData.machines.map((machine, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                        >
                          {machine}
                          <button
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({
                                ...prev,
                                machines: prev.machines.filter((_, i) => i !== index)
                              }));
                            }}
                            className="ml-2 text-purple-600 hover:text-purple-800"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder={isFieldEmpty(formData.machines) ? "Enter machine name and press Enter" : "Add more machines..."}
                      onKeyPress={(e) => handleArrayKeyPress(e, 'machines')}
                      className={`flex-1 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                        fieldErrors.machines
                          ? 'border-red-500 bg-red-50 focus:ring-red-500'
                          : 'border-gray-300 bg-white focus:ring-blue-500'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        const input = e.target.previousElementSibling;
                        if (input.value.trim()) {
                          handleAddArrayItem('machines', input.value);
                          input.value = '';
                        }
                      }}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Type machine name and press Enter or click Add (spaces are allowed)
                  </p>
                  {fieldErrors.machines && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.machines}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Production Capacity
                      {!isFieldEmpty(formData.productionCapacity) && (
                        <span className="ml-2 text-green-600 text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="productionCapacity"
                      value={formData.productionCapacity}
                      onChange={handleChange}
                      placeholder={isFieldEmpty(formData.productionCapacity) ? "1000 units per day" : ""}
                      className={getFieldStyling(formData.productionCapacity, 'productionCapacity')}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Established On
                      {!isFieldEmpty(formData.establishedOn) && (
                        <span className="ml-2 text-green-600 text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      )}
                    </label>
                    <input
                      type="date"
                      name="establishedOn"
                      value={formData.establishedOn}
                      onChange={handleChange}
                      className={getFieldStyling(formData.establishedOn, 'establishedOn')}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Company Motto
                    {!isFieldEmpty(formData.companyMotto) && (
                      <span className="ml-2 text-green-600 text-xs flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="companyMotto"
                    value={formData.companyMotto}
                    onChange={handleChange}
                    placeholder={isFieldEmpty(formData.companyMotto) ? "Your company's mission statement" : ""}
                    className={getFieldStyling(formData.companyMotto, 'companyMotto')}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    Official Email
                    {!isFieldEmpty(formData.officialEmail) && (
                      <span className="ml-2 text-green-600 text-xs flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Completed
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    name="officialEmail"
                    value={formData.officialEmail}
                    onChange={handleChange}
                    placeholder={isFieldEmpty(formData.officialEmail) ? "Enter your official company email" : ""}
                    className={getFieldStyling(formData.officialEmail, 'officialEmail')}
                  />
                  {fieldErrors.officialEmail && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.officialEmail}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      GSTIN Number
                      {!isFieldEmpty(formData.gstinNumber) && (
                        <span className="ml-2 text-green-600 text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="gstinNumber"
                      value={formData.gstinNumber}
                      onChange={handleChange}
                      placeholder={isFieldEmpty(formData.gstinNumber) ? "12ABCDE1234F1Z5" : ""}
                      className={getFieldStyling(formData.gstinNumber, 'gstinNumber')}
                    />
                    {fieldErrors.gstinNumber && (
                      <p className="mt-1 text-sm text-red-600">{fieldErrors.gstinNumber}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Plant Location
                      {!isFieldEmpty(formData.plantLocation) && (
                        <span className="ml-2 text-green-600 text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      name="plantLocation"
                      value={formData.plantLocation}
                      onChange={handleChange}
                      placeholder={isFieldEmpty(formData.plantLocation) ? "Detroit, Michigan, USA" : ""}
                      className={getFieldStyling(formData.plantLocation, 'plantLocation')}
                    />
                  </div>
                </div>

                {/* Plant Images Upload */}
                <div className="mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      Plant Images
                      {!isFieldEmpty(formData.plantImages) && (
                        <span className="ml-2 text-green-600 text-xs flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Completed
                        </span>
                      )}
                    </label>
                    
                    <FileUpload
                      selectedFiles={selectedFiles}
                      setSelectedFiles={setSelectedFiles}
                      uploadedImages={formData.plantImages || []}
                      onImagesUpdate={(newImages) => {
                        setFormData(prev => ({
                          ...prev,
                          plantImages: newImages
                        }));
                      }}
                      maxFiles={5}
                      accept="image/*"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between space-x-4 pt-6">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-8 py-3 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span>Back to Dashboard</span>
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg flex items-center space-x-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <span>Update Profile</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
