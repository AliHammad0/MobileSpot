
import React from 'react'
import { Link } from 'react-router-dom'
import {
  FiSmartphone,
  FiShield,
  FiHeadphones,
  FiTruck,
  FiRefreshCw,
  FiCreditCard,
  FiMapPin,
  FiHeart,
  FiTarget,
  FiUsers,
  FiCheckCircle,
} from 'react-icons/fi'

const About = () => {
  const services = [
    {
      icon: <FiSmartphone />,
      title: 'Latest Smartphones',
      description: 'Explore the latest smartphones from Apple, Samsung, Vivo, Oppo and other popular brands.',
    },
    {
      icon: <FiShield />,
      title: 'Trusted Products',
      description: 'Shop smartphones with reliable product information and warranty details.',
    },
    {
      icon: <FiHeadphones />,
      title: 'Customer Support',
      description: 'Our support team is here to help you with your shopping experience and queries.',
    },
    {
      icon: <FiTruck />,
      title: 'Home Delivery',
      description: 'Get your favourite smartphone delivered directly to your doorstep.',
    },
    {
      icon: <FiRefreshCw />,
      title: 'Easy Returns',
      description: 'Our return process is designed to make eligible returns easier for customers.',
    },
    {
      icon: <FiCreditCard />,
      title: 'Flexible Payments',
      description: 'Choose from available payment methods, including Cash on Delivery.',
    },
  ]

  const values = [
    {
      icon: <FiHeart />,
      title: 'Customer First',
      description: 'Our customers are at the heart of everything we do. We aim to make every shopping experience better.',
    },
    {
      icon: <FiShield />,
      title: 'Authenticity',
      description: 'We believe in honest product information, transparent pricing and dependable service.',
    },
    {
      icon: <FiTarget />,
      title: 'Our Mission',
      description: 'Making it easier for everyone to discover and purchase their ideal smartphone.',
    },
    {
      icon: <FiUsers />,
      title: 'Together',
      description: 'We build lasting relationships with customers through care, support and trust.',
    },
  ]

  return (
    <div className="overflow-hidden bg-white font-[Arial]">

      {/* Hero Section */}
      <section className="bg-[#171717] px-4 py-20 text-white sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">

          <div>
            <p className="mb-5 text-sm font-bold uppercase tracking-[4px] text-[#c8ad86]">
              About MobileHub
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Buying Made Simple.
              <span className="block text-[#c8ad86]">
                Every Day.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-sm leading-8 text-gray-400 sm:text-base">
              Discover, compare and shop your favourite smartphones in one
              place. We make finding the right mobile phone simple,
              convenient and hassle-free.
            </p>

            <Link
              to="/mobiles"
              className="mt-8 inline-flex rounded-lg bg-[#c8ad86] px-8 py-3.5 text-sm font-bold text-[#171717] transition hover:bg-white"
            >
              Explore Smartphones
            </Link>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-[#c8ad86]/10 blur-3xl" />
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900"
              alt="Smartphone"
              className="relative z-10 max-h-[420px] w-full max-w-md rounded-3xl object-cover"
            />
          </div>

        </div>
      </section>

      {/* Introduction */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-sm font-bold uppercase tracking-[3px] text-[#9b7c54]">
            What We Do
          </p>

          <h2 className="mt-4 text-3xl font-bold text-[#171717] sm:text-4xl">
            We Meet Your Smartphone Needs Head On
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-sm leading-8 text-gray-500 sm:text-base">
            At MobileHub, we bring popular smartphone brands and models
            together to help you find the phone that matches your needs
            and budget. Whether you are looking for a flagship device
            or an affordable everyday smartphone, we make your search easier.
          </p>
        </div>

        <div className="mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-4 sm:grid-cols-3">
          {[
            'Apple',
            'Samsung',
            'Vivo',
            'Oppo',
            'Infinix',
            'Tecno',
            'Xiaomi',
            'Realme',
            'Google Pixel',
          ].map((brand) => (
            <div
              key={brand}
              className="flex min-h-24 items-center justify-center rounded-xl border border-gray-100 bg-[#faf9f6] p-5 text-center text-base font-bold text-[#171717] transition hover:border-[#c8ad86] hover:shadow-sm"
            >
              {brand}
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="bg-[#f8f7f4] px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-[3px] text-[#9b7c54]">
              Why Choose Us
            </p>
            <h2 className="mt-4 text-3xl font-bold text-[#171717] sm:text-4xl">
              Making Online Shopping Reliable and Simple
            </h2>
            <p className="mt-4 text-sm leading-7 text-gray-500">
              Everything you need for a smooth and convenient smartphone
              shopping experience.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-2xl border border-gray-100 bg-white p-7 transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#f1ece4] text-2xl text-[#9b7c54]">
                  {service.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#171717]">
                  {service.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Delivery */}
      <section className="px-4 py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">

          <div>
            <p className="text-sm font-bold uppercase tracking-[3px] text-[#9b7c54]">
              Convenient Shopping
            </p>

            <h2 className="mt-4 text-3xl font-bold leading-tight text-[#171717] sm:text-4xl">
              Your Favourite Smartphone, Delivered to Your Door
            </h2>

            <p className="mt-5 text-sm leading-8 text-gray-500">
              Shop from the comfort of your home. Browse available
              smartphones, place your order and choose from the available
              delivery and payment options.
            </p>

            <div className="mt-7 space-y-4">
              {[
                'Browse smartphones from popular brands',
                'Compare prices and product specifications',
                'Place your order online',
                'Receive your phone at your doorstep',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-gray-700">
                  <FiCheckCircle className="shrink-0 text-[#9b7c54]" size={19} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl bg-[#f8f7f4]">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5qzdmM2QQA-oVFUvQ0BVrW-Q4QwFX7LZWgYPv5pvK4Q&s=10"
              alt="Online shopping delivery"
              className="h-80 w-full object-cover"
            />
          </div>

        </div>
      </section>

      {/* Payment Methods */}
      <section className="bg-[#171717] px-4 py-16 text-white">
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-sm font-bold uppercase tracking-[3px] text-[#c8ad86]">
            Easy Payments
          </p>

          <h2 className="mt-4 text-3xl font-bold">
            Flexible Payment Options
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-400">
            Choose a convenient payment method from the options available
            at checkout.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: <FiCreditCard />, title: 'Credit / Debit Card' },
              { icon: <FiMapPin />, title: 'Cash on Delivery' },
              { icon: <FiShield />, title: 'Secure Payments' },
            ].map((payment) => (
              <div
                key={payment.title}
                className="rounded-xl border border-white/10 bg-white/5 p-7"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#c8ad86] text-xl text-[#171717]">
                  {payment.icon}
                </div>
                <h3 className="mt-4 text-sm font-bold">
                  {payment.title}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="px-4 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <p className="text-sm font-bold uppercase tracking-[3px] text-[#9b7c54]">
              What We Believe
            </p>
            <h2 className="mt-4 text-3xl font-bold text-[#171717] sm:text-4xl">
              Our Values
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div key={value.title} className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1ece4] text-2xl text-[#9b7c54]">
                  {value.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#171717]">
                  {value.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#f8f7f4] px-4 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-[#171717]">
            Find Your Next Smartphone
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-500">
            Explore our collection and discover a smartphone that fits
            your lifestyle and budget.
          </p>

          <Link
            to="/mobiles"
            className="mt-7 inline-flex rounded-lg bg-[#171717] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-[#9b7c54]"
          >
            Shop All Mobiles
          </Link>
        </div>
      </section>

    </div>
  )
}

export default About
