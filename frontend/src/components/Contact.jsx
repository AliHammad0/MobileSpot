
import React, { useState } from 'react'
import {
  FiPhone,
  FiMail,
  FiMapPin,
  FiInstagram,
  FiFacebook,
  FiYoutube,
  FiMessageCircle,
  FiSend,
  FiChevronDown,
  FiHeadphones
} from 'react-icons/fi'

const faqs = [
  {
    question: 'How can I track my order?',
    answer: 'You can track your mobile phone order by visiting your Profile and opening the My Orders section. Select your order to view its latest status.'
  },
  {
    question: 'How can I register a complaint?',
    answer: 'You can submit your complaint using the contact form below or email our support team. Please include your order number and a description of the issue.'
  },
  {
    question: 'What can I do if my desired mobile phone is out of stock?',
    answer: 'You can contact our support team to ask about availability. You can also check the product page later for stock updates.'
  },
  {
    question: 'What is MobileHub’s return policy?',
    answer: 'Return requests are subject to our return policy and product condition. Please contact our support team with your order details for assistance.'
  },
  {
    question: 'How many days will it take for my payment to be refunded?',
    answer: 'Refund processing time depends on your payment method and bank. Contact our support team with your order number for an update.'
  },
  {
    question: 'Can I change the colour or storage of my order?',
    answer: 'You can request a change before your order is dispatched. Contact our support team as soon as possible. Changes depend on product availability.'
  },
  {
    question: 'What is included in the mobile phone box?',
    answer: 'Box contents vary by smartphone brand and model. Please check the product description for the included items before placing your order.'
  },
  {
    question: 'Where can I find the refund form?',
    answer: 'Contact our support team with your order number. They will guide you through the refund request process.'
  },
  {
    question: 'How can I deactivate my MobileHub account?',
    answer: 'Please contact our support team using your registered email address to request account deactivation.'
  },
  {
    question: 'How can I cancel my order?',
    answer: 'Contact our support team as soon as possible. Cancellation requests depend on whether your order has already been dispatched.'
  },
  {
    question: 'How can I find my mobile brand’s warranty centre?',
    answer: 'Warranty centre details depend on your smartphone brand. You can contact the relevant brand support team or ask our team for guidance.'
  },
  {
    question: 'Can I change my shipping address?',
    answer: 'You can request an address change before dispatch. Contact our support team with your order number and updated address.'
  },
  {
    question: 'Why is there no warranty card in the box?',
    answer: 'Warranty documentation may vary by brand and model. Check your product details or contact support for warranty information.'
  },
  {
    question: 'How can I get details about installment plans?',
    answer: 'Contact our support team to ask about available installment options and eligibility.'
  },
  {
    question: 'How can I check my order packaging details?',
    answer: 'Contact our support team with your order number for available packaging and dispatch information.'
  }
]

const Contact = () => {
  const [activeFaq, setActiveFaq] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    orderNumber: '',
    subject: 'Order Inquiry',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Contact Form:', formData)
    alert('Your message has been submitted successfully!')
    setFormData({
      name: '',
      email: '',
      orderNumber: '',
      subject: 'Order Inquiry',
      message: ''
    })
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] font-[Arial] text-[#171717]">

      {/* Hero */}
      <section className="bg-[#171717] px-5 py-20 text-center text-white md:py-24">
        <div className="mx-auto max-w-3xl">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/10">
            <FiMessageCircle size={26} />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[3px] text-[#d6c5a5]">
            We Are Here For You
          </p>

          <h1 className="text-4xl font-bold md:text-6xl">
            Any Questions?
            <span className="mt-2 block text-[#d6c5a5]">
              We'd Love To Hear.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
            Whether you have questions about our smartphones, your order,
            delivery or returns, our team is ready to help you.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:py-20">
        <div className="mb-10 text-center">
          <p className="mb-3 text-xs font-bold uppercase tracking-[2px] text-[#a18c68]">
            Help Center
          </p>
          <h2 className="text-3xl font-bold md:text-4xl">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm text-gray-500">
            Find quick answers to common questions.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`overflow-hidden rounded-xl border transition ${
                activeFaq === index
                  ? 'border-[#c8b797] bg-white shadow-sm'
                  : 'border-gray-200 bg-white'
              }`}
            >
              <button
                onClick={() =>
                  setActiveFaq(activeFaq === index ? -1 : index)
                }
                className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-7"
              >
                <span className="text-sm font-semibold md:text-base">
                  {faq.question}
                </span>

                <FiChevronDown
                  size={20}
                  className={`shrink-0 transition-transform ${
                    activeFaq === index ? 'rotate-180 text-[#a18c68]' : ''
                  }`}
                />
              </button>

              {activeFaq === index && (
                <div className="border-t border-gray-100 px-5 py-5 text-sm leading-7 text-gray-600 md:px-7">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form */}
      <section className="bg-white px-5 py-16 md:py-20">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-2">

          <div className="flex flex-col justify-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[2px] text-[#a18c68]">
              Get In Touch
            </p>

            <h2 className="text-3xl font-bold md:text-4xl">
              Still Need Help?
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-gray-500">
              Can't find the answer you're looking for? Send us a message
              and our support team will help you with your mobile phone
              purchase and order-related questions.
            </p>

            <div className="mt-9 space-y-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3efe7]">
                  <FiPhone size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Phone Support</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your official contact number
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3efe7]">
                  <FiMail size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Email Support</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Add your official support email
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f3efe7]">
                  <FiMapPin size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Our Location</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Pakistan
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-2xl border border-gray-200 bg-[#faf9f6] p-6 md:p-8">
            <h3 className="text-xl font-bold">Send Us A Message</h3>
            <p className="mt-2 text-sm text-gray-500">
              Fill in the details below.
            </p>

            <form onSubmit={handleSubmit} className="mt-7 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a18c68]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a18c68]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Order Number (Optional)
                </label>
                <input
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleChange}
                  placeholder="Enter your order number"
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a18c68]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#a18c68]"
                >
                  <option>Order Inquiry</option>
                  <option>Product Information</option>
                  <option>Complaint</option>
                  <option>Return or Refund</option>
                  <option>Warranty Support</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Your Message
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  rows="4"
                  required
                  className="w-full resize-none rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a18c68]"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#171717] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#a18c68]"
              >
                Send Message <FiSend size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="bg-[#f3efe7] px-5 py-14 text-center">
        <div className="mx-auto max-w-2xl">
          <FiHeadphones size={30} className="mx-auto mb-4" />

          <h2 className="text-2xl font-bold md:text-3xl">
            Stay Connected With MobileHub
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-600">
            Follow us on social media for smartphone updates, new arrivals
            and the latest offers.
          </p>

          <div className="mt-7 flex justify-center gap-4">
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition hover:bg-[#171717] hover:text-white"
            >
              <FiInstagram size={20} />
            </a>

            <a
              href="#"
              aria-label="Facebook"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition hover:bg-[#171717] hover:text-white"
            >
              <FiFacebook size={20} />
            </a>

            <a
              href="#"
              aria-label="YouTube"
              className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition hover:bg-[#171717] hover:text-white"
            >
              <FiYoutube size={20} />
            </a>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Contact
