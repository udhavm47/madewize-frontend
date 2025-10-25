import { useState, useRef, useEffect } from 'react'
import RegistrationForm from '../components/RegistrationForm'
import LoginForm from '../components/LoginForm'
import AnimatedText from '../components/AnimatedText'

const LandingPage = ({ onLoginSuccess }) => {
  const [showRegistration, setShowRegistration] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [isTitleVisible, setIsTitleVisible] = useState(false)
  const titleRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            console.log('Title is now visible, triggering animation')
            setIsTitleVisible(true)
            // Stop observing after animation triggers
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.2, // Trigger when 20% of the element is visible
        rootMargin: '0px 0px 0px 0px' // No margin offset
      }
    )

    // Use a timeout to ensure the ref is available
    const timeoutId = setTimeout(() => {
      if (titleRef.current) {
        console.log('Setting up intersection observer for title')
        observer.observe(titleRef.current)
      }
    }, 100)

    return () => {
      clearTimeout(timeoutId)
      if (titleRef.current) {
        observer.unobserve(titleRef.current)
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section Container with Background */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0"
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
        <header className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center">
          <img 
            src="/madevize.svg" 
            alt="Madevize Logo" 
            className="h-6 md:h-8"
          />
        </div>
        
        {/* Desktop Navigation - Right Side */}
        <div className="hidden md:flex items-center space-x-3">
          <button className="px-6 py-2.5 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-full transition-all duration-200" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
            About Us
          </button>
          <button className="px-6 py-2.5 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-full transition-all duration-200" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
            Service
          </button>
          <button className="px-6 py-2.5 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-full transition-all duration-200" style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}>
            Contact
          </button>
          <button 
            onClick={() => setShowLogin(true)}
            className="px-6 py-2.5 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-full transition-all duration-200"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
          >
            Sign In
          </button>
          <button 
            onClick={() => setShowRegistration(true)}
            className="px-6 py-2.5 bg-white text-black hover:bg-gray-100 rounded-full transition-all duration-200 flex items-center space-x-2 font-medium"
            style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
          >
            <span>Sign Up</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="md:hidden text-white p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-gray-900/95 backdrop-blur-lg z-20 px-6 py-4 border-t border-gray-700">
          <nav className="flex flex-col space-y-3">
            <button className="px-4 py-2.5 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-full transition-all duration-200 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              About Us
            </button>
            <button className="px-4 py-2.5 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-full transition-all duration-200 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              Service
            </button>
            <button className="px-4 py-2.5 bg-gray-700/80 hover:bg-gray-600/80 text-white rounded-full transition-all duration-200 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              Contact
            </button>
            <button 
              onClick={() => setShowLogin(true)}
              className="px-4 py-2.5 text-white hover:text-gray-300 transition-colors text-center underline underline-offset-4"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Sign In
            </button>
            <button 
              onClick={() => setShowRegistration(true)}
              className="px-4 py-2.5 bg-white text-black hover:bg-gray-100 rounded-full transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <span>Sign Up</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      )}

      {/* Hero Section */}
      <main className="relative max-w-5xl z-10 flex items-center min-h-screen px-6 md:px-12 lg:px-20">
        <div 
          className="relative max-w-4xl text-left"
          style={{
            paddingRight: '15%'
          }}
        >
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-tight" style={{ fontFamily: 'Inter, sans-serif' }}>
            <AnimatedText 
              text="Built Your Factory's Digital Presence & Get Discovered by Buyers"
              staggerDelay={0.1}
              delay={0.2}
            />
          </h1>
          
          <div className="flex items-center mb-12">
            <div className="w-1 h-8 bg-white mr-4"></div>
            <AnimatedText 
              text="The potential of manufacturing to shape economies and futures"
              className="text-lg md:text-xl text-white font-light"
              style={{ fontFamily: 'Inter, sans-serif' }}
              staggerDelay={0.08}
              delay={1.5}
            />
          </div>
        </div>

        {/* Bottom CTA - Positioned on the cutout area */}
        <div 
          className="absolute left-1/2 z-10 flex justify-center items-center"
          style={{
            bottom: '60px',
            transform: 'translateX(-50%)'
          }}
        >
          <button 
            onClick={() => setShowRegistration(true)}
            className="px-8 py-4 bg-white hover:bg-gray-100 text-black rounded-lg transition-all duration-200 flex items-center space-x-3 text-lg font-semibold shadow-lg hover:shadow-xl"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span>Build Your Profile</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        </div>
      </main>
      </div>
      {/* End Hero Section Container */}

      {/* Who Are We Section */}
      <section className="relative bg-black flex flex-col justify-between items-start w-full px-6 md:px-10 py-12 md:py-16" style={{ minHeight: '682px' }}>
        {/* WHO ARE WE Label */}
        <div className="relative flex items-center mb-6 md:mb-8" style={{ width: 'fit-content' }}>
          <div className="w-6 md:w-8 h-px bg-white mr-2 md:mr-3"></div>
          <span className="text-white uppercase tracking-wider text-xs md:text-sm" style={{ fontFamily: 'Inter, sans-serif', fontWeight: '500', letterSpacing: '0.1em' }}>
            WHO ARE WE
          </span>
        </div>

        {/* Main Heading */}
        <h2 
          className="relative text-left text-white mb-10 md:mb-16 px-4"
          style={{
            fontFamily: '"Inter Display", Inter, sans-serif',
            fontWeight: 500,
            fontSize: 'clamp(32px, 5vw, 60px)',
            letterSpacing: '-0.04em',
            lineHeight: '1.2em',
            maxWidth: '820px',
            opacity: 1
          }}
        >
        Explore How We Bring Digital Access to Every Corner of India
        </h2>

        {/* Images and Paragraph Section */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-start w-full overflow-hidden gap-8 md:gap-16" style={{ maxWidth: '1200px' }}>
          {/* Images Container */}
          <div className="flex gap-6 md:gap-6 justify-center w-full md:w-auto">
            <img 
              src="/abou1.jpeg" 
              alt="Madevise Feature 1" 
              className="relative flex-1 object-contain animate-fade-in-scale"
              style={{ 
                height: '191px',
                opacity: 0,
                animation: 'fadeInScale 0.6s ease-out 0.2s forwards'
              }}
            />
            <img 
              src="/about2.jpeg" 
              alt="Madevise Feature 2" 
              className="relative flex-1 object-contain animate-fade-in-scale"
              style={{ 
                height: '191px',
                opacity: 0,
                animation: 'fadeInScale 0.6s ease-out 0.4s forwards'
              }}
            />
            <img 
              src="/about3.jpeg" 
              alt="Madevise Feature 3" 
              className="relative flex-1 object-contain animate-fade-in-scale"
              style={{ 
                height: '191px',
                opacity: 0,
                animation: 'fadeInScale 0.6s ease-out 0.6s forwards'
              }}
            />
          </div>

          {/* Paragraph */}
          <p 
            className="relative flex-1 text-white/90 text-center md:text-left"
            style={{
              fontFamily: 'Manrope, sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              letterSpacing: '0em',
              lineHeight: '1.5em',
              maxWidth: '600px',
              opacity: 1
            }}
          >
            Madevise has grown from a single idea into a simple, powerful tool that helps small and medium manufacturers get noticed and grow their business. Whether you make parts, do fabrication, or run a job shop, we make it easy to show your work to the right players. Our platform brings together easy-to-use features and local know-how, helping factories create an online profile, share achievements, find new buyers and suppliers, and get quotes faster, all in one place, in your own language, right from your phone.
          </p>
        </div>

        {/* About Us Button */}
        <button 
          className="mt-12 md:mt-16 px-8 py-3 bg-white text-black hover:bg-gray-100 rounded-full transition-all duration-200 flex items-center space-x-2 font-medium"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '15px' }}
        >
          <span>About Us</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-7-7l7 7-7 7" />
          </svg>
        </button>
      </section>

      {/* Why Choose Us Section */}
      <section 
        className="relative bg-white overflow-hidden px-4 md:px-10 lg:px-10 py-16 md:py-20 lg:py-24"
        style={{
          minHeight: '100vh'
        }}
      >
        {/* Background Ellipses - Hidden on mobile */}
        <div className="absolute inset-0 w-full h-full pointer-events-none hidden lg:block">
          {/* Top-Left Ellipses */}
          <div className="absolute top-0 left-0">
            {/* Ellipse 1 - Largest (Top-Left) */}
            <div 
              className="absolute border border-black/71 rounded-full"
              style={{
                width: '1050px',
                height: '1050px',
                top: '-200px',
                left: '-300px'
              }}
            />
            {/* Ellipse 2 - Medium (Top-Left) */}
            <div 
              className="absolute border border-black/71 rounded-full"
              style={{
                width: '820px',
                height: '820px',
                top: '-100px',
                left: '-200px'
              }}
            />
            {/* Ellipse 3 - Smallest (Top-Left) */}
            <div 
              className="absolute border border-black/71 rounded-full"
              style={{
                width: '550px',
                height: '550px',
                top: '50px',
                left: '-100px'
              }}
            />
          </div>

          {/* Bottom-Right Ellipses */}
          <div className="absolute bottom-0 right-0">
            {/* Ellipse 1 - Largest (Bottom-Right) */}
            <div 
              className="absolute border border-black/71 rounded-full"
              style={{
                width: '1400px',
                height: '1400px',
                bottom: '-300px',
                right: '-400px'
              }}
            />
            {/* Ellipse 2 - Medium (Bottom-Right) */}
            <div 
              className="absolute border border-black/71 rounded-full"
              style={{
                width: '1100px',
                height: '1100px',
                bottom: '-200px',
                right: '-300px'
              }}
            />
            {/* Ellipse 3 - Smallest (Bottom-Right) */}
            <div 
              className="absolute border border-black/71 rounded-full"
              style={{
                width: '800px',
                height: '800px',
                bottom: '-100px',
                right: '-200px'
              }}
            />
          </div>
        </div>

        {/* Container */}
        <div 
          className="relative flex flex-col items-end max-w-7xl mx-auto"
          style={{
            gap: '64px',
            width: '100%'
          }}
        >
          {/* Title Section */}
          <div 
            className="flex flex-col items-start w-full"
            style={{
              gap: '32px'
            }}
          >
            {/* Section Tag */}
            <div 
              className="relative"
              style={{
                width: 'fit-content',
                height: 'fit-content'
              }}
            >
              <span 
                className="text-black uppercase tracking-wider"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '0.1em'
                }}
              >
                WHY CHOOSE US
              </span>
            </div>

            {/* Main Title */}
            <h2 
              ref={titleRef}
              className="text-black font-medium"
              style={{
                fontFamily: '"Inter Display", Inter, sans-serif',
                fontSize: 'clamp(28px, 4vw, 41px)',
                letterSpacing: '-0.04em',
                lineHeight: '1.2',
                maxWidth: '820px',
                whiteSpace: 'pre-wrap',
                wordWrap: 'break-word',
                wordBreak: 'break-word'
              }}
            >
              <span className={`inline-block ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0 transform translate-y-2 blur-sm'}`} style={{ animationDelay: isTitleVisible ? '0.1s' : '0s' }}>Upscale</span>{' '}
              <span className={`inline-block ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0 transform translate-y-2 blur-sm'}`} style={{ animationDelay: isTitleVisible ? '0.2s' : '0s' }}>digitally</span>{' '}
              <span className={`inline-block ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0 transform translate-y-2 blur-sm'}`} style={{ animationDelay: isTitleVisible ? '0.3s' : '0s' }}>in</span>{' '}
              <span className={`inline-block ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0 transform translate-y-2 blur-sm'}`} style={{ animationDelay: isTitleVisible ? '0.4s' : '0s' }}>a</span>{' '}
              <span className={`inline-block ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0 transform translate-y-2 blur-sm'}`} style={{ animationDelay: isTitleVisible ? '0.5s' : '0s' }}>click</span>{' '}
              <span className={`inline-block ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0 transform translate-y-2 blur-sm'}`} style={{ animationDelay: isTitleVisible ? '0.6s' : '0s' }}>-</span>{' '}
              <span className={`inline-block ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0 transform translate-y-2 blur-sm'}`} style={{ animationDelay: isTitleVisible ? '0.7s' : '0s' }}>your</span>{' '}
              <span className={`inline-block ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0 transform translate-y-2 blur-sm'}`} style={{ animationDelay: isTitleVisible ? '0.8s' : '0s' }}>website,</span>{' '}
              <span className={`inline-block ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0 transform translate-y-2 blur-sm'}`} style={{ animationDelay: isTitleVisible ? '0.9s' : '0s' }}>your</span>{' '}
              <span className={`inline-block ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0 transform translate-y-2 blur-sm'}`} style={{ animationDelay: isTitleVisible ? '1.0s' : '0s' }}>profile,</span>{' '}
              <span className={`inline-block ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0 transform translate-y-2 blur-sm'}`} style={{ animationDelay: isTitleVisible ? '1.1s' : '0s' }}>your</span>{' '}
              <span className={`inline-block ${isTitleVisible ? 'animate-fade-in-up' : 'opacity-0 transform translate-y-2 blur-sm'}`} style={{ animationDelay: isTitleVisible ? '1.2s' : '0s' }}>business</span>
            </h2>
          </div>

          {/* Feature Cards Stack */}
          <div 
            className="flex flex-col items-center w-full lg:w-auto"
            style={{
              width: '100%',
              maxWidth: '618px',
              gap: '56px'
            }}
          >
            {/* Card 1: Your Digital Manufacturing Identity */}
            <div 
              className="relative w-full max-w-[618px]"
              style={{
                height: '187px'
              }}
            >
              {/* Card Background SVG */}
              <svg 
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 617.229 186.851" 
                fill="none"
              >
                <path 
                  d="M 0 160.285 L 0 120.655 C 0 105.983 11.894 94.088 26.567 94.088 L 65.484 94.088 C 80.156 94.088 92.05 82.194 92.05 67.522 L 92.05 26.567 C 92.05 11.894 103.944 0 118.617 0 L 590.662 0 C 605.335 0 617.229 11.894 617.229 26.567 L 617.229 107.94 C 617.229 122.612 605.335 134.506 590.662 134.506 L 518.476 134.506 C 504.022 134.506 492.303 146.224 492.303 160.679 C 492.303 175.134 480.586 186.851 466.132 186.851 L 26.567 186.851 C 11.894 186.851 0 174.957 0 160.285 Z" 
                  fill="rgb(0, 0, 0)" 
                  stroke="rgb(0, 0, 0)" 
                  strokeWidth="0.89"
                />
              </svg>

              {/* Icon */}
              <div 
                className="absolute"
                style={{
                  top: '20px',
                  left: '20px',
                  width: '73px',
                  height: '73px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="73" height="73" fill="none">
                  <path d="M 36.5 73 C 16.342 73 0 56.658 0 36.5 L 0 36.5 C 0 16.342 16.342 0 36.5 0 L 36.5 0 C 56.658 0 73 16.342 73 36.5 L 73 36.5 C 73 56.658 56.658 73 36.5 73 Z" fill="rgb(0, 0, 0)"></path>
                  <g transform="translate(16.5 16.5)">
                    <path d="M 0 40 L 0 0 L 40 0 L 40 40 Z" fill="transparent"></path>
                    <path d="M 23.962 1.3 L 26.285 3 C 26.667 3.28 27.112 3.465 27.58 3.538 L 30.425 3.975 C 31.832 4.192 33.134 4.852 34.141 5.859 C 35.148 6.866 35.808 8.168 36.025 9.575 L 36.46 12.423 C 36.532 12.89 36.717 13.335 36.997 13.718 L 38.697 16.038 C 39.54 17.187 39.995 18.575 39.995 20 C 39.995 21.425 39.54 22.814 38.697 23.963 L 36.997 26.283 C 36.718 26.666 36.534 27.11 36.46 27.578 L 36.022 30.423 C 35.806 31.831 35.145 33.133 34.138 34.141 C 33.13 35.148 31.828 35.809 30.42 36.025 L 27.575 36.463 C 27.107 36.537 26.663 36.721 26.28 37 L 23.96 38.7 C 22.811 39.543 21.422 39.998 19.997 39.998 C 18.572 39.998 17.184 39.543 16.035 38.7 L 13.715 37 C 13.332 36.721 12.888 36.537 12.42 36.463 L 9.575 36.025 C 8.167 35.808 6.866 35.148 5.859 34.141 C 4.852 33.134 4.192 31.833 3.975 30.425 L 3.537 27.58 C 3.463 27.112 3.279 26.668 3 26.285 L 1.3 23.965 C 0.457 22.816 0.002 21.428 0.002 20.003 C 0.002 18.578 0.457 17.19 1.3 16.04 L 3 13.72 C 3.28 13.338 3.465 12.893 3.537 12.425 L 3.975 9.575 C 4.192 8.168 4.852 6.866 5.859 5.859 C 6.866 4.852 8.167 4.192 9.575 3.975 L 12.422 3.538 C 12.89 3.465 13.335 3.28 13.717 3 L 16.037 1.3 C 17.187 0.457 18.575 0.003 20 0.003 C 21.425 0.003 22.813 0.457 23.962 1.3 Z M 18.257 4.32 L 15.94 6.02 C 15.068 6.658 14.057 7.077 12.99 7.243 L 10.147 7.678 C 9.527 7.773 8.953 8.064 8.51 8.508 C 8.066 8.951 7.775 9.525 7.68 10.145 L 7.245 12.985 C 7.079 14.052 6.66 15.064 6.022 15.935 L 4.322 18.255 C 3.952 18.761 3.753 19.371 3.753 19.998 C 3.753 20.624 3.952 21.235 4.322 21.74 L 6.022 24.058 C 6.662 24.928 7.082 25.94 7.245 27.008 L 7.68 29.85 C 7.875 31.123 8.875 32.123 10.147 32.318 L 12.987 32.753 C 14.054 32.919 15.066 33.338 15.937 33.975 L 18.257 35.675 C 19.292 36.438 20.705 36.438 21.742 35.675 L 24.06 33.975 C 24.931 33.338 25.943 32.919 27.01 32.753 L 29.852 32.318 C 30.473 32.222 31.046 31.932 31.49 31.488 C 31.934 31.044 32.224 30.471 32.32 29.85 L 32.755 27.01 C 32.92 25.943 33.34 24.932 33.977 24.06 L 35.677 21.74 C 36.047 21.235 36.247 20.624 36.247 19.998 C 36.247 19.371 36.047 18.761 35.677 18.255 L 33.977 15.938 C 33.34 15.066 32.92 14.055 32.755 12.988 L 32.32 10.145 C 32.224 9.525 31.934 8.951 31.49 8.508 C 31.046 8.064 30.473 7.773 29.852 7.678 L 27.012 7.243 C 25.945 7.077 24.934 6.658 24.062 6.02 L 21.742 4.32 C 21.237 3.95 20.626 3.751 20 3.751 C 19.373 3.751 18.763 3.95 18.257 4.32 Z M 28.2 16.95 L 18.825 26.325 C 18.473 26.676 17.997 26.874 17.5 26.874 C 17.003 26.874 16.526 26.676 16.175 26.325 L 11.8 21.95 C 11.468 21.595 11.287 21.125 11.296 20.639 C 11.304 20.153 11.501 19.689 11.845 19.345 C 12.188 19.002 12.652 18.805 13.138 18.796 C 13.624 18.788 14.094 18.969 14.45 19.3 L 17.5 22.35 L 25.55 14.3 C 25.905 13.969 26.375 13.788 26.861 13.796 C 27.347 13.805 27.811 14.002 28.155 14.345 C 28.498 14.689 28.695 15.153 28.704 15.639 C 28.712 16.125 28.531 16.595 28.2 16.95 Z" fill="rgb(255,255,255)"></path>
                  </g>
                </svg>
              </div>

              {/* Card Title */}
              <h3 
                className="absolute text-white font-medium"
                style={{
                  top: '20px',
                  left: '110px',
                  fontFamily: '"Inter Display", Inter, sans-serif',
                  fontSize: 'clamp(18px, 3vw, 25px)',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  whiteSpace: 'pre',
                  width: 'calc(100% - 130px)',
                  maxWidth: '418px'
                }}
              >
                Your Digital Manufacturing Identity
              </h3>

              {/* Card Description */}
              <p 
                className="absolute text-gray-300"
                style={{
                  top: '60px',
                  left: '110px',
                  width: 'calc(100% - 130px)',
                  maxWidth: '418px',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: '500',
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word'
                }}
              >
                Build a smart, SEO-powered profile that showcases everything about your manufacturing business products, processes, strengths & scale, all in one place.
              </p>

              {/* Decorative Rectangle */}
              <div 
                className="absolute border border-black rounded-lg bg-white"
                style={{
                  bottom: '0px',
                  right: '6px',
                  width: '110px',
                  height: '45px'
                }}
              >
                <div 
                  className="absolute bg-black"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '76px',
                    height: '2px'
                  }}
                />
              </div>
            </div>

            {/* Card 2: Share. Engage. Grow. */}
            <div 
              className="relative w-full max-w-[618px]"
              style={{
                height: '187px'
              }}
            >
              {/* Card Background SVG */}
              <svg 
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 617.229 186.851" 
                fill="none"
              >
                <path 
                  d="M 0 160.285 L 0 120.655 C 0 105.983 11.894 94.088 26.567 94.088 L 65.484 94.088 C 80.156 94.088 92.05 82.194 92.05 67.522 L 92.05 26.567 C 92.05 11.894 103.944 0 118.617 0 L 590.662 0 C 605.335 0 617.229 11.894 617.229 26.567 L 617.229 107.94 C 617.229 122.612 605.335 134.506 590.662 134.506 L 518.476 134.506 C 504.022 134.506 492.303 146.224 492.303 160.679 C 492.303 175.134 480.586 186.851 466.132 186.851 L 26.567 186.851 C 11.894 186.851 0 174.957 0 160.285 Z" 
                  fill="rgb(0, 0, 0)" 
                  stroke="rgb(0, 0, 0)" 
                  strokeWidth="0.89"
                />
              </svg>

              {/* Icon */}
              <div 
                className="absolute"
                style={{
                  top: '20px',
                  left: '20px',
                  width: '73px',
                  height: '73px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="73" height="73" fill="none">
                  <path d="M 36.5 73 C 16.342 73 0 56.658 0 36.5 L 0 36.5 C 0 16.342 16.342 0 36.5 0 L 36.5 0 C 56.658 0 73 16.342 73 36.5 L 73 36.5 C 73 56.658 56.658 73 36.5 73 Z" fill="rgb(0, 0, 0)"></path>
                  <g transform="translate(16.5 16.5)">
                    <path d="M 0 40 L 0 0 L 40 0 L 40 40 Z" fill="transparent"></path>
                    <path d="M 23.962 1.3 L 26.285 3 C 26.667 3.28 27.112 3.465 27.58 3.538 L 30.425 3.975 C 31.832 4.192 33.134 4.852 34.141 5.859 C 35.148 6.866 35.808 8.168 36.025 9.575 L 36.46 12.423 C 36.532 12.89 36.717 13.335 36.997 13.718 L 38.697 16.038 C 39.54 17.187 39.995 18.575 39.995 20 C 39.995 21.425 39.54 22.814 38.697 23.963 L 36.997 26.283 C 36.718 26.666 36.534 27.11 36.46 27.578 L 36.022 30.423 C 35.806 31.831 35.145 33.133 34.138 34.141 C 33.13 35.148 31.828 35.809 30.42 36.025 L 27.575 36.463 C 27.107 36.537 26.663 36.721 26.28 37 L 23.96 38.7 C 22.811 39.543 21.422 39.998 19.997 39.998 C 18.572 39.998 17.184 39.543 16.035 38.7 L 13.715 37 C 13.332 36.721 12.888 36.537 12.42 36.463 L 9.575 36.025 C 8.167 35.808 6.866 35.148 5.859 34.141 C 4.852 33.134 4.192 31.833 3.975 30.425 L 3.537 27.58 C 3.463 27.112 3.279 26.668 3 26.285 L 1.3 23.965 C 0.457 22.816 0.002 21.428 0.002 20.003 C 0.002 18.578 0.457 17.19 1.3 16.04 L 3 13.72 C 3.28 13.338 3.465 12.893 3.537 12.425 L 3.975 9.575 C 4.192 8.168 4.852 6.866 5.859 5.859 C 6.866 4.852 8.167 4.192 9.575 3.975 L 12.422 3.538 C 12.89 3.465 13.335 3.28 13.717 3 L 16.037 1.3 C 17.187 0.457 18.575 0.003 20 0.003 C 21.425 0.003 22.813 0.457 23.962 1.3 Z M 18.257 4.32 L 15.94 6.02 C 15.068 6.658 14.057 7.077 12.99 7.243 L 10.147 7.678 C 9.527 7.773 8.953 8.064 8.51 8.508 C 8.066 8.951 7.775 9.525 7.68 10.145 L 7.245 12.985 C 7.079 14.052 6.66 15.064 6.022 15.935 L 4.322 18.255 C 3.952 18.761 3.753 19.371 3.753 19.998 C 3.753 20.624 3.952 21.235 4.322 21.74 L 6.022 24.058 C 6.662 24.928 7.082 25.94 7.245 27.008 L 7.68 29.85 C 7.875 31.123 8.875 32.123 10.147 32.318 L 12.987 32.753 C 14.054 32.919 15.066 33.338 15.937 33.975 L 18.257 35.675 C 19.292 36.438 20.705 36.438 21.742 35.675 L 24.06 33.975 C 24.931 33.338 25.943 32.919 27.01 32.753 L 29.852 32.318 C 30.473 32.222 31.046 31.932 31.49 31.488 C 31.934 31.044 32.224 30.471 32.32 29.85 L 32.755 27.01 C 32.92 25.943 33.34 24.932 33.977 24.06 L 35.677 21.74 C 36.047 21.235 36.247 20.624 36.247 19.998 C 36.247 19.371 36.047 18.761 35.677 18.255 L 33.977 15.938 C 33.34 15.066 32.92 14.055 32.755 12.988 L 32.32 10.145 C 32.224 9.525 31.934 8.951 31.49 8.508 C 31.046 8.064 30.473 7.773 29.852 7.678 L 27.012 7.243 C 25.945 7.077 24.934 6.658 24.062 6.02 L 21.742 4.32 C 21.237 3.95 20.626 3.751 20 3.751 C 19.373 3.751 18.763 3.95 18.257 4.32 Z M 28.2 16.95 L 18.825 26.325 C 18.473 26.676 17.997 26.874 17.5 26.874 C 17.003 26.874 16.526 26.676 16.175 26.325 L 11.8 21.95 C 11.468 21.595 11.287 21.125 11.296 20.639 C 11.304 20.153 11.501 19.689 11.845 19.345 C 12.188 19.002 12.652 18.805 13.138 18.796 C 13.624 18.788 14.094 18.969 14.45 19.3 L 17.5 22.35 L 25.55 14.3 C 25.905 13.969 26.375 13.788 26.861 13.796 C 27.347 13.805 27.811 14.002 28.155 14.345 C 28.498 14.689 28.695 15.153 28.704 15.639 C 28.712 16.125 28.531 16.595 28.2 16.95 Z" fill="rgb(255,255,255)"></path>
                  </g>
                </svg>
              </div>

              {/* Card Title */}
              <h3 
                className="absolute text-white font-medium"
                style={{
                  top: '20px',
                  left: '110px',
                  fontFamily: '"Inter Display", Inter, sans-serif',
                  fontSize: 'clamp(18px, 3vw, 25px)',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  whiteSpace: 'pre',
                  width: 'calc(100% - 130px)',
                  maxWidth: '418px'
                }}
              >
                Share. Engage. Grow.
              </h3>

              {/* Card Description */}
              <p 
                className="absolute text-gray-300"
                style={{
                  top: '60px',
                  left: '110px',
                  width: 'calc(100% - 130px)',
                  maxWidth: '418px',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: '500',
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word'
                }}
              >
                Post achievements, insights, trends, innovations, and promotions - position yourself as a modern manufacturer in a fast-evolving ecosystem.
              </p>

              {/* Decorative Rectangle */}
              <div 
                className="absolute border border-black rounded-lg bg-white"
                style={{
                  bottom: '0px',
                  right: '6px',
                  width: '110px',
                  height: '45px'
                }}
              >
                <div 
                  className="absolute bg-black"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '76px',
                    height: '2px'
                  }}
                />
              </div>
            </div>

            {/* Card 3: Instant RFQs, Smarter Quotes */}
            <div 
              className="relative w-full max-w-[618px]"
              style={{
                height: '187px'
              }}
            >
              {/* Card Background SVG */}
              <svg 
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 617.229 186.851" 
                fill="none"
              >
                <path 
                  d="M 0 160.285 L 0 120.655 C 0 105.983 11.894 94.088 26.567 94.088 L 65.484 94.088 C 80.156 94.088 92.05 82.194 92.05 67.522 L 92.05 26.567 C 92.05 11.894 103.944 0 118.617 0 L 590.662 0 C 605.335 0 617.229 11.894 617.229 26.567 L 617.229 107.94 C 617.229 122.612 605.335 134.506 590.662 134.506 L 518.476 134.506 C 504.022 134.506 492.303 146.224 492.303 160.679 C 492.303 175.134 480.586 186.851 466.132 186.851 L 26.567 186.851 C 11.894 186.851 0 174.957 0 160.285 Z" 
                  fill="rgb(0, 0, 0)" 
                  stroke="rgb(0, 0, 0)" 
                  strokeWidth="0.89"
                />
              </svg>

              {/* Icon */}
              <div 
                className="absolute"
                style={{
                  top: '20px',
                  left: '20px',
                  width: '73px',
                  height: '73px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="73" height="73" fill="none">
                  <path d="M 36.5 73 C 16.342 73 0 56.658 0 36.5 L 0 36.5 C 0 16.342 16.342 0 36.5 0 L 36.5 0 C 56.658 0 73 16.342 73 36.5 L 73 36.5 C 73 56.658 56.658 73 36.5 73 Z" fill="rgb(0, 0, 0)"></path>
                  <g transform="translate(16.5 16.5)">
                    <path d="M 0 40 L 0 0 L 40 0 L 40 40 Z" fill="transparent"></path>
                    <path d="M 23.962 1.3 L 26.285 3 C 26.667 3.28 27.112 3.465 27.58 3.538 L 30.425 3.975 C 31.832 4.192 33.134 4.852 34.141 5.859 C 35.148 6.866 35.808 8.168 36.025 9.575 L 36.46 12.423 C 36.532 12.89 36.717 13.335 36.997 13.718 L 38.697 16.038 C 39.54 17.187 39.995 18.575 39.995 20 C 39.995 21.425 39.54 22.814 38.697 23.963 L 36.997 26.283 C 36.718 26.666 36.534 27.11 36.46 27.578 L 36.022 30.423 C 35.806 31.831 35.145 33.133 34.138 34.141 C 33.13 35.148 31.828 35.809 30.42 36.025 L 27.575 36.463 C 27.107 36.537 26.663 36.721 26.28 37 L 23.96 38.7 C 22.811 39.543 21.422 39.998 19.997 39.998 C 18.572 39.998 17.184 39.543 16.035 38.7 L 13.715 37 C 13.332 36.721 12.888 36.537 12.42 36.463 L 9.575 36.025 C 8.167 35.808 6.866 35.148 5.859 34.141 C 4.852 33.134 4.192 31.833 3.975 30.425 L 3.537 27.58 C 3.463 27.112 3.279 26.668 3 26.285 L 1.3 23.965 C 0.457 22.816 0.002 21.428 0.002 20.003 C 0.002 18.578 0.457 17.19 1.3 16.04 L 3 13.72 C 3.28 13.338 3.465 12.893 3.537 12.425 L 3.975 9.575 C 4.192 8.168 4.852 6.866 5.859 5.859 C 6.866 4.852 8.167 4.192 9.575 3.975 L 12.422 3.538 C 12.89 3.465 13.335 3.28 13.717 3 L 16.037 1.3 C 17.187 0.457 18.575 0.003 20 0.003 C 21.425 0.003 22.813 0.457 23.962 1.3 Z M 18.257 4.32 L 15.94 6.02 C 15.068 6.658 14.057 7.077 12.99 7.243 L 10.147 7.678 C 9.527 7.773 8.953 8.064 8.51 8.508 C 8.066 8.951 7.775 9.525 7.68 10.145 L 7.245 12.985 C 7.079 14.052 6.66 15.064 6.022 15.935 L 4.322 18.255 C 3.952 18.761 3.753 19.371 3.753 19.998 C 3.753 20.624 3.952 21.235 4.322 21.74 L 6.022 24.058 C 6.662 24.928 7.082 25.94 7.245 27.008 L 7.68 29.85 C 7.875 31.123 8.875 32.123 10.147 32.318 L 12.987 32.753 C 14.054 32.919 15.066 33.338 15.937 33.975 L 18.257 35.675 C 19.292 36.438 20.705 36.438 21.742 35.675 L 24.06 33.975 C 24.931 33.338 25.943 32.919 27.01 32.753 L 29.852 32.318 C 30.473 32.222 31.046 31.932 31.49 31.488 C 31.934 31.044 32.224 30.471 32.32 29.85 L 32.755 27.01 C 32.92 25.943 33.34 24.932 33.977 24.06 L 35.677 21.74 C 36.047 21.235 36.247 20.624 36.247 19.998 C 36.247 19.371 36.047 18.761 35.677 18.255 L 33.977 15.938 C 33.34 15.066 32.92 14.055 32.755 12.988 L 32.32 10.145 C 32.224 9.525 31.934 8.951 31.49 8.508 C 31.046 8.064 30.473 7.773 29.852 7.678 L 27.012 7.243 C 25.945 7.077 24.934 6.658 24.062 6.02 L 21.742 4.32 C 21.237 3.95 20.626 3.751 20 3.751 C 19.373 3.751 18.763 3.95 18.257 4.32 Z M 28.2 16.95 L 18.825 26.325 C 18.473 26.676 17.997 26.874 17.5 26.874 C 17.003 26.874 16.526 26.676 16.175 26.325 L 11.8 21.95 C 11.468 21.595 11.287 21.125 11.296 20.639 C 11.304 20.153 11.501 19.689 11.845 19.345 C 12.188 19.002 12.652 18.805 13.138 18.796 C 13.624 18.788 14.094 18.969 14.45 19.3 L 17.5 22.35 L 25.55 14.3 C 25.905 13.969 26.375 13.788 26.861 13.796 C 27.347 13.805 27.811 14.002 28.155 14.345 C 28.498 14.689 28.695 15.153 28.704 15.639 C 28.712 16.125 28.531 16.595 28.2 16.95 Z" fill="rgb(255,255,255)"></path>
                  </g>
                </svg>
              </div>

              {/* Card Title */}
              <h3 
                className="absolute text-white font-medium"
                style={{
                  top: '20px',
                  left: '110px',
                  fontFamily: '"Inter Display", Inter, sans-serif',
                  fontSize: 'clamp(18px, 3vw, 25px)',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  whiteSpace: 'pre',
                  width: 'calc(100% - 130px)',
                  maxWidth: '418px'
                }}
              >
                Instant RFQs, Smarter Quotes
              </h3>

              {/* Card Description */}
              <p 
                className="absolute text-gray-300"
                style={{
                  top: '60px',
                  left: '110px',
                  width: 'calc(100% - 130px)',
                  maxWidth: '418px',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: '500',
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word'
                }}
              >
                Post your requirements and receive competitive quotes from trusted manufacturers across India - faster, fairer, and completely transparent.
              </p>

              {/* Decorative Rectangle */}
              <div 
                className="absolute border border-black rounded-lg bg-white"
                style={{
                  bottom: '0px',
                  right: '6px',
                  width: '110px',
                  height: '45px'
                }}
              >
                <div 
                  className="absolute bg-black"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '76px',
                    height: '2px'
                  }}
                />
              </div>
            </div>

            {/* Card 4: A Marketplace for Manufacturers */}
            <div 
              className="relative w-full max-w-[618px]"
              style={{
                height: '187px'
              }}
            >
              {/* Card Background SVG */}
              <svg 
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 617.229 186.851" 
                fill="none"
              >
                <path 
                  d="M 0 160.285 L 0 120.655 C 0 105.983 11.894 94.088 26.567 94.088 L 65.484 94.088 C 80.156 94.088 92.05 82.194 92.05 67.522 L 92.05 26.567 C 92.05 11.894 103.944 0 118.617 0 L 590.662 0 C 605.335 0 617.229 11.894 617.229 26.567 L 617.229 107.94 C 617.229 122.612 605.335 134.506 590.662 134.506 L 518.476 134.506 C 504.022 134.506 492.303 146.224 492.303 160.679 C 492.303 175.134 480.586 186.851 466.132 186.851 L 26.567 186.851 C 11.894 186.851 0 174.957 0 160.285 Z" 
                  fill="rgb(0, 0, 0)" 
                  stroke="rgb(0, 0, 0)" 
                  strokeWidth="0.89"
                />
              </svg>

              {/* Icon */}
              <div 
                className="absolute"
                style={{
                  top: '20px',
                  left: '20px',
                  width: '73px',
                  height: '73px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="73" height="73" fill="none">
                  <path d="M 36.5 73 C 16.342 73 0 56.658 0 36.5 L 0 36.5 C 0 16.342 16.342 0 36.5 0 L 36.5 0 C 56.658 0 73 16.342 73 36.5 L 73 36.5 C 73 56.658 56.658 73 36.5 73 Z" fill="rgb(0, 0, 0)"></path>
                  <g transform="translate(16.5 16.5)">
                    <path d="M 0 40 L 0 0 L 40 0 L 40 40 Z" fill="transparent"></path>
                    <path d="M 23.962 1.3 L 26.285 3 C 26.667 3.28 27.112 3.465 27.58 3.538 L 30.425 3.975 C 31.832 4.192 33.134 4.852 34.141 5.859 C 35.148 6.866 35.808 8.168 36.025 9.575 L 36.46 12.423 C 36.532 12.89 36.717 13.335 36.997 13.718 L 38.697 16.038 C 39.54 17.187 39.995 18.575 39.995 20 C 39.995 21.425 39.54 22.814 38.697 23.963 L 36.997 26.283 C 36.718 26.666 36.534 27.11 36.46 27.578 L 36.022 30.423 C 35.806 31.831 35.145 33.133 34.138 34.141 C 33.13 35.148 31.828 35.809 30.42 36.025 L 27.575 36.463 C 27.107 36.537 26.663 36.721 26.28 37 L 23.96 38.7 C 22.811 39.543 21.422 39.998 19.997 39.998 C 18.572 39.998 17.184 39.543 16.035 38.7 L 13.715 37 C 13.332 36.721 12.888 36.537 12.42 36.463 L 9.575 36.025 C 8.167 35.808 6.866 35.148 5.859 34.141 C 4.852 33.134 4.192 31.833 3.975 30.425 L 3.537 27.58 C 3.463 27.112 3.279 26.668 3 26.285 L 1.3 23.965 C 0.457 22.816 0.002 21.428 0.002 20.003 C 0.002 18.578 0.457 17.19 1.3 16.04 L 3 13.72 C 3.28 13.338 3.465 12.893 3.537 12.425 L 3.975 9.575 C 4.192 8.168 4.852 6.866 5.859 5.859 C 6.866 4.852 8.167 4.192 9.575 3.975 L 12.422 3.538 C 12.89 3.465 13.335 3.28 13.717 3 L 16.037 1.3 C 17.187 0.457 18.575 0.003 20 0.003 C 21.425 0.003 22.813 0.457 23.962 1.3 Z M 18.257 4.32 L 15.94 6.02 C 15.068 6.658 14.057 7.077 12.99 7.243 L 10.147 7.678 C 9.527 7.773 8.953 8.064 8.51 8.508 C 8.066 8.951 7.775 9.525 7.68 10.145 L 7.245 12.985 C 7.079 14.052 6.66 15.064 6.022 15.935 L 4.322 18.255 C 3.952 18.761 3.753 19.371 3.753 19.998 C 3.753 20.624 3.952 21.235 4.322 21.74 L 6.022 24.058 C 6.662 24.928 7.082 25.94 7.245 27.008 L 7.68 29.85 C 7.875 31.123 8.875 32.123 10.147 32.318 L 12.987 32.753 C 14.054 32.919 15.066 33.338 15.937 33.975 L 18.257 35.675 C 19.292 36.438 20.705 36.438 21.742 35.675 L 24.06 33.975 C 24.931 33.338 25.943 32.919 27.01 32.753 L 29.852 32.318 C 30.473 32.222 31.046 31.932 31.49 31.488 C 31.934 31.044 32.224 30.471 32.32 29.85 L 32.755 27.01 C 32.92 25.943 33.34 24.932 33.977 24.06 L 35.677 21.74 C 36.047 21.235 36.247 20.624 36.247 19.998 C 36.247 19.371 36.047 18.761 35.677 18.255 L 33.977 15.938 C 33.34 15.066 32.92 14.055 32.755 12.988 L 32.32 10.145 C 32.224 9.525 31.934 8.951 31.49 8.508 C 31.046 8.064 30.473 7.773 29.852 7.678 L 27.012 7.243 C 25.945 7.077 24.934 6.658 24.062 6.02 L 21.742 4.32 C 21.237 3.95 20.626 3.751 20 3.751 C 19.373 3.751 18.763 3.95 18.257 4.32 Z M 28.2 16.95 L 18.825 26.325 C 18.473 26.676 17.997 26.874 17.5 26.874 C 17.003 26.874 16.526 26.676 16.175 26.325 L 11.8 21.95 C 11.468 21.595 11.287 21.125 11.296 20.639 C 11.304 20.153 11.501 19.689 11.845 19.345 C 12.188 19.002 12.652 18.805 13.138 18.796 C 13.624 18.788 14.094 18.969 14.45 19.3 L 17.5 22.35 L 25.55 14.3 C 25.905 13.969 26.375 13.788 26.861 13.796 C 27.347 13.805 27.811 14.002 28.155 14.345 C 28.498 14.689 28.695 15.153 28.704 15.639 C 28.712 16.125 28.531 16.595 28.2 16.95 Z" fill="rgb(255,255,255)"></path>
                  </g>
                </svg>
              </div>

              {/* Card Title */}
              <h3 
                className="absolute text-white font-medium"
                style={{
                  top: '20px',
                  left: '110px',
                  fontFamily: '"Inter Display", Inter, sans-serif',
                  fontSize: 'clamp(18px, 3vw, 25px)',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  whiteSpace: 'pre',
                  width: 'calc(100% - 130px)',
                  maxWidth: '418px'
                }}
              >
                A Marketplace for Manufacturers
              </h3>

              {/* Card Description */}
              <p 
                className="absolute text-gray-300"
                style={{
                  top: '60px',
                  left: '110px',
                  width: 'calc(100% - 130px)',
                  maxWidth: '418px',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: '500',
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word'
                }}
              >
                Get discovered by the right buyers and businesses through a targeted digital platform - designed exclusively for Indian manufacturers.
              </p>

              {/* Decorative Rectangle */}
              <div 
                className="absolute border border-black rounded-lg bg-white"
                style={{
                  bottom: '0px',
                  right: '6px',
                  width: '110px',
                  height: '45px'
                }}
              >
                <div 
                  className="absolute bg-black"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '76px',
                    height: '2px'
                  }}
                />
              </div>
            </div>

            {/* Card 5: Find Vendors in Minutes, Not Months */}
            <div 
              className="relative w-full max-w-[618px]"
              style={{
                height: '187px'
              }}
            >
              {/* Card Background SVG */}
              <svg 
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 617.229 186.851" 
                fill="none"
              >
                <path 
                  d="M 0 160.285 L 0 120.655 C 0 105.983 11.894 94.088 26.567 94.088 L 65.484 94.088 C 80.156 94.088 92.05 82.194 92.05 67.522 L 92.05 26.567 C 92.05 11.894 103.944 0 118.617 0 L 590.662 0 C 605.335 0 617.229 11.894 617.229 26.567 L 617.229 107.94 C 617.229 122.612 605.335 134.506 590.662 134.506 L 518.476 134.506 C 504.022 134.506 492.303 146.224 492.303 160.679 C 492.303 175.134 480.586 186.851 466.132 186.851 L 26.567 186.851 C 11.894 186.851 0 174.957 0 160.285 Z" 
                  fill="rgb(0, 0, 0)" 
                  stroke="rgb(0, 0, 0)" 
                  strokeWidth="0.89"
                />
              </svg>

              {/* Icon */}
              <div 
                className="absolute"
                style={{
                  top: '20px',
                  left: '20px',
                  width: '73px',
                  height: '73px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="73" height="73" fill="none">
                  <path d="M 36.5 73 C 16.342 73 0 56.658 0 36.5 L 0 36.5 C 0 16.342 16.342 0 36.5 0 L 36.5 0 C 56.658 0 73 16.342 73 36.5 L 73 36.5 C 73 56.658 56.658 73 36.5 73 Z" fill="rgb(0, 0, 0)"></path>
                  <g transform="translate(16.5 16.5)">
                    <path d="M 0 40 L 0 0 L 40 0 L 40 40 Z" fill="transparent"></path>
                    <path d="M 23.962 1.3 L 26.285 3 C 26.667 3.28 27.112 3.465 27.58 3.538 L 30.425 3.975 C 31.832 4.192 33.134 4.852 34.141 5.859 C 35.148 6.866 35.808 8.168 36.025 9.575 L 36.46 12.423 C 36.532 12.89 36.717 13.335 36.997 13.718 L 38.697 16.038 C 39.54 17.187 39.995 18.575 39.995 20 C 39.995 21.425 39.54 22.814 38.697 23.963 L 36.997 26.283 C 36.718 26.666 36.534 27.11 36.46 27.578 L 36.022 30.423 C 35.806 31.831 35.145 33.133 34.138 34.141 C 33.13 35.148 31.828 35.809 30.42 36.025 L 27.575 36.463 C 27.107 36.537 26.663 36.721 26.28 37 L 23.96 38.7 C 22.811 39.543 21.422 39.998 19.997 39.998 C 18.572 39.998 17.184 39.543 16.035 38.7 L 13.715 37 C 13.332 36.721 12.888 36.537 12.42 36.463 L 9.575 36.025 C 8.167 35.808 6.866 35.148 5.859 34.141 C 4.852 33.134 4.192 31.833 3.975 30.425 L 3.537 27.58 C 3.463 27.112 3.279 26.668 3 26.285 L 1.3 23.965 C 0.457 22.816 0.002 21.428 0.002 20.003 C 0.002 18.578 0.457 17.19 1.3 16.04 L 3 13.72 C 3.28 13.338 3.465 12.893 3.537 12.425 L 3.975 9.575 C 4.192 8.168 4.852 6.866 5.859 5.859 C 6.866 4.852 8.167 4.192 9.575 3.975 L 12.422 3.538 C 12.89 3.465 13.335 3.28 13.717 3 L 16.037 1.3 C 17.187 0.457 18.575 0.003 20 0.003 C 21.425 0.003 22.813 0.457 23.962 1.3 Z M 18.257 4.32 L 15.94 6.02 C 15.068 6.658 14.057 7.077 12.99 7.243 L 10.147 7.678 C 9.527 7.773 8.953 8.064 8.51 8.508 C 8.066 8.951 7.775 9.525 7.68 10.145 L 7.245 12.985 C 7.079 14.052 6.66 15.064 6.022 15.935 L 4.322 18.255 C 3.952 18.761 3.753 19.371 3.753 19.998 C 3.753 20.624 3.952 21.235 4.322 21.74 L 6.022 24.058 C 6.662 24.928 7.082 25.94 7.245 27.008 L 7.68 29.85 C 7.875 31.123 8.875 32.123 10.147 32.318 L 12.987 32.753 C 14.054 32.919 15.066 33.338 15.937 33.975 L 18.257 35.675 C 19.292 36.438 20.705 36.438 21.742 35.675 L 24.06 33.975 C 24.931 33.338 25.943 32.919 27.01 32.753 L 29.852 32.318 C 30.473 32.222 31.046 31.932 31.49 31.488 C 31.934 31.044 32.224 30.471 32.32 29.85 L 32.755 27.01 C 32.92 25.943 33.34 24.932 33.977 24.06 L 35.677 21.74 C 36.047 21.235 36.247 20.624 36.247 19.998 C 36.247 19.371 36.047 18.761 35.677 18.255 L 33.977 15.938 C 33.34 15.066 32.92 14.055 32.755 12.988 L 32.32 10.145 C 32.224 9.525 31.934 8.951 31.49 8.508 C 31.046 8.064 30.473 7.773 29.852 7.678 L 27.012 7.243 C 25.945 7.077 24.934 6.658 24.062 6.02 L 21.742 4.32 C 21.237 3.95 20.626 3.751 20 3.751 C 19.373 3.751 18.763 3.95 18.257 4.32 Z M 28.2 16.95 L 18.825 26.325 C 18.473 26.676 17.997 26.874 17.5 26.874 C 17.003 26.874 16.526 26.676 16.175 26.325 L 11.8 21.95 C 11.468 21.595 11.287 21.125 11.296 20.639 C 11.304 20.153 11.501 19.689 11.845 19.345 C 12.188 19.002 12.652 18.805 13.138 18.796 C 13.624 18.788 14.094 18.969 14.45 19.3 L 17.5 22.35 L 25.55 14.3 C 25.905 13.969 26.375 13.788 26.861 13.796 C 27.347 13.805 27.811 14.002 28.155 14.345 C 28.498 14.689 28.695 15.153 28.704 15.639 C 28.712 16.125 28.531 16.595 28.2 16.95 Z" fill="rgb(255,255,255)"></path>
                  </g>
                </svg>
              </div>

              {/* Card Title */}
              <h3 
                className="absolute text-white font-medium"
                style={{
                  top: '20px',
                  left: '110px',
                  fontFamily: '"Inter Display", Inter, sans-serif',
                  fontSize: 'clamp(18px, 3vw, 25px)',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  whiteSpace: 'pre',
                  width: 'calc(100% - 130px)',
                  maxWidth: '418px'
                }}
              >
                Find Vendors in Minutes, Not Months
              </h3>

              {/* Card Description */}
              <p 
                className="absolute text-gray-300"
                style={{
                  top: '60px',
                  left: '110px',
                  width: 'calc(100% - 130px)',
                  maxWidth: '418px',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: '500',
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word'
                }}
              >
                Easily search by location, materials, manufacturing type, or finished product - compare profiles, certifications, and capabilities at a glance.
              </p>

              {/* Decorative Rectangle */}
              <div 
                className="absolute border border-black rounded-lg bg-white"
                style={{
                  bottom: '0px',
                  right: '6px',
                  width: '110px',
                  height: '45px'
                }}
              >
                <div 
                  className="absolute bg-black"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '76px',
                    height: '2px'
                  }}
                />
              </div>
            </div>

            {/* Card 6: One-Click Digital Business Card */}
            <div 
              className="relative w-full max-w-[618px]"
              style={{
                height: '187px'
              }}
            >
              {/* Card Background SVG */}
              <svg 
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 617.229 186.851" 
                fill="none"
              >
                <path 
                  d="M 0 160.285 L 0 120.655 C 0 105.983 11.894 94.088 26.567 94.088 L 65.484 94.088 C 80.156 94.088 92.05 82.194 92.05 67.522 L 92.05 26.567 C 92.05 11.894 103.944 0 118.617 0 L 590.662 0 C 605.335 0 617.229 11.894 617.229 26.567 L 617.229 107.94 C 617.229 122.612 605.335 134.506 590.662 134.506 L 518.476 134.506 C 504.022 134.506 492.303 146.224 492.303 160.679 C 492.303 175.134 480.586 186.851 466.132 186.851 L 26.567 186.851 C 11.894 186.851 0 174.957 0 160.285 Z" 
                  fill="rgb(0, 0, 0)" 
                  stroke="rgb(0, 0, 0)" 
                  strokeWidth="0.89"
                />
              </svg>

              {/* Icon */}
              <div 
                className="absolute"
                style={{
                  top: '20px',
                  left: '20px',
                  width: '73px',
                  height: '73px'
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="73" height="73" fill="none">
                  <path d="M 36.5 73 C 16.342 73 0 56.658 0 36.5 L 0 36.5 C 0 16.342 16.342 0 36.5 0 L 36.5 0 C 56.658 0 73 16.342 73 36.5 L 73 36.5 C 73 56.658 56.658 73 36.5 73 Z" fill="rgb(0, 0, 0)"></path>
                  <g transform="translate(16.5 16.5)">
                    <path d="M 0 40 L 0 0 L 40 0 L 40 40 Z" fill="transparent"></path>
                    <path d="M 23.962 1.3 L 26.285 3 C 26.667 3.28 27.112 3.465 27.58 3.538 L 30.425 3.975 C 31.832 4.192 33.134 4.852 34.141 5.859 C 35.148 6.866 35.808 8.168 36.025 9.575 L 36.46 12.423 C 36.532 12.89 36.717 13.335 36.997 13.718 L 38.697 16.038 C 39.54 17.187 39.995 18.575 39.995 20 C 39.995 21.425 39.54 22.814 38.697 23.963 L 36.997 26.283 C 36.718 26.666 36.534 27.11 36.46 27.578 L 36.022 30.423 C 35.806 31.831 35.145 33.133 34.138 34.141 C 33.13 35.148 31.828 35.809 30.42 36.025 L 27.575 36.463 C 27.107 36.537 26.663 36.721 26.28 37 L 23.96 38.7 C 22.811 39.543 21.422 39.998 19.997 39.998 C 18.572 39.998 17.184 39.543 16.035 38.7 L 13.715 37 C 13.332 36.721 12.888 36.537 12.42 36.463 L 9.575 36.025 C 8.167 35.808 6.866 35.148 5.859 34.141 C 4.852 33.134 4.192 31.833 3.975 30.425 L 3.537 27.58 C 3.463 27.112 3.279 26.668 3 26.285 L 1.3 23.965 C 0.457 22.816 0.002 21.428 0.002 20.003 C 0.002 18.578 0.457 17.19 1.3 16.04 L 3 13.72 C 3.28 13.338 3.465 12.893 3.537 12.425 L 3.975 9.575 C 4.192 8.168 4.852 6.866 5.859 5.859 C 6.866 4.852 8.167 4.192 9.575 3.975 L 12.422 3.538 C 12.89 3.465 13.335 3.28 13.717 3 L 16.037 1.3 C 17.187 0.457 18.575 0.003 20 0.003 C 21.425 0.003 22.813 0.457 23.962 1.3 Z M 18.257 4.32 L 15.94 6.02 C 15.068 6.658 14.057 7.077 12.99 7.243 L 10.147 7.678 C 9.527 7.773 8.953 8.064 8.51 8.508 C 8.066 8.951 7.775 9.525 7.68 10.145 L 7.245 12.985 C 7.079 14.052 6.66 15.064 6.022 15.935 L 4.322 18.255 C 3.952 18.761 3.753 19.371 3.753 19.998 C 3.753 20.624 3.952 21.235 4.322 21.74 L 6.022 24.058 C 6.662 24.928 7.082 25.94 7.245 27.008 L 7.68 29.85 C 7.875 31.123 8.875 32.123 10.147 32.318 L 12.987 32.753 C 14.054 32.919 15.066 33.338 15.937 33.975 L 18.257 35.675 C 19.292 36.438 20.705 36.438 21.742 35.675 L 24.06 33.975 C 24.931 33.338 25.943 32.919 27.01 32.753 L 29.852 32.318 C 30.473 32.222 31.046 31.932 31.49 31.488 C 31.934 31.044 32.224 30.471 32.32 29.85 L 32.755 27.01 C 32.92 25.943 33.34 24.932 33.977 24.06 L 35.677 21.74 C 36.047 21.235 36.247 20.624 36.247 19.998 C 36.247 19.371 36.047 18.761 35.677 18.255 L 33.977 15.938 C 33.34 15.066 32.92 14.055 32.755 12.988 L 32.32 10.145 C 32.224 9.525 31.934 8.951 31.49 8.508 C 31.046 8.064 30.473 7.773 29.852 7.678 L 27.012 7.243 C 25.945 7.077 24.934 6.658 24.062 6.02 L 21.742 4.32 C 21.237 3.95 20.626 3.751 20 3.751 C 19.373 3.751 18.763 3.95 18.257 4.32 Z M 28.2 16.95 L 18.825 26.325 C 18.473 26.676 17.997 26.874 17.5 26.874 C 17.003 26.874 16.526 26.676 16.175 26.325 L 11.8 21.95 C 11.468 21.595 11.287 21.125 11.296 20.639 C 11.304 20.153 11.501 19.689 11.845 19.345 C 12.188 19.002 12.652 18.805 13.138 18.796 C 13.624 18.788 14.094 18.969 14.45 19.3 L 17.5 22.35 L 25.55 14.3 C 25.905 13.969 26.375 13.788 26.861 13.796 C 27.347 13.805 27.811 14.002 28.155 14.345 C 28.498 14.689 28.695 15.153 28.704 15.639 C 28.712 16.125 28.531 16.595 28.2 16.95 Z" fill="rgb(255,255,255)"></path>
                  </g>
                </svg>
              </div>

              {/* Card Title */}
              <h3 
                className="absolute text-white font-medium"
                style={{
                  top: '20px',
                  left: '110px',
                  fontFamily: '"Inter Display", Inter, sans-serif',
                  fontSize: 'clamp(18px, 3vw, 25px)',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  whiteSpace: 'pre',
                  width: 'calc(100% - 130px)',
                  maxWidth: '418px'
                }}
              >
                One-Click Digital Business Card
              </h3>

              {/* Card Description */}
              <p 
                className="absolute text-gray-300"
                style={{
                  top: '60px',
                  left: '110px',
                  width: 'calc(100% - 130px)',
                  maxWidth: '418px',
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: '500',
                  fontSize: 'clamp(14px, 2vw, 16px)',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  wordBreak: 'break-word'
                }}
              >
                Generate a sleek, shareable business card right from your profile - download or send it instantly to clients and vendors, anytime.
              </p>

              {/* Decorative Rectangle */}
              <div 
                className="absolute border border-black rounded-lg bg-white"
                style={{
                  bottom: '0px',
                  right: '6px',
                  width: '110px',
                  height: '45px'
                }}
              >
                <div 
                  className="absolute bg-black"
                  style={{
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '76px',
                    height: '2px'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section 
        className="relative bg-black overflow-hidden px-4 md:px-10 lg:px-10 py-16 md:py-20 lg:py-24"
        style={{
          minHeight: '100vh',
          padding: '100px 40px'
        }}
      >
        {/* Container */}
        <div 
          className="relative flex flex-col items-start max-w-7xl mx-auto"
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
              className="relative"
              style={{
                width: 'fit-content',
                height: 'fit-content'
              }}
            >
              <span 
                className="text-white uppercase tracking-wider"
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
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
              gap: '60px'
            }}
          >
            {/* Left Side - Contact Info */}
            <div 
              className="flex flex-col justify-between items-start w-full lg:w-auto"
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
              className="flex justify-start items-start w-full lg:flex-1"
              style={{
                gap: '12px'
              }}
            >
              {/* Form Container */}
              <div 
                className="w-full bg-white rounded-lg border border-gray-200 p-6"
                style={{
                  gap: '10px',
                  maxWidth: '700px',
                  minWidth: '500px'
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
        className="relative bg-black overflow-hidden px-2 md:px-8 lg:px-8 py-8 md:py-10 lg:py-10"
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
              gap: '480px'
            }}
          >
            {/* Left Stack - Logo */}
            <div 
              className="flex flex-col items-start"
              style={{
                gap: '383px'
              }}
            >
              {/* Logo */}
              <div 
                className="flex items-center"
                style={{
                  width: '200px',
                  height: '100px',
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
              className="flex flex-col items-end"
              style={{
                width: '37%',
                gap: '10px'
              }}
            >
              {/* Join Us Now Title */}
              <h3 
                className="text-white font-medium"
                style={{
                  fontFamily: '"Inter Display", Inter, sans-serif',
                  fontSize: '32px',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  whiteSpace: 'pre'
                }}
              >
                Join Us Now
              </h3>

              {/* Description Text */}
              <p 
                className="text-white text-right"
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontWeight: '500',
                  fontSize: '20px',
                  letterSpacing: '0em',
                  lineHeight: '1.2',
                  width: '403px',
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
          className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
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
          <div className="relative rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
            <RegistrationForm onClose={() => setShowRegistration(false)} />
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div 
          className="fixed inset-0 flex items-center justify-center p-4 z-50 backdrop-blur-sm"
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
          <div className="relative rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700 bg-gray-900/90 backdrop-blur-sm">
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
