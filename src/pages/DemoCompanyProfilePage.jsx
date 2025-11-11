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
  vendors: [
    { name: 'Orion Fabrication Works', location: 'Gurugram' },
    { name: 'GreenField AgriTech', location: 'Hyderabad' },
    { name: 'Velocity Auto Components', location: 'Noida' },
    { name: 'Stellar Pumps & Valves', location: 'New Delhi' },
    { name: 'Rivetron Engineering', location: 'Gaziabaad' },
    { name: 'Bluemax Motorsports', location: 'Faridabaad' }
  ],
  machines: ['CNC Milling Center', '5-Axis CNC', 'Lathe Machines', 'Welding Equipment', 'Quality Testing Lab'],
  certifications: ['ISO 9001:2015', 'AS9100D', 'ISO 14001:2015'],
  productionCapacity: '10,000+ units per month',
  establishedOn: '1998-01-15',
  experience: '25',
  partsManufacturedAnnually: '150M',
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
  const [activeTab, setActiveTab] = useState('Raw Material')

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
      [fieldName]: prev[fieldName].map((item, i) => {
        if (i === index) {
          // If item is an object (partner with name/location), update accordingly
          if (typeof item === 'object' && item !== null) {
            return { ...item, ...value }
          }
          // Otherwise, treat as simple string update
          return value
        }
        return item
      })
    }))
  }

  const handlePartnerFieldChange = (fieldName, index, field, value) => {
    setCompany(prev => ({
      ...prev,
      [fieldName]: prev[fieldName].map((item, i) => {
        if (i === index) {
          if (typeof item === 'object' && item !== null) {
            return { ...item, [field]: value }
          }
          // If it's a string, convert to object
          return { name: item || '', location: '', [field]: value }
        }
        return item
      })
    }))
  }

  const handleAddArrayItem = (fieldName) => {
    // Enter edit mode if not already editing
    if (!editingFields[fieldName]) {
      startEditing(fieldName)
    }
    
    // Add new empty item - check if vendors use object format
    setCompany(prev => {
      const existingItems = prev[fieldName] || []
      const isObjectFormat = existingItems.length > 0 && typeof existingItems[0] === 'object' && existingItems[0] !== null && !Array.isArray(existingItems[0])
      
      return {
        ...prev,
        [fieldName]: [...existingItems, isObjectFormat ? { name: '', location: '' } : '']
      }
    })
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
        <SectionSeparator sectionName="CLIENTS" />
        <Vendors company={company} isEditMode={isEditMode} editingFields={editingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} onArrayChange={handleArrayFieldChange} onPartnerFieldChange={handlePartnerFieldChange} onAddItem={handleAddArrayItem} onRemoveItem={handleRemoveArrayItem} />
        <MoreAboutUs company={company} isEditMode={isEditMode} editingFields={editingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
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
  const hasMotto = company?.companyMotto && company.companyMotto.trim()
  const hasDescription = company?.companyDescription && company.companyDescription.trim()
  
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16">
      <div className="relative mx-auto" style={{ width: '1160px', maxWidth: '95%' }}>
        {/* Main Container */}
        <motion.div 
          variants={fadeUp}
          className="relative mx-auto rounded-[30px]"
          style={{
            width: '1160px',
            maxWidth: '100%',
            background: 'rgba(33, 33, 33, 0.35)',
            borderRadius: '30px',
            padding: '66px 0 60px 0'
          }}
        >
          {/* Company Motto */}
          <div 
            className="relative mx-auto text-center"
            style={{
              width: '896px',
              maxWidth: '77%',
              marginBottom: hasDescription || !hasMotto ? '48px' : '0px'
            }}
          >
            {editingFields.companyMottoAbout ? (
              <textarea
                value={company?.companyMotto || ''}
                onChange={(e) => onFieldChange('companyMotto', e.target.value)}
                onBlur={() => onStopEdit('companyMottoAbout')}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    onStopEdit('companyMottoAbout')
                  }
                }}
                maxLength={200}
                className="bg-gray-700 border-2 border-[#FC6500] rounded p-4 text-white w-full text-center focus:outline-none focus:ring-2 focus:ring-[#FC6500] resize-y"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  fontSize: '36px',
                  lineHeight: '44px',
                  minHeight: hasMotto ? 'auto' : '44px',
                  height: 'auto'
                }}
                autoFocus
              />
            ) : (
              <span
                onClick={(e) => {
                  e.stopPropagation()
                  onStartEdit('companyMottoAbout')
                }}
                className="cursor-pointer hover:bg-gray-700/30 rounded px-4 py-2 transition-colors inline-block group relative block w-full"
                title="Click to edit"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: '36px',
                  lineHeight: '44px',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  minHeight: hasMotto ? 'auto' : '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: hasMotto ? '12px 16px' : '16px'
                }}
              >
                {company?.companyMotto || 'Click to add company motto...'}
                <svg 
                  className="w-5 h-5 text-gray-500 ml-3 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </span>
            )}
          </div>

          {/* Company Description */}
          <div 
            className="relative mx-auto text-center"
            style={{
              width: '818px',
              maxWidth: '70%'
            }}
          >
            {editingFields.companyDescriptionAbout ? (
              <textarea
                value={company?.companyDescription || ''}
                onChange={(e) => {
                  onFieldChange('companyDescription', e.target.value)
                  // Auto-resize textarea based on content
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.max(72, e.target.scrollHeight) + 'px'
                }}
                onBlur={() => onStopEdit('companyDescriptionAbout')}
                onKeyDown={(e) => {
                  if (e.key === 'Escape') {
                    onStopEdit('companyDescriptionAbout')
                  }
                }}
                maxLength={2000}
                placeholder="Enter company description (2-3 paragraphs)..."
                className="bg-gray-700 border-2 border-[#FC6500] rounded p-4 text-white w-full text-center focus:outline-none focus:ring-2 focus:ring-[#FC6500] resize-none overflow-hidden"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '20px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  color: '#929292',
                  minHeight: hasDescription ? 'auto' : '72px',
                  paddingTop: '16px',
                  paddingBottom: '16px'
                }}
                autoFocus
              />
            ) : (
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  onStartEdit('companyDescriptionAbout')
                }}
                className="cursor-pointer hover:bg-gray-700/30 rounded px-4 py-3 transition-colors group relative w-full"
                title="Click to edit"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 400,
                  fontSize: '20px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  color: '#929292',
                  minHeight: hasDescription ? 'auto' : '72px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  padding: hasDescription ? '16px' : '24px 16px'
                }}
              >
                {hasDescription ? (
                  <div style={{ 
                    whiteSpace: 'pre-wrap',
                    width: '100%',
                    lineHeight: '1.6'
                  }}>
                    {company.companyDescription.split('\n\n').filter(p => p.trim()).map((paragraph, index, arr) => (
                      <p key={index} style={{ 
                        marginBottom: index < arr.length - 1 ? '16px' : '0px',
                        marginTop: '0px'
                      }}>
                        {paragraph.trim()}
                      </p>
                    ))}
                  </div>
                ) : (
                  <span>Click to add company description (2-3 paragraphs)...</span>
                )}
                <svg 
                  className="w-4 h-4 text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity absolute right-4 top-3" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

function SectionSeparator({ sectionName }) {
  return (
    <div 
      className="relative w-full flex items-center"
      style={{
        width: '1162px',
        maxWidth: '95%',
        height: '22px',
        margin: '0 auto',
        padding: '40px 0'
      }}
    >
      <div
        className="flex flex-row items-center"
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: '0px',
          gap: '29px',
          width: '100%'
        }}
      >
        {/* Section Name */}
        <div
          style={{
            width: 'auto',
            height: '22px',
            fontFamily: 'Manrope, sans-serif',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: '16px',
            lineHeight: '22px',
            color: '#FFFFFF',
            flex: 'none',
            order: 0,
            flexGrow: 0,
            whiteSpace: 'nowrap'
          }}
        >
          {sectionName}
        </div>
        
        {/* Line */}
        <div
          style={{
            flex: '1 1 auto',
            height: '0px',
            border: '2px solid #B1B1B1',
            flexShrink: 1,
            order: 1,
            minWidth: 0
          }}
        />
      </div>
    </div>
  )
}

function Vendors({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange, onArrayChange, onPartnerFieldChange, onAddItem, onRemoveItem }) {
  const isEditing = editingFields.vendors

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16" style={{ marginBottom: '120px' }}>
      {/* Header Section */}
      <div className="relative mx-auto mb-8 sm:mb-10 md:mb-12" style={{ width: '1162px', maxWidth: '95%' }}>
        <motion.div 
          variants={fadeUp}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '22px',
            width: '100%'
          }}
        >
          {/* Heading with Edit Button */}
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '12px'
            }}
          >
            <h2
              style={{
                height: 'auto',
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: '40px',
                lineHeight: '49px',
                color: '#FFFFFF',
                flex: 'none',
                order: 0,
                flexGrow: 0,
                margin: 0
              }}
            >
              Vendors We Supply
            </h2>
            {!isEditing && (
              <button
                onClick={() => onStartEdit('vendors')}
                className="text-gray-400 hover:text-[#FC6500] transition-colors"
                title="Edit vendors"
                style={{
                  flex: 'none',
                  order: 1,
                  flexGrow: 0
                }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
            )}
          </div>
          
          {/* Description Text */}
          <p
            style={{
              width: '100%',
              height: 'auto',
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'normal',
              fontWeight: 500,
              fontSize: '20px',
              lineHeight: '24px',
              color: '#929292',
              flex: 'none',
              order: 1,
              alignSelf: 'stretch',
              flexGrow: 0,
              margin: 0
            }}
          >
            We collaborate with top-tier vendors who share our passion for precision and performance. Through consistent quality and timely delivery, we help them achieve efficiency, durability, and innovation in every build.
          </p>
        </motion.div>
      </div>

      {/* Partners Content */}
      <div className="max-w-6xl mx-auto">
        {isEditing ? (
          <motion.div variants={fadeUp}>
            <div className="space-y-4">
              {company?.vendors && company.vendors.length > 0 ? (
                company.vendors.map((vendor, index) => {
                  const vendorName = typeof vendor === 'object' && vendor !== null ? vendor.name : vendor
                  const vendorLocation = typeof vendor === 'object' && vendor !== null ? vendor.location : ''
                  
                  return (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg">
                      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                        <div className="flex-1 space-y-2">
                          <input
                            type="text"
                            value={vendorName}
                            onChange={(e) => {
                              if (typeof vendor === 'object' && vendor !== null) {
                                onArrayChange('vendors', index, { name: e.target.value, location: vendorLocation })
                              } else {
                                onArrayChange('vendors', index, e.target.value)
                              }
                            }}
                            placeholder="Partner name"
                            className="w-full bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white text-sm sm:text-base focus:outline-none"
                            autoFocus={index === company.vendors.length - 1 && (!vendorName || vendorName === '')}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.target.blur()
                              }
                            }}
                          />
                          <input
                            type="text"
                            value={vendorLocation}
                            onChange={(e) => {
                              if (typeof vendor === 'object' && vendor !== null) {
                                onArrayChange('vendors', index, { name: vendorName, location: e.target.value })
                              } else {
                                onArrayChange('vendors', index, { name: vendorName, location: e.target.value })
                              }
                            }}
                            placeholder="Location"
                            className="w-full bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white text-sm sm:text-base focus:outline-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.target.blur()
                              }
                            }}
                          />
                        </div>
                        <button
                          onClick={() => onRemoveItem('vendors', index)}
                          className="text-red-400 hover:text-red-300 font-bold text-xl w-8 h-8 flex items-center justify-center flex-shrink-0"
                          title="Remove partner"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : null}
              <button
                onClick={() => onAddItem('vendors')}
                className="bg-gray-700 hover:bg-gray-600 p-4 rounded-lg text-center text-gray-300 border-2 border-dashed border-gray-600 min-h-[60px] flex items-center justify-center text-sm sm:text-base w-full"
              >
                + Add Partner
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
          <motion.div variants={fadeUp}>
            {company?.vendors && company.vendors.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6" style={{ maxWidth: '100vw', margin: '0 auto', width: '100%' }}>
                {company.vendors.map((vendor, index) => {
                  const vendorName = typeof vendor === 'object' && vendor !== null ? vendor.name : vendor
                  const vendorLocation = typeof vendor === 'object' && vendor !== null ? vendor.location : ''
                  
                  return (
                    <div 
                      key={index}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        padding: '0px',
                        gap: '13px',
                        width: '219px',
                        maxWidth: '100%',
                        height: 'auto'
                      }}
                    >
                      {/* Partner Name */}
                      <div
                        style={{
                          width: '100%',
                          height: 'auto',
                          minHeight: '20px',
                          fontFamily: 'Montserrat, sans-serif',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: '16px',
                          lineHeight: '20px',
                          color: '#979797',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0
                        }}
                      >
                        {vendorName || 'Partner Name'}
                      </div>
                      
                      {/* Location with Map Pin */}
                      {vendorLocation ? (
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            padding: '0px',
                            gap: '5px',
                            flex: 'none',
                            order: 1,
                            flexGrow: 0,
                            width: 'auto',
                            height: '20px'
                          }}
                        >
                          {/* Map Pin Icon */}
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            style={{
                              flex: 'none',
                              order: 0,
                              flexGrow: 0
                            }}
                          >
                            <path
                              d="M8 2C5.79 2 4 3.79 4 6C4 9 8 14 8 14C8 14 12 9 12 6C12 3.79 10.21 2 8 2Z"
                              stroke="white"
                              strokeWidth="1.33333"
                              fill="none"
                            />
                            <circle
                              cx="8"
                              cy="6"
                              r="1.5"
                              stroke="white"
                              strokeWidth="1.33333"
                              fill="none"
                            />
                          </svg>
                          
                          {/* Location Text */}
                          <div
                            style={{
                              fontFamily: 'Montserrat, sans-serif',
                              fontStyle: 'normal',
                              fontWeight: 500,
                              fontSize: '16px',
                              lineHeight: '20px',
                              color: '#FFFFFF',
                              flex: 'none',
                              order: 1,
                              flexGrow: 0
                            }}
                          >
                            {vendorLocation}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center text-gray-400 text-sm sm:text-base px-4">
                No partners listed. Click edit to add partners.
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

function MoreAboutUs({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange }) {
  // Calculate experience from establishedOn date if not set
  const getExperience = () => {
    if (company?.experience) return company.experience
    if (company?.establishedOn) {
      const established = new Date(company.establishedOn)
      const now = new Date()
      const years = now.getFullYear() - established.getFullYear()
      return years.toString()
    }
    return '25'
  }

  const getEstablishedYear = () => {
    if (company?.establishedOn) {
      return new Date(company.establishedOn).getFullYear().toString()
    }
    return '1998'
  }

  const experience = getExperience()
  const establishedYear = getEstablishedYear()
  const partsManufactured = company?.partsManufacturedAnnually || '150M'

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16" style={{ marginTop: '120px', marginBottom: '120px' }}>
      <div className="relative mx-auto" style={{ width: '76vw', maxWidth: '100%' }}>
        <motion.div 
          variants={fadeUp}
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            padding: '0px',
            gap: '121px',
            width: '100%',
            flexWrap: 'wrap'
          }}
        >
          {/* More About Us Title */}
          <div
            style={{
              width: '246px',
              height: 'auto',
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '32px',
              lineHeight: '39px',
              color: '#929292',
              flex: 'none',
              order: 0,
              flexGrow: 0
            }}
          >
            More About Us
          </div>

          {/* Stats Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '0px',
              gap: '118px',
              flex: '1 1 auto',
              justifyContent: 'flex-start',
              flexWrap: 'wrap'
            }}
          >
            {/* Experience Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '20px',
                width: '115px',
                height: 'auto',
                minHeight: '103px',
                flex: 'none',
                order: 0,
                flexGrow: 0
              }}
            >
              <div
                style={{
                  width: '115px',
                  height: 'auto',
                  minHeight: '24px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: '24px',
                  color: '#929292',
                  flex: 'none',
                  order: 0,
                  alignSelf: 'stretch',
                  flexGrow: 0
                }}
              >
                Experience
              </div>
              {editingFields.experience ? (
                <input
                  type="text"
                  value={experience}
                  onChange={(e) => onFieldChange('experience', e.target.value)}
                  onBlur={() => onStopEdit('experience')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      onStopEdit('experience')
                    }
                  }}
                  className="bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FC6500]"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '48px',
                    lineHeight: '59px',
                    color: '#FFFFFF',
                    width: '115px',
                    height: 'auto'
                  }}
                  autoFocus
                />
              ) : (
                <div
                  onClick={() => onStartEdit('experience')}
                  className="cursor-pointer hover:bg-gray-800/30 rounded px-2 py-1 transition-colors"
                  style={{
                    width: '115px',
                    height: 'auto',
                    minHeight: '59px',
                    fontFamily: 'Montserrat, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '48px',
                    lineHeight: '59px',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    alignSelf: 'stretch',
                    flexGrow: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Click to edit"
                >
                  {experience}+
                </div>
              )}
            </div>

            {/* Established In Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '20px',
                width: '144px',
                height: 'auto',
                minHeight: '103px',
                flex: 'none',
                order: 1,
                flexGrow: 0
              }}
            >
              <div
                style={{
                  width: '144px',
                  height: 'auto',
                  minHeight: '24px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: '24px',
                  color: '#929292',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0
                }}
              >
                Established In
              </div>
              {editingFields.establishedYear ? (
                <input
                  type="text"
                  value={establishedYear}
                  onChange={(e) => {
                    const newYear = e.target.value
                    // Allow typing digits only, up to 4 digits
                    if (/^\d{0,4}$/.test(newYear)) {
                      // Store temporarily as text, will update on blur
                      const currentDate = company?.establishedOn ? new Date(company.establishedOn) : new Date('1998-01-15')
                      if (newYear.length === 4 && /^\d{4}$/.test(newYear)) {
                        currentDate.setFullYear(parseInt(newYear))
                        const isoString = currentDate.toISOString()
                        onFieldChange('establishedOn', isoString)
                      }
                    }
                  }}
                  onBlur={() => {
                    // Validate and update on blur
                    const currentDate = company?.establishedOn ? new Date(company.establishedOn) : new Date('1998-01-15')
                    const yearText = establishedYear
                    if (yearText && /^\d{4}$/.test(yearText)) {
                      currentDate.setFullYear(parseInt(yearText))
                      const isoString = currentDate.toISOString()
                      onFieldChange('establishedOn', isoString)
                    }
                    onStopEdit('establishedYear')
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      const currentDate = company?.establishedOn ? new Date(company.establishedOn) : new Date('1998-01-15')
                      const yearText = e.target.value
                      if (yearText && /^\d{4}$/.test(yearText)) {
                        currentDate.setFullYear(parseInt(yearText))
                        const isoString = currentDate.toISOString()
                        onFieldChange('establishedOn', isoString)
                      }
                      onStopEdit('establishedYear')
                    }
                  }}
                  className="bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FC6500]"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '48px',
                    lineHeight: '59px',
                    color: '#FFFFFF',
                    width: '110px',
                    height: 'auto'
                  }}
                  autoFocus
                  maxLength={4}
                  pattern="\d{4}"
                />
              ) : (
                <div
                  onClick={() => onStartEdit('establishedYear')}
                  className="cursor-pointer hover:bg-gray-800/30 rounded px-2 py-1 transition-colors"
                  style={{
                    width: '110px',
                    height: 'auto',
                    minHeight: '59px',
                    fontFamily: 'Montserrat, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '48px',
                    lineHeight: '59px',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Click to edit"
                >
                  {establishedYear}
                </div>
              )}
            </div>

            {/* Parts Manufactured Annually Card */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '20px',
                width: '298px',
                height: 'auto',
                minHeight: '103px',
                flex: 'none',
                order: 2,
                flexGrow: 0
              }}
            >
              <div
                style={{
                  width: '298px',
                  height: 'auto',
                  minHeight: '24px',
                  fontFamily: 'Montserrat, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '20px',
                  lineHeight: '24px',
                  color: '#929292',
                  flex: 'none',
                  order: 0,
                  flexGrow: 0
                }}
              >
                Parts Manufactured Annually
              </div>
              {editingFields.partsManufacturedAnnually ? (
                <input
                  type="text"
                  value={partsManufactured}
                  onChange={(e) => onFieldChange('partsManufacturedAnnually', e.target.value)}
                  onBlur={() => onStopEdit('partsManufacturedAnnually')}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === 'Escape') {
                      onStopEdit('partsManufacturedAnnually')
                    }
                  }}
                  className="bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white focus:outline-none focus:ring-2 focus:ring-[#FC6500]"
                  style={{
                    fontFamily: 'Montserrat, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: '48px',
                    lineHeight: '59px',
                    color: '#FFFFFF',
                    width: '153px',
                    height: 'auto'
                  }}
                  autoFocus
                />
              ) : (
                <div
                  onClick={() => onStartEdit('partsManufacturedAnnually')}
                  className="cursor-pointer hover:bg-gray-800/30 rounded px-2 py-1 transition-colors"
                  style={{
                    width: '153px',
                    height: 'auto',
                    minHeight: '59px',
                    fontFamily: 'Montserrat',
                    fontStyle: 'SemiBold',
                    fontWeight: 600,
                    fontSize: '48px',
                    lineHeight: '59px',
                    color: '#FFFFFF',
                    flex: 'none',
                    order: 1,
                    flexGrow: 0,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Click to edit"
                >
                  {partsManufactured}+
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

function TabNavigation({ activeTab, onTabChange }) {
  const tabs = ['Raw Material', 'Machines', 'Mfg Process', 'Specializations']
  const tabWidths = [191, 117, 149, 182] // Raw Material, Machines, Mfg Process, Specializations
  const gap = 116

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16" style={{ marginTop: '120px', marginBottom: '120px' }}>
      <div className="relative mx-auto" style={{ width: '987px', maxWidth: '95%', height: '69px' }}>
        <motion.div 
          variants={fadeUp}
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0px',
            gap: '116px',
            width: '100%',
            height: '53px',
            position: 'relative'
          }}
        >
          {tabs.map((tab, index) => {
            const isActive = activeTab === tab
            return (
              <div key={tab} style={{ position: 'relative', flex: 'none', order: index, flexGrow: 0 }}>
                {isActive ? (
                  <div
                    onClick={() => onTabChange(tab)}
                    className="cursor-pointer"
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                      padding: '12px 16px',
                      gap: '10px',
                      width: 'auto',
                      height: '53px',
                      background: 'rgba(255, 255, 255, 0.12)',
                      borderRadius: '14px',
                      flex: 'none',
                      order: 0,
                      flexGrow: 0
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        fontSize: '24px',
                        lineHeight: '29px',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {tab}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => onTabChange(tab)}
                    className="cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '24px',
                      lineHeight: '29px',
                      color: '#FFFFFF',
                      flex: 'none',
                      order: index,
                      flexGrow: 0,
                      whiteSpace: 'nowrap',
                      padding: '12px 0',
                      height: '53px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {tab}
                  </div>
                )}
              </div>
            )
          })}
        </motion.div>
        
        {/* Underline for active tab */}
        {activeTab && (() => {
          const activeIndex = tabs.indexOf(activeTab)
          let offset = 0
          for (let i = 0; i < activeIndex; i++) {
            offset += tabWidths[i] + gap
          }
          offset += tabWidths[activeIndex] / 2 - 65.5 // Center the line on the active tab (131px / 2 = 65.5px)
          // Account for container being centered
          offset -= 493.5 // 987px / 2 = 493.5px
          
          return (
            <div
              style={{
                position: 'absolute',
                width: '131px',
                height: '0px',
                left: '50%',
                top: '63px',
                transform: `translateX(calc(-50% + ${offset}px))`,
                border: '1px solid #FFFFFF',
                transition: 'transform 0.3s ease'
              }}
            />
          )
        })()}
      </div>
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
