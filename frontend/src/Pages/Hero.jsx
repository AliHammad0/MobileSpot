
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'

const slides = [
  {
    tag: 'PREMIUM SMARTPHONES',
    title: 'Experience the',
    highlight: 'Power of iPhone',
    description:
      'Discover premium Apple smartphones with stunning design, powerful performance and advanced technology.',
    button: 'SHOP IPHONE',
    link: '/mobiles',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcREIYGvvZLT2HkyzAbGupf_nHu3SbAlL73FadlYPuCfJA&s=10',
    background: 'from-[#17120c] via-[#292013] to-[#080808]'
  },
  {
    tag: 'NEXT GENERATION TECHNOLOGY',
    title: 'Upgrade Your',
    highlight: 'Samsung Experience',
    description:
      'Explore innovative Samsung smartphones with brilliant displays, amazing cameras and powerful performance.',
    button: 'EXPLORE SAMSUNG',
    link: '/mobiles',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSGrUx8BAJDonWLJJdCPtvJC4vFL7Jgz_hx7oofHE47iw&s=10',
    background: 'from-[#101626] via-[#172b48] to-[#080808]'
  },
  {
    tag: 'SMART TECHNOLOGY',
    title: 'Technology Meets',
    highlight: 'Your Lifestyle',
    description:
      'Find the perfect smartphone with impressive features, modern design and incredible value.',
    button: 'EXPLORE MOBILES',
    link: '/mobiles',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ883UMAlcxwu33iiByF29vKy4UgbpBwtOHHDIYGQdTBA&s=10',
    background: 'from-[#20120d] via-[#422316] to-[#080808]'
  }
]

const Hero = () => {
  const [activeSlide, setActiveSlide] = useState(0)

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setActiveSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    )
  }

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide()
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const currentSlide = slides[activeSlide]

  return (
    <section className="w-full font-[Arial] bg-black overflow-hidden">

      <div className={`relative bg-gradient-to-r ${currentSlide.background} transition-all duration-700`}>

        <div className="max-w-7xl mx-auto min-h-[570px] lg:min-h-[620px] px-5 md:px-10 py-14 flex items-center">

          <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-10 w-full">

            {/* LEFT CONTENT */}
            <div
              key={activeSlide}
              className="relative z-10 text-center lg:text-left animate-[fadeIn_.7s_ease]"
            >
              <span className="inline-block text-[#d6b878] text-xs font-bold tracking-[3px] border border-[#d6b878]/40 rounded-full px-5 py-3 mb-7">
                {currentSlide.tag}
              </span>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight">
                {currentSlide.title}
                <span className="block text-[#d6b878] mt-2">
                  {currentSlide.highlight}
                </span>
              </h1>

              <p className="text-gray-300 text-sm sm:text-base leading-7 max-w-lg mx-auto lg:mx-0 mt-6">
                {currentSlide.description}
              </p>

              <Link
                to={currentSlide.link}
                className="inline-flex items-center justify-center mt-9 px-9 py-4 rounded-xl bg-[#d6b878] hover:bg-[#c3a15c] text-black font-bold text-sm tracking-wide transition-all duration-300 hover:-translate-y-1"
              >
                {currentSlide.button}
              </Link>
            </div>

            {/* RIGHT IMAGE */}
            <div
              key={`image-${activeSlide}`}
              className="relative flex items-center justify-center animate-[fadeIn_.8s_ease]"
            >
              <div className="absolute w-72 h-72 md:w-[420px] md:h-[420px] rounded-full bg-[#d6b878]/10 blur-[90px]" />

              <img
                src={currentSlide.image}
                alt={currentSlide.highlight}
                className="relative z-10 w-full max-w-[550px] h-[300px] md:h-[420px] object-contain drop-shadow-2xl"
              />
            </div>

          </div>
        </div>

        {/* PREVIOUS BUTTON */}
        <button
          onClick={prevSlide}
          aria-label="Previous banner"
          className="absolute left-3 md:left-7 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 bg-black/30 text-white flex items-center justify-center hover:bg-[#d6b878] hover:text-black transition"
        >
          <FiChevronLeft size={23} />
        </button>

        {/* NEXT BUTTON */}
        <button
          onClick={nextSlide}
          aria-label="Next banner"
          className="absolute right-3 md:right-7 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/30 bg-black/30 text-white flex items-center justify-center hover:bg-[#d6b878] hover:text-black transition"
        >
          <FiChevronRight size={23} />
        </button>

        {/* SLIDER INDICATORS */}
        <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
          {slides.map((slide, index) => (
            <button
              key={slide.tag}
              onClick={() => setActiveSlide(index)}
              aria-label={`Go to banner ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-500 ${
                activeSlide === index
                  ? 'w-9 bg-[#d6b878]'
                  : 'w-2 bg-white/50 hover:bg-white'
              }`}
            />
          ))}
        </div>

      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </section>
  )
}

export default Hero
