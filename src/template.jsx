import React from "react";
import { motion } from "framer-motion";

// Landing page for Shyaam Industries — rebuilt from Figma design + CSS
// Responsive, animated, uses Tailwind + Framer Motion + Google Fonts

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };
const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1 } };

export default function App() {
  return (
    <div className="min-h-screen bg-black text-white font-montserrat">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10">
        <Header />
        <Hero />
        <About />
        <Vendors />
        <Stats />
        <ProcessCategories />
        <Services />
        <Certifications />
        <Gallery />
        <Team />
        <Testimonials />
        <Contact />
        <Footer />
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="text-3xl font-baloo">madevize</div>
      <nav className="hidden md:flex gap-4">
        <button className="px-4 py-2 rounded-full bg-[#363636]">About Us</button>
        <button className="px-4 py-2 rounded-full bg-[#363636]">Services</button>
        <button className="px-4 py-2 rounded-full bg-[#363636]">Contact</button>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <motion.section initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="pt-8 pb-12">
      <div className="grid md:grid-cols-3 gap-8 items-start">
        <motion.div variants={fadeUp} className="md:col-span-2">
          <h1 className="text-4xl md:text-[64px] leading-tight font-semibold">Shyaam Industries Pvt. Ltd.</h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-gray-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 11c1.657 0 3-1.343 3-3S13.657 5 12 5 9 6.343 9 8s1.343 3 3 3z"/><path strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" d="M12 22s8-4.5 8-11a8 8 0 10-16 0c0 6.5 8 11 8 11z"/></svg>
            <span>Gurugram, Haryana</span>
          </div>
          <p className="mt-8 text-gray-400 max-w-[720px]">
            Shyaam Industries is a precision engineering company specializing in the design, manufacture, and supply of high-performance mechanical components.
          </p>
          <div className="mt-8 flex gap-4">
            <button className="bg-[#FC6500] text-black px-5 py-2 rounded-md font-semibold">View Materials</button>
            <button className="border border-gray-700 px-5 py-2 rounded-md">Get Quote</button>
          </div>
        </motion.div>

        <motion.aside variants={fadeUp} className="bg-[rgba(33,33,33,0.35)] p-6 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center font-bold">⚙️</div>
            <div>
              <div className="font-semibold">Shyaam Industries</div>
              <div className="text-sm text-gray-400">Manufacturing • Machining • Fabrication</div>
            </div>
          </div>
          <div className="mt-2 text-sm text-gray-400">Established 1998 — Trusted by OEM partners</div>
        </motion.aside>
      </div>
    </motion.section>
  );
}

function About() {
  return (
    <section className="py-10">
      <div className="bg-[rgba(33,33,33,0.35)] p-10 rounded-[30px]">
        <motion.h2 initial="hidden" whileInView="show" variants={fadeUp} className="text-center text-3xl md:text-[36px] font-semibold">
          From concept to creation, we deliver mechanical components built to perform under pressure and crafted for excellence
        </motion.h2>
        <div className="mt-8 grid md:grid-cols-2 gap-8 text-gray-400">
          <p>
            Our USP lies in consistent precision, material integrity, and adaptive production, empowering businesses worldwide.
          </p>
          <p>
            We partner with OEMs and suppliers to provide end-to-end services from raw material sourcing to finished part delivery.
          </p>
        </div>
      </div>
    </section>
  );
}

function Vendors() {
  const vendors = ['MARUTI SUZUKI', 'BOSCH', 'TATA MOTORS', 'ASHOK LEYLAND'];
  return (
    <section className="py-10">
      <h3 className="text-xl font-semibold mb-4">Vendors We Supply</h3>
      <div className="flex gap-4 overflow-x-auto py-3">
        {vendors.map((v, i) => (
          <div key={i} className="min-w-[240px] border border-gray-700 rounded-2xl px-6 py-6 flex items-center justify-center text-sm">
            {v}
          </div>
        ))}
      </div>
    </section>
  );
}

function Stats() {
  const items = [
    { label: 'Experience', value: '25+' },
    { label: 'Established In', value: '1998' },
    { label: 'Parts Manufactured', value: '150M+' }
  ];
  return (
    <section className="py-12">
      <div className="flex flex-wrap gap-6 justify-center">
        {items.map((it, i) => (
          <div key={i} className="bg-[#0b0b0b] p-6 rounded-xl text-center min-w-[150px]">
            <div className="text-3xl font-semibold">{it.value}</div>
            <div className="text-gray-400 mt-2 text-sm">{it.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProcessCategories() {
  const cats = ['Raw Material', 'Machines', 'Mfg Process', 'Specializations'];
  return (
    <section className="py-8 flex gap-6 flex-wrap justify-center">
      {cats.map((c, i) => (
        <div key={i} className="bg-[#131313] px-5 py-4 rounded-lg text-sm font-medium">{c}</div>
      ))}
    </section>
  );
}

function Services() {
  const SERVICES = [
    { title: 'Product Design & Prototyping', desc: 'From CAD modelling to functional prototypes.' },
    { title: 'Precision Machining', desc: 'High-tolerance CNC turning and milling.' },
    { title: 'Casting & Forging', desc: 'Metal casting and high-pressure forging.' },
    { title: 'Fabrication & Welding', desc: 'Custom fabrication and robotic welding.' }
  ];
  return (
    <section id="services" className="py-12">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h3 className="text-[32px] font-semibold">Driving Innovation Through Expert Manufacturing Services</h3>
        <button className="border border-white rounded-full px-6 py-3">View All Services</button>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {SERVICES.map((s, idx) => (
          <motion.article initial="hidden" whileInView="show" variants={fadeUp} key={idx} className="bg-[#0c0c0c] rounded-xl p-6 flex gap-4">
            <div className="w-28 h-20 bg-gray-800 rounded-md flex items-center justify-center">Img</div>
            <div>
              <h4 className="font-semibold text-lg">{s.title}</h4>
              <p className="text-gray-400 mt-2">{s.desc}</p>
              <button className="text-xs border border-gray-700 px-3 py-1 rounded-full mt-4">Read More</button>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}

function Certifications() {
  const CERTS = [
    { title: 'ISO 9001', desc: 'Quality management system.' },
    { title: 'IATF 16949', desc: 'Automotive production standard.' },
    { title: 'AS9100 Rev D', desc: 'Aerospace industry compliance.' }
  ];
  return (
    <section className="py-12">
      <h3 className="text-[32px] font-semibold mb-6">Setting Global Standards in Quality & Precision</h3>
      <div className="flex gap-6 overflow-x-auto py-2">
        {CERTS.map((c, idx) => (
          <div key={idx} className="min-w-[320px] bg-[#0c0c0c] rounded-xl p-6">
            <div className="text-lg font-semibold">{c.title}</div>
            <p className="text-gray-400 mt-3">{c.desc}</p>
            <div className="mt-4 h-[140px] bg-gray-800 rounded-md flex items-center justify-center">Certificate</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Gallery() {
  return (
    <section className="py-12">
      <h3 className="text-[32px] font-semibold mb-6">Factory & Workshop Gallery</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-gray-900 rounded-lg flex items-end p-4">Workshop {i + 1}</div>
        ))}
      </div>
    </section>
  );
}

function Team() {
  const TEAM = [
    { name: 'Abhijeet Sinha', role: 'MD' },
    { name: 'Seemrat', role: 'Head - Operations' },
    { name: 'Rohan Mishra', role: 'Head - Sales' }
  ];
  return (
    <section className="py-12">
      <h3 className="text-[32px] font-semibold mb-6">The Faces Behind Precision and Performance</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {TEAM.map((t, i) => (
          <div key={i} className="bg-[#0c0c0c] rounded-xl p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-gray-800 mx-auto flex items-center justify-center">IMG</div>
            <div className="mt-4 font-semibold">{t.name}</div>
            <div className="text-gray-400 mt-1 text-sm">{t.role}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Testimonials() {
  const TESTIMONIALS = [
    { name: 'Rahul Sharma', title: 'Product Manager', quote: 'Great quality and on-time delivery.' },
    { name: "Leena D'Souza", title: 'Procurement', quote: 'Reliable supplier with excellent communication.' },
    { name: 'Vikram Kumar', title: 'Plant Head', quote: 'High tolerance parts, zero rework.' }
  ];
  return (
    <section className="py-12">
      <h3 className="text-[32px] font-semibold mb-6">Client Testimonials</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <blockquote key={i} className="bg-[#0b0b0b] rounded-xl p-6">
            <p className="text-gray-400">“{t.quote}”</p>
            <div className="mt-4 text-sm text-gray-500">— {t.name}, {t.title}</div>
          </blockquote>
        ))}
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="py-12">
      <h3 className="text-[32px] font-semibold mb-6">Get In Touch</h3>
      <div className="bg-[#0c0c0c] rounded-xl p-6 grid md:grid-cols-2 gap-6">
        <form className="space-y-4">
          <div>
            <label className="text-xs text-gray-400">Your Name</label>
            <input className="w-full mt-1 bg-transparent border border-gray-800 rounded px-3 py-2 text-white text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Your Email</label>
            <input className="w-full mt-1 bg-transparent border border-gray-800 rounded px-3 py-2 text-white text-sm" />
          </div>
          <div>
            <label className="text-xs text-gray-400">Message</label>
            <textarea className="w-full mt-1 bg-transparent border border-gray-800 rounded px-3 py-2 text-white text-sm h-28" />
          </div>
          <button type="submit" className="bg-[#FC6500] text-black px-4 py-2 rounded font-semibold">Send</button>
        </form>
        <div className="text-sm text-gray-400">
          <p className="mb-2">Shyaam Industries Pvt. Ltd.</p>
          <p className="mb-2">Email: contact@shyaam.example</p>
          <p className="mb-2">Phone: +91 9xxxxxxxxx</p>
          <p className="text-xs text-gray-500 mt-4">Office hours: Mon — Fri, 9:30 — 18:00</p>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-8 text-center text-sm text-gray-500">
      © {new Date().getFullYear()} Shyaam Industries Pvt. Ltd. All rights reserved.
    </footer>
  );
}
