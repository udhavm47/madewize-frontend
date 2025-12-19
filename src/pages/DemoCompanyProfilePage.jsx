import { useState } from 'react'
import { motion } from 'framer-motion'
import Navbar from '../components/Navbar'
import { authAPI } from '../services/api'
import cert1 from '../assets/cert.jpg'
import cert2 from '../assets/cert2.jpg'
import cert3 from '../assets/cert3.jpg'
import media from '../assets/media.jpg'
import media2 from '../assets/media2.jpg'
import media3 from '../assets/media3.jpg'
import media4 from '../assets/media4.jpg'
import media5 from '../assets/media5.jpg'
import team1 from '../assets/team.jpg'
import team2 from '../assets/team2.jpg'
import team3 from '../assets/team3.jpg'
import testimonialImg from '../assets/testimonial.jpg'
import logoImage from '../assets/image.png'
import service1 from '../assets/service.jpg'
import service2 from '../assets/service2.jpg'
import service3 from '../assets/service3.jpg'
import service4 from '../assets/service4.jpg'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1 } }

// Mock data based on backend structure
const initialMockCompanyData = {
  id: 'demo-company-123',
  companyName: 'Shyaam Industries Pvt. Ltd.',
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
  services: [
    {
      title: 'Product Design & Prototyping',
      description: 'From CAD modeling to functional prototypes, enabling faster innovation.',
      image: service1
    },
    {
      title: 'Precision Machining',
      description: 'High-accuracy machining services for complex components and tight tolerances.',
      image: service2
    },
    {
      title: 'Casting & Forging',
      description: 'Tailored manufacturing solutions to meet your unique specifications and requirements.',
      image: service3
    },
    {
      title: 'Fabrication & Welding',
      description: 'Complete assembly solutions from component integration to final product delivery.',
      image: service4
    }
  ],
  profileCompletionPercentage: 85
}

const DemoCompanyProfilePage = ({ readOnly = false }) => {
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
    if (readOnly) return // Prevent editing when in read-only mode
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
    if (readOnly) return // Prevent adding items when in read-only mode
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
    if (readOnly) return // Prevent removing items when in read-only mode
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

  // Ensure edit mode is disabled when in read-only mode
  const effectiveEditMode = readOnly ? false : isEditMode
  const effectiveEditingFields = readOnly ? {} : editingFields

  return (
    <div className="min-h-screen bg-black text-white font-montserrat overflow-x-hidden" style={{ overflowX: 'hidden' }}>
      <div className="w-full mx-auto px-4 sm:px-6 md:px-8 lg:px-10 overflow-x-hidden" style={{ overflowX: 'hidden' }}>
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
          <div className={`max-w-6xl mx-auto mt-2 mb-4 p-3 rounded-lg ${saveMessage.includes('✅') ? 'bg-green-600/20 border border-green-500 text-green-300' : 'bg-red-600/20 border border-red-500 text-red-300'
            }`}>
            {saveMessage}
          </div>
        )}

        <Hero company={company} isEditMode={effectiveEditMode} editingFields={effectiveEditingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
        <About company={company} isEditMode={effectiveEditMode} editingFields={effectiveEditingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
        <SectionSeparator sectionName="CLIENTS" />
        <Vendors company={company} isEditMode={effectiveEditMode} editingFields={effectiveEditingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} onArrayChange={handleArrayFieldChange} onPartnerFieldChange={handlePartnerFieldChange} onAddItem={handleAddArrayItem} onRemoveItem={handleRemoveArrayItem} />
        <MoreAboutUs company={company} isEditMode={effectiveEditMode} editingFields={effectiveEditingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        <SectionSeparator sectionName="OUR SERVICES" />
        <OurServices company={company} isEditMode={effectiveEditMode} editingFields={effectiveEditingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
        <SectionSeparator sectionName="CERTIFICATIONS" />
        <Certifications company={company} isEditMode={effectiveEditMode} editingFields={effectiveEditingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
        <SectionSeparator sectionName="MEDIA & VISUALS" />
        <Gallery company={company} />
        {/* <Machines company={company} isEditMode={effectiveEditMode} editingFields={effectiveEditingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} onArrayChange={handleArrayFieldChange} onAddItem={handleAddArrayItem} onRemoveItem={handleRemoveArrayItem} />
        <Details company={company} isEditMode={effectiveEditMode} editingFields={effectiveEditingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} /> */}
        <SectionSeparator sectionName="TEAM" />
        <Team company={company} isEditMode={effectiveEditMode} editingFields={effectiveEditingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
        <SectionSeparator sectionName="TESTIMONIALS" />
        <Testimonials company={company} isEditMode={effectiveEditMode} editingFields={effectiveEditingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
        <SectionSeparator sectionName="ID CARD" />
        <IdCard company={company} isEditMode={effectiveEditMode} editingFields={effectiveEditingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
        <SectionSeparator sectionName="CONTACT" />
        <Contact company={company} isEditMode={effectiveEditMode} editingFields={effectiveEditingFields} onStartEdit={startEditing} onStopEdit={stopEditing} onFieldChange={handleFieldChange} />
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
  multiline = false,
  readOnly = false
}) => {
  const handleClick = (e) => {
    if (readOnly) return // Don't allow editing in read-only mode
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
      className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:bg-gray-800/50'} rounded px-2 py-1 transition-colors group relative ${className} ${!value ? 'text-gray-500 italic' : ''}`}
      title={readOnly ? undefined : "Click to edit"}
    >
      {value || <span className="text-gray-500 italic">{placeholder || 'Click to add...'}</span>}
      {!readOnly && (
        <svg
          className="w-4 h-4 text-gray-500 absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      )}
    </div>
  )
}

function Hero({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange }) {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto pt-4 sm:pt-6 md:pt-8 pb-8 sm:pb-10 md:pb-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
        <motion.div variants={fadeUp} className="md:col-span-2 order-2 md:order-1">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col items-start justify-between">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-7xl font-bold text-white mb-3 sm:mb-4">
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
              {/* Location Display */}
              <div className="flex items-center gap-2 mt-2 p-1 sm:mt-3">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 10C21 17 12 23 12 23C12 23 3 17 3 10C3 7.61305 3.94821 5.32387 5.63604 3.63604C7.32387 1.94821 9.61305 1 12 1C14.3869 1 16.6761 1.94821 18.364 3.63604C20.0518 5.32387 21 7.61305 21 10Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-white text-base sm:text-md md:text-lg font-medium">
                  Gurugram, Haryana
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.aside variants={fadeUp} className="flex justify-end order-1 md:order-2 mb-6 md:mb-0">
          {company?.avatar && company.avatar.url && company.avatar.url !== '/madevize.svg' ? (
            <img
              src={company.avatar.url}
              alt={`${company.companyName} logo`}
              className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain"
            />
          ) : (
            <img
              src={logoImage}
              alt="Default logo"
              className="w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain"
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
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8" style={{ width: '100%', maxWidth: '72.5rem' }}>
        {/* Main Container */}
        <motion.div
          variants={fadeUp}
          className="relative mx-auto rounded-[30px] w-full"
          style={{
            background: 'rgba(33, 33, 33, 0.35)',
            borderRadius: '30px',
            padding: 'clamp(2rem, 4vw, 4.125rem) clamp(1.5rem, 3vw, 3.75rem)'
          }}
        >
          {/* Company Motto */}
          <div
            className="relative mx-auto text-center"
            style={{
              width: '100%',
              maxWidth: '56rem',
              marginBottom: hasDescription || !hasMotto ? 'clamp(1.5rem, 3vw, 3rem)' : '0px'
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
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                  lineHeight: '1.22',
                  minHeight: hasMotto ? 'auto' : 'clamp(2rem, 2.75vw, 2.75rem)',
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
                  fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)',
                  lineHeight: '1.22',
                  textAlign: 'center',
                  color: '#FFFFFF',
                  minHeight: hasMotto ? 'auto' : 'clamp(2rem, 2.75vw, 2.75rem)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: hasMotto ? 'clamp(0.75rem, 1vw, 1rem) clamp(1rem, 1.5vw, 1.5rem)' : 'clamp(1rem, 1.5vw, 1.5rem)'
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
            className="relative mx-auto text-center w-full"
            style={{
              maxWidth: '51.125rem'
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
                  fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                  lineHeight: '1.5',
                  textAlign: 'center',
                  color: '#929292',
                  minHeight: hasDescription ? 'auto' : 'clamp(3rem, 4.5vw, 4.5rem)',
                  paddingTop: 'clamp(1rem, 1.5vw, 1.5rem)',
                  paddingBottom: 'clamp(1rem, 1.5vw, 1.5rem)'
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
                  fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                  lineHeight: '1.5',
                  textAlign: 'center',
                  color: '#929292',
                  minHeight: hasDescription ? 'auto' : 'clamp(3rem, 4.5vw, 4.5rem)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  padding: hasDescription ? 'clamp(1rem, 1.5vw, 1.5rem)' : 'clamp(1.5rem, 2vw, 2rem) clamp(1rem, 1.5vw, 1.5rem)'
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
      className="relative w-full flex items-center px-4 sm:px-6 lg:px-8"
      style={{
        width: '100%',
        maxWidth: '72.625rem',
        height: 'clamp(1rem, 1.5vw, 1.375rem)',
        margin: '0 auto',
        padding: 'clamp(1.5rem, 3vw, 2.5rem) 0'
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
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16" style={{ marginBottom: 'clamp(3rem, 7.5vw, 7.5rem)' }}>
      {/* Header Section */}
      <div className="relative mx-auto mb-8 sm:mb-10 md:mb-12" style={{ width: '100%', maxWidth: '72.625rem' }}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6" style={{ maxWidth: '100%', width: '50%' }}>
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
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16 lg:py-20" style={{ marginTop: 'clamp(3rem, 7.5vw, 7.5rem)', marginBottom: 'clamp(3rem, 7.5vw, 7.5rem)' }}>
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8" style={{ width: '100%', maxWidth: '76vw' }}>
        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 md:gap-12 lg:gap-16 xl:gap-20"
          style={{
            width: '100%'
          }}
        >
          {/* More About Us Title */}
          <div
            className="flex-shrink-0"
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
              lineHeight: '1.22',
              color: '#929292'
            }}
          >
            More About Us
          </div>

          {/* Stats Container */}
          <div
            className="flex flex-row items-center gap-8 md:gap-12 lg:gap-16 xl:gap-20 flex-wrap"
            style={{
              flex: '1 1 auto',
              justifyContent: 'flex-start'
            }}
          >
            {/* Experience Card */}
            <div
              className="flex flex-col items-start"
              style={{
                gap: 'clamp(1rem, 1.5vw, 1.25rem)',
                minWidth: 'fit-content'
              }}
            >
              <div
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                  lineHeight: '1.2',
                  color: '#929292'
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
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    lineHeight: '1.23',
                    color: '#FFFFFF',
                    width: 'auto',
                    minWidth: 'fit-content',
                    height: 'auto'
                  }}
                  autoFocus
                />
              ) : (
                <div
                  onClick={() => onStartEdit('experience')}
                  className="cursor-pointer hover:bg-gray-800/30 rounded px-2 py-1 transition-colors"
                  style={{
                    minHeight: 'clamp(2.5rem, 4vw, 3.6875rem)',
                    fontFamily: 'Montserrat, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    lineHeight: '1.23',
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
              className="flex flex-col items-start"
              style={{
                gap: 'clamp(1rem, 1.5vw, 1.25rem)',
                minWidth: 'fit-content'
              }}
            >
              <div
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                  lineHeight: '1.2',
                  color: '#929292'
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
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    lineHeight: '1.23',
                    color: '#FFFFFF',
                    width: 'auto',
                    minWidth: 'fit-content',
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
                    minHeight: 'clamp(2.5rem, 4vw, 3.6875rem)',
                    fontFamily: 'Montserrat, sans-serif',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    lineHeight: '1.23',
                    color: '#FFFFFF',
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
              className="flex flex-col items-start"
              style={{
                gap: 'clamp(1rem, 1.5vw, 1.25rem)',
                minWidth: 'fit-content'
              }}
            >
              <div
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                  lineHeight: '1.2',
                  color: '#929292'
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
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    lineHeight: '1.23',
                    color: '#FFFFFF',
                    width: 'auto',
                    minWidth: 'fit-content',
                    height: 'auto'
                  }}
                  autoFocus
                />
              ) : (
                <div
                  onClick={() => onStartEdit('partsManufacturedAnnually')}
                  className="cursor-pointer hover:bg-gray-800/30 rounded px-2 py-1 transition-colors"
                  style={{
                    minHeight: 'clamp(2.5rem, 4vw, 3.6875rem)',
                    fontFamily: 'Montserrat',
                    fontStyle: 'SemiBold',
                    fontWeight: 600,
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    lineHeight: '1.23',
                    color: '#FFFFFF',
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

  // Data for Raw Material cards
  const rawMaterialCards = [
    {
      title: 'Metals & Alloys',
      items: ['Steel', 'Iron', 'Nickel', 'Aluminum & Alloy', 'Copper', 'Zinc', 'Lead', 'Titanium']
    },
    {
      title: 'Polymers & Plastics',
      items: ['Thermoplastics', 'Rubber', 'Engineering Plastics', 'Thermosets']
    },
    {
      title: 'Ceramics & Glass',
      items: ['Industrial Ceramics', 'Refractories', 'Glass', 'Alumina', 'Silicon Carbide']
    },
    {
      title: 'Composites',
      items: ['Carbon Fiber Composites', 'Glass Fiber Reinforced Plastics', 'Natural fiber composites']
    },
    {
      title: 'Wood & Natural Materials',
      items: ['Softwoods', 'Plywood', 'MDF', 'Hardwoods', 'Laminates']
    },
    {
      title: 'Chemicals & Industrial Inputs',
      items: ['Refractories', 'Glass', 'Alumina', 'Silicon Carbide']
    }
  ]

  // Data for Machines cards
  const machinesCards = [
    {
      title: 'CNC Machining',
      items: ['5-Axis CNC', '3-Axis CNC', 'CNC Milling Center', 'CNC Lathe', 'Swiss CNC', 'CNC Turning']
    },
    {
      title: 'Cutting & Shaping',
      items: ['Laser Cutting', 'Water Jet Cutting', 'Plasma Cutting', 'EDM Machines', 'Band Saws']
    },
    {
      title: 'Forming & Pressing',
      items: ['Hydraulic Press', 'Punch Press', 'Bending Machines', 'Stamping Press', 'Roll Forming']
    },
    {
      title: 'Welding & Joining',
      items: ['TIG Welding', 'MIG Welding', 'Spot Welding', 'Arc Welding', 'Robotic Welding']
    },
    {
      title: 'Quality & Testing',
      items: ['CMM Machines', 'Coordinate Measuring', 'Hardness Testers', 'Surface Roughness', 'Metrology Lab']
    },
    {
      title: 'Finishing & Coating',
      items: ['Grinding Machines', 'Polishing Equipment', 'Anodizing Line', 'Powder Coating', 'Plating Systems']
    }
  ]

  // Data for Manufacturing Process cards
  const mfgProcessCards = [
    {
      title: 'Metal Forming',
      items: ['Forging', 'Casting', 'Stamping', 'Extrusion', 'Deep Drawing', 'Roll Forming']
    },
    {
      title: 'Machining Operations',
      items: ['Milling', 'Turning', 'Drilling', 'Grinding', 'Threading', 'Boring']
    },
    {
      title: 'Assembly & Joining',
      items: ['Welding', 'Brazing', 'Soldering', 'Riveting', 'Adhesive Bonding', 'Mechanical Fastening']
    },
    {
      title: 'Surface Treatment',
      items: ['Anodizing', 'Plating', 'Powder Coating', 'Heat Treatment', 'Passivation', 'Painting']
    },
    {
      title: 'Quality Control',
      items: ['Dimensional Inspection', 'Material Testing', 'NDT Testing', 'Surface Analysis', 'Metrology']
    },
    {
      title: 'Packaging & Shipping',
      items: ['Custom Packaging', 'Labeling', 'Documentation', 'Logistics', 'Export Compliance']
    }
  ]

  // Data for Specializations cards
  const specializationsCards = [
    {
      title: 'Aerospace & Defense',
      items: ['Aircraft Components', 'Defense Systems', 'Satellite Parts', 'AS9100 Certified']
    },
    {
      title: 'Automotive Industry',
      items: ['Engine Components', 'Chassis Components', 'IATF 16949']
    },
    {
      title: 'Medical Devices',
      items: ['Surgical Instruments', 'Implants', 'Medical Equipment', 'ISO 13485', 'FDA Compliant']
    },
    {
      title: 'Electronics & Semiconductors',
      items: ['Precision Components', 'Heat Sinks', 'Enclosures', 'Connectors', 'Micro Machining']
    },
    {
      title: 'Energy & Power',
      items: [ 'Power Generation', 'Renewable Energy', 'Oil & Gas', 'Nuclear Components']
    },
    {
      title: 'Industrial Equipment',
      items: ['Heavy Machinery', 'Industrial Automation', 'Material Handling']
    }
  ]

  // Get cards data based on active tab
  const getCardsForTab = (tab) => {
    switch (tab) {
      case 'Raw Material':
        return rawMaterialCards
      case 'Machines':
        return machinesCards
      case 'Mfg Process':
        return mfgProcessCards
      case 'Specializations':
        return specializationsCards
      default:
        return rawMaterialCards
    }
  }

  const currentCards = getCardsForTab(activeTab)

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16 lg:py-20" style={{ marginTop: 'clamp(3rem, 7.5vw, 7.5rem)', marginBottom: 'clamp(3rem, 7.5vw, 7.5rem)' }}>
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8" style={{ width: '100%', maxWidth: '72.625rem' }}>
        {/* Tab Navigation */}
        <div className="relative mx-auto mb-8 md:mb-12" style={{ width: '100%', maxWidth: '61.6875rem', minHeight: 'clamp(3.5rem, 5vw, 4.3125rem)' }}>
          <motion.div
            variants={fadeUp}
            className="flex flex-row items-center justify-center flex-wrap gap-4 md:gap-8 lg:gap-12 xl:gap-16"
            style={{
              width: '100%',
              minHeight: 'clamp(2.5rem, 4vw, 3.3125rem)',
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
                        padding: 'clamp(0.75rem, 1vw, 1rem) clamp(1rem, 1.5vw, 1.5rem)',
                        gap: 'clamp(0.5rem, 0.75vw, 0.625rem)',
                        width: 'auto',
                        minHeight: 'clamp(2.5rem, 4vw, 3.3125rem)',
                        background: 'rgba(255, 255, 255, 0.12)',
                        borderRadius: 'clamp(0.75rem, 1vw, 0.875rem)',
                        flex: 'none',
                        order: 0,
                        flexGrow: 0,
                        position: 'relative'
                      }}
                    >
                      <div
                        style={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontStyle: 'normal',
                          fontWeight: 500,
                          fontSize: 'clamp(1rem, 1.75vw, 1.5rem)',
                          lineHeight: '1.21',
                          color: '#FFFFFF',
                          flex: 'none',
                          order: 0,
                          flexGrow: 0,
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {tab}
                      </div>
                      {/* Underline centered under the active tab */}
                      <div
                        style={{
                          position: 'absolute',
                          bottom: 'clamp(-0.5rem, -0.75vw, -0.625rem)',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 'clamp(5rem, 8vw, 8.1875rem)',
                          height: '1px',
                          background: '#FFFFFF',
                          transition: 'all 0.3s ease'
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => onTabChange(tab)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        fontSize: 'clamp(1rem, 1.75vw, 1.5rem)',
                        lineHeight: '1.21',
                        color: '#FFFFFF',
                        flex: 'none',
                        order: index,
                        flexGrow: 0,
                        whiteSpace: 'nowrap',
                        padding: 'clamp(0.75rem, 1vw, 1rem) 0',
                        minHeight: 'clamp(2.5rem, 4vw, 3.3125rem)',
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
        </div>

        {/* Cards Grid */}
        {currentCards.length > 0 && (
          <motion.div
            key={activeTab}
            initial="hidden"
            animate="show"
            variants={fadeUp}
            className="relative p-10 bg-[#212121]/35 rounded-xl"
            style={{ width: '100%' }}
          >
            {/* Cards Container with vertical separators */}
            <div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              style={{
                position: 'relative',
                width: '100%'
              }}
            >
              {currentCards.map((card, index) => {
                const isLastInRow = (index + 1) % 3 === 0
                const isFirstInRow = index % 3 === 0
                
                // Calculate dynamic gap based on number of items
                // More items = smaller gap to fit within same card height
                const itemCount = card.items.length
                let dynamicGap = 'clamp(0.375rem, 0.75vw, 0.5rem)' // default gap (6px-8px)
                if (itemCount > 10) {
                  dynamicGap = 'clamp(0.2rem, 0.4vw, 0.3rem)' // very small gap for many items (3px-5px)
                } else if (itemCount > 8) {
                  dynamicGap = 'clamp(0.25rem, 0.5vw, 0.375rem)' // small gap (4px-6px)
                } else if (itemCount > 6) {
                  dynamicGap = 'clamp(0.3rem, 0.6vw, 0.4rem)' // medium gap (5px-6px)
                }

                return (
                  <div key={index} style={{ position: 'relative' }}>
                    {/* Vertical dashed line separator */}
                    {!isLastInRow && (
                      <div
                        className="absolute right-0 top-0 bottom-0 pointer-events-none"
                        style={{
                          width: '1px',
                          borderRight: '1px dashed #B1B1B1',
                          height: '100%',
                          transform: 'translateX(12px)',
                          opacity: 0.5
                        }}
                      />
                    )}

                    {/* Card */}
                    <div
                      className="bg-[#ffffff/70] rounded-[30px] p-6 flex flex-col"
                      style={{
                        background: 'rgba(255, 255, 255, 0.7)',
                        borderRadius: 'clamp(0.75rem, 1.5vw, 1rem)',
                        padding: 'clamp(1rem, 2vw, 1.5rem)',
                        height: 'clamp(12rem, 20vw, 17.5rem)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        position: 'relative',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Card Title */}
                      <h3
                        style={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontStyle: 'normal',
                          fontWeight: 600,
                          fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                          lineHeight: '1.2',
                          color: '#000000',
                          marginBottom: 'clamp(1rem, 1.5vw, 1.25rem)',
                          flexShrink: 0
                        }}
                      >
                        {card.title}
                      </h3>

                      {/* Card Items */}
                      <div className="flex flex-wrap mb-4" style={{ flex: 1, gap: dynamicGap, minHeight: 0, alignContent: 'flex-start' }}>
                        {card.items.map((item, itemIndex) => (
                          <span
                            key={itemIndex}
                            className="inline-flex items-center justify-center text-center rounded-full"
                            style={{
                              background: 'transparent',
                              border: '1px solid #3A3A3A',
                              borderRadius: '14px',
                              padding: '12px 16px 12px 16px',
                              gap: '10px',
                              fontFamily: 'Montserrat, sans-serif',
                              fontStyle: 'normal',
                              fontWeight: 500,
                              fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
                              lineHeight: '1',
                              color: '#000000',
                              whiteSpace: 'nowrap',
                              minHeight: 'clamp(1.5rem, 2vw, 1.8125rem)',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {item}
                          </span>
                        ))}
                      </div>

                      {/* Arrow Icon */}
                      <div className="flex justify-start pt-2" style={{ flexShrink: 0 }}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M5 12H19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M12 5L19 12L12 19" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}

function OurServices({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange }) {
  // Default services if not provided
  const defaultServices = [
    {
      title: 'Product Design & Prototyping',
      description: 'From CAD modeling to functional prototypes, enabling faster innovation.',
      image: service1
    },
    {
      title: 'Precision Machining',
      description: 'High-accuracy machining services for complex components and tight tolerances.',
      image: service2
    },
    {
      title: 'Casting & Forging',
      description: 'Tailored manufacturing solutions to meet your unique specifications and requirements.',
      image: service3
    },
    {
      title: 'Fabrication & Welding',
      description: 'Complete assembly solutions from component integration to final product delivery.',
      image: service4
    }
  ]

  const services = company?.services || defaultServices
  const isEditing = editingFields.services

  const handleServiceFieldChange = (index, field, value) => {
    const currentServices = company?.services || services
    const newServices = [...currentServices]
    if (typeof newServices[index] === 'string') {
      // Convert string to object if needed
      newServices[index] = { title: newServices[index], description: '', image: '' }
    }
    newServices[index] = { ...newServices[index], [field]: value }
    onFieldChange('services', newServices)
  }

  const handleAddService = () => {
    if (!isEditing) {
      onStartEdit('services')
    }
    const currentServices = company?.services || services
    onFieldChange('services', [...currentServices, { title: '', description: '', image: '' }])
  }

  const handleRemoveService = (index) => {
    const currentServices = company?.services || services
    const newServices = currentServices.filter((_, i) => i !== index)
    onFieldChange('services', newServices)
  }

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16" style={{ marginBottom: 'clamp(3rem, 7.5vw, 7.5rem)' }}>
      {/* Header Section with Title and Button */}
      <div className="relative mx-auto mb-8 sm:mb-10 md:mb-12" style={{ width: '100%', maxWidth: '72.625rem' }}>
        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10"
          style={{
            padding: '0px',
            width: '100%'
          }}
        >
          {/* Two-line Title on Left */}
          <div
            className="flex-1"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0px'
            }}
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] leading-tight"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '1.2',
                color: '#FFFFFF',
                margin: 0,
                textAlign: 'left'
              }}
            >
              Driving Innovation Through Expert
            </h2>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] leading-tight"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '1.2',
                color: '#FFFFFF',
                margin: 0,
                textAlign: 'left'
              }}
            >
              Manufacturing Services
            </h2>
          </div>

          {/* View All Services Button on Right */}
          <div
            className="flex-shrink-0 w-full md:w-auto flex items-center justify-start md:justify-end"
          >
            <button
              onClick={() => {
                // Scroll to services grid or handle navigation
                const servicesGrid = document.querySelector('[data-services-grid]')
                if (servicesGrid) {
                  servicesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }
              }}
              className="group flex items-center gap-3 px-4 sm:px-6 py-3 border border-white rounded-lg hover:bg-white/10 transition-colors w-full md:w-auto justify-center md:justify-start"
              style={{
                background: 'transparent',
                border: '1px solid #FFFFFF',
                borderRadius: '8px'
              }}
            >
              <span
                className="text-sm sm:text-base"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '20px',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap'
                }}
              >
                View All Services
              </span>
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '1px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 17L17 7M17 7H7M17 7V17"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Services Content - Cards */}
      <div className="max-w-6xl mx-auto" data-services-grid>
        {isEditing ? (
          <motion.div variants={fadeUp}>
            <div className="space-y-8">
              {services && services.length > 0 ? (
                services.map((service, index) => {
                  const serviceTitle = typeof service === 'object' ? service.title : service
                  const serviceDesc = typeof service === 'object' ? service.description : ''
                  const serviceImage = typeof service === 'object' ? service.image : ''

                  return (
                    <div key={index} className="bg-gray-800 p-6 rounded-2xl">
                      <div className="flex flex-col gap-4">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={serviceTitle || ''}
                            onChange={(e) => handleServiceFieldChange(index, 'title', e.target.value)}
                            placeholder="Service title"
                            className="w-full bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white text-lg font-semibold focus:outline-none"
                          />
                          <textarea
                            value={serviceDesc || ''}
                            onChange={(e) => handleServiceFieldChange(index, 'description', e.target.value)}
                            placeholder="Service description"
                            className="w-full bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white text-sm focus:outline-none resize-y"
                            rows="2"
                          />
                          <input
                            type="text"
                            value={serviceImage || ''}
                            onChange={(e) => handleServiceFieldChange(index, 'image', e.target.value)}
                            placeholder="Image URL"
                            className="w-full bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white text-sm focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => handleRemoveService(index)}
                          className="text-red-400 hover:text-red-300 font-bold text-xl w-8 h-8 flex items-center justify-center self-end"
                          title="Remove service"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : null}
              <button
                onClick={handleAddService}
                className="bg-gray-700 hover:bg-gray-600 p-6 rounded-2xl text-center text-gray-300 border-2 border-dashed border-gray-600 min-h-[100px] flex items-center justify-center text-sm sm:text-base w-full"
              >
                + Add Service
              </button>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => onStopEdit('services')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 text-base"
              >
                Done Editing
              </button>
            </div>
          </motion.div>
        ) : (
          <div
            className="space-y-6"
            style={{
              opacity: 1,
              visibility: 'visible',
              width: '100%'
            }}
          >
            {services && services.length > 0 ? (
              services.map((service, index) => {
                const serviceTitle = typeof service === 'object' && service !== null ? service.title : (service || 'Service Name')
                const serviceDesc = typeof service === 'object' && service !== null ? service.description : ''
                const serviceImage = typeof service === 'object' && service !== null ? service.image : service1

                return (
                  <div
                    key={index}
                    className="bg-gray-900 rounded-3xl overflow-hidden"
                    style={{
                      borderRadius: '24px',
                      background: 'rgba(33, 33, 33, 0.95)',
                      minHeight: '280px',
                      width: '100%',
                      position: 'relative',
                      zIndex: 1,
                      display: 'block'
                    }}
                  >
                    {/* 3-Column Layout */}
                    <div
                      className="w-full p-6 sm:p-8 md:p-10 lg:p-12 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-6 lg:gap-6"
                      style={{
                        width: '100%',
                        position: 'relative',
                        zIndex: 2,
                        alignItems: 'stretch'
                      }}
                    >
                      {/* Column 1: Service Name */}
                      <div
                        className="flex items-start"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                          alignItems: 'flex-start'
                        }}
                      >
                        <h3
                          style={{
                            fontFamily: 'Montserrat, sans-serif',
                            fontStyle: 'normal',
                            fontWeight: 600,
                            fontSize: 'clamp(1.5rem, 2.5vw, 2rem)',
                            lineHeight: '1.22',
                            color: '#FFFFFF',
                            margin: 0
                          }}
                          className="text-2xl sm:text-3xl md:text-4xl"
                        >
                          {serviceTitle}
                        </h3>
                      </div>

                      {/* Column 2: Description and Read More Button */}
                      <div
                        className="flex flex-col justify-between"
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '1rem'
                        }}
                      >
                        {/* Description */}
                        {serviceDesc && (
                          <p
                            style={{
                              fontFamily: 'Montserrat, sans-serif',
                              fontStyle: 'normal',
                              fontWeight: 400,
                              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
                              lineHeight: '1.5',
                              color: '#FFFFFF',
                              margin: 0
                            }}
                            className="text-xl sm:text-base"
                          >
                            {serviceDesc}
                          </p>
                        )}

                        {/* Read More Button */}
                        <button
                          onClick={() => {
                            // Handle read more action
                            console.log('Read more:', serviceTitle)
                          }}
                          className="group flex items-center w-fit rounded-full border border-white hover:bg-white/10 transition-colors mt-auto"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            background: '#000000',
                            border: '1px solid #FFFFFF',
                            borderRadius: '9999px',
                            padding: '0',
                            gap: '0',
                            overflow: 'hidden',
                            marginTop: 'auto'
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'Montserrat, sans-serif',
                              fontStyle: 'normal',
                              fontWeight: 500,
                              fontSize: 'clamp(0.875rem, 1.2vw, 1rem)',
                              lineHeight: '1.25',
                              color: '#FFFFFF',
                              padding: 'clamp(0.75rem, 1vw, 0.875rem) clamp(1rem, 1.5vw, 1.25rem) clamp(0.75rem, 1vw, 0.875rem) clamp(1.25rem, 1.75vw, 1.5rem)',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            Read More
                          </span>
                          <div
                            className="flex items-center justify-center"
                            style={{
                              width: 'clamp(36px, 4vw, 44px)',
                              height: 'clamp(36px, 4vw, 44px)',
                              borderRadius: '50%',
                              background: '#FFFFFF',
                              border: '1px solid #000000',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              margin: '2px',
                              marginLeft: '0'
                            }}
                          >
                            <svg
                              width="18"
                              height="18"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M7 17L17 7M17 7H7M17 7V17"
                                stroke="#000000"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </div>
                        </button>
                      </div>

                      {/* Column 3: Image */}
                      <div
                        className="flex items-center justify-center md:justify-end w-full md:w-auto"
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          className="w-full md:w-auto"
                          style={{
                            position: 'relative',
                            overflow: 'hidden',
                            width: '100%',
                            maxWidth: 'clamp(200px, 25vw, 260px)',
                            height: 'clamp(180px, 22vw, 200px)',
                            borderRadius: '16px'
                          }}
                        >
                          <img
                            src={serviceImage}
                            alt={serviceTitle}
                            className="w-full h-full object-cover"
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              borderRadius: '16px'
                            }}
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZhaWxlZCB0byBsb2FkPC90ZXh0Pjwvc3ZnPg=='
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center text-gray-400 text-base px-4 py-12">
                No services listed. Click edit to add services.
              </div>
            )}
          </div>
        )}
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
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16" style={{ marginBottom: 'clamp(3rem, 7.5vw, 7.5rem)' }}>
      {/* Header Section with Title and Button */}
      <div className="relative mx-auto mb-8 sm:mb-10 md:mb-12" style={{ width: '100%', maxWidth: '72.625rem' }}>
        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10"
          style={{
            padding: '0px',
            width: '100%'
          }}
        >
          {/* Two-line Title on Left */}
          <div
            className="flex-1"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0px'
            }}
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] leading-tight"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '1.2',
                color: '#FFFFFF',
                margin: 0,
                textAlign: 'left'
              }}
            >
              Setting Global Standards in
            </h2>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] leading-tight"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '1.2',
                color: '#FFFFFF',
                margin: 0,
                textAlign: 'left'
              }}
            >
              Quality & Precision
            </h2>
          </div>

          {/* Add More Button on Right */}
          <div
            className="flex-shrink-0 w-full md:w-auto flex items-center justify-start md:justify-end"
          >
            <button
              onClick={() => onStartEdit('certifications')}
              className="group flex items-center gap-3 px-4 sm:px-6 py-3 border border-white rounded-lg hover:bg-white/10 transition-colors w-full md:w-auto justify-center md:justify-start"
              style={{
                background: 'transparent',
                border: '1px solid #FFFFFF',
                borderRadius: '8px'
              }}
            >
              <span
                className="text-sm sm:text-base"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  lineHeight: '20px',
                  color: '#FFFFFF',
                  whiteSpace: 'nowrap'
                }}
              >
                Add More
              </span>
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '1px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 5V19M5 12H19"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Certifications Content */}
      <div className="max-w-6xl mx-auto">
        {isEditing ? (
          <div className="space-y-6" style={{ opacity: 1, visibility: 'visible' }}>
            <div className="space-y-4">
              {company?.certifications && company.certifications.length > 0 ? (
                company.certifications.map((cert, index) => {
                  const certData = typeof cert === 'object' ? cert : {
                    title: cert,
                    year: '',
                    description: '',
                    image: ''
                  }
                  return (
                    <div key={index} className="bg-gray-800 p-6 rounded-2xl">
                      <div className="flex flex-col gap-4">
                        <div className="flex-1 space-y-3">
                          <input
                            type="text"
                            value={certData.title || ''}
                            onChange={(e) => {
                              const currentCerts = company?.certifications || []
                              const newCerts = [...currentCerts]
                              newCerts[index] = { ...certData, title: e.target.value }
                              onFieldChange('certifications', newCerts)
                            }}
                            placeholder="Certification Title"
                            className="w-full bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white text-lg font-semibold focus:outline-none"
                          />
                          <input
                            type="text"
                            value={certData.year || ''}
                            onChange={(e) => {
                              const currentCerts = company?.certifications || []
                              const newCerts = [...currentCerts]
                              newCerts[index] = { ...certData, year: e.target.value }
                              onFieldChange('certifications', newCerts)
                            }}
                            placeholder="Year (e.g., 2022)"
                            className="w-full bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white text-sm focus:outline-none"
                          />
                          <textarea
                            value={certData.description || ''}
                            onChange={(e) => {
                              const currentCerts = company?.certifications || []
                              const newCerts = [...currentCerts]
                              newCerts[index] = { ...certData, description: e.target.value }
                              onFieldChange('certifications', newCerts)
                            }}
                            placeholder="Description"
                            className="w-full bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white text-sm focus:outline-none resize-y"
                            rows="3"
                          />
                          <input
                            type="text"
                            value={certData.image || ''}
                            onChange={(e) => {
                              const currentCerts = company?.certifications || []
                              const newCerts = [...currentCerts]
                              newCerts[index] = { ...certData, image: e.target.value }
                              onFieldChange('certifications', newCerts)
                            }}
                            placeholder="Image URL (optional)"
                            className="w-full bg-gray-700 border-2 border-[#FC6500] rounded p-2 text-white text-sm focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => {
                            const currentCerts = company?.certifications || []
                            const newCerts = currentCerts.filter((_, i) => i !== index)
                            onFieldChange('certifications', newCerts)
                          }}
                          className="text-red-400 hover:text-red-300 font-bold text-xl w-8 h-8 flex items-center justify-center self-end"
                          title="Remove certification"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center text-gray-400 text-base px-4 py-8">
                  No certifications yet. Click "Add New Certification" to add one.
                </div>
              )}
              <button
                onClick={() => {
                  const currentCerts = company?.certifications || []
                  onFieldChange('certifications', [...currentCerts, { title: '', year: '', description: '', image: '' }])
                }}
                className="bg-gray-700 hover:bg-gray-600 p-6 rounded-2xl text-center text-gray-300 border-2 border-dashed border-gray-600 min-h-[100px] flex items-center justify-center text-sm sm:text-base w-full"
              >
                + Add New Certification
              </button>
            </div>
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => onStopEdit('certifications')}
                className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 text-base"
              >
                Done Editing
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-6 overflow-hidden w-full" style={{ padding: '0 20px' }}>
            {/* First Row - Infinite Scrolling Left */}
            <div className="relative w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
              <div className="flex animate-scroll-left gap-6" style={{ width: 'max-content' }}>
                {/* Duplicate content for seamless loop */}
                {[...Array(3)].map((_, loopIndex) => (
                  <div key={`loop-${loopIndex}`} className="flex gap-6">
                    {company?.certifications && company.certifications.length > 0 ? (
                      company.certifications.map((cert, index) => {
                        const certImages = [cert1, cert2, cert3]
                        const certImage = certImages[index % certImages.length]
                        const certData = typeof cert === 'object' ? cert : {
                          title: cert,
                          year: '2022',
                          description: 'Quality management system ensuring consistent product quality and customer satisfaction.',
                          image: certImage
                        }
                        return (
                          <div
                            key={`${loopIndex}-${index}`}
                            className="bg-gray-800 rounded-lg p-4 flex-shrink-0 h-20"
                            style={{
                              width: '400px',
                              minHeight: '220px',
                              height: '220px',
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '20px',
                              background: 'rgba(33, 33, 33, 0.8)',
                              borderRadius: '12px'
                            }}
                          >
                            {/* Left Content */}
                            <div className="flex flex-col justify-between flex-1" style={{ minWidth: '200px' }}>
                              <div>
                                <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  {certData.title}
                                </h3>
                                <p className="text-white text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  {certData.year || '2022'}
                                </p>
                                <div className="w-full h-px bg-gray-600 mb-2"></div>
                                <p className="text-sm text-gray-300 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  {certData.description || 'Quality management system ensuring consistent product quality and customer satisfaction.'}
                                </p>
                              </div>
                            </div>
                            {/* Right - Certificate Image */}
                            <div className="flex-shrink-0" style={{ width: '150px', height: '180px' }}>
                              <img
                                src={certData.image || certImage}
                                alt={certData.title}
                                className="w-full h-full object-cover rounded"
                                style={{ borderRadius: '8px' }}
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZhaWxlZCB0byBsb2FkPC90ZXh0Pjwvc3ZnPg=='
                                }}
                              />
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center text-gray-400 text-base px-4 py-12" style={{ width: '400px' }}>
                        No certifications listed. Click edit to add certifications.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Second Row - Infinite Scrolling Right */}
            <div className="relative w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
              <div className="flex animate-scroll-right gap-6" style={{ width: 'max-content' }}>
                {/* Duplicate content for seamless loop */}
                {[...Array(3)].map((_, loopIndex) => (
                  <div key={`loop-reverse-${loopIndex}`} className="flex gap-6">
                    {company?.certifications && company.certifications.length > 0 ? (
                      [...company.certifications].reverse().map((cert, index) => {
                        const certImages = [cert1, cert2, cert3]
                        const certImage = certImages[index % certImages.length]
                        const certData = typeof cert === 'object' ? cert : {
                          title: cert,
                          year: '2021',
                          description: 'Quality management system ensuring consistent product quality and customer satisfaction.',
                          image: certImage
                        }
                        return (
                          <div
                            key={`reverse-${loopIndex}-${index}`}
                            className="bg-gray-800 rounded-lg p-4 flex-shrink-0 h-20"
                            style={{
                              width: '400px',
                              minHeight: '220px',
                              height: '220px',
                              display: 'flex',
                              flexDirection: 'row',
                              gap: '20px',
                              background: 'rgba(33, 33, 33, 0.8)',
                              borderRadius: '12px'
                            }}
                          >
                            {/* Left Content */}
                            <div className="flex flex-col justify-between flex-1" style={{ minWidth: '200px' }}>
                              <div>
                                <h3 className="text-2xl font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  {certData.title}
                                </h3>
                                <p className="text-white text-lg mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  {certData.year || '2021'}
                                </p>
                                <div className="w-full h-px bg-gray-600 mb-2"></div>
                                <p className="text-sm text-gray-300 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                  {certData.description || 'Quality management system ensuring consistent product quality and customer satisfaction.'}
                                </p>
                              </div>
                            </div>
                            {/* Right - Certificate Image */}
                            <div className="flex-shrink-0" style={{ width: '150px', height: '180px' }}>
                              <img
                                src={certData.image || certImage}
                                alt={certData.title}
                                className="w-full h-full object-cover rounded"
                                style={{ borderRadius: '8px' }}
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZhaWxlZCB0byBsb2FkPC90ZXh0Pjwvc3ZnPg=='
                                }}
                              />
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <div className="text-center text-gray-400 text-base px-4 py-12" style={{ width: '400px' }}>
                        No certifications listed. Click edit to add certifications.
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  )
}


function Gallery({ company }) {
  const [currentIndex, setCurrentIndex] = useState(2) // Start at center (index 2)

  // Default media images - always use these for demo
  const defaultMediaImages = [media, media2, media3, media4, media5]

  // Always use default images for now
  const mediaImages = defaultMediaImages

  console.log('Gallery images:', mediaImages)

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % mediaImages.length)
  }

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + mediaImages.length) % mediaImages.length)
  }

  const goToSlide = (index) => {
    setCurrentIndex(index)
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
      className="relative w-full py-8 sm:py-12 md:py-16 lg:py-20 overflow-x-hidden"
      style={{ marginBottom: 'clamp(3rem, 7.5vw, 7.5rem)', overflowX: 'hidden' }}
    >
      <div className="relative mx-auto px-4 sm:px-6 lg:px-8" style={{ width: '100%', maxWidth: '72.625rem', overflowX: 'hidden', position: 'relative', isolation: 'isolate' }}>
        {/* Gallery Container with clipping */}
        <div className="relative w-full overflow-x-hidden" style={{ overflowX: 'hidden', position: 'relative', width: '100%', maxWidth: '100%' }}>
          <div className="relative flex items-center justify-center overflow-x-hidden" style={{ height: 'clamp(20rem, 40vw, 31.25rem)', perspective: 'clamp(50rem, 100vw, 75rem)', overflowX: 'hidden', overflowY: 'visible', width: '100%', position: 'relative', maxWidth: '100%' }}>
            <div className="relative flex items-center justify-center overflow-x-hidden" style={{ width: '100%', height: '100%', overflowX: 'hidden', overflowY: 'visible', position: 'relative', maxWidth: '100%' }}>
              {mediaImages && mediaImages.length > 0 ? mediaImages.map((image, index) => {
                const offset = index - currentIndex
                const isCenter = offset === 0

                // Calculate position, rotation, and scale - responsive spacing
                const baseSpacing = typeof window !== 'undefined' ? Math.min(window.innerWidth * 0.15, 280) : 280
                let translateX = offset * baseSpacing
                let rotationY = 0
                let scale = 1
                let opacity = 1
                let zIndex = mediaImages.length - Math.abs(offset)

                if (!isCenter) {
                  // Tilt images that are not in center
                  rotationY = offset > 0 ? 25 : -25 // Tilt right if ahead, left if behind
                  scale = 0.75
                  opacity = 0.5
                } else {
                  scale = 1
                  opacity = 1
                  zIndex = 100
                }

                return (
                  <div
                    key={index}
                    className="absolute cursor-pointer transition-all duration-700 ease-in-out"
                    style={{
                      width: 'clamp(16rem, 30vw, 25rem)',
                      height: 'clamp(18rem, 33vw, 28.125rem)',
                      transform: `translateX(${translateX}px) rotateY(${rotationY}deg) scale(${scale})`,
                      opacity: opacity,
                      zIndex: zIndex,
                      transformStyle: 'preserve-3d',
                      backfaceVisibility: 'hidden'
                    }}
                    onClick={() => goToSlide(index)}
                  >
                    <div
                      className="w-full h-full rounded-2xl overflow-hidden"
                      style={{
                        borderRadius: '16px',
                        boxShadow: isCenter
                          ? '0 25px 50px rgba(0, 0, 0, 0.6)'
                          : '0 10px 25px rgba(0, 0, 0, 0.4)',
                        transition: 'box-shadow 0.7s ease-in-out'
                      }}
                    >
                      <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="w-full h-full object-cover"
                        style={{
                          transition: 'all 0.7s ease-in-out'
                        }}
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZhaWxlZCB0byBsb2FkPC90ZXh0Pjwvc3ZnPg=='
                        }}
                      />
                    </div>
                  </div>
                )
              }) : (
                <div className="text-white">No images available</div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center items-center gap-2 mt-12">
          {mediaImages.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="transition-all duration-300 rounded-full"
              style={{
                width: index === currentIndex ? '12px' : '8px',
                height: index === currentIndex ? '12px' : '8px',
                backgroundColor: index === currentIndex ? '#FFFFFF' : '#666666',
                border: 'none',
                cursor: 'pointer'
              }}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all duration-300 z-20"
          style={{ backdropFilter: 'blur(10px)' }}
          aria-label="Previous image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 rounded-full p-3 transition-all duration-300 z-20"
          style={{ backdropFilter: 'blur(10px)' }}
          aria-label="Next image"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 18L15 12L9 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </motion.section>
  )
}

function Testimonials({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange }) {
  // Default testimonials if not provided
  const defaultTestimonials = [
    {
      quote: 'Outstanding quality and precision in every project. Their manufacturing capabilities exceeded our expectations.',
      author: 'John Smith',
      company: 'Tech Industries Inc.',
      rating: 5
    },
    {
      quote: 'Professional team with exceptional attention to detail. Highly recommend their services.',
      author: 'Emily Davis',
      company: 'Global Solutions Ltd.',
      rating: 5
    },
    {
      quote: 'Reliable partner for all our manufacturing needs. Consistent quality and on-time delivery.',
      author: 'Michael Brown',
      company: 'Innovation Corp.',
      rating: 5
    },
    {
      quote: 'Excellent service and superior craftsmanship. They truly understand our requirements.',
      author: 'Sarah Wilson',
      company: 'Advanced Manufacturing Co.',
      rating: 5
    },
    {
      quote: 'Top-notch quality and professional service. Our go-to manufacturing partner.',
      author: 'David Lee',
      company: 'Precision Engineering Group',
      rating: 5
    }
  ]

  const testimonials = company?.testimonials || defaultTestimonials

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16" style={{ marginBottom: 'clamp(3rem, 7.5vw, 7.5rem)' }}>
      {/* Testimonials Content */}
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col gap-6 overflow-hidden w-full" style={{ padding: '0 20px' }}>
          {/* First Row - Infinite Scrolling Left */}
          <div className="relative w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div className="flex animate-scroll-left gap-6" style={{ width: 'max-content' }}>
              {/* Duplicate content for seamless loop */}
              {[...Array(3)].map((_, loopIndex) => (
                <div key={`loop-${loopIndex}`} className="flex gap-6">
                  {testimonials && testimonials.length > 0 ? (
                    testimonials.map((testimonial, index) => {
                      const testimonialData = typeof testimonial === 'object' ? testimonial : {
                        quote: testimonial,
                        author: 'Client',
                        company: 'Company Name',
                        rating: 5
                      }
                      return (
                        <div
                          key={`${loopIndex}-${index}`}
                          className="bg-gray-800 rounded-lg p-4 flex-shrink-0"
                          style={{
                            width: '400px',
                            minHeight: '220px',
                            height: '220px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            background: 'rgba(33, 33, 33, 0.8)',
                            borderRadius: '12px'
                          }}
                        >
                          {/* Name and Image Section */}
                          <div className="flex items-center gap-3">
                            {/* User Image */}
                            <div className="flex-shrink-0" style={{ width: '50px', height: '50px' }}>
                              <img
                                src={testimonialImg}
                                alt={testimonialData.author || 'Client'}
                                className="w-full h-full object-cover rounded-full"
                                style={{
                                  borderRadius: '50%',
                                  objectPosition: 'center top'
                                }}
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZhaWxlZCB0byBsb2FkPC90ZXh0Pjwvc3ZnPg=='
                                }}
                              />
                            </div>
                            {/* Name and Company */}
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {testimonialData.author || 'Client Name'}
                              </h3>
                              <p className="text-sm text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {testimonialData.company || 'Company Name'}
                              </p>
                            </div>
                          </div>

                          {/* Separator */}
                          <div className="w-full h-px bg-gray-600"></div>

                          {/* Quote */}
                          <div className="flex-1">
                            <p className="text-sm text-gray-300 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              "{testimonialData.quote || 'Great service and quality products.'}"
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center text-gray-400 text-base px-4 py-12" style={{ width: '400px' }}>
                      No testimonials listed.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Second Row - Infinite Scrolling Right */}
          <div className="relative w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
            <div className="flex animate-scroll-right gap-6" style={{ width: 'max-content' }}>
              {/* Duplicate content for seamless loop */}
              {[...Array(3)].map((_, loopIndex) => (
                <div key={`loop-reverse-${loopIndex}`} className="flex gap-6">
                  {testimonials && testimonials.length > 0 ? (
                    [...testimonials].reverse().map((testimonial, index) => {
                      const testimonialData = typeof testimonial === 'object' ? testimonial : {
                        quote: testimonial,
                        author: 'Client',
                        company: 'Company Name',
                        rating: 5
                      }
                      return (
                        <div
                          key={`reverse-${loopIndex}-${index}`}
                          className="bg-gray-800 rounded-lg p-4 flex-shrink-0"
                          style={{
                            width: '400px',
                            minHeight: '220px',
                            height: '220px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            background: 'rgba(33, 33, 33, 0.8)',
                            borderRadius: '12px'
                          }}
                        >
                          {/* Name and Image Section */}
                          <div className="flex items-center gap-3">
                            {/* User Image */}
                            <div className="flex-shrink-0" style={{ width: '50px', height: '50px' }}>
                              <img
                                src={testimonialImg}
                                alt={testimonialData.author || 'Client'}
                                className="w-full h-full object-cover rounded-full"
                                style={{
                                  borderRadius: '50%',
                                  objectPosition: 'center top'
                                }}
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZhaWxlZCB0byBsb2FkPC90ZXh0Pjwvc3ZnPg=='
                                }}
                              />
                            </div>
                            {/* Name and Company */}
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-white mb-1" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {testimonialData.author || 'Client Name'}
                              </h3>
                              <p className="text-sm text-gray-400" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                                {testimonialData.company || 'Company Name'}
                              </p>
                            </div>
                          </div>

                          {/* Separator */}
                          <div className="w-full h-px bg-gray-600"></div>

                          {/* Quote */}
                          <div className="flex-1">
                            <p className="text-sm text-gray-300 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                              "{testimonialData.quote || 'Great service and quality products.'}"
                            </p>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center text-gray-400 text-base px-4 py-12" style={{ width: '400px' }}>
                      No testimonials listed.
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

function Team({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange }) {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16" style={{ marginBottom: 'clamp(3rem, 7.5vw, 7.5rem)' }}>
      {/* Header Section with Title and Button */}
      <div className="relative mx-auto mb-8 sm:mb-10 md:mb-12" style={{ width: '100%', maxWidth: '72.625rem' }}>
        <motion.div
          variants={fadeUp}
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-10"
          style={{
            padding: '0px',
            width: '100%'
          }}
        >
          {/* Title on Left */}
          <div
            className="flex-1"
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: '0px'
            }}
          >
            <h2
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[48px] leading-tight"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                fontStyle: 'normal',
                fontWeight: 600,
                lineHeight: '1.2',
                color: '#FFFFFF',
                margin: 0,
                textAlign: 'left'
              }}
            >
              The Faces Behind Precision and Performance
            </h2>
          </div>

          {/* Button on Right */}
          <div
            className="flex-shrink-0 w-full md:w-auto flex items-center justify-start md:justify-end"
          >
            <button
              onClick={() => {
                // Handle button action
                console.log('Team button clicked')
              }}
              className="group flex items-center w-fit rounded-full border border-white hover:bg-white/10 transition-colors"
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#000000',
                border: '1px solid #FFFFFF',
                borderRadius: '9999px',
                padding: '0',
                gap: '0',
                overflow: 'hidden'
              }}
            >
              <span
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: '16px',
                  lineHeight: '20px',
                  color: '#FFFFFF',
                  padding: '12px 20px 12px 24px',
                  whiteSpace: 'nowrap'
                }}
              >
                View Team
              </span>
              <div
                className="flex items-center justify-center"
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  border: '1px solid #000000',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  margin: '2px',
                  marginLeft: '0'
                }}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 17L17 7M17 7H7M17 7V17"
                    stroke="#000000"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Team Content */}
      <div className="max-w-6xl mx-auto">
        <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Demo Team Members */}
          <TeamMemberCard
            name="Abhijeet Sinha"
            title="CEO"
            image={team1}
            linkedin="#"
            twitter="#"
            facebook="#"
          />
          <TeamMemberCard
            name="Sarah Johnson"
            title="CTO"
            image={team2}
            linkedin="#"
            twitter="#"
            facebook="#"
          />
          <TeamMemberCard
            name="Michael Chen"
            title="Head of Operations"
            image={team3}
            linkedin="#"
            twitter="#"
            facebook="#"
          />
        </motion.div>
      </div>
    </motion.section>
  )
}

// Team Member Card Component
function TeamMemberCard({ name, title, image, linkedin, twitter, facebook }) {
  return (
    <div
      className="bg-transparent rounded-lg overflow-hidden"
      style={{
        borderRadius: '12px',
        overflow: 'hidden'
      }}
    >
      {/* Profile Image */}
      <div
        className="w-full"
        style={{
          height: '350px',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          style={{
            objectFit: 'cover',
            objectPosition: 'center',
            width: '100%',
            height: '100%'
          }}
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZhaWxlZCB0byBsb2FkPC90ZXh0Pjwvc3ZnPg=='
          }}
        />
      </div>

      {/* Information Section */}
      <div
        className="bg-[#0C0C0C] p-4 sm:p-5 md:p-6"
        style={{
          background: '#0C0C0C',
          borderRadius: '0 0 12px 12px',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        {/* Name and Title */}
        <div className="flex-1">
          <h3
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'normal',
              fontWeight: 600,
              fontSize: '20px',
              lineHeight: '28px',
              color: '#FFFFFF',
              margin: 0,
              marginBottom: '4px'
            }}
          >
            {name}
          </h3>
          <p
            style={{
              fontFamily: 'Montserrat, sans-serif',
              fontStyle: 'normal',
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '20px',
              color: '#9CA3AF',
              margin: 0
            }}
          >
            {title}
          </p>
        </div>

        {/* Social Media Icons */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {linkedin && (
            <a
              href={linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '4px',
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #333333'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" fill="#FFFFFF" />
              </svg>
            </a>
          )}
          {twitter && (
            <a
              href={twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #333333'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="#FFFFFF" />
              </svg>
            </a>
          )}
          {facebook && (
            <a
              href={facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#000000',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #333333'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#FFFFFF" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

function IdCard({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange }) {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16" style={{ marginBottom: 'clamp(3rem, 7.5vw, 7.5rem)' }}>
      {/* ID Card Content */}
      <div className="max-w-6xl mx-auto">
        {/* ID Card content will go here */}
      </div>
    </motion.section>
  )
}

function Contact({ company, isEditMode, editingFields, onStartEdit, onStopEdit, onFieldChange }) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    query: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="relative w-full py-8 sm:py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div variants={fadeUp} className="flex flex-col md:flex-row gap-4 md:gap-32 lg:gap-48">
          {/* Left Side - Title */}
          <span className="text-xl sm:text-3xl md:text-xl font-bold text-white" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Let's Work Together
          </span>

          {/* Right Side - Form */}
          <div className="flex-1">
            <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
              {/* Top Row: Your Name and Your Phone side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                {/* Your Name */}
                <div className="flex flex-col">
                  <label className="text-white text-sm sm:text-base mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-transparent text-white text-sm sm:text-base pb-2 focus:outline-none border-b border-white"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                    placeholder=""
                  />
                </div>

                {/* Your Phone */}
                <div className="flex flex-col">
                  <label className="text-white text-sm sm:text-base mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Your Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-transparent text-white text-sm sm:text-base pb-2 focus:outline-none border-b border-white"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                    placeholder=""
                  />
                </div>
              </div>

              {/* Your Email - Below Your Name field */}
              <div className="flex flex-col md:w-1/2">
                <label className="text-white text-sm sm:text-base mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Your Email ID
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-transparent text-white text-sm sm:text-base pb-2 focus:outline-none border-b border-white"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  placeholder=""
                />
              </div>

              {/* Your Query - Textarea */}
              <div className="flex flex-col">
                <label className="text-white text-sm sm:text-base mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Your Query
                </label>
                <textarea
                  name="query"
                  value={formData.query}
                  onChange={handleInputChange}
                  rows="6"
                  className="w-full bg-[#131313] text-white text-sm sm:text-base p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20 resize-y"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  placeholder="type here....."
                />
              </div>

              {/* Submit Button - Styled like Read More button */}
              <div className="flex justify-start mt-8">
                <button
                  type="submit"
                  className="group flex items-center w-fit rounded-full border border-white hover:bg-white/10 transition-colors"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: '#000000',
                    border: '1px solid #FFFFFF',
                    borderRadius: '9999px',
                    padding: '0',
                    gap: '0',
                    overflow: 'hidden'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      fontStyle: 'normal',
                      fontWeight: 500,
                      fontSize: '16px',
                      lineHeight: '20px',
                      color: '#FFFFFF',
                      padding: '12px 20px 12px 24px',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    Submit
                  </span>
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      background: '#FFFFFF',
                      border: '1px solid #000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      margin: '2px',
                      marginLeft: '0'
                    }}
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M7 17L17 7M17 7H7M17 7V17"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

export default DemoCompanyProfilePage
