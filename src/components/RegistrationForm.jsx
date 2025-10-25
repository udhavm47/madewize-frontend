import { useState, useEffect, useRef } from 'react';
import { authAPI } from '../services/api';
import FileUpload from './FileUpload';

const RegistrationForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    personalEmail: '',
    phoneNumber: '',
    address: '',
    companyName: '',
    companyDescription: '',
    certifications: [],
    vendors: [],
    machines: [],
    productionCapacity: '',
    establishedOn: '',
    companyMotto: '',
    officialEmail: '',
    gstinNumber: '',
    plantLocation: '',
    plantImages: []
  });
  const [selectedFiles, setSelectedFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showCertDropdown, setShowCertDropdown] = useState(false);
  const dropdownRef = useRef(null);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleArrayChange = (e) => {
    const { name, value } = e.target;
    // Split by comma and trim, but preserve spaces within individual items
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    
    setFormData(prev => ({
      ...prev,
      [name]: array
    }));
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      // Create FormData for full registration with all fields including files
      const registrationData = new FormData();
      
      // Add all form fields
      registrationData.append('username', formData.username);
      registrationData.append('password', formData.password);
      registrationData.append('personalEmail', formData.personalEmail);
      registrationData.append('phoneNumber', formData.phoneNumber);
      registrationData.append('address', formData.address);
      registrationData.append('companyName', formData.companyName);
      
      // Add optional fields if they have values
      if (formData.companyDescription) {
        registrationData.append('companyDescription', formData.companyDescription);
      }
      if (formData.certifications && formData.certifications.length > 0) {
        registrationData.append('certifications', formData.certifications.join(','));
      }
      if (formData.vendors && formData.vendors.length > 0) {
        registrationData.append('vendors', formData.vendors.join(','));
      }
      if (formData.machines && formData.machines.length > 0) {
        registrationData.append('machines', formData.machines.join(','));
      }
      if (formData.productionCapacity) {
        registrationData.append('productionCapacity', formData.productionCapacity);
      }
      if (formData.establishedOn) {
        registrationData.append('establishedOn', formData.establishedOn);
      }
      if (formData.companyMotto) {
        registrationData.append('companyMotto', formData.companyMotto);
      }
      if (formData.officialEmail) {
        registrationData.append('officialEmail', formData.officialEmail);
      }
      if (formData.gstinNumber) {
        registrationData.append('gstinNumber', formData.gstinNumber);
      }
      if (formData.plantLocation) {
        registrationData.append('plantLocation', formData.plantLocation);
      }
      
      // Add plant images files
      if (formData.plantImages && formData.plantImages.length > 0) {
        const filesToUpload = formData.plantImages.filter(img => img.file);
        filesToUpload.forEach(img => {
          registrationData.append('plantImages', img.file);
        });
      }

      const response = await authAPI.register(registrationData);
      
      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.data.token);
        
        // Fetch complete user profile to get all data including plant images
        try {
          const profileResponse = await authAPI.getProfile();
          if (profileResponse.data.success) {
            localStorage.setItem('user', JSON.stringify(profileResponse.data.data));
            setMessage('Registration successful! You can now build your complete profile.');
          } else {
            // Fallback to limited user data if profile fetch fails
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            setMessage('Registration successful! You can now build your complete profile.');
          }
        } catch (profileError) {
          // Fallback to limited user data if profile fetch fails
          localStorage.setItem('user', JSON.stringify(response.data.data.user));
          setMessage('Registration successful! You can now build your complete profile.');
        }
      }
      
      // Don't close modal, let user continue building profile
      setLoading(false);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
      setLoading(false);
    }
  };


  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-4xl font-bold text-white" style={{ fontFamily: 'Inter, sans-serif' }}>
          Build Your Profile
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition-colors duration-200 p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.includes('successful') 
            ? 'bg-green-900/20 text-green-400 border-green-500/30' 
            : 'bg-red-900/20 text-red-400 border-red-500/30'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Required Fields */}
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
            <div className="w-1 h-6 bg-white mr-3"></div>
            Required Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username *
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                placeholder="Enter your username"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Personal Email *
            </label>
            <input
              type="email"
              name="personalEmail"
              value={formData.personalEmail}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
              placeholder="Enter your personal email"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Name *
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                placeholder="Enter your company name"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Address *
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 resize-none"
              placeholder="Enter your company address"
            />
          </div>
        </div>

        {/* Optional Fields */}
        <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-1 h-6 bg-gray-400 mr-3"></div>
            Optional Information
            <span className="ml-2 text-sm text-gray-400 font-normal">(Complete for better reach)</span>
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Description
              </label>
              <textarea
                name="companyDescription"
                value={formData.companyDescription}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 resize-none"
                placeholder="Describe your company and manufacturing capabilities"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Certifications
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
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200 text-left flex items-center justify-between"
                  >
                    <span className={formData.certifications.length === 0 ? "text-gray-400" : "text-white"}>
                      {formData.certifications.length === 0 ? "Select certifications..." : `${formData.certifications.length} selected`}
                    </span>
                    <svg className={`w-5 h-5 transition-transform ${showCertDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {showCertDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-gray-700 border border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {validCertifications.map((cert) => (
                        <button
                          key={cert}
                          type="button"
                          onClick={() => handleCertificationSelect(cert)}
                          className={`w-full px-4 py-2 text-left hover:bg-gray-600 transition-colors flex items-center ${
                            formData.certifications.includes(cert) ? 'bg-blue-600 text-white' : 'text-gray-300'
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
                
                <p className="text-xs text-gray-400 mt-1">
                  Click to select multiple certifications
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Vendors
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
                    placeholder="Enter vendor name and press Enter"
                    onKeyPress={(e) => handleArrayKeyPress(e, 'vendors')}
                    className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
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
                <p className="text-xs text-gray-400 mt-1">
                  Type vendor name and press Enter or click Add (spaces are allowed)
                </p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Machines
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
                  placeholder="Enter machine name and press Enter"
                  onKeyPress={(e) => handleArrayKeyPress(e, 'machines')}
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
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
              <p className="text-xs text-gray-400 mt-1">
                Type machine name and press Enter or click Add (spaces are allowed)
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Production Capacity
                </label>
                <input
                  type="text"
                  name="productionCapacity"
                  value={formData.productionCapacity}
                  onChange={handleChange}
                  placeholder="1000 units per day"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Established On
                </label>
                <input
                  type="date"
                  name="establishedOn"
                  value={formData.establishedOn}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Company Motto
              </label>
              <input
                type="text"
                name="companyMotto"
                value={formData.companyMotto}
                onChange={handleChange}
                placeholder="Quality First, Innovation Always"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Official Email
              </label>
              <input
                type="email"
                name="officialEmail"
                value={formData.officialEmail}
                onChange={handleChange}
                placeholder="Enter your official company email"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  GSTIN Number
                </label>
                <input
                  type="text"
                  name="gstinNumber"
                  value={formData.gstinNumber}
                  onChange={handleChange}
                  placeholder="12ABCDE1234F1Z5"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plant Location
                </label>
                <input
                  type="text"
                  name="plantLocation"
                  value={formData.plantLocation}
                  onChange={handleChange}
                  placeholder="Detroit, Michigan, USA"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Plant Images Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plant Images (Optional)
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
              variant="dark"
              requireAuth={false}
              showUploadButton={false}
            />
              </div>
            </div>
          </div>
        </div>


        <div className="flex justify-between space-x-4 pt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-all duration-200 border border-gray-600"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Cancel
          </button>
          
          <div className="flex space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                  </svg>
                </>
              )}
            </button>
            
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
