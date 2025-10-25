import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Navbar from './Navbar'

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }
const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1 } }

const CompanyProfile = ({ companyId, user, onLogout, onUpdateUser }) => {
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      try {
        const token = localStorage.getItem('token')
        const response = await fetch(`http://localhost:3000/api/companies/${companyId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.ok) {
          const data = await response.json()
          console.log('Company data received:', data.data)
          console.log('Company avatar:', data.data.avatar)
          console.log('Company plantImages:', data.data.plantImages)
          setCompany(data.data)
        } else {
          setError('Company not found')
        }
      } catch (err) {
        setError('Failed to load company profile')
      } finally {
        setLoading(false)
      }
    }

    if (companyId) {
      fetchCompanyProfile()
    }
  }, [companyId])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white font-montserrat">
      <div className="w-full mx-auto px-6 md:px-10">
        <Navbar 
          user={user} 
          onLogout={onLogout} 
          onUpdateUser={onUpdateUser} 
          showDebugButtons={false}
        />
        <Hero company={company} />
        <About company={company} />
        <Vendors company={company} />
        <Stats company={company} />
        <ProcessCategories />
        <Services />
        <Certifications />
        <Gallery company={company} />
        <Team />
        <Testimonials />
        <Contact company={company} />
        <Footer />
      </div>
    </div>
  )
}

function Hero({ company }) {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto pt-8 pb-12">
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <motion.div variants={fadeUp} className="md:col-span-2">
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                {company?.companyName || 'Company Name'}
              </h1>
              <p className="text-lg text-gray-300 leading-relaxed">
                {company?.companyDescription || 'Company description goes here...'}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-[#FC6500] text-black px-5 py-2 rounded-md font-semibold">View Materials</button>
              <button className="border border-gray-700 px-5 py-2 rounded-md">Get Quote</button>
            </div>
          </div>
        </motion.div>

        <motion.aside variants={fadeUp} className="flex justify-center">
          {company?.avatar && company.avatar.url ? (
            <img 
              src={company.avatar.url} 
              alt={`${company.companyName} logo`}
              className="w-56 h-56 object-contain"
            />
          ) : (
            <img 
              src="/madevize.svg" 
              alt="Default logo"
              className="w-32 h-32"
            />
          )}
        </motion.aside>
      </div>
    </motion.section>
  )
}

function About({ company }) {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-16">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <motion.div variants={fadeUp}>
          <h2 className="text-3xl font-bold text-white mb-6">About Us</h2>
          <p className="text-gray-300 leading-relaxed">
            {company?.companyDescription || 'We are a leading manufacturing company specializing in precision engineering and innovative solutions.'}
          </p>
        </motion.div>
        <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">Experience</h3>
            <p className="text-gray-300">20+ Years</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-white mb-2">Projects</h3>
            <p className="text-gray-300">500+</p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  )
}

function Vendors({ company }) {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-16">
      <motion.div variants={fadeUp} className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Our Vendors</h2>
        <p className="text-gray-300">Trusted partners and suppliers</p>
      </motion.div>
      
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {company?.vendors?.slice(0, 8).map((vendor, index) => (
          <div key={index} className="bg-gray-800 p-4 rounded-lg text-center">
            <h3 className="text-white font-semibold">{vendor}</h3>
          </div>
        )) || (
          <div className="col-span-full text-center text-gray-400">
            No vendors listed
          </div>
        )}
      </motion.div>
    </motion.section>
  )
}

function Stats({ company }) {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-16">
      <motion.div variants={fadeUp} className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="text-center">
          <h3 className="text-3xl font-bold text-[#FC6500] mb-2">500+</h3>
          <p className="text-gray-300">Projects Completed</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-[#FC6500] mb-2">20+</h3>
          <p className="text-gray-300">Years Experience</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-[#FC6500] mb-2">50+</h3>
          <p className="text-gray-300">Team Members</p>
        </div>
        <div className="text-center">
          <h3 className="text-3xl font-bold text-[#FC6500] mb-2">99%</h3>
          <p className="text-gray-300">Client Satisfaction</p>
        </div>
      </motion.div>
    </motion.section>
  )
}

function ProcessCategories() {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-16">
      <motion.div variants={fadeUp} className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Our Process Categories</h2>
        <p className="text-gray-300">Comprehensive manufacturing solutions</p>
      </motion.div>
      
      <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-8">
        <div className="bg-gray-800 p-8 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Machining</h3>
          <p className="text-gray-300">Precision machining services for complex components</p>
        </div>
        <div className="bg-gray-800 p-8 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Fabrication</h3>
          <p className="text-gray-300">Custom fabrication solutions for various industries</p>
        </div>
        <div className="bg-gray-800 p-8 rounded-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Assembly</h3>
          <p className="text-gray-300">Complete assembly services for finished products</p>
        </div>
      </motion.div>
    </motion.section>
  )
}

function Services() {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-16">
      <motion.div variants={fadeUp} className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Our Services</h2>
        <p className="text-gray-300">Comprehensive manufacturing solutions</p>
      </motion.div>
      
      <motion.div variants={fadeUp} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">CNC Machining</h3>
          <p className="text-gray-300">Precision CNC machining for complex parts</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Welding</h3>
          <p className="text-gray-300">Professional welding services</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-lg font-semibold text-white mb-3">Quality Control</h3>
          <p className="text-gray-300">Comprehensive quality assurance</p>
        </div>
      </motion.div>
    </motion.section>
  )
}

function Certifications() {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-16">
      <motion.div variants={fadeUp} className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Certifications</h2>
        <p className="text-gray-300">Industry recognized certifications</p>
      </motion.div>
      
      <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-white mb-2">ISO 9001</h3>
          <p className="text-gray-300">Quality Management</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-white mb-2">AS9100</h3>
          <p className="text-gray-300">Aerospace Quality</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg text-center">
          <h3 className="text-lg font-semibold text-white mb-2">ISO 14001</h3>
          <p className="text-gray-300">Environmental Management</p>
        </div>
      </motion.div>
    </motion.section>
  )
}

function Gallery({ company }) {
  // Only show plant images in gallery
  const plantImages = [];
  
  console.log('Gallery - Company data:', company);
  console.log('Gallery - Plant Images:', company?.plantImages);
  
  // Add plant images if they exist
  if (company?.plantImages && company.plantImages.length > 0) {
    console.log('Processing plant images:', company.plantImages);
    company.plantImages.forEach((image, index) => {
      console.log(`Plant image ${index}:`, image);
      if (image.url) {
        plantImages.push({
          url: image.url,
          type: 'plant',
          alt: `Plant image ${index + 1}`
        });
      }
    });
  }
  
  console.log('Plant images for gallery:', plantImages);

  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-16">
      <motion.div variants={fadeUp} className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Our Gallery</h2>
        <p className="text-gray-300">See our work in action</p>
      </motion.div>
      
      {plantImages.length > 0 ? (
        <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-6">
          {plantImages.map((image, index) => (
            <div key={index} className="relative group bg-gray-800 rounded-lg overflow-hidden h-48">
              <img 
                src={image.url} 
                onLoad={() => console.log('Plant image loaded successfully:', image.url)}
                onError={(e) => {
                  console.error('Plant image failed to load:', image.url);
                  e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzc0MTUxIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkZhaWxlZCB0byBsb2FkPC90ZXh0Pjwvc3ZnPg==';
                }}
              />

            </div>
          ))}
        </motion.div>
      ) : (
        <motion.div variants={fadeUp} className="text-center">
          <div className="bg-gray-800 h-48 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">No images uploaded yet</span>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            <p>Debug: Plant images count: {company?.plantImages?.length || 0}</p>
            {company?.plantImages && company.plantImages.length > 0 && (
              <div className="mt-4">
                <p>First plant image URL: {company.plantImages[0].url}</p>
                <div className="mt-2">
                  <p className="text-white mb-2">Test Image (should display below):</p>
                  <img 
                    src={company.plantImages[0].url} 
                    alt="Test plant" 
                    className="w-32 h-32 object-cover rounded border-2 border-white"
                    onLoad={() => console.log('Test plant image loaded successfully')}
                    onError={() => console.log('Test plant image failed to load')}
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </motion.section>
  )
}

function Team() {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-16">
      <motion.div variants={fadeUp} className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Our Team</h2>
        <p className="text-gray-300">Meet the experts behind our success</p>
      </motion.div>
      
      <motion.div variants={fadeUp} className="grid md:grid-cols-3 gap-8">
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-white mb-2">John Doe</h3>
          <p className="text-gray-300">CEO & Founder</p>
        </div>
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-white mb-2">Jane Smith</h3>
          <p className="text-gray-300">Operations Manager</p>
        </div>
        <div className="text-center">
          <div className="w-24 h-24 bg-gray-700 rounded-full mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-white mb-2">Mike Johnson</h3>
          <p className="text-gray-300">Lead Engineer</p>
        </div>
      </motion.div>
    </motion.section>
  )
}

function Testimonials() {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-16">
      <motion.div variants={fadeUp} className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Client Testimonials</h2>
        <p className="text-gray-300">What our clients say about us</p>
      </motion.div>
      
      <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-300 mb-4">"Excellent work and professional service. Highly recommended!"</p>
          <p className="text-white font-semibold">- Client Name</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg">
          <p className="text-gray-300 mb-4">"Outstanding quality and timely delivery. Will work with them again."</p>
          <p className="text-white font-semibold">- Another Client</p>
        </div>
      </motion.div>
    </motion.section>
  )
}

function Contact({ company }) {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="max-w-6xl mx-auto py-16">
      <motion.div variants={fadeUp} className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Contact Us</h2>
        <p className="text-gray-300">Get in touch for your next project</p>
      </motion.div>
      
      <motion.div variants={fadeUp} className="grid md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Get in Touch</h3>
          <div className="space-y-4">
            <p className="text-gray-300">
              <span className="font-semibold">Email:</span> {company?.email || 'contact@company.com'}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Phone:</span> {company?.phone || '+1 (555) 123-4567'}
            </p>
            <p className="text-gray-300">
              <span className="font-semibold">Address:</span> {company?.address || '123 Manufacturing St, City, State 12345'}
            </p>
          </div>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">Send Message</h3>
          <form className="space-y-4">
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
            />
            <textarea 
              placeholder="Your Message" 
              rows="4"
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
            ></textarea>
            <button className="w-full bg-[#FC6500] text-black py-3 rounded-lg font-semibold">
              Send Message
            </button>
          </form>
        </div>
      </motion.div>
    </motion.section>
  )
}

function Footer() {
  return (
    <footer className="max-w-6xl mx-auto bg-gray-900 py-8 mt-16">
      <div className="text-center">
        <p className="text-gray-400">&copy; 2024 Madevize. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default CompanyProfile
