import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { authAPI } from '../services/api'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1 } }

// Mock data based on backend structure
const initialMockCompanyData = {
  id: 'demo-company-123',
  companyName: 'Advanced Manufacturing Solutions',
  companyDescription: 'We are a leading precision manufacturing company specializing in CNC machining, fabrication, and assembly services. With over 20 years of experience, we deliver high-quality components for aerospace, automotive, and medical industries.',
  companyMotto: 'Excellence in Every Component',
  vendors: ['Steel Suppliers Inc', 'Tooling Solutions Ltd', 'Material Corp', 'Precision Tools Co'],
  machines: ['CNC Milling Center', '5-Axis CNC', 'Lathe Machines', 'Welding Equipment', 'Quality Testing Lab'],
  certifications: ['ISO 9001:2015', 'AS9100D', 'ISO 14001:2015'],
  productionCapacity: '10,000+ units per month',
  establishedOn: '2003-01-15',
  plantLocation: '123 Industrial Park, Manufacturing City, State 12345',
  officialEmail: 'info@advancedmfg.com',
  gstinNumber: '12ABCDE1234F1Z5',
  avatar: {
    url: '/madevize.svg',
    publicId: 'demo-avatar'
  },
  plantImages: [
    { url: '/NewBackground.jpeg', publicId: 'plant-1' },
    { url: '/about2.jpeg', publicId: 'plant-2' },
    { url: '/about3.jpeg', publicId: 'plant-3' }
  ],
  profileCompletionPercentage: 85
}

const DemoCompanyProfilePage = () => {
  const [company, setCompany] = useState(initialMockCompanyData)
  const [editingFields, setEditingFields] = useState({})
  const [isEditMode, setIsEditMode] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Mock user data for navbar
  const mockUser = {
    username: 'demo_user',
    companyName: company.companyName
  }

  const startEditing = (fieldName) => {
    setEditingFields(prev => ({ ...prev, [fieldName]: true }))
    setIsEditMode(true)
  }

  const stopEditing = (fieldName) => {
    setEditingFields(prev => {
      const newFields = { ...prev }
      delete newFields[fieldName]
      return newFields
    })
    
    // If no more fields are being edited, turn off edit mode
    const remainingFields = Object.keys(editingFields).filter(f => f !== fieldName)
    if (remainingFields.length === 1) { // Only the one we're removing
      setIsEditMode(false)
    }
  }

  const handleFieldChange = (fieldName, value) => {
    setCompany(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleArrayFieldChange = (fieldName, index, value) => {
    setCompany(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => i === index ? value : item)
    }))
  }

  const handleAddArrayItem = (fieldName) => {
    // Enter edit mode if not already editing
    if (!editingFields[fieldName]) {
      startEditing(fieldName)
    }
    
    // Add new empty item
    setCompany(prev => ({
      ...prev,
      [fieldName]: [...(prev[fieldName] || []), '']
    }))
  }

  const handleRemoveArrayItem = (fieldName, index) => {
    setCompany(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].filter((_, i) => i !== index)
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveMessage('')
    
    try {
      // In demo mode, we'll simulate saving
      // In real implementation, you would call: await authAPI.updateProfile(company)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setSaveMessage('✅ Changes saved successfully! (Demo Mode)')
      setIsEditMode(false)
      setEditingFields({})
      
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('❌ Failed to save changes. Please try again.')
      setTimeout(() => setSaveMessage(''), 3000)
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    window.location.href = '/'
  }

  const handleUpdateUser = () => {
    // Handle user updates if needed
  }

  return (
    <div className="min-h-screen bg-black text-white font-montserrat">
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <Navbar 
          user={mockUser} 
      onLogout={handleLogout}
      onUpdateUser={handleUpdateUser}
          showDebugButtons={false}
        />
        
        {/* Edit Mode Banner */}
        {/* {isEditMode && (
          <div className="max-w-6xl mx-auto mt-4 mb-4 p-4 bg-yellow-600/20 border border-yellow-500 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <span className="text-yellow-300 font-medium">Edit Mode: Click on fields to edit. Click outside to save individual fields.</span>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#FC6500] text-black px-4 py-2 rounded-md font-semibold hover:bg-[#e55a00] disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        )} */}

        {saveMessage && (
          <div className={`max-w-6xl mx-auto mt-2 mb-4 p-3 rounded-lg ${
            saveMessage.includes('✅') ? 'bg-green-600/20 border border-green-500 text-green-300' : 'bg-red-600/20 border border-red-500 text-red-300'
          }`}>
            {saveMessage}
          </div>
        )}

        <Hero company={company} isEditMode={isEditMode} editingFields={editingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
        <About company={company} isEditMode={isEditMode} editingFields={editingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
        <Vendors company={company} isEditMode={isEditMode} editingFields={editingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} onArrayChange={handleArrayFieldChange} onAddItem={handleAddArrayItem} onRemoveItem={handleRemoveArrayItem} />
        <Certifications company={company} isEditMode={isEditMode} editingFields={editingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
        <Machines company={company} isEditMode={isEditMode} editingFields={editingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} onArrayChange={handleArrayFieldChange} onAddItem={handleAddArrayItem} onRemoveItem={handleRemoveArrayItem} />
        <Details company={company} isEditMode={isEditMode} editingFields={editingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
        <Gallery company={company} />
        <Contact company={company} isEditMode={isEditMode} editingFields={editingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
      </div>
    </div>
  )
}

// Editable field component
const EditableField = ({ 
  value, 
  fieldName, 
  isEditing, 
  onStartEdit, 
  onStopEdit, 
  onChange, 
  type = 'text',
  placeholder = '',
  className = '',
  maxLength,
  multiline = false
}) => {
  const handleClick = (e) => {
    if (!isEditing && onStartEdit) {
      onStartEdit(fieldName)
    }
  }

  const handleBlur = () => {
    if (isEditing && onStopEdit) {
      onStopEdit(fieldName)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !multiline) {
      handleBlur()
    } else if (e.key === 'Escape') {
      handleBlur()
    }
  }

  if (isEditing) {
    if (multiline) {
      return (
        <textarea
          value={value || ''}
          onChange={(e) => onChange(fieldName, e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus
          className={`bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FC6500] ${className}`}
        />
      )
    }
    return (
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(fieldName, e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        autoFocus
        className={`bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FC6500] ${className}`}
      />
    )
  }

  return (
    <div 
      onClick={handleClick}
      className={`cursor-pointer hover:bg-gray-800/50 rounded px-2 py-1 transition-colors group relative ${className} ${!value ? 'text-gray-500 italic' : ''}`}
      title="Click to edit"
    >
      {value || <span className="text-gray-500 italic">{placeholder || 'Click to add...'}</span>}
      <svg 
        className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    </div>
  )
}

function Hero({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange }) {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-start">
        <motion.div variants={fadeUp} className="md:col-span-2 order-2 md:order-1">
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4">
                {editingFields.companyName ? (
                  <input
                    type="text"
                    value={company?.companyName || ''}
                    onChange={(e) => onFieldChange('companyName', e.target.value)}
                    onBlur={() => onStopEdit('companyName')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Escape') {
                        onStopEdit('companyName')
                      }
                    }}
                    className="bg-gray-700 border-2 border-[#FC6500] rounded p-2 sm:p-3 text-white text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold w-full focus:outline-none focus:ring-2 focus:ring-[#FC6500]"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={() => onStartEdit('companyName')}
                    className="cursor-pointer hover:bg-gray-800/50 rounded px-2 py-1 transition-colors inline-block group relative"
                    title="Click to edit"
                  >
                    {company?.companyName || 'Company Name'}
                    <svg 
                      className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 absolute -right-4 sm:-right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ml-2" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </span>
                )}
              </h1>
              <div className="text-base sm:text-lg text-gray-300 leading-relaxed">
                {editingFields.companyDescriptionHero ? (
                  <textarea
                    value={company?.companyDescription || ''}
                    onChange={(e) => onFieldChange('companyDescription', e.target.value)}
                    onBlur={() => onStopEdit('companyDescriptionHero')}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') {
                        onStopEdit('companyDescriptionHero')
                      }
                    }}
                    maxLength={1000}
                    className="bg-gray-700 border-2 border-[#FC6500] rounded p-2 sm:p-3 text-white w-full min-h-[80px] sm:min-h-[100px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FC6500] resize-y"
                    autoFocus
                  />
                ) : (
                  <span
                    onClick={(e) => {
                      e.stopPropagation()
                      onStartEdit('companyDescriptionHero')
                    }}
                    className="cursor-pointer hover:bg-gray-800/50 rounded px-2 py-1 transition-colors inline-block group relative w-full"
                    title="Click to edit"
                  >
                    {company?.companyDescription || 'Company description...'}
                    <svg 
                      className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <button className="bg-[#FC6500] text-black px-4 sm:px-5 py-2 rounded-md font-semibold text-sm sm:text-base w-full sm:w-auto">View Materials</button>
              <button className="border border-gray-700 px-4 sm:px-5 py-2 rounded-md text-sm sm:text-base w-full sm:w-auto">Get Quote</button>
            </div>
          </div>
        </motion.div>

        <motion.aside variants={fadeUp} className="flex justify-center order-1 md:order-2 mb-6 md:mb-0">
          {company?.avatar && company.avatar.url ? (
            <img 
              src={company.avatar.url} 
              alt={`${company.companyName} logo`}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
            />
          ) : (
            <img 
              src="/madevize.svg" 
              alt="Default logo"
              className="w-24 h-24 sm:w-32 sm:h-32"
            />
          )}
        </motion.aside>
      </div>
    </motion.section>
  )
}

function About({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange }) {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-8 sm:py-12 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-start md:items-center">
        <motion.div variants={fadeUp}>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">About Us</h2>
          <div className="text-gray-300 leading-relaxed">
            {editingFields.companyDescriptionAbout ? (
              <textarea
                value={company?.companyDescription || ''}
                onChange={(e) => onFieldChange('companyDescription', e.target.value)}
                onBlur={() => onStopEdit('companyDescriptionAbout')}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    onStopEdit('companyDescriptionAbout')
                  }
                }}
                maxLength={1000}
                className="bg-gray-700 border-2 border-[#FC6500] rounded p-2 sm:p-3 text-white w-full min-h-[100px] sm:min-h-[120px] text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FC6500] resize-y"
                autoFocus
              />
            ) : (
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  onStartEdit('companyDescriptionAbout')
                }}
                className="cursor-pointer hover:bg-gray-800/50 rounded px-2 py-1 transition-colors inline-block group relative w-full text-sm sm:text-base"
                title="Click to edit"
              >
                {company?.companyDescription || 'Company description...'}
                <svg 
                  className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
            )}
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-4">
          <div className="bg-gray-800 p-4 sm:p-5 md:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Experience</h3>
            <div className="text-gray-300">
              {editingFields.establishedOn ? (
                <input
                  type="date"
                  value={company?.establishedOn ? company.establishedOn.split('T')[0] : ''}
                  onChange={(e) => {
                    // Convert YYYY-MM-DD to ISO string
                    const dateValue = e.target.value
                    if (dateValue) {
                      const isoString = new Date(dateValue + 'T00:00:00').toISOString()
                      onFieldChange('establishedOn', isoString)
                    } else {
                      onFieldChange('establishedOn', '')
                    }
                  }}
                  onBlur={() => onStopEdit('establishedOn')}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      onStopEdit('establishedOn')
                    }
                  }}
                  className="bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FC6500]"
                  autoFocus
                />
              ) : (
                <p
                  onClick={() => onStartEdit('establishedOn')}
                  className="cursor-pointer hover:bg-gray-700/50 rounded px-2 py-1 transition-colors inline-block group relative text-sm sm:text-base"
                  title="Click to edit"
                >
                  {company?.establishedOn ? new Date(company.establishedOn).getFullYear() + ' (' + (new Date().getFullYear() - new Date(company.establishedOn).getFullYear()) + '+ Years)' : 'Not set'}
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </p>
              )}
            </div>
          </div>
          <div className="bg-gray-800 p-4 sm:p-5 md:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">Production Capacity</h3>
            <div className="text-gray-300">
              {editingFields.productionCapacity ? (
                <input
                  type="text"
                  value={company?.productionCapacity || ''}
                  onChange={(e) => onFieldChange('productionCapacity', e.target.value)}
                  onBlur={() => onStopEdit('productionCapacity')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      onStopEdit('productionCapacity')
                    }
                  }}
                  placeholder="Enter production capacity"
                  className="bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FC6500]"
                  autoFocus
                />
              ) : (
                <p
                  onClick={() => onStartEdit('productionCapacity')}
                  className="cursor-pointer hover:bg-gray-700/50 rounded px-2 py-1 transition-colors inline-block group relative text-sm sm:text-base"
                  title="Click to edit"
                >
                  {company?.productionCapacity || 'Not set'}
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

function Vendors({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange, onArrayChange, onAddItem, onRemoveItem }) {
  const isEditing = editingFields.vendors

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-8 sm:py-12 md:py-16">
      <motion.div variants={fadeUp} className="text-center mb-8 sm:mb-10 md:mb-12">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Our Vendors</h2>
          {!isEditing && (
            <button
              onClick={() => onStartEdit('vendors')}
              className="text-gray-400 hover:text-[#FC6500] mb-2 sm:mb-4"
              title="Edit vendors"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-sm sm:text-base text-gray-300">Trusted partners and suppliers</p>
      </motion.div>
      
      {isEditing ? (
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {company?.vendors && company.vendors.length > 0 ? (
              company.vendors.map((vendor, index) => (
                <div key={index} className="bg-gray-800 p-3 sm:p-4 rounded-lg text-center">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={vendor}
                      onChange={(e) => onArrayChange('vendors', index, e.target.value)}
                      className="flex-1 bg-gray-700 border-2 border-[#FC6500] rounded p-1.5 sm:p-2 text-white text-xs sm:text-sm focus:outline-none"
                      autoFocus={index === company.vendors.length - 1 && vendor === ''}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.target.blur()
                        }
                      }}
                    />
                    <button
                      onClick={() => onRemoveItem('vendors', index)}
                      className="text-red-400 hover:text-red-300 font-bold text-lg sm:text-xl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0"
                      title="Remove vendor"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))
            ) : null}
            <button
              onClick={() => onAddItem('vendors')}
              className="bg-gray-700 hover:bg-gray-600 p-3 sm:p-4 rounded-lg text-center text-gray-300 border-2 border-dashed border-gray-600 min-h-[50px] sm:min-h-[60px] flex items-center justify-center text-sm sm:text-base"
            >
              + Add Vendor
            </button>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => onStopEdit('vendors')}
              className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-green-700 text-sm sm:text-base"
            >
              Done Editing
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {company?.vendors && company.vendors.length > 0 ? (
            company.vendors.map((vendor, index) => (
              <div key={index} className="bg-gray-800 p-3 sm:p-4 rounded-lg text-center">
                <h3 className="text-white font-semibold text-sm sm:text-base">{vendor}</h3>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 text-sm sm:text-base px-4">
              No vendors listed. Click edit to add vendors.
            </div>
          )}
        </motion.div>
      )}
    </motion.section>
  )
}

function Certifications({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange }) {
  const CERTIFICATION_TYPES = [
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
  ]

  const isEditing = editingFields.certifications

  const handleCertificationToggle = (cert) => {
    const currentCerts = company?.certifications || []
    const newCerts = currentCerts.includes(cert)
      ? currentCerts.filter(c => c !== cert)
      : [...currentCerts, cert]
    onFieldChange('certifications', newCerts)
  }

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-16">
      <motion.div variants={fadeUp} className="text-center mb-12">
        <div className="flex items-center justify-center gap-3">
          <h2 className="text-3xl font-bold text-white mb-4">Certifications</h2>
          {!isEditing && (
            <button
              onClick={() => onStartEdit('certifications')}
              className="text-gray-400 hover:text-[#FC6500] mb-4"
              title="Edit certifications"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-gray-300">Industry recognized certifications</p>
      </motion.div>
      
      {isEditing ? (
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {CERTIFICATION_TYPES.map((cert) => {
            const isSelected = company?.certifications?.includes(cert)
            return (
              <button
                key={cert}
                onClick={() => handleCertificationToggle(cert)}
                className={`p-3 sm:p-4 rounded-lg text-center border-2 transition-colors text-xs sm:text-sm ${
                  isSelected
                    ? 'bg-[#FC6500] text-black border-[#FC6500]'
                    : 'bg-gray-800 text-white border-gray-700 hover:border-gray-600'
                }`}
              >
                {cert}
              </button>
            )
          })}
          <button
            onClick={() => onStopEdit('certifications')}
            className="col-span-full bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-green-700 text-sm sm:text-base"
          >
            Done Editing
          </button>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {company?.certifications && company.certifications.length > 0 ? (
            company.certifications.map((cert, index) => (
              <div key={index} className="bg-gray-800 p-4 sm:p-5 md:p-6 rounded-lg text-center">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2">{cert}</h3>
                <p className="text-sm sm:text-base text-gray-300">Certified</p>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 text-sm sm:text-base px-4">
              No certifications listed. Click edit to add certifications.
            </div>
          )}
        </motion.div>
      )}
    </motion.section>
  )
}

function Machines({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange, onArrayChange, onAddItem, onRemoveItem }) {
  const isEditing = editingFields.machines

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-8 sm:py-12 md:py-16">
      <motion.div variants={fadeUp} className="text-center mb-8 sm:mb-10 md:mb-12">
        <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">Our Machines</h2>
          {!isEditing && (
            <button
              onClick={() => onStartEdit('machines')}
              className="text-gray-400 hover:text-[#FC6500] mb-2 sm:mb-4"
              title="Edit machines"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-sm sm:text-base text-gray-300">Production equipment and capabilities</p>
      </motion.div>
      
      {isEditing ? (
        <motion.div variants={fadeUp}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {company?.machines && company.machines.length > 0 ? (
            company.machines.map((machine, index) => (
              <div key={index} className="bg-gray-800 p-4 sm:p-5 md:p-6 rounded-lg">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={machine}
                    onChange={(e) => onArrayChange('machines', index, e.target.value)}
                    className="flex-1 bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white text-sm sm:text-base focus:outline-none"
                    autoFocus={index === company.machines.length - 1 && machine === ''}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.target.blur()
                      }
                    }}
                  />
                  <button
                    onClick={() => onRemoveItem('machines', index)}
                    className="text-red-400 hover:text-red-300 font-bold text-lg sm:text-xl w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center flex-shrink-0"
                    title="Remove machine"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))
          ) : null}
            <button
              onClick={() => onAddItem('machines')}
              className="bg-gray-700 hover:bg-gray-600 p-4 sm:p-5 md:p-6 rounded-lg text-center text-gray-300 border-2 border-dashed border-gray-600 min-h-[60px] sm:min-h-[80px] flex items-center justify-center text-sm sm:text-base"
            >
              + Add Machine
            </button>
          </div>
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => onStopEdit('machines')}
              className="bg-green-600 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-green-700 text-sm sm:text-base"
            >
              Done Editing
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {company?.machines && company.machines.length > 0 ? (
            company.machines.map((machine, index) => (
              <div key={index} className="bg-gray-800 p-4 sm:p-5 md:p-6 rounded-lg">
                <h3 className="text-base sm:text-lg font-semibold text-white mb-2 sm:mb-3">{machine}</h3>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center text-gray-400 text-sm sm:text-base px-4">
              No machines listed. Click edit to add machines.
            </div>
          )}
        </motion.div>
      )}
    </motion.section>
  )
}

function Details({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange }) {
  const editingAnyDetail = editingFields.companyMotto || editingFields.establishedOn || editingFields.plantLocation || editingFields.officialEmail || editingFields.gstinNumber

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-8 sm:py-12 md:py-16">
      <motion.div variants={fadeUp}>
        <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center">Company Details</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gray-800 p-4 sm:p-5 md:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Company Motto</h3>
            <div className="text-gray-300">
              {editingFields.companyMotto ? (
                <input
                  type="text"
                  value={company?.companyMotto || ''}
                  onChange={(e) => onFieldChange('companyMotto', e.target.value)}
                  onBlur={() => onStopEdit('companyMotto')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      onStopEdit('companyMotto')
                    }
                  }}
                  maxLength={200}
                  placeholder="Enter company motto"
                  className="bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FC6500]"
                  autoFocus
                />
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    onStartEdit('companyMotto')
                  }}
                  className="cursor-pointer hover:bg-gray-700/50 rounded px-2 py-1 transition-colors inline-block group relative w-full block min-h-[24px] text-sm sm:text-base"
                  title="Click to edit"
                >
                  {company?.companyMotto || 'Not set'}
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
              )}
            </div>
          </div>
          <div className="bg-gray-800 p-4 sm:p-5 md:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Established On</h3>
            <div className="text-gray-300">
              {editingFields.establishedOn ? (
                <input
                  type="date"
                  value={company?.establishedOn ? company.establishedOn.split('T')[0] : ''}
                  onChange={(e) => {
                    // Convert YYYY-MM-DD to ISO string
                    const dateValue = e.target.value
                    if (dateValue) {
                      const isoString = new Date(dateValue + 'T00:00:00').toISOString()
                      onFieldChange('establishedOn', isoString)
                    } else {
                      onFieldChange('establishedOn', '')
                    }
                  }}
                  onBlur={() => onStopEdit('establishedOn')}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      onStopEdit('establishedOn')
                    }
                  }}
                  className="bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FC6500]"
                  autoFocus
                />
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    onStartEdit('establishedOn')
                  }}
                  className="cursor-pointer hover:bg-gray-700/50 rounded px-2 py-1 transition-colors inline-block group relative w-full block min-h-[24px] text-sm sm:text-base"
                  title="Click to edit"
                >
                  {company?.establishedOn ? new Date(company.establishedOn).toLocaleDateString() : 'Not set'}
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
              )}
            </div>
          </div>
          <div className="bg-gray-800 p-4 sm:p-5 md:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Plant Location</h3>
            <div className="text-gray-300">
              {editingFields.plantLocation ? (
                <input
                  type="text"
                  value={company?.plantLocation || ''}
                  onChange={(e) => onFieldChange('plantLocation', e.target.value)}
                  onBlur={() => onStopEdit('plantLocation')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      onStopEdit('plantLocation')
                    }
                  }}
                  placeholder="Enter plant location"
                  className="bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FC6500]"
                  autoFocus
                />
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    onStartEdit('plantLocation')
                  }}
                  className="cursor-pointer hover:bg-gray-700/50 rounded px-2 py-1 transition-colors inline-block group relative w-full block min-h-[24px] text-sm sm:text-base"
                  title="Click to edit"
                >
                  {company?.plantLocation || 'Not set'}
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
              )}
            </div>
          </div>
          <div className="bg-gray-800 p-4 sm:p-5 md:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">Official Email</h3>
            <div className="text-gray-300">
              {editingFields.officialEmail ? (
                <input
                  type="email"
                  value={company?.officialEmail || ''}
                  onChange={(e) => onFieldChange('officialEmail', e.target.value)}
                  onBlur={() => onStopEdit('officialEmail')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      onStopEdit('officialEmail')
                    }
                  }}
                  placeholder="Enter official email"
                  className="bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FC6500]"
                  autoFocus
                />
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    onStartEdit('officialEmail')
                  }}
                  className="cursor-pointer hover:bg-gray-700/50 rounded px-2 py-1 transition-colors inline-block group relative w-full block min-h-[24px] text-sm sm:text-base"
                  title="Click to edit"
                >
                  {company?.officialEmail || 'Not set'}
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
              )}
            </div>
          </div>
          <div className="bg-gray-800 p-4 sm:p-5 md:p-6 rounded-lg">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">GSTIN Number</h3>
            <div className="text-gray-300">
              {editingFields.gstinNumber ? (
                <input
                  type="text"
                  value={company?.gstinNumber || ''}
                  onChange={(e) => onFieldChange('gstinNumber', e.target.value)}
                  onBlur={() => onStopEdit('gstinNumber')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      onStopEdit('gstinNumber')
                    }
                  }}
                  placeholder="Enter GSTIN number"
                  className="bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white w-full text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FC6500]"
                  autoFocus
                />
              ) : (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    onStartEdit('gstinNumber')
                  }}
                  className="cursor-pointer hover:bg-gray-700/50 rounded px-2 py-1 transition-colors inline-block group relative w-full block min-h-[24px] text-sm sm:text-base"
                  title="Click to edit"
                >
                  {company?.gstinNumber || 'Not set'}
                  <svg 
                    className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 ml-2 opacity-0 group-hover:opacity-100 transition-opacity inline" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.section>
  )
}

function Gallery({ company }) {
  const plantImages = []
  
  if (company?.plantImages && company.plantImages.length > 0) {
    company.plantImages.forEach((image) => {
      if (image.url) {
        plantImages.push({
          url: image.url,
          type: 'plant',
          alt: 'Plant image'
        })
      }
    })
  }

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-8 sm:py-12 md:py-16">
      <motion.div variants={fadeUp} className="text-center mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Our Gallery</h2>
        <p className="text-sm sm:text-base text-gray-300">See our work in action</p>
      </motion.div>
      
      {plantImages.length > 0 ? (
        <motion.div variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {plantImages.map((image, index) => (
            <div key={index} className="relative group bg-gray-800 rounded-lg overflow-hidden h-40 sm:h-48 md:h-56">
              <img 
                src={image.url} 
                alt={image.alt}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZhaWxlZCB0byBsb2FkPC90ZXh0Pjwvc3ZnPg=='
                }}
              />
            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="text-center">
          <div className="bg-gray-800 h-32 sm:h-40 md:h-48 rounded-lg flex items-center justify-center">
            <span className="text-gray-400 text-sm sm:text-base px-4">No images uploaded yet</span>
          </div>
        </motion.div>
      )}
    </motion.section>
  )
}

function Contact({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange }) {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-8 sm:py-12 md:py-16">
      <motion.div variants={fadeUp} className="text-center mb-8 sm:mb-10 md:mb-12">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Contact Us</h2>
        <p className="text-sm sm:text-base text-gray-300">Get in touch for your next project</p>
      </motion.div>
      
      <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Get in Touch</h3>
          <div className="space-y-3 sm:space-y-4">
            <p className="text-sm sm:text-base text-gray-300">
              <span className="font-semibold">Email:</span>{' '}
              <EditableField
                value={company?.officialEmail}
                fieldName="officialEmail"
                isEditing={editingFields.officialEmail}
                onStartEdit={onStartEdit}
                onStopEdit={onStopEdit}
                onChange={onFieldChange}
                type="email"
                placeholder="Enter official email"
                className="inline-block ml-2"
              />
            </p>
            <p className="text-sm sm:text-base text-gray-300">
              <span className="font-semibold">Location:</span>{' '}
              <EditableField
                value={company?.plantLocation}
                fieldName="plantLocation"
                isEditing={editingFields.plantLocation}
                onStartEdit={onStartEdit}
                onStopEdit={onStopEdit}
                onChange={onFieldChange}
                placeholder="Enter plant location"
                className="inline-block ml-2"
              />
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Send Message</h3>
          <form className="space-y-3 sm:space-y-4">
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full p-2.5 sm:p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FC6500]"
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="w-full p-2.5 sm:p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FC6500]"
            />
            <textarea 
              placeholder="Your Message" 
              rows="4"
              className="w-full p-2.5 sm:p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#FC6500] resize-y"
            ></textarea>
            <button className="w-full bg-[#FC6500] text-black py-2.5 sm:py-3 rounded-lg font-semibold text-sm sm:text-base hover:bg-[#e55a00] transition-colors">
              Send Message
            </button>
          </form>
        </div>
      </motion.div>
    </motion.section>
  )
}

export default DemoCompanyProfilePage
