import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import Lenis from 'lenis';
import { Menu, X, Phone, Mail, MapPin, ArrowRight, CheckCircle2 } from 'lucide-react';

// Custom Components
import { LiquidRipple } from './components/LiquidRipple';
import { ImageCursorTrail } from './components/ImageCursorTrail';
import { PoolCalculator } from './components/PoolCalculator';

// Aceternity Style Components
import { HeroParallax } from './components/HeroParallax';
import { ThreeDMarquee } from './components/ThreeDMarquee';
import Skiper3dCarousel from './components/Skiper3dCarousel';
import PricingCard from './components/PricingCard';
import { AnimatedTestimonials } from './components/AnimatedTestimonials';
import { MaskContainer } from './components/MaskContainer';
import { PinContainer } from './components/PinContainer';
import { BackgroundRippleEffect } from './components/BackgroundRippleEffect';
import { WorkGallery } from './components/WorkGallery';
import { Floating3DElement } from './components/Floating3DElement';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const IMAGES = [
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-alexander-f-ungerer-157458816-19830216.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-artbovich-8134746.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-artbovich-8134750.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-bertellifotografia-9056671.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-eric-mufasa-578798-1746876.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-jamily-chaves-136935520-14402819.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-jokassis-5515733.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-jonathanborba-5563468.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-jose-franco-2157655172-35015141.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-k3ithvision-27847373.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-mia-dalisay-594958-15948530.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-myburgh-2513972.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-ninobur-17410701.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-pixabay-261041.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-pixabay-261238.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-quirva-14540938.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-sarah-o-shea-98049248-26839223.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-vince-2876789.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-weickmann-32204695.jpg',
  'https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/pexels-wendywei-5306735.jpg',
];

const PRODUCTS = IMAGES.map((img, i) => ({
  title: `Pool ${i + 1}`,
  link: "#",
  thumbnail: img,
}));

const TESTIMONIALS = [
  {
    quote: "Tony has been maintaining our pool for 3 years. It's never looked better. He's reliable, professional, and great with our dogs.",
    name: "Sarah Jenkins",
    designation: "La Jolla Resident",
    src: IMAGES[0],
  },
  {
    quote: "The best pool service in San Diego. Tony is meticulous and always on time. Highly recommend Omni Pools for anyone who wants perfection.",
    name: "Michael Chen",
    designation: "Del Mar Homeowner",
    src: IMAGES[1],
  },
  {
    quote: "Crystal clear water every single week. Tony's attention to detail is unmatched. He really cares about his work.",
    name: "Emily Rodriguez",
    designation: "Point Loma Resident",
    src: IMAGES[2],
  },
];

const CAROUSEL_ITEMS = IMAGES.slice(5, 12).map((img, i) => ({
  title: `Pool ${i + 1}`,
  description: "San Diego Luxury Pool Maintenance",
  color: i % 2 === 0 ? "#00c2cb" : "#3dd9eb",
  src: img,
}));

export default function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      lerp: 0.1,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
      infinite: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Marquee Velocity
    const marquee = document.querySelector('.marquee-content');
    if (marquee) {
      const marqueeWidth = marquee.clientWidth;
      const tl = gsap.to('.marquee-content', {
        x: -marqueeWidth / 2,
        duration: 20,
        ease: 'none',
        repeat: -1,
      });

      ScrollTrigger.create({
        onUpdate: (self) => {
          const velocity = Math.abs(self.getVelocity());
          gsap.to(tl, { timeScale: 1 + velocity / 500, duration: 0.5 });
        }
      });
    }

    // Expand on Scroll
    gsap.to('.expand-image', {
      width: '100vw',
      height: '100vh',
      borderRadius: '0px',
      scrollTrigger: {
        trigger: '.expand-section',
        start: 'top bottom',
        end: 'center center',
        scrub: true,
      }
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-off-white overflow-x-hidden">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-[100] px-6 py-8 flex justify-between items-center mix-blend-difference text-foam">
        <div className="text-2xl font-black tracking-tighter uppercase">Omni Pools</div>
        <div className="hidden md:flex gap-12 text-xs font-bold uppercase tracking-widest">
          <a href="#about" className="hover:text-aqua transition-colors">About</a>
          <a href="#services" className="hover:text-aqua transition-colors">Services</a>
          <a href="#calculator" className="hover:text-aqua transition-colors">Calculator</a>
          <a href="#gallery" className="hover:text-aqua transition-colors">Gallery</a>
          <a href="#contact" className="hover:text-aqua transition-colors">Contact</a>
        </div>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[150] bg-navy flex flex-col items-center justify-center gap-8 text-foam text-4xl font-black uppercase tracking-tighter">
          <button onClick={() => setIsMenuOpen(false)} className="absolute top-8 right-8 text-foam">
            <X size={40} />
          </button>
          <a href="#about" onClick={() => setIsMenuOpen(false)} className="hover:text-aqua">About</a>
          <a href="#services" onClick={() => setIsMenuOpen(false)} className="hover:text-aqua">Services</a>
          <a href="#calculator" onClick={() => setIsMenuOpen(false)} className="hover:text-aqua">Calculator</a>
          <a href="#gallery" onClick={() => setIsMenuOpen(false)} className="hover:text-aqua">Gallery</a>
          <a href="#contact" onClick={() => setIsMenuOpen(false)} className="hover:text-aqua">Contact</a>
        </div>
      )}

      {/* Hero Section - Parallax */}
      <section className="relative overflow-hidden bg-navy will-change-transform">
        <LiquidRipple videoUrl="https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/5470803-hd_1920_1080_30fps.mp4" />
        <div className="absolute inset-0 bg-navy/30 z-[6] pointer-events-none" /> {/* Subtle overlay for text readability */}
        <HeroParallax 
          products={PRODUCTS} 
          title="Omni Pools" 
          subtitle="San Diego's Premier Pool Service. Weekly Maintenance, Chemical Balancing, and Expert Repairs."
        />
      </section>

      {/* 3D Floating Elements - Staggered throughout the scroll */}
      <Floating3DElement 
        url="https://pub-5a76c67414e24796a5bd7ac87486acd0.r2.dev/KescherNeu.glb"
        trigger="#services"
        initialPosition={[-15, 3, 0]}
        targetX={15}
        targetY={-3}
        scale={3}
      />

      {/* Marquee Strip */}
      <section className="py-12 bg-aqua text-navy overflow-hidden border-y border-navy/10 relative z-20">
        <div className="marquee-container">
          <div className="marquee-content flex gap-12 text-2xl md:text-4xl font-black uppercase tracking-tighter whitespace-nowrap">
            <span>San Diego's Premier Pool Service · Weekly Cleaning · Chemical Balancing · Repairs · Over 10 Years Experience · </span>
            <span>San Diego's Premier Pool Service · Weekly Cleaning · Chemical Balancing · Repairs · Over 10 Years Experience · </span>
          </div>
        </div>
      </section>

      {/* About Section - Mask Reveal */}
      <section id="about" className="relative">
        <MaskContainer 
          revealText={
            <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
              <h2 className="text-4xl md:text-7xl font-black text-navy uppercase tracking-tighter leading-none">
                A <span className="serif-italic text-aqua lowercase">decade</span> of crystal clear excellence.
              </h2>
              <p className="text-xl md:text-2xl text-navy/70 font-medium">
                Omni Pools is a solo-operated passion project by Tony Dunn. We provide high-end maintenance for those who demand perfection in their backyard oasis.
              </p>
            </div>
          }
        >
          <div className="text-foam text-center px-6">
            <p className="text-2xl md:text-4xl font-black uppercase tracking-widest opacity-50">Hover to reveal our philosophy</p>
            <h3 className="text-5xl md:text-9xl font-black mt-4">PURE WATER</h3>
          </div>
        </MaskContainer>
      </section>

      {/* Services Section - Pricing Cards */}
      <section id="services" className="py-32 px-6 bg-navy relative overflow-hidden">
        <BackgroundRippleEffect rows={10} cols={20} />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-5xl md:text-8xl font-black text-foam uppercase tracking-tighter">Service <span className="serif-italic text-aqua lowercase">Tiers</span></h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-stretch">
            <PricingCard 
              planName="Chemical Only" 
              price="$90" 
              features={[
                { text: "Water Testing" },
                { text: "Chemical Balancing" },
                { text: "Equipment Inspection" },
                { text: "Monthly Salt Cell Cleaning" }
              ]}
              ctaText="Book Now"
            />
            <PricingCard 
              planName="Mid-Tier Service" 
              price="$130" 
              highlighted
              features={[
                { text: "All Chem Features" },
                { text: "Surface Skimming" },
                { text: "Basket Cleaning" },
                { text: "Filter Backwashing" },
                { text: "Weekly Reporting" }
              ]}
              ctaText="Most Popular"
            />
            <PricingCard 
              planName="Full-Service Luxury" 
              price="$180" 
              features={[
                { text: "All Mid-Tier Features" },
                { text: "Full Vacuuming" },
                { text: "Tile Brushing" },
                { text: "Priority Repair Scheduling" },
                { text: "Winterizing Support" }
              ]}
              ctaText="Go Premium"
            />
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-32 px-6 bg-off-white">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <h2 className="text-5xl md:text-7xl font-black text-navy uppercase tracking-tighter">Volume <span className="serif-italic text-aqua lowercase">Calculator</span></h2>
          <p className="mt-6 text-navy/60 font-bold uppercase tracking-widest text-sm">Estimate your pool's capacity and service tier</p>
        </div>
        <PoolCalculator />
      </section>

      {/* Gallery Section - Consolidated */}
      <section id="gallery" className="bg-navy overflow-hidden">
        <div className="pt-32 pb-16 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl md:text-8xl font-black text-foam uppercase tracking-tighter">Our <span className="serif-italic text-aqua lowercase">Work</span></h2>
            <p className="text-foam/40 mt-6 max-w-2xl mx-auto font-bold uppercase tracking-[0.2em] text-xs md:text-sm">
              A curated showcase of premier pool transformations across San Diego.
            </p>
          </div>
        </div>
        
        <div className="pb-32">
          <Skiper3dCarousel items={CAROUSEL_ITEMS} />
        </div>

        <WorkGallery images={IMAGES.slice(0, 9)} />
        
        <div className="py-32">
          <h3 className="text-2xl font-bold text-foam/40 uppercase tracking-widest text-center mb-12">Interactive Showcase</h3>
          <ThreeDMarquee images={IMAGES.slice(12, 20)} />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-off-white relative overflow-hidden">
        <ImageCursorTrail />
        <div className="max-w-4xl mx-auto text-center mb-16 px-6 relative z-10">
          <h2 className="text-5xl md:text-7xl font-black text-navy uppercase tracking-tighter">Client <span className="serif-italic text-aqua lowercase">Love</span></h2>
        </div>
        <div className="relative z-10">
          <AnimatedTestimonials testimonials={TESTIMONIALS} autoplay />
        </div>
      </section>

      {/* Expand on Scroll Section */}
      <section className="expand-section relative h-[150vh] bg-navy flex items-center justify-center overflow-hidden">
        <div className="expand-image w-[300px] h-[400px] rounded-3xl overflow-hidden relative z-10">
          <img src={IMAGES[14]} className="w-full h-full object-cover" alt="Luxury Pool" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
            <h3 className="text-foam text-4xl md:text-8xl font-black uppercase tracking-tighter text-center px-6 drop-shadow-2xl">
              Always Clear. <br /> Always On Time.
            </h3>
          </div>
        </div>
      </section>

      {/* Contact Section - Pin Container */}
      <section id="contact" className="relative py-32 px-6 bg-off-white overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 relative z-10">
          <div className="space-y-12 flex flex-col justify-center">
            <h2 className="text-6xl md:text-8xl font-black text-navy leading-[0.9] uppercase tracking-tighter">
              Ready to <br /> <span className="serif-italic text-aqua lowercase">dive in?</span>
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-12">
              <PinContainer title="Call Tony" href="tel:6195641873">
                <div className="flex flex-col p-4 w-[15rem] h-[15rem] justify-center items-center text-center space-y-4">
                  <Phone size={48} className="text-aqua" />
                  <p className="text-foam font-black text-xl">(619) 564-1873</p>
                  <p className="text-foam/40 text-xs uppercase tracking-widest">Available Mon-Fri</p>
                </div>
              </PinContainer>
              
              <PinContainer title="Email Us" href="mailto:Tonydunn619@gmail.com">
                <div className="flex flex-col p-4 w-[15rem] h-[15rem] justify-center items-center text-center space-y-4">
                  <Mail size={48} className="text-aqua" />
                  <p className="text-foam font-black text-lg">Tonydunn619@gmail.com</p>
                  <p className="text-foam/40 text-xs uppercase tracking-widest">Quick Response</p>
                </div>
              </PinContainer>
            </div>
          </div>
          
          <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-2xl border border-navy/5">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-navy/60">First Name</label>
                  <input required type="text" className="w-full bg-navy/5 border border-navy/10 rounded-xl p-4 text-navy focus:outline-none focus:border-aqua" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-navy/60">Last Name</label>
                  <input required type="text" className="w-full bg-navy/5 border border-navy/10 rounded-xl p-4 text-navy focus:outline-none focus:border-aqua" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-navy/60">Email Address</label>
                <input required type="email" className="w-full bg-navy/5 border border-navy/10 rounded-xl p-4 text-navy focus:outline-none focus:border-aqua" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-navy/60">Phone Number</label>
                <input required type="tel" className="w-full bg-navy/5 border border-navy/10 rounded-xl p-4 text-navy focus:outline-none focus:border-aqua" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-navy/60">Message</label>
                <textarea rows={4} className="w-full bg-navy/5 border border-navy/10 rounded-xl p-4 text-navy focus:outline-none focus:border-aqua" />
              </div>
              <button type="submit" className="w-full bg-navy text-foam py-5 rounded-xl font-black uppercase tracking-widest hover:bg-navy-dark transition-colors">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-24 px-6 bg-navy text-foam border-t border-white/5 relative overflow-hidden">
        <BackgroundRippleEffect rows={5} cols={15} />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
          <div className="text-center md:text-left space-y-4">
            <div className="text-3xl font-black tracking-tighter uppercase">Omni Pools</div>
            <p className="text-foam/40 text-sm font-bold uppercase tracking-widest">San Diego's Pool, Perfectly Kept.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-xs font-bold uppercase tracking-widest">
            <a href="#about" className="hover:text-aqua transition-colors">About</a>
            <a href="#services" className="hover:text-aqua transition-colors">Services</a>
            <a href="#calculator" className="hover:text-aqua transition-colors">Calculator</a>
            <a href="#contact" className="hover:text-aqua transition-colors">Contact</a>
          </div>
          <div className="text-center md:text-right text-foam/40 text-[10px] font-bold uppercase tracking-widest">
            © 2026 Omni Pools. All Rights Reserved. <br />
            Designed for Excellence.
          </div>
        </div>
      </footer>
    </div>
  );
}
