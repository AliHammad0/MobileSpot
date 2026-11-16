
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiChevronDown, FiShield, FiFileText } from 'react-icons/fi'

const Terms = () => {
  const [openSection, setOpenSection] = useState('introduction')

  const sections = [
    {
      id: 'introduction',
      title: 'INTRODUCTION',
      content: (
        <>
          <p>
            Welcome to MobileHub. These Terms and Conditions govern your access
            to and use of our website, mobile services, products, and related
            features.
          </p>
          <p>
            By accessing or using MobileHub, you agree to follow these Terms
            and Conditions, our Privacy Policy, Return and Refund Policy, and
            other applicable policies.
          </p>
          <p>
            If you do not agree with these terms, please do not use our
            website or services.
          </p>
          <p>
            MobileHub reserves the right to update or modify these terms at
            any time. Updated terms will become effective once published on
            this website.
          </p>
        </>
      ),
    },
    {
      id: 'buyer',
      title: 'BUYER POLICY',
      content: (
        <>
          <p>
            Customers must provide accurate information when placing an order
            on MobileHub.
          </p>
          <ul>
            <li>Customers must be at least 18 years old or use the platform under parental supervision.</li>
            <li>All orders are subject to product availability.</li>
            <li>Customers should verify product details before placing an order.</li>
            <li>MobileHub reserves the right to cancel suspicious or fraudulent orders.</li>
            <li>Customers must provide a valid phone number and delivery address.</li>
          </ul>
        </>
      ),
    },
    {
      id: 'conditions',
      title: 'CONDITIONS OF USE',
      content: (
        <>
          <p>
            By using MobileHub, you agree to use the website responsibly and
            only for lawful purposes.
          </p>
          <ul>
            <li>You must not misuse or attempt to damage our website.</li>
            <li>You must not provide false account or payment information.</li>
            <li>You are responsible for maintaining the confidentiality of your account.</li>
            <li>Product images and descriptions are provided for customer information.</li>
            <li>Prices and product availability may change without prior notice.</li>
          </ul>
        </>
      ),
    },
  ]

  const policies = [
    {
      title: 'Coupon Usage',
      description: 'Rules for using promotional codes and discounts.',
      path: '/terms/coupon-usage',
    },
    {
      title: 'Extended Warranty',
      description: 'Information about optional extended warranty coverage.',
      path: '/terms/extended-warranty',
    },
    {
      title: 'Fair Usage',
      description: 'Guidelines for fair and responsible use of our services.',
      path: '/terms/fair-usage',
    },
    {
      title: 'Installment Plan',
      description: 'Terms for available installment payment options.',
      path: '/terms/installment',
    },
    {
      title: 'Open Parcel',
      description: 'Guidelines for checking your parcel at delivery.',
      path: '/terms/open-parcel',
    },
    {
      title: 'Price Beating',
      description: 'Our price comparison and price beating guidelines.',
      path: '/terms/price-beating',
    },
    {
      title: 'Refund Policy',
      description: 'How refunds are processed for eligible orders.',
      path: '/terms/refund',
    },
    {
      title: 'Return Policy',
      description: 'Conditions and process for returning smartphones.',
      path: '/terms/return',
    },
    {
      title: 'Shipping Policy',
      description: 'Delivery charges, processing, and shipping information.',
      path: '/terms/shipping',
    },
    {
      title: 'Warranty Policy',
      description: 'Information about official product warranties.',
      path: '/terms/warranty',
    },
    {
      title: 'Trade-In Policy',
      description: 'Terms for exchanging eligible old smartphones.',
      path: '/terms/trade-in',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8f7f4] px-4 py-12 font-[Arial]">
      <div className="mx-auto max-w-5xl">

        {/* Page Heading */}
        <div className="mb-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#eee8df] text-[#9b7c54]">
            <FiFileText size={30} />
          </div>

          <h1 className="text-3xl font-bold text-[#171717] sm:text-4xl">
            Terms & Conditions
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-gray-500">
            Please read our terms and conditions carefully before using
            MobileHub. By using our website, you agree to these policies.
          </p>
        </div>

        {/* Main Introduction */}
        <div className="mb-6 rounded-xl border border-[#eee9e1] bg-white p-5 sm:p-7">
          <div className="flex items-center gap-3">
            <FiShield size={23} className="text-[#9b7c54]" />
            <h2 className="text-lg font-bold text-[#171717]">
              Welcome to MobileHub
            </h2>
          </div>

          <p className="mt-4 text-sm leading-7 text-gray-600">
            MobileHub is an online platform for discovering and purchasing
            smartphones from popular brands. These terms explain the rules,
            responsibilities, and policies that apply when using our website.
          </p>
        </div>

        {/* Accordion Sections */}
        <div className="mb-10 space-y-3">
          {sections.map((section) => (
            <div
              key={section.id}
              className="overflow-hidden rounded-xl border border-[#eee9e1] bg-white"
            >
              <button
                onClick={() =>
                  setOpenSection(
                    openSection === section.id ? null : section.id
                  )
                }
                className="flex w-full items-center justify-between px-5 py-5 text-left sm:px-7"
              >
                <span className="text-sm font-bold tracking-wide text-[#171717]">
                  {section.title}
                </span>

                <FiChevronDown
                  size={20}
                  className={`shrink-0 text-[#9b7c54] transition-transform ${
                    openSection === section.id ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openSection === section.id && (
                <div className="border-t border-gray-100 px-5 py-5 text-sm leading-7 text-gray-600 sm:px-7">
                  <div className="space-y-3 [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5">
                    {section.content}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Related Policies */}
        <div className="rounded-xl border border-[#eee9e1] bg-white p-5 sm:p-7">
          <h2 className="text-xl font-bold text-[#171717]">
            Related Policies and Procedures
          </h2>

          <p className="mb-6 mt-2 text-sm text-gray-500">
            Learn more about our shopping, delivery, returns, and warranty policies.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            {policies.map((policy) => (
              <Link
                key={policy.title}
                to={policy.path}
                className="group rounded-lg border border-gray-100 p-4 transition hover:border-[#c8ad86] hover:bg-[#faf9f6]"
              >
                <h3 className="font-semibold text-[#171717] transition group-hover:text-[#9b7c54]">
                  {policy.title}
                </h3>

                <p className="mt-1 text-xs leading-5 text-gray-500">
                  {policy.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <p className="mt-8 text-center text-xs leading-6 text-gray-400">
          If you have questions about these Terms & Conditions, please{' '}
          <Link to="/contact" className="font-semibold text-[#9b7c54] hover:underline">
            contact us
          </Link>.
        </p>

      </div>
    </div>
  )
}

export default Terms
