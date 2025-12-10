import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RegistrationForm from '../components/RegistrationForm'
import LoginForm from '../components/LoginForm'
import AnimatedText from '../components/AnimatedText'

const LandingPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate()
  const [showRegistration, setShowRegistration] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isFixesSectionVisible, setIsFixesSectionVisible] = useState(false)
  const fixesSectionRef = useRef(null)
  const [isCardsSectionVisible, setIsCardsSectionVisible] = useState(false)
  const cardsSectionRef = useRef(null)
  const [isHowItWorksSectionVisible, setIsHowItWorksSectionVisible] = useState(false)
  const howItWorksSectionRef = useRef(null)
  const [counter1, setCounter1] = useState(0)
  const [counter2, setCounter2] = useState(0)
  const [counter3, setCounter3] = useState(0)
  const [counter4, setCounter4] = useState(0)

  // Intersection Observer for "This is what Madevise fixes" section
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

  // Intersection Observer for cards section
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

  // Intersection Observer for "How It Works" section
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

  // Counter animations for "How It Works" section
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

  return (
    <div className="min-h-screen">
      {/* Hero Section Container with Background */}
      <div className="relative min-h-screen overflow-hidden">
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
                className="text-white font-semibold text-[14px] xl:text-base hover:text-gray-300 transition-colors duration-200 relative z-30"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
                ABOUT
          </button>
              <button 
                className="text-white font-semibold text-[14px] xl:text-base hover:text-gray-300 transition-colors duration-200 relative z-30"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                HOW IT WORKS
          </button>
              <button 
                className="text-white font-semibold text-[14px] xl:text-base hover:text-gray-300 transition-colors duration-200 relative z-30"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                PRICING
          </button>
          <button 
                className="text-white font-semibold text-[14px] xl:text-base hover:text-gray-300 transition-colors duration-200 relative z-30"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
                CONTACT
          </button>
            </div>
          </nav>
          
          {/* Right - CTA Button */}
          <div className="flex items-center">
          <button 
            onClick={() => setShowRegistration(true)}
              className="px-6 xl:px-6 py-4 xl:py-2.5 bg-white text-black hover:bg-gray-100 rounded-[15px] transition-all duration-200 font-semibold text-sm xl:text-base"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
              Create My Profile
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
              className="px-4 py-2 sm:py-2.5 text-white font-bold hover:text-gray-300 transition-colors text-center text-sm sm:text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              ABOUT
            </button>
            <button 
              className="px-4 py-2 sm:py-2.5 text-white font-bold hover:text-gray-300 transition-colors text-center text-sm sm:text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              HOW IT WORKS
            </button>
            <button 
              className="px-4 py-2 sm:py-2.5 text-white font-bold hover:text-gray-300 transition-colors text-center text-sm sm:text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              PRICING
            </button>
            <button 
              className="px-4 py-2 sm:py-2.5 text-white font-bold hover:text-gray-300 transition-colors text-center text-sm sm:text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              CONTACT
            </button>
            <button 
              onClick={() => {
                setShowRegistration(true)
                setShowMobileMenu(false)
              }}
              className="px-4 py-2 sm:py-2.5 bg-white text-black hover:bg-gray-100 rounded-full transition-all duration-200 text-center font-medium text-sm sm:text-base mt-4"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Create My Profile
            </button>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <main className="relative z-10 flex items-center min-h-screen px-4 sm:px-6 md:px-8 lg:px-12 xl:px-20 2xl:px-24">
        <div className="flex flex-col items-start justify-start w-full md:w-[85%] lg:w-[80%] xl:w-[75%] 2xl:w-[70%]">
          {/* Indicator Pill */}
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2.5 flex items-center space-x-3 mb-6">
            {/* Light gray circular bullet point */}
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            {/* Text */}
            <span 
              className="text-white text-sm font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              For factories, job shops & suppliers in India
            </span>
          </div>
          
          {/* Main Heading with Animation */}
          <h2 
            className="w-full h-auto whitespace-pre-wrap break-words max-w-full font-medium text-white leading-[1.2] mb-6 text-[42px] md:text-[48px] lg:text-[54px] xl:text-[60px] 2xl:text-[64px]"
            style={{
              fontFamily: '"Inter Display", "Inter Display Placeholder", sans-serif',
              letterSpacing: '-0.04em',
              wordSpacing: '-1.5em',
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
            className="w-full md:w-[70%] lg:w-[60%] xl:w-[55%] mb-6"
            style={{
              color: '#B1B1B1',
              fontSize: 'clamp(16px, 2vw, 20px)',
              fontFamily: 'Inter, sans-serif',
              lineHeight: '1.5'
            }}
          >
            Madevize gives every manufacturing business a powerful digital identity, so buyers can find you, trust you, and start working with you. One profile, endless opportunities.
          </p>
          
          {/* CTA Buttons Row */}
          <div className="flex flex-row items-center gap-3 md:gap-4">
          <button 
            onClick={() => setShowRegistration(true)}
              className="px-4 py-2 h-[47px] w-[160px] md:w-[170px] lg:w-[180px] bg-white text-black hover:bg-gray-100 rounded-[15px] transition-all duration-200 font-semibold text-sm md:text-base"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
              Create My Profile
            </button>
            <button 
              onClick={() => navigate('/demo-company')}
              className="px-4 py-2 h-[47px] w-[160px] md:w-[170px] lg:w-[180px] bg-white text-black hover:bg-gray-100 rounded-[15px] transition-all duration-200 font-semibold text-sm md:text-base"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              View How It Works
          </button>
          </div>
        </div>
      </main>
      </div>
      {/* End Hero Section Container */}

      {/* The Reality Today Section */}
      <section className="relative bg-white flex flex-col justify-between items-start w-full px-4 sm:px-6 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-24" style={{ minHeight: 'auto' }}>
        {/* Title and Paragraph on Same Line */}
        <div className="flex flex-row items-start justify-between w-full gap-8 md:gap-10 lg:gap-16 xl:gap-20 mb-6 md:mb-8">
          {/* THE REALITY TODAY Label */}
          <div className="relative flex items-center p-2 flex-shrink-0" style={{ width: 'fit-content' }}>
            <div className="w-4 sm:w-6 md:w-4 h-4 bg-black mr-2 md:mr-3"></div>
            <span className="text-[#29292B] tracking-wider text-sm sm:text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', letterSpacing: '0em' }}>
              The Reality Today
          </span>
        </div>

          {/* Paragraph and Grid Container */}
          <div className="flex flex-col w-[65%] items-end justify-space-between flex-shrink-0">
            {/* Paragraph */}
            <p 
              className="text-[#1E1E1E] font-semibold mb-6 md:mb-8"
          style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: 'clamp(32px, 3.5vw, 42px)',
                lineHeight: '1.5',
                maxWidth: '100%',
                textAlign: 'left'
              }}
            >
              Manufacturers lose business every day, not because of quality, but because they are invisible.
            </p>

            {/* Grid Section - 2 rows, 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-5 md:gap-6 lg:gap-6 w-full">
          {/* Grid Item 1 */}
          <div className="flex flex-col">
            <h3 className="text-[#1E1E1E] font-semibold text-lg mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              No proper digital presence
            </h3>
            <p className="text-[#666666] text-base md:text-base lg:text-base w-[60%]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
              Buyers can't discover you beyond references.
            </p>
          </div>

          {/* Grid Item 2 */}
          <div className="flex flex-col">
            <h3 className="text-[#1E1E1E] font-semibold text-lg mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Limited Customer Base
            </h3>
            <p className="text-[#666666] text-base md:text-base lg:text-base w-[60%]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
            90% of work comes from the same 2-3 customers you've always had
            </p>
          </div>

          {/* Grid Item 3 */}
          <div className="flex flex-col">
            <h3 className="text-[#1E1E1E] font-semibold text-lg mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Capabilities Go Unseen            </h3>
            <p className="text-[#666666] text-base md:text-base lg:text-base w-[60%]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
            It's hard to show your true capability: machines, tolerances, quality checks.
          </p>
          </div>
          
          {/* Grid Item 4 */}
          <div className="flex flex-col">
            <h3 className="text-[#1E1E1E] font-semibold text-lg mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Slow Vendor Discovery
            </h3>
            <p className="text-[#666666] text-base md:text-base lg:text-base w-[60%]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
            Finding new vendors for castings, machining, treatments takes weeks
            </p>
        </div>

          {/* Grid Item 5 */}
          <div className="flex flex-col">
            <h3 className="text-[#1E1E1E] font-semibold text-lg mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Lost on Generic Platforms
            </h3>
            <p className="text-[#666666] text-base md:text-base lg:text-base w-[60%]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
            Generic portals don't understand manufacturing, you become "just another listing"
            </p>
          </div>

          {/* Grid Item 6 */}
          <div className="flex flex-col">
            <h3 className="text-[#1E1E1E] font-semibold text-lg mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
            Visibility Starts Online
            </h3>
            <p className="text-[#666666] text-base md:text-base lg:text-base w-[60%]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.5' }}>
            Younger buyers and OEMs search online first. If you're not there, you're not considered
            </p>
          </div>
            </div>
          </div>
        </div>
      </section>

      {/* This is what Madevise fixes Section */}
      <section 
        ref={fixesSectionRef}
        className="relative bg-black flex items-center justify-center w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-20 sm:py-24 md:py-28 lg:py-32 xl:py-36 2xl:py-40"
      >
        <h2 
          className="text-[#D9D9D9] text-center"
        style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(36px, 4vw, 60px)',
            fontWeight: '600',
            letterSpacing: '-0.02em',
            lineHeight: '1.2'
          }}
        >
          {'This is what Madevise fixes'.split(' ').map((word, index, array) => (
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

      {/* The Madevise Platform Section */}
      <section className="relative bg-white flex flex-col items-center w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
        <h2 
          className="text-black text-center mb-6 md:mb-8 lg:mb-10"
              style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(36px, 4vw, 60px)',
            fontWeight: '600',
            letterSpacing: '-0.02em',
            lineHeight: '1.2'
          }}
        >
          The Madevise Platform
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
                <h3 className="text-black font-semibold mb-2 text-lg md:text-xl lg:text-[24px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                  Factory business profile
                </h3>
                <p className="text-[#5B5B5B] text-sm md:text-base lg:text-[18px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
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
              <h3 className="text-black font-semibold mb-2 text-lg md:text-xl lg:text-[24px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                RFQs & quotes
              </h3>
                <p className="text-[#5B5B5B] text-sm md:text-base lg:text-[18px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
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
                <h3 className="text-black font-semibold mb-2 text-lg md:text-xl lg:text-[24px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                  Get founded by buyers
                </h3>
                <p className="text-[#5B5B5B] text-sm md:text-base lg:text-[18px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                  OEMs, exporters, assemblers and traders can discover you using filters like process, material, location and industry.
                </p>
              </div>
              {/* Card 4 */}
              <div 
                className="bg-gray-100 rounded-lg p-5 md:p-6 lg:p-6 flex-1 min-h-[150px]"
            style={{
                  transform: isCardsSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                  opacity: isCardsSectionVisible ? 1 : 0,
                  transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s, opacity 1.5s ease 0.3s`
            }}
          >
                <p className="text-black">Card 4</p>
              </div>
              {/* Card 5 */}
              <div 
                className="bg-gray-100 rounded-lg p-5 md:p-6 lg:p-6 flex-1 min-h-[150px]"
              style={{
                  transform: isCardsSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                  opacity: isCardsSectionVisible ? 1 : 0,
                  transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.3s, opacity 1.5s ease 0.3s`
                }}
              >
                <h3 className="text-black font-semibold mb-2 text-lg md:text-xl lg:text-[24px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                  Vendor discovery
                </h3>
                <p className="text-[#5B5B5B] text-sm md:text-base lg:text-[18px]" style={{ fontFamily: 'Inter, sans-serif', lineHeight: '1.2' }}>
                Find suppliers for castings, forgings, plating, machining, fabrication and more in a few clicks.
                </p>
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
              className="mt-6 w-full md:w-[60%] lg:w-[50%] bg-white text-black rounded-full px-4 md:px-5 lg:px-6 py-2 md:py-2.5 lg:py-3 flex items-center justify-between border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span className="font-medium text-sm md:text-base lg:text-base">Get started</span>
              <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section 
        ref={howItWorksSectionRef}
        className="relative bg-white flex flex-col justify-between items-start w-full px-4 sm:px-6 md:px-6 lg:px-8 xl:px-10 2xl:px-12 py-8 sm:py-10 md:py-12 lg:py-16 xl:py-20 2xl:py-24" 
        style={{ minHeight: 'auto' }}
      >
        <div className="flex flex-row items-start justify-start w-full">
          {/* First Column */}
          <div className="flex flex-col flex-1">
            {/* HOW IT WORKS Label */}
            <div className="relative flex items-center p-2 mb-4" style={{ width: 'fit-content' }}>
              <div className="w-4 sm:w-6 md:w-4 h-4 bg-black mr-2 md:mr-3"></div>
              <span className="text-[#29292B] tracking-wider text-sm sm:text-lg" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', letterSpacing: '0em' }}>
                HOW IT WORKS
              </span>
            </div>
            
            {/* Title */}
            <h1 
              className="text-[#05080C] font-medium"
              style={{
                fontFamily: '"Inter Display", "Inter Display Placeholder", sans-serif',
                fontSize: 'clamp(36px, 4.5vw, 60px)',
                lineHeight: '1.2',
                fontWeight: '500',
                paddingRight: '50px',
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
          <div className="flex flex-col flex-1">
            {/* Section 1 */}
            <div 
              className="flex flex-row justify-between items-center gap-4 pb-6 border-b border-gray-200"
              style={{
                transform: isHowItWorksSectionVisible ? 'translateY(0)' : 'translateY(-50px)',
                opacity: isHowItWorksSectionVisible ? 1 : 0,
                transition: `transform 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.45s, opacity 1.5s ease 0.45s`
              }}
            >
              <span className="text-black font-medium text-2xl md:text-3xl lg:text-8xl flex-shrink-0" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;' }}>
                {Math.floor(counter1)}
              </span>
              <div className="flex flex-col w-[70%] justify-center items-center">
                <p className="text-black text-base md:text-lg lg:text-xl" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;', lineHeight: '1' }}>
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
              <span className="text-black font-medium text-2xl md:text-3xl lg:text-8xl flex-shrink-0" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;' }}>
                {Math.floor(counter2)}
              </span>
              <div className="flex flex-col w-[70%] justify-center items-center">
                <p className="text-black text-base md:text-lg lg:text-xl" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;', lineHeight: '1' }}>
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
              <span className="text-black font-medium text-2xl md:text-3xl lg:text-8xl flex-shrink-0" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;' }}>
                {Math.floor(counter3)}
              </span>
              <div className="flex flex-col w-[70%] justify-center items-center">
                <p className="text-black text-base md:text-lg lg:text-xl" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;', lineHeight: '1' }}>
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
              <span className="text-black font-medium text-2xl md:text-3xl lg:text-8xl flex-shrink-0" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;' }}>
                {Math.floor(counter4)}
              </span>
              <div className="flex flex-col w-[70%] justify-center items-center">
                <p className="text-black text-base md:text-lg lg:text-xl" style={{ fontFamily: '"Geist", "Geist Placeholder", sans-serif;', lineHeight: '1' }}>
                  Start with small jobs, prove quality, and grow lasting relationships, all starting from your Madevize presence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Black Background with White Center Div Section */}
      <section className="relative bg-black flex items-center justify-center w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
        <div className="bg-white rounded-lg w-full max-w-4xl p-8 md:p-12 lg:p-16">
          {/* Content will go here */}
        </div>
      </section>

      {/* Contact Us Section */}
      <section 
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
              <div className="w-4 sm:w-6 md:w-10 h-[4px] bg-white items-center mr-2 md:mr-3"></div>
              <span 
                className="text-white uppercase tracking-wider text-lg"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontWeight: '500',
                  letterSpacing: '0.1em'
                }}
              >
                CONTACT US
              </span>
            </div>

            {/* Main Title */}
            <h2 
              className="text-white font-medium"
              style={{
                fontFamily: '"Inter Display", Inter, sans-serif',
                fontSize: '60px',
                letterSpacing: '-0.04em',
                lineHeight: '1.2',
                maxWidth: '820px',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >
              Get in Touch
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
              className="flex flex-col justify-between items-start w-full lg:w-auto lg:max-w-full"
              style={{
                gap: '10px',
                minHeight: '400px'
              }}
            >
              {/* Description Text */}
              <p 
                className="text-white/90"
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: '400',
                  fontSize: '20px',
                  letterSpacing: '0em',
                  lineHeight: '1.5',
                  maxWidth: '100%'
                }}
              >
                For any inquiries or to explore your vision further, we invite you to contact our professional team using the details provided below.
              </p>

              {/* Contact Details */}
              <div 
                className="flex flex-col items-start"
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
                      <path d="M19.9999 15.4281V18.1281C20.0009 18.3787 19.9496 18.6268 19.8492 18.8565C19.7487 19.0862 19.6015 19.2923 19.4168 19.4618C19.2321 19.6312 19.014 19.7602 18.7766 19.8405C18.5391 19.9208 18.2875 19.9506 18.0379 19.9281C15.2684 19.6272 12.6082 18.6808 10.2709 17.1651C8.09634 15.7833 6.25269 13.9396 4.87089 11.7651C3.34987 9.41717 2.40331 6.74398 2.10789 3.96209C2.0854 3.71321 2.11498 3.46237 2.19474 3.22555C2.2745 2.98873 2.4027 2.77111 2.57118 2.58655C2.73966 2.40199 2.94472 2.25453 3.1733 2.15356C3.40189 2.05259 3.649 2.00032 3.89889 2.00009H6.59889C7.03567 1.99579 7.4591 2.15046 7.79028 2.43527C8.12145 2.72008 8.33776 3.11559 8.39889 3.54809C8.51285 4.41215 8.7242 5.26054 9.02889 6.07709C9.14998 6.39922 9.17619 6.74931 9.10441 7.08588C9.03263 7.42245 8.86587 7.73139 8.62389 7.97609L7.48089 9.11909C8.76209 11.3723 10.6277 13.2379 12.8809 14.5191L14.0239 13.3761C14.2686 13.1341 14.5775 12.9674 14.9141 12.8956C15.2507 12.8238 15.6008 12.85 15.9229 12.9711C16.7394 13.2758 17.5878 13.4871 18.4519 13.6011C18.8891 13.6628 19.2884 13.883 19.5738 14.2198C19.8592 14.5567 20.0108 14.9867 19.9999 15.4281Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
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
                        <path d="M19.0999 9.6C19.0999 15.9 10.9999 21.3 10.9999 21.3C10.9999 21.3 2.8999 15.9 2.8999 9.6C2.8999 7.45175 3.75329 5.39148 5.27234 3.87243C6.79138 2.35339 8.85165 1.5 10.9999 1.5C13.1482 1.5 15.2084 2.35339 16.7275 3.87243C18.2465 5.39148 19.0999 7.45175 19.0999 9.6Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.9998 12.3004C12.491 12.3004 13.6998 11.0916 13.6998 9.60039C13.6998 8.10922 12.491 6.90039 10.9998 6.90039C9.50864 6.90039 8.2998 8.10922 8.2998 9.60039C8.2998 11.0916 9.50864 12.3004 10.9998 12.3004Z" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </g>
                      <defs>
                        <clipPath id="clip0_199_156">
                          <rect width="21.6" height="21.6" fill="white" transform="translate(0.200195 0.600098)"/>
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
              <div 
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
                      placeholder="John Smith"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                      }}
                    />
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
                      placeholder="johnsmith@gmail.com"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                      }}
                    />
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
                      placeholder="+44789 123456"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Message Field */}
                  <div>
                    <label 
                      className="block text-sm font-medium text-gray-700 mb-1"
                      style={{
                        fontFamily: 'Inter, sans-serif'
                      }}
                    >
                      Message<span className="text-red-500">*</span>
                    </label>
                    <textarea 
                      placeholder="Hello, I'd like to enquire about..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      style={{
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <button 
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
              </div>
            </div>
          </div>
        </div>
      </section>

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
              className="flex flex-col items-start"
              style={{
                gap: 'clamp(20px, 5vw, 383px)'
              }}
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
            </div>

            {/* Right Stack - Join Us Content */}
            <div 
              className="flex flex-col items-end w-full lg:w-auto"
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

          {/* Divider Line */}
          <div 
            className="w-full bg-white/20"
            style={{
              height: '2px'
            }}
          />

          {/* Copyright Frame */}
          <div 
            className="flex items-center justify-center w-full"
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
    </div>
  )
}

export default LandingPage
