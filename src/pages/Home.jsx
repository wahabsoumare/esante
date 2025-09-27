import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import Presentation from '../components/Presentation'
import WhyUs from '../components/WhyUs'
import Specialties from '../components/Specialties'
import Testimonials from '../components/Testimonials'
import Packs from '../components/Packs'
import Events from '../components/Events'
import CTA from '../components/CTA'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <div>
      <Navbar />
      <Hero />
      <Presentation />
      <WhyUs />
      <Specialties />
      <Testimonials />
      <Packs />
      <Events />
      <CTA />
      <Footer />
    </div>
  )
}
