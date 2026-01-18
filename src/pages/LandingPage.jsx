// ============================================================================
// IMPORTS
// ============================================================================
import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from '@headlessui/react'
import { CheckCircleIcon } from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import RegistrationForm from '../components/RegistrationForm'
import LoginForm from '../components/LoginForm'
import AnimatedText from '../components/AnimatedText'
import DemoCompanyProfilePage from './DemoCompanyProfilePage'
import card5Image from '../assets/card5.png'
import bgnewImage from '../assets/bgnew.png'
import testimonialImg from '../assets/testimonial.jpg'

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const LandingPage = ({ onLoginSuccess }) => {
  // Navigation
  const navigate = useNavigate()

  // ============================================================================
  // STATE MANAGEMENT - UI MODALS & MENUS
  // ============================================================================
  const [showRegistration, setShowRegistration] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showContactFormModal, setShowContactFormModal] = useState(false)

  // ============================================================================
  // STATE MANAGEMENT - SECTION VISIBILITY (for animations)
  // ============================================================================
  const [isFixesSectionVisible, setIsFixesSectionVisible] = useState(false)
  const [isCardsSectionVisible, setIsCardsSectionVisible] = useState(false)
  const [isHowItWorksSectionVisible, setIsHowItWorksSectionVisible] = useState(false)
  const [isImageSectionVisible, setIsImageSectionVisible] = useState(false)
  const [isPricingSectionVisible, setIsPricingSectionVisible] = useState(false)
  const [isTestimonialsSectionVisible, setIsTestimonialsSectionVisible] = useState(false)
  const [isAboutUsSectionVisible, setIsAboutUsSectionVisible] = useState(false)
  const [isMadevizeTitleVisible, setIsMadevizeTitleVisible] = useState(false)
  const [isFactoryTitleVisible, setIsFactoryTitleVisible] = useState(false)

  // ============================================================================
  // REFS - Section References for Intersection Observer
  // ============================================================================
  const fixesSectionRef = useRef(null)
  const cardsSectionRef = useRef(null)
  const howItWorksSectionRef = useRef(null)
  const imageSectionRef = useRef(null)
  const pricingSectionRef = useRef(null)
  const testimonialsSectionRef = useRef(null)
  const aboutUsSectionRef = useRef(null)
  const madevizeTitleRef = useRef(null)
  const factoryTitleRef = useRef(null)
  const contactSectionRef = useRef(null)

  // ============================================================================
  // STATE MANAGEMENT - Image & Pricing
  // ============================================================================
  const [imageScale, setImageScale] = useState(1.3)
  const [billingPeriod, setBillingPeriod] = useState('Monthly')

  // ============================================================================
  // STATE MANAGEMENT - Mobile Parallax Scroll Effect
  // ============================================================================
  const [heroScrollProgress, setHeroScrollProgress] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0)

  // ============================================================================
  // STATE MANAGEMENT - Counter Animations
  // ============================================================================
  const [counter1, setCounter1] = useState(0)
  const [counter2, setCounter2] = useState(0)
  const [counter3, setCounter3] = useState(0)
  const [counter4, setCounter4] = useState(0)

  // ============================================================================
  // STATE MANAGEMENT - Footer Contact Form
  // ============================================================================
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    businessType: '',
    otherBusinessType: '',
    businessDescription: ''
  })
  const [formErrors, setFormErrors] = useState({})
  const [isFooterSubmitting, setIsFooterSubmitting] = useState(false)

  // ============================================================================
  // STATE MANAGEMENT - Modal Contact Form
  // ============================================================================
  const [modalFormData, setModalFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    businessType: '',
    otherBusinessType: '',
    businessDescription: ''
  })
  const [modalFormErrors, setModalFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ============================================================================
  // CONSTANTS - Business Types Dropdown Options
  // ============================================================================
  const businessTypes = [
    'Manufacturing',
    'Machining',
    'Casting',
    'Forging',
    'Fabrication',
    'Plating & Surface Treatment',
    'Assembly',
    'Tooling & Molds',
    'Quality Control & Testing',
    'Trading & Distribution',
    'Others'
  ]

  // ============================================================================
  // FORM HANDLERS - Footer Contact Form
  // ============================================================================

  /**
   * Handles input changes in the footer contact form
   * Clears validation errors when user starts typing
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  /**
   * Validates the footer contact form
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateForm = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!formData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!formData.businessDescription.trim()) {
      errors.businessDescription = 'Business description is required'
    }

    if (formData.businessType === 'Others' && !formData.otherBusinessType.trim()) {
      errors.otherBusinessType = 'Please specify your business type'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  /**
   * Handles footer form submission
   * Validates form and allows natural Google Forms submission if valid
   */
  const handleFooterSubmit = (e) => {
    if (!validateForm()) {
      e.preventDefault()
      return
    }
    // If validation passes, allow form to submit naturally to Google Forms
    setIsFooterSubmitting(true)
    // The iframe onLoad handler will detect completion and show success modal
  }

  /**
   * Handles footer iframe load event after form submission
   * Resets form and shows success modal when submission completes
   */
  const handleFooterIframeLoad = () => {
    // Only process if we're actually submitting (to avoid firing on initial iframe load)
    if (isFooterSubmitting) {
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        businessType: '',
        otherBusinessType: '',
        businessDescription: ''
      })
      setFormErrors({})
      setIsFooterSubmitting(false)

      // Show success modal
      setShowSuccessModal(true)
    }
  }

  // ============================================================================
  // FORM HANDLERS - Modal Contact Form
  // ============================================================================

  /**
   * Handles input changes in the modal contact form
   * Clears validation errors when user starts typing
   */
  const handleModalInputChange = (e) => {
    const { name, value } = e.target
    setModalFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error for this field when user starts typing
    if (modalFormErrors[name]) {
      setModalFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  /**
   * Validates the modal contact form
   * @returns {boolean} True if form is valid, false otherwise
   */
  const validateModalForm = () => {
    const errors = {}

    if (!modalFormData.name.trim()) {
      errors.name = 'Name is required'
    }

    if (!modalFormData.email.trim()) {
      errors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(modalFormData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    if (!modalFormData.businessDescription.trim()) {
      errors.businessDescription = 'Business description is required'
    }

    if (modalFormData.businessType === 'Others' && !modalFormData.otherBusinessType.trim()) {
      errors.otherBusinessType = 'Please specify your business type'
    }

    setModalFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  /**
   * Handles modal form submission
   * Validates form and allows natural Google Forms submission if valid
   */
  const handleModalSubmit = (e) => {
    if (!validateModalForm()) {
      e.preventDefault()
      return
    }
    // If validation passes, allow form to submit naturally to Google Forms
    setIsSubmitting(true)
    // The iframe onLoad handler will detect completion and show success modal
  }

  /**
   * Handles iframe load event after form submission
   * Resets form and shows success modal when submission completes
   */
  const handleModalIframeLoad = () => {
    // Only process if we're actually submitting (to avoid firing on initial iframe load)
    if (isSubmitting) {
      // Reset form after successful submission
      setModalFormData({
        name: '',
        email: '',
        phoneNumber: '',
        businessType: '',
        otherBusinessType: '',
        businessDescription: ''
      })
      setModalFormErrors({})
      setIsSubmitting(false)

      // Close modal and show success modal
      setShowContactFormModal(false)
      setShowSuccessModal(true)
    }
  }

  // ============================================================================
  // INTERSECTION OBSERVERS - Section Visibility Tracking
  // ============================================================================

  /**
   * Intersection Observer for "This is what Madevize fixes" section
   * Triggers animation when section enters viewport
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isFixesSectionVisible) {
            setIsFixesSectionVisible(true)
            // Stop observing after animation triggers (no replays)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    )

    if (fixesSectionRef.current) {
      observer.observe(fixesSectionRef.current)
    }

    return () => {
      if (fixesSectionRef.current) {
        observer.unobserve(fixesSectionRef.current)
      }
    }
  }, [isFixesSectionVisible])

  /**
   * Intersection Observer for cards section
   * Tracks visibility for card animations
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsCardsSectionVisible(entry.isIntersecting)
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    )

    if (cardsSectionRef.current) {
      observer.observe(cardsSectionRef.current)
    }

    return () => {
      if (cardsSectionRef.current) {
        observer.unobserve(cardsSectionRef.current)
      }
    }
  }, [])

  /**
   * Intersection Observer for "How It Works" section
   * Tracks visibility for counter animations
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsHowItWorksSectionVisible(entry.isIntersecting)
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    )

    if (howItWorksSectionRef.current) {
      observer.observe(howItWorksSectionRef.current)
    }

    return () => {
      if (howItWorksSectionRef.current) {
        observer.unobserve(howItWorksSectionRef.current)
      }
    }
  }, [])

  /**
   * Intersection Observer for image section - scroll-based animation with zoom
   * Calculates scroll progress and updates image scale dynamically
   */
  useEffect(() => {
    const handleScroll = () => {
      if (!imageSectionRef.current) return

      const rect = imageSectionRef.current.getBoundingClientRect()
      const windowHeight = window.innerHeight
      const sectionTop = rect.top
      const sectionHeight = rect.height

      // Calculate scroll progress through the section
      // When section top is at viewport top, progress is 0
      // When section is fully scrolled past, progress is 1
      const sectionBottom = sectionTop + sectionHeight
      const viewportCenter = windowHeight * 0.5

      // Calculate progress: 0 when section enters, 1 when fully scrolled
      let progress = 0
      if (sectionTop < viewportCenter && sectionBottom > viewportCenter) {
        // Section is in viewport
        const distanceFromTop = viewportCenter - sectionTop
        const visibleHeight = Math.min(sectionHeight, windowHeight)
        progress = Math.min(1, distanceFromTop / (visibleHeight * 0.6))
      } else if (sectionTop >= viewportCenter) {
        progress = 0
      } else {
        progress = 1
      }

      // Start animation when section is visible
      if (sectionTop < windowHeight * 0.8 && sectionTop + sectionHeight > 0) {
        setIsImageSectionVisible(true)
      } else {
        setIsImageSectionVisible(false)
      }

      // Calculate scale: start at 1.3 (zoomed in), end at 1.0 (original)
      const minScale = 1.0
      const maxScale = 1.3
      const scale = maxScale - (progress * (maxScale - minScale))
      setImageScale(Math.max(minScale, Math.min(maxScale, scale)))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Check initial state

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  /**
   * Intersection Observer for pricing section
   * Triggers animation once when section enters viewport
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isPricingSectionVisible) {
            setIsPricingSectionVisible(true)
            // Stop observing after animation triggers (no replays)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    )

    if (pricingSectionRef.current) {
      observer.observe(pricingSectionRef.current)
    }

    return () => {
      if (pricingSectionRef.current) {
        observer.unobserve(pricingSectionRef.current)
      }
    }
  }, [isPricingSectionVisible])

  /**
   * Intersection Observer for testimonials section
   * Triggers animation once when section enters viewport
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isTestimonialsSectionVisible) {
            setIsTestimonialsSectionVisible(true)
            // Stop observing after animation triggers (no replays)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    )

    if (testimonialsSectionRef.current) {
      observer.observe(testimonialsSectionRef.current)
    }

    return () => {
      if (testimonialsSectionRef.current) {
        observer.unobserve(testimonialsSectionRef.current)
      }
    }
  }, [isTestimonialsSectionVisible])

  /**
   * Intersection Observer for About Us section
   * Triggers animation once when section enters viewport
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAboutUsSectionVisible) {
            setIsAboutUsSectionVisible(true)
            // Stop observing after animation triggers (no replays)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    )

    if (aboutUsSectionRef.current) {
      observer.observe(aboutUsSectionRef.current)
    }

    return () => {
      if (aboutUsSectionRef.current) {
        observer.unobserve(aboutUsSectionRef.current)
      }
    }
  }, [isAboutUsSectionVisible])

  /**
   * Intersection Observer for Madevize title in About Us section
   * Triggers animation once when title enters viewport
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isMadevizeTitleVisible) {
            setIsMadevizeTitleVisible(true)
            // Stop observing after animation triggers (no replays)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.2,
        rootMargin: '0px'
      }
    )

    if (madevizeTitleRef.current) {
      observer.observe(madevizeTitleRef.current)
    }

    return () => {
      if (madevizeTitleRef.current) {
        observer.unobserve(madevizeTitleRef.current)
      }
    }
  }, [isMadevizeTitleVisible])

  /**
   * Intersection Observer for Factory title section
   * Triggers animation when section is centered (50% visible)
   */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isFactoryTitleVisible) {
            setIsFactoryTitleVisible(true)
            // Stop observing after animation triggers
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.5, // Trigger when element is centered (50% visible)
        rootMargin: '0px'
      }
    )

    if (factoryTitleRef.current) {
      observer.observe(factoryTitleRef.current)
    }

    return () => {
      if (factoryTitleRef.current) {
        observer.unobserve(factoryTitleRef.current)
      }
    }
  }, [isFactoryTitleVisible])

  /**
   * Counter animations for "How It Works" section
   * Animates counters from 0 to their target values with staggered delays
   */
  useEffect(() => {
    if (!isHowItWorksSectionVisible) {
      setCounter1(0)
      setCounter2(0)
      setCounter3(0)
      setCounter4(0)
      return
    }

    const intervals = []

    // Counter 1: 0 to 1, delay 0.45s
    const timer1 = setTimeout(() => {
      const duration = 1000 // 1 second
      const steps = 30
      const increment = 1 / steps
      let current = 0
      const interval = setInterval(() => {
        current += increment
        if (current >= 1) {
          setCounter1(1)
          clearInterval(interval)
        } else {
          setCounter1(Math.floor(current * 10) / 10)
        }
      }, duration / steps)
      intervals.push(interval)
    }, 450)

    // Counter 2: 0 to 2, delay 0.6s
    const timer2 = setTimeout(() => {
      const duration = 1000
      const steps = 30
      const increment = 2 / steps
      let current = 0
      const interval = setInterval(() => {
        current += increment
        if (current >= 2) {
          setCounter2(2)
          clearInterval(interval)
        } else {
          setCounter2(Math.floor(current * 10) / 10)
        }
      }, duration / steps)
      intervals.push(interval)
    }, 600)

    // Counter 3: 0 to 3, delay 0.75s
    const timer3 = setTimeout(() => {
      const duration = 1000
      const steps = 30
      const increment = 3 / steps
      let current = 0
      const interval = setInterval(() => {
        current += increment
        if (current >= 3) {
          setCounter3(3)
          clearInterval(interval)
        } else {
          setCounter3(Math.floor(current * 10) / 10)
        }
      }, duration / steps)
      intervals.push(interval)
    }, 750)

    // Counter 4: 0 to 4, delay 0.9s
    const timer4 = setTimeout(() => {
      const duration = 1000
      const steps = 30
      const increment = 4 / steps
      let current = 0
      const interval = setInterval(() => {
        current += increment
        if (current >= 4) {
          setCounter4(4)
          clearInterval(interval)
        } else {
          setCounter4(Math.floor(current * 10) / 10)
        }
      }, duration / steps)
      intervals.push(interval)
    }, 900)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      clearTimeout(timer4)
      intervals.forEach(interval => clearInterval(interval))
    }
  }, [isHowItWorksSectionVisible])

  // ============================================================================
  // MOBILE PARALLAX SCROLL EFFECT
  // ============================================================================

  /**
   * Detects mobile viewport and sets up parallax effect
   * where the next section scrolls over the hero section
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    // Check on mount
    checkMobile()
    
    // Check on resize
    window.addEventListener('resize', checkMobile)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
    }
  }, [])

  // ============================================================================
  // TESTIMONIAL CAROUSEL SWIPE HANDLERS
  // ============================================================================

  /**
   * Handles swipe gestures for testimonial carousel on mobile
   */
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      // Swiped left - go to next
      setCurrentTestimonialIndex((prev) => (prev + 1) % 5)
    }

    if (touchStart - touchEnd < -75) {
      // Swiped right - go to previous
      setCurrentTestimonialIndex((prev) => (prev - 1 + 5) % 5)
    }
  }

  // ============================================================================
  // SCROLL FUNCTIONS - Smooth Navigation
  // ============================================================================

  /**
   * Smoothly scrolls to the "How It Works" section
   */
  const scrollToHowItWorks = () => {
    if (howItWorksSectionRef.current) {
      howItWorksSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  /**
   * Smoothly scrolls to the "About Us" section
   */
  const scrollToAboutUs = () => {
    if (aboutUsSectionRef.current) {
      aboutUsSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  /**
   * Smoothly scrolls to the "Pricing" section
   */
  const scrollToPricing = () => {
    if (pricingSectionRef.current) {
      pricingSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  /**
   * Smoothly scrolls to the "Contact" section
   */
  const scrollToContact = () => {
    if (contactSectionRef.current) {
      contactSectionRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    }
  }

  // ============================================================================
  // JSX RENDER
  // ============================================================================
  return (
    <>
      <div className="min-h-screen overflow-x-hidden">
        {/* ======================================================================
            HERO SECTION - Main Landing Area with Background
            ====================================================================== */}
        {/* Hero Section Container with Background */}
        <div 
          id="hero-section"
          className={`min-h-[70vh] md:min-h-screen overflow-hidden w-full ${isMobile ? 'sticky top-0' : 'relative'}`}
          style={{
            zIndex: isMobile ? '1' : 'auto'
          }}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 z-10"
            style={{
              backgroundImage: 'url("/NewBackground.jpeg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              filter: 'brightness(1.3)', // Brighten the image to make it more visible
            }}
          />
          {/* Very subtle overlay for depth */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30" />

          {/* Header */}
          <header className="relative z-10 flex items-center justify-between px-4 sm:px-6 md:px-8 py-4 sm:py-6">
            {/* Left - Logo */}
            <div className="flex items-center">
              <img
                src="/madevize.svg"
                alt="Madevize Logo"
                className="h-5 sm:h-6 md:h-7"
              />
            </div>

            {/* Center - Dynamic Island Navigation Pill */}
            <nav className="hidden md:flex items-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-[14px] px-4 md:px-5 lg:px-6 py-3 md:py-3.5 lg:py-4 flex items-center space-x-4 md:space-x-5 lg:space-x-6 xl:space-x-8 relative z-20">
                <button
                  onClick={scrollToAboutUs}
                  className="text-white font-semibold text-[14px] xl:text-base hover:text-gray-300 transition-colors duration-200 relative z-30"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  ABOUT
                </button>
                <button
                  onClick={scrollToHowItWorks}
                  className="text-white font-semibold text-[14px] xl:text-base hover:text-gray-300 transition-colors duration-200 relative z-30"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  HOW IT WORKS
                </button>
                <button
                  onClick={scrollToPricing}
                  className="text-white font-semibold text-[14px] xl:text-base hover:text-gray-300 transition-colors duration-200 relative z-30"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  PRICING
                </button>
                <button
                  onClick={scrollToContact}
                  className="text-white font-semibold text-[14px] xl:text-base hover:text-gray-300 transition-colors duration-200 relative z-30"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  CONTACT
                </button>
              </div>
            </nav>

            {/* Right - CTA Button */}
            <div className="hidden lg:flex items-center">
              <style>{`
            .get-started-btn {
              overflow: hidden;
              position: relative;
            }
            .get-started-text-container {
              position: relative;
              height: 1.5em;
              overflow: hidden;
            }
            .get-started-text {
              transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                          font-size 0.4s cubic-bezier(0.4, 0, 0.2, 1);
              display: block;
            }
            .get-started-btn:hover .get-started-text-top {
              transform: translateY(-100%) scale(0.8);
            }
            .get-started-text-bottom {
              position: absolute;
              top: 100%;
              left: 0;
              transform: scale(0.8);
              transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                          top 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .get-started-btn:hover .get-started-text-bottom {
              top: 0;
              transform: scale(1);
            }
            .arrow-container {
              position: relative;
              width: 36px;
              height: 36px;
              overflow: visible;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .arrow-chevron {
              position: absolute;
              transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                          opacity 0.3s ease,
                          d 0.4s ease;
            }
            .get-started-btn:hover .arrow-chevron {
              transform: translateX(150%);
              opacity: 0;
            }
            .arrow-horizontal {
              position: absolute;
              left: 50%;
              transform: translateX(-50%);
              transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.2s, 
                          opacity 0.3s ease 0.2s;
              opacity: 0;
            }
            .get-started-btn:hover .arrow-horizontal {
              transform: translateX(150%);
              opacity: 1;
            }
            .arrow-horizontal-new {
              position: absolute;
              left: -50%;
              transform: translateX(-50%);
              transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.4s, 
                          opacity 0.3s ease 0.4s;
              opacity: 0;
            }
            .get-started-btn:hover .arrow-horizontal-new {
              left: 50%;
              transform: translateX(-50%);
              opacity: 1;
            }
          `}</style>
              <button
                onClick={() => setShowContactFormModal(true)}
                className="get-started-btn flex items-center bg-white text-black rounded-full hover:bg-gray-50 transition-colors duration-200"
                style={{ fontFamily: '"Inter Display", "Inter Display Placeholder", sans-serif' }}
              >
                <div className="get-started-text-container font-semibold text-sm md:text-base lg:text-base pr-6 ml-2">
                  <span className="get-started-text get-started-text-top">Get Started</span>
                  <span className="get-started-text get-started-text-bottom">Get Started</span>
                </div>
                <div className="p-[1px] flex-shrink-0">
                  <div className="arrow-container bg-black rounded-full flex items-center justify-center">
                    {/* Chevron Arrow (original) */}
                    <svg className="arrow-chevron w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                      <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="6" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="18" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                    </svg>
                    {/* Horizontal Arrow (->) that moves right */}
                    <svg className="arrow-horizontal w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                      <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="6" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="18" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                    </svg>
                    {/* New Horizontal Arrow coming from left */}
                    <svg className="arrow-horizontal-new w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                      <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="6" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="18" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                    </svg>
                  </div>
                </div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="lg:hidden text-white p-2 ml-4"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </header>

          {/* Mobile Navigation */}
          {showMobileMenu && (
            <div className="lg:hidden absolute top-16 sm:top-20 left-0 right-0 bg-gray-900/95 backdrop-blur-lg z-20 px-4 sm:px-6 py-4 border-t border-gray-700">
              <nav className="flex flex-col space-y-2 sm:space-y-3">
                <button
                  onClick={() => {
                    scrollToAboutUs()
                    setShowMobileMenu(false)
                  }}
                  className="px-4 py-2 sm:py-2.5 text-white font-bold hover:text-gray-300 transition-colors text-center text-sm sm:text-base"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  ABOUT
                </button>
                <button
                  onClick={() => {
                    scrollToHowItWorks()
                    setShowMobileMenu(false)
                  }}
                  className="px-4 py-2 sm:py-2.5 text-white font-bold hover:text-gray-300 transition-colors text-center text-sm sm:text-base"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  HOW IT WORKS
                </button>
                <button
                  onClick={() => {
                    scrollToPricing()
                    setShowMobileMenu(false)
                  }}
                  className="px-4 py-2 sm:py-2.5 text-white font-bold hover:text-gray-300 transition-colors text-center text-sm sm:text-base"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  PRICING
                </button>
                <button
                  onClick={() => {
                    scrollToContact()
                    setShowMobileMenu(false)
                  }}
                  className="px-4 py-2 sm:py-2.5 text-white font-bold hover:text-gray-300 transition-colors text-center text-sm sm:text-base"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  CONTACT
                </button>
                <button
                  onClick={() => {
                    setShowContactFormModal(true)
                    setShowMobileMenu(false)
                  }}
                  className="flex items-center justify-between bg-white text-black rounded-full hover:bg-gray-50 transition-colors duration-200 px-4 py-2.5 text-center font-medium text-sm sm:text-base mt-4 border border-gray-300"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span className="font-medium text-sm sm:text-base">Get Started</span>
                  <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </nav>
            </div>
          )}

          {/* Hero Section */}
          <main className="relative z-10 flex items-center min-h-[55vh] md:min-h-screen px-5 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-24">
            <div className="flex flex-col items-start justify-start w-full max-w-full md:w-[85%] lg:w-[80%] xl:w-[75%] 2xl:w-[70%]">
              {/* Indicator Pill */}
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 md:px-4 md:py-2.5 flex items-center space-x-2 md:space-x-3 mb-4 md:mb-6 w-full md:w-auto">
                {/* Light gray circular bullet point */}
                <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                {/* Text */}
                <span
                  className="text-white text-sm md:text-sm font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  For factories, job shops & suppliers in India
                </span>
              </div>

              {/* Main Heading with Animation */}
              <h2
                className="w-full h-auto whitespace-pre-wrap break-words max-w-full font-medium text-white leading-[1.15] md:leading-[1.2] mb-4 md:mb-6 text-left text-[34px] sm:text-[38px] md:text-[48px] lg:text-[54px] xl:text-[60px] 2xl:text-[64px]"
                style={{
                  fontFamily: '"Inter Display", "Inter Display Placeholder", sans-serif',
                  letterSpacing: '-0.02em',
                  wordSpacing: 'normal',
                  fontFeatureSettings: 'normal'
                }}
              >
                <AnimatedText
                  text="Making India's factories visible, credible, and preferred"
                  staggerDelay={0.1}
                  delay={0.2}
                />
              </h2>

              {/* Description Paragraph */}
              <p
                className="w-full md:w-[70%] lg:w-[60%] xl:w-[55%] mb-6 md:mb-6 text-left text-[16px] sm:text-[17px] md:text-base lg:text-lg text-white md:text-[#B1B1B1]"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.5'
                }}
              >
                Madevize gives every manufacturing business a powerful digital identity, so buyers can find you, trust you, and start working with you. One profile, endless opportunities.
              </p>

              {/* CTA Buttons Row */}
              <style>{`
            .hero-btn {
              position: relative;
              overflow: hidden;
              display: flex;
              align-items: center;
              justify-content: center;
            }
            .hero-btn-text {
              transition: transform 0.3s ease;
              display: inline-block;
              text-align: center;
              width: 100%;
            }
            .hero-btn-arrow {
              position: absolute;
              right: -30px;
              top: 50%;
              transform: translateY(-50%);
              opacity: 0;
              transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                          opacity 0.3s ease,
                          transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
            .hero-btn:hover {
              background-color: rgba(255, 255, 255, 0.1) !important;
              color: white !important;
            }
            .hero-btn:hover .hero-btn-text {
              transform: translateX(-10px);
            }
            .hero-btn:hover .hero-btn-arrow {
              color: white;
            }
            .hero-btn:hover .hero-btn-arrow {
              right: 16px;
              opacity: 1;
              transform: translateY(-50%);
            }
          `}</style>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-4 w-[45%] sm:w-[80%] md:w-auto">
                <button
                  onClick={() => setShowContactFormModal(true)}
                  className="hero-btn px-4 py-3 md:py-2 h-[50px] md:h-[47px] w-full md:w-[160px] lg:w-[180px] bg-white text-black rounded-[15px] transition-all duration-200 font-semibold text-[15px] md:text-sm lg:text-md"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span className="hero-btn-text">Create My Profile</span>
                  <svg className="hero-btn-arrow w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                    <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                    <line x1="16" y1="6" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                    <line x1="16" y1="18" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                  </svg>
                </button>
                <button
                  onClick={scrollToHowItWorks}
                  className="hero-btn px-4 py-3 md:py-4 h-[50px] md:h-[47px] w-full md:w-[160px] lg:w-[180px] bg-white text-black rounded-[15px] transition-all duration-200 font-semibold text-[15px] md:text-sm lg:text-md"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <span className="hero-btn-text">View How It Works</span>
                  <svg className="hero-btn-arrow w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '20px', height: '20px' }}>
                    <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                    <line x1="16" y1="6" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                    <line x1="16" y1="18" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                  </svg>
                </button>
              </div>
            </div>
          </main>
        </div>
        {/* End Hero Section Container */}

        {/* The Reality Today Section */}
        <section 
          className="relative bg-white flex flex-col justify-between items-start w-full px-4 sm:px-6 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-24" 
          style={{ 
            minHeight: 'auto',
            position: 'relative',
            zIndex: isMobile ? '10' : 'auto'
          }}
        >
          {/* Title and Paragraph on Same Line */}
          <div className="flex flex-col md:flex-row items-start md:justify-between w-full gap-6 md:gap-8 lg:gap-16 xl:gap-20 mb-6 md:mb-8">
            {/* THE REALITY TODAY Label */}
            <div className="relative flex items-center p-2 flex-shrink-0" style={{ width: 'fit-content' }}>
              <div className="w-4 sm:w-6 md:w-4 h-4 bg-black mr-2 md:mr-3"></div>
              <span className="text-[#29292B] tracking-wider text-sm sm:text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', letterSpacing: '0em' }}>
                The Reality Today
              </span>
            </div>

            {/* Paragraph and Grid Container */}
            <div className="flex flex-col w-full md:w-[65%] items-start md:items-end justify-space-between flex-shrink-0">
              {/* Paragraph */}
              <p
                className="text-[#1E1E1E] font-semibold mb-10 md:mb-8 text-left w-full"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: 'clamp(32px, 4vw, 42px)',
                  lineHeight: '1.5',
                  maxWidth: '100%'
                }}
              >
                Manufacturers lose business every day, not because of quality, but because they are invisible.
              </p>

              {/* Grid Section - 2 rows, 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-5 md:gap-6 lg:gap-6 w-full">
                {/* Grid Item 1 */}
                <div className="flex flex-col items-start text-left border-t border-b md:border-0 border-gray-200 py-5 md:py-0">
                  <h3 className="text-[#1E1E1E] font-semibold text-lg mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    No proper digital presence
                  </h3>
                  <p className="text-[#666666] text-base md:text-base lg:text-base w-full md:w-[60%]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                    Buyers can't discover you beyond references.
                  </p>
                </div>

                {/* Grid Item 2 */}
                <div className="flex flex-col items-start text-left border-b md:border-0 border-gray-200 py-5 md:py-0">
                  <h3 className="text-[#1E1E1E] font-semibold text-lg mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Limited Customer Base
                  </h3>
                  <p className="text-[#666666] text-base md:text-base lg:text-base w-full md:w-[60%]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                    90% of work comes from the same 2-3 customers you've always had
                  </p>
                </div>

                {/* Grid Item 3 */}
                <div className="flex flex-col items-start text-left border-b md:border-0 border-gray-200 py-5 md:py-0">
                  <h3 className="text-[#1E1E1E] font-semibold text-lg mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Capabilities Go Unseen            </h3>
                  <p className="text-[#666666] text-base md:text-base lg:text-base w-full md:w-[60%]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                    It's hard to show your true capability: machines, tolerances, quality checks.
                  </p>
                </div>

                {/* Grid Item 4 */}
                <div className="flex flex-col items-start text-left border-b md:border-0 border-gray-200 py-5 md:py-0">
                  <h3 className="text-[#1E1E1E] font-semibold text-lg mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Slow Vendor Discovery
                  </h3>
                  <p className="text-[#666666] text-base md:text-base lg:text-base w-full md:w-[60%]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                    Finding new vendors for castings, machining, treatments takes weeks
                  </p>
                </div>

                {/* Grid Item 5 */}
                <div className="flex flex-col items-start text-left border-b md:border-0 border-gray-200 py-5 md:py-0">
                  <h3 className="text-[#1E1E1E] font-semibold text-lg mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Lost on Generic Platforms
                  </h3>
                  <p className="text-[#666666] text-base md:text-base lg:text-base w-full md:w-[60%]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                    Generic portals don't understand manufacturing, you become "just another listing"
                  </p>
                </div>

                {/* Grid Item 6 */}
                <div className="flex flex-col items-start text-left border-b md:border-0 border-gray-200 py-5 md:py-0">
                  <h3 className="text-[#1E1E1E] font-semibold text-lg mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Visibility Starts Online
                  </h3>
                  <p className="text-[#666666] text-base md:text-base lg:text-base w-full md:w-[60%]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                    Younger buyers and OEMs search online first. If you're not there, you're not considered
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================
            THIS IS WHAT MADEVIZE FIXES SECTION
            ====================================================================== */}
        {/* This is what Madevize fixes Section */}
        <section
          ref={fixesSectionRef}
          className="relative bg-black flex items-center justify-center w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-20 sm:py-24 md:py-28 lg:py-32 xl:py-36 2xl:py-40"
        >
          <h2
            className="text-[#D9D9D9] text-center"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(28px, 3.5vw, 48px)',
              fontWeight: '600',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}
          >
            {'This is what Madevize fixes'.split(' ').map((word, index, array) => (
              <span
                key={index}
                style={{
                  display: 'inline-block',
                  marginRight: index < array.length - 1 ? '0.3em' : '0',
                  transform: isFixesSectionVisible ? 'scale(1) translateY(0)' : 'scale(0) translateY(-50px)',
                  filter: isFixesSectionVisible ? 'blur(0px)' : 'blur(10px)',
                  opacity: isFixesSectionVisible ? 1 : 0,
                  transition: isFixesSectionVisible
                    ? `transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.5 + index * 0.05}s, filter 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.5 + index * 0.05}s, opacity 0.3s ease ${0.5 + index * 0.05}s`
                    : 'none'
                }}
              >
                {word}
              </span>
            ))}
          </h2>
        </section>

        {/* ======================================================================
            THE MADEVIZE PLATFORM SECTION
            ====================================================================== */}
        {/* The Madevize Platform Section */}
        <section className="relative bg-white flex flex-col items-center w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
          <h2
            className="text-black text-center mb-6 md:mb-8 lg:mb-10"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(42px, 5vw, 72px)',
              fontWeight: '500',
              letterSpacing: '-0.02em',
              lineHeight: '1.2'
            }}
          >
            The Madevize Platform
          </h2>

          {/* Cards Container */}
          <div
            ref={cardsSectionRef}
            className="flex flex-col lg:flex-row items-stretch justify-start w-full gap-5 md:gap-6 lg:gap-6"
          >
            {/* First Div - 5 Cards */}
            <div className="flex flex-col gap-5 md:gap-6 lg:gap-6 flex-1">
              {/* Upper Part - 2 Cards */}
              <div className="flex flex-col md:flex-row gap-5 md:gap-6 lg:gap-6 w-full">
                {/* Card 1 */}
                <div
                  className="bg-[#F5F5F5] rounded-lg p-5 md:p-6 lg:p-6 flex-1 min-w-0 md:min-w-[300px] lg:min-w-[400px] xl:min-w-[450px] min-h-[150px]"
                  style={{
                    transform: isCardsSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                    opacity: isCardsSectionVisible ? 1 : 0,
                    transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s, opacity 1.5s ease 0.3s`
                  }}
                >
                  <h3 className="text-black font-semibold mb-4 text-xl md:text-2xl lg:text-[28px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                    Factory business profile
                  </h3>
                  <p className="text-[#5B5B5B] text-base md:text-lg lg:text-[20px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                    Show your machines, capacities, tolerances, materials, certifications and clients in one powerful profile.
                  </p>
                </div>
                {/* Card 2 */}
                <div
                  className="bg-[#F5F5F5] rounded-lg p-5 md:p-6 lg:p-6 flex-1 min-w-0 md:min-w-[300px] lg:min-w-[400px] xl:min-w-[450px] min-h-[150px]"
                  style={{
                    transform: isCardsSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                    opacity: isCardsSectionVisible ? 1 : 0,
                    transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s, opacity 1.5s ease 0.3s`
                  }}
                >
                  <h3 className="text-black font-semibold mb-4 text-xl md:text-2xl lg:text-[28px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                    RFQs & quotes
                  </h3>
                  <p className="text-[#5B5B5B] text-base md:text-lg lg:text-[20px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                    Post requirements, receive multiple quotations and choose vendors based on capability, quality and trust.                </p>
                </div>
              </div>

              {/* Lower Part - 3 Cards */}
              <div className="flex flex-col md:flex-row gap-5 md:gap-6 lg:gap-6">
                {/* Card 3 */}
                <div
                  className="bg-[#F5F5F5] rounded-lg p-5 md:p-6 lg:p-6 flex-1 min-h-[150px]"
                  style={{
                    transform: isCardsSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                    opacity: isCardsSectionVisible ? 1 : 0,
                    transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s, opacity 1.5s ease 0.3s`
                  }}
                >
                  <h3 className="text-black font-semibold mb-4 text-xl md:text-2xl lg:text-[28px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                    Get founded by buyers
                  </h3>
                  <p className="text-[#5B5B5B] text-base md:text-lg lg:text-[20px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                    OEMs, exporters, assemblers and traders can discover you using filters like process, material, location and industry.
                  </p>
                </div>
                {/* Card 4 */}
                <div
                  className="bg-[#F5F5F5] rounded-lg p-5 md:p-6 lg:p-6 flex-1 min-h-[150px] flex items-center justify-center"
                  style={{
                    transform: isCardsSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                    opacity: isCardsSectionVisible ? 1 : 0,
                    transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s, opacity 1.5s ease 0.3s`
                  }}
                >
                  <h3 className="text-black font-semibold text-[36px] md:text-xl lg:text-[24px] text-center" style={{ lineHeight: '1.2' }}>
                    <span style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif' }}>Reliable &</span><br></br><span className="font-normal" style={{ fontFamily: "'Great Vibes', sans-serif", fontSize: '36px' }}>Future-Ready</span>
                  </h3>
                </div>
                {/* Card 5 */}
                <div
                  className="bg-[#F5F5F5] rounded-lg flex-1 min-h-[150px] relative overflow-hidden"
                  style={{
                    transform: isCardsSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                    opacity: isCardsSectionVisible ? 1 : 0,
                    transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s, opacity 1.5s ease 0.3s`
                  }}
                >
                  <div className="p-5 md:p-6 lg:p-6 relative z-10">
                    <h3 className="text-black font-semibold mb-4 text-xl md:text-2xl lg:text-[28px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                      Vendor discovery
                    </h3>
                    <p className="text-[#5B5B5B] text-base md:text-lg lg:text-[20px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                      Find suppliers for castings, forgings, plating, machining, fabrication and more in a few clicks.
                    </p>
                  </div>
                  <img
                    src={card5Image}
                    alt=""
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      height: 'auto',
                      width: 'auto',
                      maxWidth: '50%',
                      maxHeight: '70%',
                      objectFit: 'contain',
                      zIndex: 1,
                      pointerEvents: 'none'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Second Div - Card 6 */}
            <div
              className="bg-[#000000] text-white rounded-lg p-5 md:p-6 lg:p-6 flex-1 lg:flex-shrink-0 flex flex-col w-full lg:w-auto"
              style={{
                transform: isCardsSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                opacity: isCardsSectionVisible ? 1 : 0,
                transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s, opacity 1.5s ease 0.3s`
              }}
            >
              <h3 className="text-white font-semibold text-[24px] mb-4" style={{ fontFamily: 'Geist, sans-serif', lineHeight: '1.2' }}>
                Updates & proof of work
              </h3>
              <ul className="list-none space-y-3">
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  <span className="text-[#AAA9AD] text-[18px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                    Show Upgrades, Build Trust
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  <span className="text-[#AAA9AD] text-[18px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                    Share Progress, Earn Credibility
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-white mr-2">•</span>
                  <span className="text-[#AAA9AD] text-[18px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                    Highlight Improvements & Wins
                  </span>
                </li>
              </ul>
              {/* Get Started Button */}
              <button
                onClick={() => setShowRegistration(true)}
                className="get-started-btn mt-6 w-fit bg-white text-black rounded-full flex items-center border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <div className="get-started-text-container font-semibold text-sm md:text-base lg:text-base pr-6 ml-2">
                  <span className="get-started-text get-started-text-top">Get started</span>
                  <span className="get-started-text get-started-text-bottom">Get started</span>
                </div>
                <div className="p-[1px] flex-shrink-0">
                  <div className="arrow-container bg-black rounded-full flex items-center justify-center">
                    {/* Chevron Arrow (original) */}
                    <svg className="arrow-chevron w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                      <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="6" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="18" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                    </svg>
                    {/* Horizontal Arrow (->) that moves right */}
                    <svg className="arrow-horizontal w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                      <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="6" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="18" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                    </svg>
                    {/* New Horizontal Arrow coming from left */}
                    <svg className="arrow-horizontal-new w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                      <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="6" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="18" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </section>

        {/* ======================================================================
            HOW IT WORKS SECTION
            ====================================================================== */}
        {/* How It Works Section */}
        <section
          id="how-it-works"
          ref={howItWorksSectionRef}
          className="relative bg-white flex flex-col justify-between items-start w-full px-4 sm:px-6 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-24"
          style={{ minHeight: 'auto' }}
        >
          {/* HOW IT WORKS Label - Only shown at top on mobile */}
          <div className="relative flex md:hidden items-center p-2 mb-6" style={{ width: 'fit-content' }}>
            <div className="w-4 sm:w-6 md:w-4 h-4 bg-black mr-2 md:mr-3"></div>
            <span className="text-[#29292B] tracking-wider text-sm sm:text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', letterSpacing: '0em' }}>
              HOW IT WORKS
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-start justify-start w-full">
            {/* First Column */}
            <div className="flex flex-col w-full md:flex-1">
              {/* HOW IT WORKS Label - Only shown here on desktop */}
              <div className="relative hidden md:flex items-center p-2 mb-4" style={{ width: 'fit-content' }}>
                <div className="w-4 sm:w-6 md:w-4 h-4 bg-black mr-2 md:mr-3"></div>
                <span className="text-[#29292B] tracking-wider text-sm sm:text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', letterSpacing: '0em' }}>
                  HOW IT WORKS
                </span>
              </div>

              {/* Title */}
              <h1
                className="text-[#05080C] font-medium mb-6 md:mb-0"
                style={{
                  fontFamily: '"Inter Display", "Inter Display Placeholder", sans-serif',
                  fontSize: 'clamp(40px, 5vw, 68px)',
                  lineHeight: '1.2',
                  fontWeight: '500',
                  paddingRight: '0px',
                  maxWidth: '100%',
                  transform: isHowItWorksSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                  opacity: isHowItWorksSectionVisible ? 1 : 0,
                  transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s, opacity 1.5s ease 0.15s`
                }}
              >
                From Unseen to Seen in Just Four Steps
              </h1>
            </div>

            {/* Second Column */}
            <div className="flex flex-col w-full md:flex-1">
              {/* Section 1 */}
              <div
                className="flex flex-row justify-between items-center gap-4 pb-6 border-b border-gray-200"
                style={{
                  transform: isHowItWorksSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                  opacity: isHowItWorksSectionVisible ? 1 : 0,
                  transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s, opacity 1.5s ease 0.45s`
                }}
              >
                <span className="text-black font-medium text-4xl md:text-5xl lg:text-9xl flex-shrink-0 pl-4 md:pl-0" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;' }}>
                  {Math.floor(counter1)}
                </span>
                <div className="flex flex-col w-[70%] justify-center items-center">
                  <p className="text-black text-sm md:text-base lg:text-lg" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;', lineHeight: '1.6' }}>
                    Tell us what you do: machines, processes, materials, industries served and tolerances. We format it for you.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div
                className="flex flex-row justify-between  items-center gap-4 py-6 border-b border-gray-200"
                style={{
                  transform: isHowItWorksSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                  opacity: isHowItWorksSectionVisible ? 1 : 0,
                  transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s, opacity 1.5s ease 0.6s`
                }}
              >
                <span className="text-black font-medium text-4xl md:text-5xl lg:text-9xl flex-shrink-0 pl-4 md:pl-0" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;' }}>
                  {Math.floor(counter2)}
                </span>
                <div className="flex flex-col w-[70%] justify-center items-center">
                  <p className="text-black text-sm md:text-base lg:text-lg" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;', lineHeight: '1.6' }}>
                    Your profile appears in relevant searches made by OEMs, traders and factories nearby and across India.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div
                className="flex flex-row justify-between items-center gap-4 py-6 border-b border-gray-200"
                style={{
                  transform: isHowItWorksSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                  opacity: isHowItWorksSectionVisible ? 1 : 0,
                  transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.75s, opacity 1.5s ease 0.75s`
                }}
              >
                <span className="text-black font-medium text-4xl md:text-5xl lg:text-9xl flex-shrink-0 pl-4 md:pl-0" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;' }}>
                  {Math.floor(counter3)}
                </span>
                <div className="flex flex-col w-[70%] justify-center items-center">
                  <p className="text-black text-sm md:text-base lg:text-lg" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;', lineHeight: '1.6' }}>
                    Need a vendor for machining, laser cutting, casting or treatment? Post an RFQ and receive quotes.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div
                className="flex flex-row justify-between items-center gap-4 pt-6"
                style={{
                  transform: isHowItWorksSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                  opacity: isHowItWorksSectionVisible ? 1 : 0,
                  transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.9s, opacity 1.5s ease 0.9s`
                }}
              >
                <span className="text-black font-medium text-4xl md:text-5xl lg:text-9xl flex-shrink-0 pl-4 md:pl-0" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;' }}>
                  {Math.floor(counter4)}
                </span>
                <div className="flex flex-col w-[70%] justify-center items-center">
                  <p className="text-black text-sm md:text-base lg:text-lg" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;', lineHeight: '1.6' }}>
                    Start with small jobs, prove quality, and grow lasting relationships, all starting from your Madevize presence.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Black Background with White Center Div Section */}
        <section
          ref={imageSectionRef}
          className="relative bg-black flex items-center justify-center w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32"
        >
          <div className="bg-transparent w-full max-w-6xl p-8 md:p-12 lg:p-16 relative rounded-3xl overflow-hidden" style={{
            minHeight: '500px',
            transform: isImageSectionVisible ? 'translateY(0)' : 'translateY(50px)',
            opacity: isImageSectionVisible ? 1 : 0,
            transition: 'all 1s cubic-bezier(0.44, 0, 0.56, 1) 0s'
          }}>
            <img
              src={bgnewImage}
              alt=""
              className="absolute w-full h-full object-cover rounded-3xl"
              style={{
                zIndex: 0,
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                objectPosition: 'center 20%',
                transform: `scale(${imageScale})`,
                transition: 'transform 0.1s ease-out'
              }}
            />
            <div className="relative z-10 flex flex-col justify-center h-full p-8 md:p-12 lg:p-16">
              <div className="text-white max-w-2xl">
                <h1 className="text-white font-semibold mb-4 md:mb-4 pb-4 md:pb-0 border-b md:border-0 border-gray-600 text-3xl md:text-3xl lg:text-4xl text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Show your real capability
                </h1>
                <br></br>
                <h2 className="text-white font-medium mb-4 text-2xl md:text-2xl lg:text-3xl text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                  For the first time, your factory floor can speak itself
                </h2>
                <p className="text-sm md:text-lg lg:text-xl text-left" style={{ color: '#A0A0A0', fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                  Upload photos of your machines, inspection setups and parts you've produced. Highlight your quality checks, surface finishes and tolerances. Let buyers see what makes your shop different from the rest
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Clear Pricing Section */}
        <section
          ref={pricingSectionRef}
          className="relative bg-black flex flex-col items-center w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32"
        >
          <h2
            className="text-white text-center mb-6 md:mb-8 lg:mb-10 w-full md:w-[60%]"
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(48px, 8vw, 76px)',
              fontWeight: '500',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
              transform: isPricingSectionVisible ? 'translateY(0)' : 'translateY(100px)',
              opacity: isPricingSectionVisible ? 1 : 0,
              transition: 'transform 1.5s cubic-bezier(0.68, -0.2, 0.265, 1.2) 0.15s, opacity 1.5s cubic-bezier(0.68, -0.2, 0.265, 1.2) 0.15s'
            }}
          >
            Clear <span style={{ fontFamily: '"Great Vibes", sans-serif' }}>Pricing</span>, Clear Results
          </h2>
          <div className="flex flex-row w-full gap-2 md:gap-6 lg:gap-2">
            <div
              className="bg-[#1a1a1b] flex rounded-xl flex-col p-4 md:p-8 lg:p-10 gap-6 w-full md:w-[600px] lg:w-[65%] flex-shrink-0"
              style={{
                transform: isPricingSectionVisible ? 'translateY(0)' : 'translateY(100px)',
                opacity: isPricingSectionVisible ? 1 : 0,
                transition: 'transform 1.5s cubic-bezier(0.68, -0.2, 0.265, 1.2) 0.3s, opacity 1.5s cubic-bezier(0.68, -0.2, 0.265, 1.2) 0.3s'
              }}
            >
              {/* First div: Title, Subtitle, and Toggle */}
              <div className="flex flex-col md:flex-row items-start md:justify-between gap-4 pb-6 md:pb-0 border-b md:border-0 border-gray-700">
                <div className="flex flex-col w-full md:w-auto">
                  <h3 className="text-white font-semibold mb-2 text-3xl md:text-2xl lg:text-3xl text-left" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif' }}>
                    Founding Factory Offer
                  </h3>
                  <p className="text-white text-xl md:text-base lg:text-lg mb-4 md:mb-0 text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Free for the first 500 factories
                  </p>
                </div>
                {/* Toggle Button */}
                <div className="relative flex bg-[#0a0a0a] rounded-full p-1 w-full md:w-auto" style={{ minWidth: '0', maxWidth: '100%' }}>
                  <button
                    onClick={() => setBillingPeriod('Monthly')}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative z-10 ${billingPeriod === 'Monthly'
                      ? 'text-white'
                      : 'text-[#AAA9AD]'
                      }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Monthly
                  </button>
                  <button
                    onClick={() => setBillingPeriod('Yearly')}
                    className={`flex-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 relative z-10 ${billingPeriod === 'Yearly'
                      ? 'text-white'
                      : 'text-[#AAA9AD]'
                      }`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Yearly
                  </button>
                  {/* Active indicator background */}
                  <div
                    className={`absolute top-1 bottom-1 rounded-full bg-[#2a2a2b] transition-all duration-200 ${billingPeriod === 'Monthly' ? 'left-1 right-1/2' : 'left-1/2 right-1'
                      }`}
                  />
                </div>
              </div>
              {/* Second div - placeholder for now */}

              <div className="flex">
                <p className="text-[#AAA9AD] text-sm md:text-base lg:text-md mb-6" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.6' }}>
                  Get full access to your factory profile, vendor search, RFQs and priority placement at no cost during the early-access phase. Help shape the platform that represents India's manufacturing backbone.
                </p>
              </div>
              {/* Third div - placeholder for now */}
              <div>
                <div className="bg-black p-4 md:p-5 lg:p-6 rounded-lg flex flex-col md:flex-row items-start md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-white text-4xl md:text-3xl lg:text-4xl font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span style={{ fontFamily: '"Great Vibes", sans-serif' }}>₹</span>0<span className="text-[#AAA9AD] text-lg md:text-sm lg:text-sm ml-2">/month</span>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowContactFormModal(true)}
                    className="get-started-btn flex items-center bg-white text-black rounded-full hover:bg-gray-50 transition-colors duration-200 w-fit md:w-auto"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <div className="get-started-text-container font-semibold text-sm md:text-base lg:text-base pr-6 ml-4">
                      <span className="get-started-text get-started-text-top">Claim Your Free Spot</span>
                      <span className="get-started-text get-started-text-bottom">Claim Your Free Spot</span>
                    </div>
                    <div className="p-[1px] flex-shrink-0">
                      <div className="arrow-container bg-black rounded-full flex items-center justify-center">
                        {/* Chevron Arrow (original) */}
                        <svg className="arrow-chevron w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                          <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                          <line x1="16" y1="6" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                          <line x1="16" y1="18" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                        </svg>
                        {/* Horizontal Arrow (->) that moves right */}
                        <svg className="arrow-horizontal w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                          <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                          <line x1="16" y1="6" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                          <line x1="16" y1="18" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                        </svg>
                        {/* New Horizontal Arrow coming from left */}
                        <svg className="arrow-horizontal-new w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                          <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                          <line x1="16" y1="6" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                          <line x1="16" y1="18" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                        </svg>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
            <div
              className="flex-1 bg-[#1a1a1b] flex rounded-xl flex-col justify-between p-4 md:p-8 lg:p-10 w-full md:w-[30%] lg:w-[30%] flex-shrink-0"
              style={{
                transform: isPricingSectionVisible ? 'translateY(0)' : 'translateY(100px)',
                opacity: isPricingSectionVisible ? 1 : 0,
                transition: 'transform 1.5s cubic-bezier(0.68, -0.2, 0.265, 1.2) 0.3s, opacity 1.5s cubic-bezier(0.68, -0.2, 0.265, 1.2) 0.3s'
              }}
            >
              <div>
                <h3 className="text-white font-semibold mb-6 text-xl md:text-2xl lg:text-3xl" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif' }}>
                  Founding Factory Owner
                </h3>

              </div>
              <div className="bg-black p-4 md:p-5 lg:p-6 mb-6 rounded-lg">
                <p className="text-white text-2xl md:text-3xl lg:text-4xl font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span style={{ fontFamily: '"Great Vibes", sans-serif' }}>₹</span>0 <span className="text-[#AAA9AD] md:text-sm lg:text-sm">/month</span>
                </p>
              </div>
              <ul className="bottom-0">
                <li className="flex items-start text-[#AAA9AD]">
                  <span className="text-[#AAA9AD] mr-3">•</span>
                  <span className="text-[#AAA9AD] text-sm md:text-base lg:text-sm" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                    Featured placement in relevant searches
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#AAA9AD] mr-3">•</span>
                  <span className="text-[#AAA9AD] text-sm md:text-base lg:text-sm" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                    Direct feedback channel with the product team
                  </span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#AAA9AD] mr-3">•</span>
                  <span className="text-[#AAA9AD] text-sm md:text-base lg:text-sm" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
                    Locked-in discounts for future premium plans
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ======================================================================
            TESTIMONIALS SECTION
            ====================================================================== */}
        {/* Testimonials Section */}
        <section
          ref={testimonialsSectionRef}
          className="relative bg-white flex flex-col font-medium items-center w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32"
        >
          <h2
            style={{
              flex: 1,
              width: 'auto',
              minWidth: 'fit-content',
              height: 'auto',
              whiteSpace: 'nowrap',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              maxWidth: '1200px',
              fontWeight: 550,
              fontStyle: 'normal',
              fontFamily: 'Cal Sans, "Cal Sans Placeholder", sans-serif',
              fontSize: 'clamp(24px, 15vw, 204px)',
              letterSpacing: '0px',
              textAlign: 'center',
              lineHeight: 'clamp(24px, 15vw, 204px)',
              fontFeatureSettings: 'normal',
              position: 'relative',
              background: 'linear-gradient(to top, transparent, rgba(12, 12, 12, 0.82))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0 auto',
              transform: isTestimonialsSectionVisible ? 'translateY(0)' : 'translateY(100px)',
              opacity: isTestimonialsSectionVisible ? 1 : 0,
              transition: 'transform 1s ease-in-out, opacity 1s ease-in-out'
            }}
          >
            Testimonials
          </h2>

          {/* Testimonials Marquee */}
          <div className="w-full mt-[-40px] md:mt-[-50px]">
            {/* Mobile Carousel - Only visible on mobile */}
            <div className="block md:hidden">
              <div className="relative w-full px-4">
                {/* Testimonial Card */}
                <div 
                  className="flex justify-center items-center min-h-[280px]"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  {[
                    {
                      quote: 'Buyers who never knew we existed started reaching out. For the first time, we feel visible beyond our local network.',
                      author: 'Rohit Sharma',
                      designation: 'Owner, Precision CNC Works • Ludhiana'
                    },
                    {
                      quote: 'Within weeks of joining, we received our first inquiry from a Fortune 500 company. Madevize put us on the map.',
                      author: 'Priya Patel',
                      designation: 'Managing Director, Gujarat Forgings Ltd • Ahmedabad'
                    },
                    {
                      quote: 'The platform helped us showcase our capabilities in a way we never could before. Quality leads started coming in immediately.',
                      author: 'Amit Kumar',
                      designation: 'Co-Founder, Bangalore Precision Engineering • Bangalore'
                    },
                    {
                      quote: 'Our workshop was always busy, but Madevize helped us reach tier-1 suppliers and premium clients we could never access before.',
                      author: 'Sandeep Singh',
                      designation: 'Proprietor, Delhi Machine Tools • New Delhi'
                    },
                    {
                      quote: 'Finally, a platform that understands manufacturing. We get inquiries from serious buyers who appreciate our technical expertise.',
                      author: 'Rajesh Mehta',
                      designation: 'Owner, Pune Sheet Metal Works • Pune'
                    }
                  ].map((testimonial, index) => (
                    <div
                      key={index}
                      className={`w-full transition-opacity duration-500 ${
                        index === currentTestimonialIndex ? 'block' : 'hidden'
                      }`}
                    >
                      <div
                        className="bg-black rounded-lg p-6 flex flex-col justify-between mx-auto"
                        style={{
                          maxWidth: '100%',
                          minHeight: '240px',
                          background: '#000000',
                          borderRadius: '12px'
                        }}
                      >
                        {/* 5 Stars at the top */}
                        <div className="flex gap-1 mb-4">
                          {[...Array(5)].map((_, starIndex) => (
                            <svg
                              key={starIndex}
                              className="w-5 h-5 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>

                        {/* Review Quote in the middle */}
                        <div className="flex-1 flex items-center mb-4">
                          <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                            "{testimonial.quote}"
                          </p>
                        </div>

                        {/* Reviewer Name and Designation at the bottom */}
                        <div>
                          <p className="text-base text-white font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {testimonial.author}
                          </p>
                          <p className="text-sm text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {testimonial.designation}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dot Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {[...Array(5)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonialIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === currentTestimonialIndex
                          ? 'bg-black w-6'
                          : 'bg-gray-300'
                      }`}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop Marquee - Only visible on desktop */}
            <div className="hidden md:flex flex-col gap-6 overflow-hidden w-full">
              {/* First Row - Infinite Scrolling Left */}
              <div className="relative w-full overflow-hidden">
                <div className="flex animate-scroll-left gap-6" style={{ width: 'max-content' }}>
                  {/* Duplicate content for seamless loop */}
                  {[...Array(3)].map((_, loopIndex) => (
                    <div key={`loop-${loopIndex}`} className="flex gap-6">
                      {[
                        {
                          quote: 'Buyers who never knew we existed started reaching out. For the first time, we feel visible beyond our local network.',
                          author: 'Rohit Sharma',
                          designation: 'Owner, Precision CNC Works • Ludhiana'
                        },
                        {
                          quote: 'Buyers who never knew we existed started reaching out. For the first time, we feel visible beyond our local network.',
                          author: 'Rohit Sharma',
                          designation: 'Owner, Precision CNC Works • Ludhiana'
                        },
                        {
                          quote: 'Buyers who never knew we existed started reaching out. For the first time, we feel visible beyond our local network.',
                          author: 'Rohit Sharma',
                          designation: 'Owner, Precision CNC Works • Ludhiana'
                        },
                        {
                          quote: 'Buyers who never knew we existed started reaching out. For the first time, we feel visible beyond our local network.',
                          author: 'Rohit Sharma',
                          designation: 'Owner, Precision CNC Works • Ludhiana'
                        },
                        {
                          quote: 'Buyers who never knew we existed started reaching out. For the first time, we feel visible beyond our local network.',
                          author: 'Rohit Sharma',
                          designation: 'Owner, Precision CNC Works • Ludhiana'
                        }
                      ].map((testimonial, index) => (
                        <div
                          key={`${loopIndex}-${index}`}
                          className="bg-black rounded-lg p-4 flex-shrink-0 flex flex-col justify-between"
                          style={{
                            width: '320px',
                            minHeight: '220px',
                            height: '220px',
                            background: '#000000',
                            borderRadius: '12px'
                          }}
                        >
                          {/* 5 Stars at the top */}
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, starIndex) => (
                              <svg
                                key={starIndex}
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>

                          {/* Review Quote in the middle */}
                          <div className="flex-1 flex items-center">
                            <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                              "{testimonial.quote || 'Buyers who never knew we existed started reaching out. For the first time, we feel visible beyond our local network.'}"
                            </p>
                          </div>

                          {/* Reviewer Name and Designation at the bottom */}
                          <div>
                            <p className="text-sm text-white font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {testimonial.author || 'Rohit Sharma'}
                            </p>
                            <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {testimonial.designation || 'Owner, Precision CNC Works • Ludhiana'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Second Row - Infinite Scrolling Right */}
              <div className="relative w-full overflow-hidden">
                <div className="flex animate-scroll-right gap-6" style={{ width: 'max-content' }}>
                  {/* Duplicate content for seamless loop */}
                  {[...Array(3)].map((_, loopIndex) => (
                    <div key={`loop-reverse-${loopIndex}`} className="flex gap-6">
                      {[
                        {
                          quote: 'Buyers who never knew we existed started reaching out. For the first time, we feel visible beyond our local network.',
                          author: 'Rohit Sharma',
                          designation: 'Owner, Precision CNC Works • Ludhiana'
                        },
                        {
                          quote: 'Buyers who never knew we existed started reaching out. For the first time, we feel visible beyond our local network.',
                          author: 'Rohit Sharma',
                          designation: 'Owner, Precision CNC Works • Ludhiana'
                        },
                        {
                          quote: 'Buyers who never knew we existed started reaching out. For the first time, we feel visible beyond our local network.',
                          author: 'Rohit Sharma',
                          designation: 'Owner, Precision CNC Works • Ludhiana'
                        },
                        {
                          quote: 'Buyers who never knew we existed started reaching out. For the first time, we feel visible beyond our local network.',
                          author: 'Rohit Sharma',
                          designation: 'Owner, Precision CNC Works • Ludhiana'
                        },
                        {
                          quote: 'Buyers who never knew we existed started reaching out. For the first time, we feel visible beyond our local network.',
                          author: 'Rohit Sharma',
                          designation: 'Owner, Precision CNC Works • Ludhiana'
                        }
                      ].map((testimonial, index) => (
                        <div
                          key={`reverse-${loopIndex}-${index}`}
                          className="bg-black rounded-lg p-4 flex-shrink-0 flex flex-col justify-between"
                          style={{
                            width: '320px',
                            minHeight: '220px',
                            height: '220px',
                            background: '#000000',
                            borderRadius: '12px'
                          }}
                        >
                          {/* 5 Stars at the top */}
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, starIndex) => (
                              <svg
                                key={starIndex}
                                className="w-5 h-5 text-white"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>

                          {/* Review Quote in the middle */}
                          <div className="flex-1 flex items-center">
                            <p className="text-sm text-gray-400 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                              "{testimonial.quote || 'Buyers who never knew we existed started reaching out. For the first time, we feel visible beyond our local network.'}"
                            </p>
                          </div>

                          {/* Reviewer Name and Designation at the bottom */}
                          <div>
                            <p className="text-sm text-white font-medium mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {testimonial.author || 'Rohit Sharma'}
                            </p>
                            <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {testimonial.designation || 'Owner, Precision CNC Works • Ludhiana'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ======================================================================
            ABOUT US SECTION
            ====================================================================== */}
        {/* About Us Section */}
        <section
          ref={aboutUsSectionRef}
          className="relative bg-black flex flex-col font-medium items-center w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32"
        >
          <h2
            style={{
              flex: 1,
              width: 'auto',
              minWidth: 'fit-content',
              height: 'auto',
              whiteSpace: 'nowrap',
              wordWrap: 'break-word',
              wordBreak: 'break-word',
              maxWidth: '1200px',
              fontWeight: 550,
              fontStyle: 'normal',
              fontFamily: 'Cal Sans, "Cal Sans Placeholder", sans-serif',
              fontSize: 'clamp(24px, 15vw, 204px)',
              letterSpacing: '0px',
              textAlign: 'center',
              lineHeight: 'clamp(24px, 15vw, 204px)',
              fontFeatureSettings: 'normal',
              position: 'relative',
              background: 'linear-gradient(to top, transparent, rgba(58, 58, 58, 0.82))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              color: 'transparent',
              margin: '0 auto',
              transform: isAboutUsSectionVisible ? 'translateY(0)' : 'translateY(100px)',
              opacity: isAboutUsSectionVisible ? 1 : 0,
              transition: 'transform 1s ease-in-out, opacity 1s ease-in-out'
            }}
          >
            About Us
          </h2>

          {/* Madevize Information */}
          <div className="w-full max-w-4xl mx-auto mt-12">
            <h3
              ref={madevizeTitleRef}
              className="text-white text-left mb-8 flex"
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(32px, 3vw, 48px)',
                fontWeight: '600'
              }}
            >
              {'Madevize'.split('').map((char, index) => (
                <span
                  key={index}
                  style={{
                    display: 'inline-block',
                    transform: isMadevizeTitleVisible ? 'translateX(0)' : 'translateX(-30px)',
                    opacity: isMadevizeTitleVisible ? 1 : 0,
                    transition: `transform 0.4s cubic-bezier(0.44, 0, 0.56, 1) ${0.05 + index * 0.06}s, opacity 0.4s cubic-bezier(0.44, 0, 0.56, 1) ${0.05 + index * 0.05}s`
                  }}
                >
                  {char === ' ' ? '\u00A0' : char}
                </span>
              ))}
            </h3>

            <div className="space-y-6 text-left">
              <p className="text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Madevize has grown from a single idea into a simple, powerful tool that helps small and medium manufacturers get noticed and grow their business. Whether you make parts, do fabrication, or run a job shop, we make it easy to show your work to the right players.
              </p>

              <p className="text-gray-400 text-base md:text-lg lg:text-xl leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Our platform brings together easy-to-use features and local know-how, helping factories create an online profile, share achievements, find new buyers and suppliers, and get quotes faster, all in one place, in your own language, right from your phone.
              </p>
            </div>
          </div>
        </section>

        {/* Factory Title Section */}
        <section
          ref={factoryTitleRef}
          className="relative bg-white flex flex-col items-center w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32"
        >
          <h2
            className="text-black text-left w-full md:w-[80%]"
            style={{
              fontFamily: '"Inter Display", "Inter Display Placeholder", sans-serif',
              fontSize: 'clamp(40px, 4vw, 60px)',
              fontWeight: '500',
              letterSpacing: '-0.02em',
              lineHeight: '1.2',
              wordWrap: 'break-word',
              wordBreak: 'break-word'
            }}
          >
            {"See How Your Factory Looks When It's Done Right".split('').map((char, index) => (
              <motion.span
                key={index}
                initial={{
                  opacity: 0,
                  filter: 'blur(10px)'
                }}
                animate={isFactoryTitleVisible ? {
                  opacity: 1,
                  filter: 'blur(0px)'
                } : {
                  opacity: 0,
                  filter: 'blur(10px)'
                }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                  ease: [0.44, 0, 0.56, 1] // Custom bezier curve
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h2>

          {/* Content Container */}
          <div
            className="w-full mt-8 rounded-t-2xl"
            style={{
              minHeight: '300px',
              maxHeight: '500px',
              overflow: 'hidden',
              position: 'relative',
              backgroundColor: '#000000'
            }}
          >
            <style>{`
            .hidden-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hidden-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
          `}</style>
            {/* Scrollable Content Wrapper */}
            <div
              className="hidden-scrollbar"
              style={{
                height: '100%',
                maxHeight: '500px',
                overflowY: 'auto',
                overflowX: 'hidden',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            >
              <DemoCompanyProfilePage readOnly={true} />
            </div>
            {/* Bottom Gradient Fade Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '30%',
                background: 'linear-gradient(to bottom, transparent 0%, rgba(192, 191, 191, 0.4) 50%, rgb(252, 252, 252) 100%)',
                pointerEvents: 'none',
                zIndex: 10
              }}
            />
          </div>
        </section>

        {/* Contact Us Section */}
        <section
          ref={contactSectionRef}
          className="relative bg-black overflow-hidden px-4 sm:px-6 md:px-10 lg:px-10 py-12 sm:py-16 md:py-20 lg:py-24"
          style={{
            minHeight: 'auto'
          }}
        >
          {/* Container */}
          <div
            className="relative flex flex-col items-between max-w-full"
            style={{
              gap: '64px',
              width: '100%'
            }}
          >
            {/* Title Section */}
            <div
              className="flex flex-col items-start"
              style={{
                gap: '32px'
              }}
            >
              {/* Section Tag */}
              <div
                className="relative flex items-center"
                style={{
                  width: 'fit-content',
                  height: 'fit-content'
                }}
              >
                {/* Square for mobile, line for desktop */}
                <div className="w-3 h-3 md:w-10 md:h-[4px] bg-white items-center mr-2 md:mr-3" style={{ borderRadius: '2px' }}></div>
                <span
                  className="text-white uppercase tracking-wider text-lg"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontWeight: '500',
                    letterSpacing: '0.1em'
                  }}
                >
                  <span className="md:hidden">CONTACT</span>
                  <span className="hidden md:inline">CONTACT US</span>
                </span>
              </div>

              {/* Main Title */}
              <h2
                className="text-white font-medium text-6xl md:text-[60px]"
                style={{
                  fontFamily: '"Inter Display", Inter, sans-serif',
                  letterSpacing: '-0.04em',
                  lineHeight: '1.2',
                  maxWidth: '820px',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word'
                }}
              >
                <span className="md:hidden">Let's see how Madevize can work for your factory</span>
                <span className="hidden md:inline">Get in Touch</span>
              </h2>
            </div>

            {/* Content Section */}
            <div
              className="flex flex-col lg:flex-row items-start w-full"
              style={{
                gap: 'clamp(40px, 8vw, 80px)'
              }}
            >
              {/* Left Side - Contact Info */}
              <div
                className="flex flex-col justify-start md:justify-between items-start w-full lg:w-auto lg:max-w-full gap-16 md:gap-[10px]"
                style={{
                  minHeight: '400px'
                }}
              >
                {/* Description Text */}
                <p
                  className="text-white/90 text-sm md:text-[20px]"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: '400',
                    letterSpacing: '0em',
                    lineHeight: '1.5',
                    maxWidth: '100%'
                  }}
                >
                  For any inquiries or to explore your vision further, we invite you to contact our professional team using the details provided below.
                </p>

                {/* Contact Details */}
                {/* Mobile Version - New Format */}
                <div className="flex md:hidden flex-col items-start gap-6 w-full">
                  {/* Office */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-sm font-bold uppercase tracking-wider">Office</h3>
                    <p className="text-white/90 text-base">India - Working with factories PAN-India</p>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-sm font-bold uppercase tracking-wider">Email</h3>
                    <p className="text-white/90 text-base">hello@madevize.com</p>
                  </div>

                  {/* Telephone */}
                  <div className="flex flex-col gap-2">
                    <h3 className="text-white text-sm font-bold uppercase tracking-wider">Telephone</h3>
                    <p className="text-white/90 text-base">8872722641</p>
                  </div>

                  {/* Separation Line */}
                  <div className="w-full h-[1px] bg-white/20"></div>

                  {/* Follow Us */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-white text-sm font-bold uppercase tracking-wider">Follow Us</h3>
                    <div className="flex gap-4">
                      {/* Instagram Icon */}
                      <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                        </svg>
                      </a>
                      {/* X (Twitter) Icon */}
                      <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-white/80 transition-colors">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 4l11.733 16h4.267l-11.733 -16z"></path>
                          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Desktop Version - Original Format */}
                <div
                  className="hidden md:flex flex-col items-start"
                  style={{
                    gap: '10px'
                  }}
                >
                  {/* Phone Contact */}
                  <div
                    className="flex items-center"
                    style={{
                      gap: '20.7px'
                    }}
                  >
                    {/* Phone SVG */}
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '22px',
                        height: '22px'
                      }}
                    >
                      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.9999 15.4281V18.1281C20.0009 18.3787 19.9496 18.6268 19.8492 18.8565C19.7487 19.0862 19.6015 19.2923 19.4168 19.4618C19.2321 19.6312 19.014 19.7602 18.7766 19.8405C18.5391 19.9208 18.2875 19.9506 18.0379 19.9281C15.2684 19.6272 12.6082 18.6808 10.2709 17.1651C8.09634 15.7833 6.25269 13.9396 4.87089 11.7651C3.34987 9.41717 2.40331 6.74398 2.10789 3.96209C2.0854 3.71321 2.11498 3.46237 2.19474 3.22555C2.2745 2.98873 2.4027 2.77111 2.57118 2.58655C2.73966 2.40199 2.94472 2.25453 3.1733 2.15356C3.40189 2.05259 3.649 2.00032 3.89889 2.00009H6.59889C7.03567 1.99579 7.4591 2.15046 7.79028 2.43527C8.12145 2.72008 8.33776 3.11559 8.39889 3.54809C8.51285 4.41215 8.7242 5.26054 9.02889 6.07709C9.14998 6.39922 9.17619 6.74931 9.10441 7.08588C9.03263 7.42245 8.86587 7.73139 8.62389 7.97609L7.48089 9.11909C8.76209 11.3723 10.6277 13.2379 12.8809 14.5191L14.0239 13.3761C14.2686 13.1341 14.5775 12.9674 14.9141 12.8956C15.2507 12.8238 15.6008 12.85 15.9229 12.9711C16.7394 13.2758 17.5878 13.4871 18.4519 13.6011C18.8891 13.6628 19.2884 13.883 19.5738 14.2198C19.8592 14.5567 20.0108 14.9867 19.9999 15.4281Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>

                    {/* Phone Text */}
                    <span
                      className="text-white"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '500',
                        fontSize: '20px',
                        letterSpacing: '0em',
                        lineHeight: '1.2'
                      }}
                    >
                      +91 8872722641
                    </span>
                  </div>

                  {/* Email Contact */}
                  <div
                    className="flex items-center"
                    style={{
                      gap: '20.7px'
                    }}
                  >
                    {/* Email @ Symbol */}
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '22px',
                        height: '22px'
                      }}
                    >
                      <span
                        className="text-white"
                        style={{
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: '500',
                          fontSize: '19.8px',
                          letterSpacing: '0em',
                          lineHeight: '1.2'
                        }}
                      >
                        @
                      </span>
                    </div>

                    {/* Email Text */}
                    <span
                      className="text-white"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '500',
                        fontSize: '20px',
                        letterSpacing: '0em',
                        lineHeight: '1.2'
                      }}
                    >
                      vidit2202002@gmail.com
                    </span>
                  </div>

                  {/* Location Contact */}
                  <div
                    className="flex items-center"
                    style={{
                      gap: '20.7px'
                    }}
                  >
                    {/* Location SVG */}
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: '22px',
                        height: '23px'
                      }}
                    >
                      <svg width="22" height="23" viewBox="0 0 22 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_199_156)">
                          <path d="M19.0999 9.6C19.0999 15.9 10.9999 21.3 10.9999 21.3C10.9999 21.3 2.8999 15.9 2.8999 9.6C2.8999 7.45175 3.75329 5.39148 5.27234 3.87243C6.79138 2.35339 8.85165 1.5 10.9999 1.5C13.1482 1.5 15.2084 2.35339 16.7275 3.87243C18.2465 5.39148 19.0999 7.45175 19.0999 9.6Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M10.9998 12.3004C12.491 12.3004 13.6998 11.0916 13.6998 9.60039C13.6998 8.10922 12.491 6.90039 10.9998 6.90039C9.50864 6.90039 8.2998 8.10922 8.2998 9.60039C8.2998 11.0916 9.50864 12.3004 10.9998 12.3004Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </g>
                        <defs>
                          <clipPath id="clip0_199_156">
                            <rect width="21.6" height="21.6" fill="white" transform="translate(0.200195 0.600098)" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>

                    {/* Location Text */}
                    <span
                      className="text-white"
                      style={{
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: '500',
                        fontSize: '20px',
                        letterSpacing: '0em',
                        lineHeight: '1.2'
                      }}
                    >
                      Gurugram
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div
                className="flex w-[200px] justify-end items-end w-full lg:flex-1"
              >
                {/* Form Container */}
                <form
                  action="https://docs.google.com/forms/d/e/1FAIpQLScb-bbWyiunWNczCRuH_41DJ5HIhsT2vTYpuVOXRexcJ40cbQ/formResponse"
                  method="POST"
                  target="hidden_iframe"
                  onSubmit={handleFooterSubmit}
                  className="w-full bg-white rounded-lg border border-gray-200 p-4 sm:p-6"
                  style={{
                    gap: '10px',
                    maxWidth: '1000px',
                    minWidth: 'clamp(300px, 40vw, 500px)'
                  }}
                >
                  {/* Form Fields */}
                  <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        style={{
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Name<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="John Smith"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.name ? 'border-red-500' : 'border-gray-300'
                          }`}
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px'
                        }}
                      />
                      {formErrors.name && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        style={{
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Email<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="johnsmith@gmail.com"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.email ? 'border-red-500' : 'border-gray-300'
                          }`}
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px'
                        }}
                      />
                      {formErrors.email && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
                      )}
                    </div>

                    {/* Phone Field */}
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        style={{
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        placeholder="+91 9876543210"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px'
                        }}
                      />
                    </div>

                    {/* Business Type Field */}
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        style={{
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Type of Business
                      </label>
                      <select
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px'
                        }}
                      >
                        <option value="">Select business type</option>
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Other Business Type Field (conditional) */}
                    {formData.businessType === 'Others' && (
                      <div>
                        <label
                          className="block text-sm font-medium text-gray-700 mb-1"
                          style={{
                            fontFamily: 'Inter, sans-serif'
                          }}
                        >
                          Specify Business Type<span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="otherBusinessType"
                          value={formData.otherBusinessType}
                          onChange={handleInputChange}
                          placeholder="Enter your business type"
                          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${formErrors.otherBusinessType ? 'border-red-500' : 'border-gray-300'
                            }`}
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px'
                          }}
                        />
                        {formErrors.otherBusinessType && (
                          <p className="text-red-500 text-xs mt-1">{formErrors.otherBusinessType}</p>
                        )}
                      </div>
                    )}

                    {/* Business Description Field */}
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        style={{
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Describe your business in few words<span className="text-red-500">*</span>
                      </label>
                      <textarea
                        name="businessDescription"
                        value={formData.businessDescription}
                        onChange={handleInputChange}
                        placeholder="Briefly describe your business..."
                        rows={4}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${formErrors.businessDescription ? 'border-red-500' : 'border-gray-300'
                          }`}
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px'
                        }}
                      />
                      {formErrors.businessDescription && (
                        <p className="text-red-500 text-xs mt-1">{formErrors.businessDescription}</p>
                      )}
                    </div>
                    {/*  transaltor layer*/}
                    <input type="hidden" name="entry.872961035" value={formData.name} />
                    <input type="hidden" name="entry.1881233451" value={formData.email} />
                    <input type="hidden" name="entry.1080815743" value={formData.phoneNumber} />

                    <input
                      type="hidden"
                      name="entry.548806817"
                      value={
                        formData.businessType === 'Others'
                          ? formData.otherBusinessType
                          : formData.businessType
                      }
                    />

                    <input
                      type="hidden"
                      name="entry.26268042"
                      value={formData.businessDescription}
                    />
                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        fontWeight: '500'
                      }}
                    >
                      Send message
                    </button>
                  </div>
                </form>
                <iframe
                  name="hidden_iframe"
                  style={{ display: 'none' }}
                  onLoad={handleFooterIframeLoad}
                />
              </div>
            </div>

            {/* Mobile Only - Additional CTA Section */}
            <div className="flex md:hidden flex-col items-center text-center w-full gap-8 mt-12 relative py-12">
              {/* Blurry white spot background - focused on content area */}
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{ 
                  zIndex: 0, 
                  width: '200px',
                  height: '350px',
                  background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%)',
                  filter: 'blur(50px)'
                }}
              ></div>
              
              {/* Content */}
              <div className="flex flex-col items-center gap-4 relative z-10">
                <h2 
                  className="text-white font-bold text-4xl leading-tight"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    letterSpacing: '-0.02em'
                  }}
                >
                  Let's talk about your next big move
                </h2>
                <p 
                  className="text-white/70 text-lg"
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    lineHeight: '1.6',
                    fontWeight: '400'
                  }}
                >
                  Contact us to see how our services can accelerate your growth.
                </p>
              </div>

              {/* Contact Us Button */}
              <button
                onClick={() => window.scrollTo({ top: document.querySelector('footer').offsetTop, behavior: 'smooth' })}
                className="get-started-btn flex items-center bg-white text-black rounded-full hover:bg-gray-50 transition-colors duration-200 w-fit relative z-10"
                style={{ fontFamily: 'Inter, sans-serif', height: '45px' }}
              >
                <div className="get-started-text-container font-medium text-base pr-6 ml-4">
                  <span className="get-started-text get-started-text-top">Contact Us</span>
                  <span className="get-started-text get-started-text-bottom">Contact Us</span>
                </div>
                <div className="p-[1px] flex-shrink-0">
                  <div className="arrow-container bg-black rounded-full flex items-center justify-center">
                    {/* Chevron Arrow (original) */}
                    <svg className="arrow-chevron w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                      <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="6" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="18" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                    </svg>
                    {/* Horizontal Arrow (->) that moves right */}
                    <svg className="arrow-horizontal w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ width: '24px', height: '24px' }}>
                      <line x1="4" y1="12" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="6" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                      <line x1="16" y1="18" x2="20" y2="12" strokeLinecap="round" strokeWidth={2.5} />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Separation Line */}
              <div className="w-full h-[1px] bg-white/20 mt-4"></div>
            </div>
          </div>
        </section>

        {/* ======================================================================
            FOOTER SECTION
            ====================================================================== */}
        {/* Footer Section */}
        <footer
          className="relative bg-black overflow-hidden px-4 sm:px-6 md:px-8 lg:px-8 py-6 sm:py-8 md:py-10 lg:py-10"
        >
          {/* Container */}
          <div
            className="relative flex flex-col items-start max-w-7xl mx-auto"
            style={{
              gap: '64px',
              width: '100%'
            }}
          >
            {/* Content Container */}
            <div
              className="flex flex-col lg:flex-row items-start justify-between w-full"
              style={{
                gap: 'clamp(32px, 8vw, 480px)'
              }}
            >
              {/* Left Stack - Logo */}
              <div
                className="flex flex-col items-start gap-4"
              >
                {/* Logo */}
                <div
                  className="flex items-center"
                  style={{
                    width: 'clamp(150px, 25vw, 200px)',
                    height: 'clamp(60px, 10vw, 100px)',
                    backgroundImage: 'url(/madevize.svg)',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center'
                  }}
                >
                  {/* Fallback text if background image fails */}
                  <span
                    className="text-white font-semibold text-lg"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      display: 'none'
                    }}
                  >
                    madevize
                  </span>
                </div>

                {/* Mobile Only - Join Us Content Below Logo */}
                <div className="flex md:hidden flex-col items-start gap-2 mt-2">
                  <h3
                    className="text-white font-medium text-left"
                    style={{
                      fontFamily: '"Inter Display", Inter, sans-serif',
                      fontSize: '20px',
                      letterSpacing: '0em',
                      lineHeight: '1.2'
                    }}
                  >
                    Join Us Now
                  </h3>
                  <p
                    className="text-white/80 text-left text-sm"
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontWeight: '400',
                      letterSpacing: '0em',
                      lineHeight: '1.4',
                      maxWidth: '300px'
                    }}
                  >
                    Connect, share, and grow with people who inspire and support each other
                  </p>
                  {/* Social Links */}
                  <p
                    className="text-gray-400 text-left text-sm mt-2"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontWeight: '400',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Wa. In. Ld.
                  </p>
                </div>
              </div>

              {/* Right Stack - Join Us Content (Desktop Only) */}
              <div
                className="hidden lg:flex flex-col items-end w-full lg:w-auto"
                style={{
                  width: '100%',
                  gap: '10px'
                }}
              >
                {/* Join Us Now Title */}
                <h3
                  className="text-white font-medium text-center lg:text-right"
                  style={{
                    fontFamily: '"Inter Display", Inter, sans-serif',
                    fontSize: 'clamp(24px, 4vw, 32px)',
                    letterSpacing: '0em',
                    lineHeight: '1.2',
                    whiteSpace: 'pre'
                  }}
                >
                  Join Us Now
                </h3>

                {/* Description Text */}
                <p
                  className="text-white text-center lg:text-right"
                  style={{
                    fontFamily: 'Manrope, sans-serif',
                    fontWeight: '500',
                    fontSize: 'clamp(16px, 3vw, 20px)',
                    letterSpacing: '0em',
                    lineHeight: '1.2',
                    width: '100%',
                    maxWidth: '403px',
                    whiteSpace: 'pre-wrap',
                    wordWrap: 'break-word',
                    wordBreak: 'break-word'
                  }}
                >
                  Connect, share, and grow with people who inspire and support each other
                </p>
              </div>
            </div>

            {/* Mobile Only - Separator and Copyright */}
            <div className="flex md:hidden flex-col items-center w-full gap-6 mt-6">
              {/* Separation Line */}
              <div className="w-full h-[1px] bg-white/20"></div>
              
              {/* Copyright Text */}
              <p
                className="text-white text-center text-sm"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '400',
                  letterSpacing: '0em',
                  lineHeight: '1.4'
                }}
              >
                Copyright 2025 • Madevize • All Rights Reserved.
              </p>
            </div>

            {/* Desktop Divider Line */}
            <div
              className="hidden md:block w-full bg-white/20"
              style={{
                height: '2px'
              }}
            />

            {/* Desktop Copyright Frame */}
            <div
              className="hidden md:flex items-center justify-center w-full"
              style={{
                gap: '5px'
              }}
            >
              {/* Copyright 2025 */}
              <span
                className="text-white"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '500',
                  fontSize: '15px',
                  letterSpacing: '0em',
                  lineHeight: '1.2'
                }}
              >
                Copyright 2025
              </span>

              {/* Ellipse/Dot */}
              <div
                className="bg-white rounded-full"
                style={{
                  width: '4px',
                  height: '4px'
                }}
              />

              {/* Madevize */}
              <span
                className="text-white"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '500',
                  fontSize: '15px',
                  letterSpacing: '0em',
                  lineHeight: '1.2'
                }}
              >
                Madevize
              </span>

              {/* Ellipse/Dot */}
              <div
                className="bg-white rounded-full"
                style={{
                  width: '4px',
                  height: '4px'
                }}
              />

              {/* All Rights Reserved */}
              <span
                className="text-white"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: '500',
                  fontSize: '15px',
                  letterSpacing: '0em',
                  lineHeight: '1.2'
                }}
              >
                All Rights Reserved.
              </span>
            </div>
          </div>
        </footer>

        {/* Registration Modal */}
        {showRegistration && (
          <div
            className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm"
            style={{
              backgroundImage: 'url("/bg.avif")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Dark overlay for better content readability */}
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>

            {/* Modal container */}
            <div className="relative rounded-2xl max-w-5xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
              <RegistrationForm onClose={() => setShowRegistration(false)} />
            </div>
          </div>
        )}

        {/* Login Modal */}
        {showLogin && (
          <div
            className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm"
            style={{
              backgroundImage: 'url("/bg.avif")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Dark overlay for better content readability */}
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>

            {/* Modal container */}
            <div className="relative rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
              <LoginForm
                onClose={() => setShowLogin(false)}
                onLoginSuccess={onLoginSuccess}
              />
            </div>
          </div>
        )}

        {/* ======================================================================
            MODALS
            ====================================================================== */}
        {/* Contact Form Modal */}
        {showContactFormModal && (
          <div
            className="fixed inset-0 flex items-center justify-center p-2 sm:p-4 z-50 backdrop-blur-sm"
            style={{
              backgroundImage: 'url("/bg.avif")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Dark overlay for better content readability */}
            <div className="absolute inset-0 bg-black bg-opacity-70"></div>

            {/* Modal container */}
            <div className="relative rounded-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 bg-white">
              <div className="p-6">
                {/* Close Button */}
                <div className="flex justify-end mb-4">
                  <button
                    onClick={() => setShowContactFormModal(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Modal Title */}
                <h2
                  className="text-2xl font-semibold text-gray-900 mb-6"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Create My Profile
                </h2>

                {/* Form */}
                <form
                  action="https://docs.google.com/forms/d/e/1FAIpQLScb-bbWyiunWNczCRuH_41DJ5HIhsT2vTYpuVOXRexcJ40cbQ/formResponse"
                  method="POST"
                  target="hidden_iframe_modal"
                  onSubmit={handleModalSubmit}
                  className="space-y-4"
                >
                  {/* Name Field */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      style={{
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={modalFormData.name}
                      onChange={handleModalInputChange}
                      placeholder="John Smith"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${modalFormErrors.name ? 'border-red-500' : 'border-gray-300'
                        }`}
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                      }}
                    />
                    {modalFormErrors.name && (
                      <p className="text-red-500 text-xs mt-1">{modalFormErrors.name}</p>
                    )}
                  </div>

                  {/* Email Field */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      style={{
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={modalFormData.email}
                      onChange={handleModalInputChange}
                      placeholder="johnsmith@gmail.com"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${modalFormErrors.email ? 'border-red-500' : 'border-gray-300'
                        }`}
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                      }}
                    />
                    {modalFormErrors.email && (
                      <p className="text-red-500 text-xs mt-1">{modalFormErrors.email}</p>
                    )}
                  </div>

                  {/* Phone Field */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      style={{
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={modalFormData.phoneNumber}
                      onChange={handleModalInputChange}
                      placeholder="+91 9876543210"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Business Type Field */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      style={{
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Type of Business
                    </label>
                    <select
                      name="businessType"
                      value={modalFormData.businessType}
                      onChange={handleModalInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                      }}
                    >
                      <option value="">Select business type</option>
                      {businessTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Other Business Type Field (conditional) */}
                  {modalFormData.businessType === 'Others' && (
                    <div>
                      <label
                        className="block text-sm font-medium text-gray-700 mb-1"
                        style={{
                          fontFamily: 'Inter, sans-serif'
                        }}
                      >
                        Specify Business Type<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="otherBusinessType"
                        value={modalFormData.otherBusinessType}
                        onChange={handleModalInputChange}
                        placeholder="Enter your business type"
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${modalFormErrors.otherBusinessType ? 'border-red-500' : 'border-gray-300'
                          }`}
                        style={{
                          fontFamily: 'Inter, sans-serif',
                          fontSize: '14px'
                        }}
                      />
                      {modalFormErrors.otherBusinessType && (
                        <p className="text-red-500 text-xs mt-1">{modalFormErrors.otherBusinessType}</p>
                      )}
                    </div>
                  )}

                  {/* Business Description Field */}
                  <div>
                    <label
                      className="block text-sm font-medium text-gray-700 mb-1"
                      style={{
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Describe your business in few words<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="businessDescription"
                      value={modalFormData.businessDescription}
                      onChange={handleModalInputChange}
                      placeholder="Briefly describe your business..."
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${modalFormErrors.businessDescription ? 'border-red-500' : 'border-gray-300'
                        }`}
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                      }}
                    />
                    {modalFormErrors.businessDescription && (
                      <p className="text-red-500 text-xs mt-1">{modalFormErrors.businessDescription}</p>
                    )}
                  </div>

                  {/* Hidden fields for Google Forms entry IDs */}
                  <input type="hidden" name="entry.872961035" value={modalFormData.name} />
                  <input type="hidden" name="entry.1881233451" value={modalFormData.email} />
                  <input type="hidden" name="entry.1080815743" value={modalFormData.phoneNumber} />
                  <input
                    type="hidden"
                    name="entry.548806817"
                    value={
                      modalFormData.businessType === 'Others'
                        ? modalFormData.otherBusinessType
                        : modalFormData.businessType
                    }
                  />
                  <input
                    type="hidden"
                    name="entry.26268042"
                    value={modalFormData.businessDescription}
                  />

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {isSubmitting ? 'Sending...' : 'Submit'}
                  </button>
                </form>
                <iframe
                  name="hidden_iframe_modal"
                  style={{ display: 'none' }}
                  onLoad={handleModalIframeLoad}
                />
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        <Dialog open={showSuccessModal} onClose={() => setShowSuccessModal(false)} className="relative z-50">
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-500/75 transition-opacity data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in"
          />

          <div className="fixed inset-0 z-50 w-screen overflow-y-auto">
            <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
              <DialogPanel
                transition
                className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all data-closed:translate-y-4 data-closed:opacity-0 data-enter:duration-300 data-enter:ease-out data-leave:duration-200 data-leave:ease-in sm:my-8 sm:w-full sm:max-w-lg data-closed:sm:translate-y-0 data-closed:sm:scale-95"
              >
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex size-12 shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:size-10">
                      <CheckCircleIcon aria-hidden="true" className="size-6 text-green-600" />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <DialogTitle as="h3" className="text-base font-semibold text-gray-900">
                        Thank You!
                      </DialogTitle>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Madevize will reach out to you within 24 hrs
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    onClick={() => setShowSuccessModal(false)}
                    className="inline-flex w-full justify-center rounded-md bg-gray-800 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-gray-700 sm:ml-3 sm:w-auto"
                  >
                    Close
                  </button>
                </div>
              </DialogPanel>
            </div>
          </div>
        </Dialog>
      </div>
    </>
  )
}

export default LandingPage
