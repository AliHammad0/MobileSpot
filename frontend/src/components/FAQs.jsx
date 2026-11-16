
import React, { useState } from 'react'
import {
  FiChevronDown,
  FiTruck,
  FiPackage,
  FiUser,
  FiRefreshCw,
  FiCreditCard,
  FiTag,
  FiCalendar,
  FiBox,
  FiShield,
  FiDollarSign,
  FiFileText
} from 'react-icons/fi'

const faqCategories = [
  {
    title: 'Shipping, Order Tracking & Delivery',
    icon: FiTruck,
    questions: [
      {
        question: 'How much does MobileHub charge for delivery?',
        answer: 'Delivery charges depend on your delivery location and order. The applicable shipping fee will be displayed during checkout before you confirm your order.'
      },
      {
        question: 'Does MobileHub deliver internationally?',
        answer: 'Currently, MobileHub provides delivery within Pakistan only.'
      },
      {
        question: 'How can I track my mobile phone order?',
        answer: 'Log in to your MobileHub account and visit the My Orders section. Select your order to check its current status.'
      },
      {
        question: 'How long does delivery take?',
        answer: 'Delivery time depends on your city and location. The estimated delivery information will be shared during the ordering process.'
      },
      {
        question: 'Can I check my order before accepting delivery?',
        answer: 'Open Parcel availability depends on the delivery service and applicable policy. Please confirm availability with our support team before placing your order.'
      }
    ]
  },
  {
    title: 'Cancellations and Modifications',
    icon: FiRefreshCw,
    questions: [
      {
        question: 'How can I cancel my order?',
        answer: 'Contact our support team as soon as possible with your order number. Cancellation depends on whether your smartphone order has already been dispatched.'
      },
      {
        question: 'Can I change my order after placing it?',
        answer: 'You can contact support to request changes before dispatch. Changes depend on product availability and order status.'
      },
      {
        question: 'Can I change my mobile phone colour or storage?',
        answer: 'You can request a colour or storage change before dispatch. The requested variant must be available in stock.'
      },
      {
        question: 'Can I change my delivery address?',
        answer: 'Contact our support team with your order number and new address. Address changes may not be possible after dispatch.'
      }
    ]
  },
  {
    title: 'Sign Up and Login',
    icon: FiUser,
    questions: [
      {
        question: 'How can I create a MobileHub account?',
        answer: 'Visit the Signup page, enter your name, email and password, and complete the registration process.'
      },
      {
        question: 'I forgot my password. What should I do?',
        answer: 'Visit the Login page and use the password recovery option when available. You can also contact support for assistance.'
      },
      {
        question: 'How can I update my account details?',
        answer: 'Log in to your account and visit your Profile section to manage your personal information.'
      }
    ]
  },
  {
    title: 'Returns and Replacement',
    icon: FiPackage,
    questions: [
      {
        question: 'What is MobileHub’s return policy?',
        answer: 'Returns are subject to our return policy, including product condition and eligibility requirements. Contact support before sending any product back.'
      },
      {
        question: 'Can I return a damaged smartphone?',
        answer: 'If your phone arrives damaged, contact our support team immediately and provide your order number and clear photos of the issue.'
      },
      {
        question: 'Can I request a replacement?',
        answer: 'Replacement requests are reviewed according to product condition and our applicable return and replacement policy.'
      },
      {
        question: 'How long does a refund take?',
        answer: 'Refund processing time depends on the payment method and bank processing. Contact support for an update on your refund.'
      }
    ]
  },
  {
    title: 'Payments',
    icon: FiCreditCard,
    questions: [
      {
        question: 'Which payment methods does MobileHub accept?',
        answer: 'Available payment methods are displayed during checkout. Please check the checkout page for the currently supported options.'
      },
      {
        question: 'Can I pay through Cash on Delivery?',
        answer: 'Cash on Delivery is available only where supported. Check the payment options shown during checkout.'
      },
      {
        question: 'Is online card payment secure?',
        answer: 'Online card payments should be completed through the secure payment gateway provided at checkout. Never share your card PIN or OTP with anyone.'
      },
      {
        question: 'What should I do if my payment fails?',
        answer: 'Check your bank or payment provider for the transaction status. If money was deducted, contact support with your order and transaction details.'
      }
    ]
  },
  {
    title: 'Coupons',
    icon: FiTag,
    questions: [
      {
        question: 'How can I use a coupon code?',
        answer: 'Enter your valid coupon code in the coupon section during checkout and apply it before completing your order.'
      },
      {
        question: 'Why is my coupon code not working?',
        answer: 'Your coupon may have expired, reached its usage limit or may not apply to the selected smartphone. Check the coupon terms.'
      },
      {
        question: 'Can I use multiple coupons on one order?',
        answer: 'Coupon combination depends on the terms of the available promotion. Check the conditions displayed with your coupon.'
      }
    ]
  },
  {
    title: 'Buy Now Pay Later at Installments',
    icon: FiCalendar,
    questions: [
      {
        question: 'Does MobileHub offer installment plans?',
        answer: 'Installment availability depends on the payment partners and offers supported by MobileHub. Check checkout or contact support for current options.'
      },
      {
        question: 'Which smartphones are available on installments?',
        answer: 'Eligible smartphone models and installment options depend on the available payment plans.'
      },
      {
        question: 'Are there additional installment charges?',
        answer: 'Any applicable processing fees, markup or other charges should be displayed by the payment provider before confirmation.'
      }
    ]
  },
  {
    title: 'Open Parcel Delivery',
    icon: FiBox,
    questions: [
      {
        question: 'What is Open Parcel Delivery?',
        answer: 'Open Parcel is a delivery option that may allow customers to inspect a parcel before accepting it, subject to courier rules and availability.'
      },
      {
        question: 'Is Open Parcel available for every smartphone?',
        answer: 'Availability depends on the courier service, delivery location and applicable MobileHub policy.'
      },
      {
        question: 'Can I refuse a parcel after opening it?',
        answer: 'Parcel inspection and refusal conditions depend on the applicable delivery policy. Contact support for the exact conditions before ordering.'
      }
    ]
  }
]

const policies = [
  {
    title: 'Coupon Usage',
    description: 'Learn about coupon codes and promotional discounts.',
    icon: FiTag
  },
  {
    title: 'Extended Warranty',
    description: 'Understand additional smartphone warranty coverage.',
    icon: FiShield
  },
  {
    title: 'Fair Usage',
    description: 'Read the fair usage guidelines for orders and services.',
    icon: FiFileText
  },
  {
    title: 'Installment Plan',
    description: 'Explore available smartphone installment options.',
    icon: FiCalendar
  },
  {
    title: 'Open Parcel',
    description: 'Learn about parcel inspection at delivery.',
    icon: FiBox
  },
  {
    title: 'Price Beating',
    description: 'Learn about price comparison and matching requests.',
    icon: FiDollarSign
  },
  {
    title: 'Refund Policy',
    description: 'Understand refund eligibility and processing.',
    icon: FiRefreshCw
  },
  {
    title: 'Return Policy',
    description: 'Read the smartphone return and replacement conditions.',
    icon: FiPackage
  },
  {
    title: 'Shipping Policy',
    description: 'Find information about delivery and shipping.',
    icon: FiTruck
  },
  {
    title: 'Warranty Policy',
    description: 'Understand smartphone warranty coverage.',
    icon: FiShield
  },
  {
    title: 'Trade-In',
    description: 'Check whether smartphone trade-in services are available.',
    icon: FiCreditCard
  }
]

const FAQs = () => {
  const [openCategory, setOpenCategory] = useState(0)
  const [openQuestion, setOpenQuestion] = useState(0)

  const toggleCategory = (index) => {
    if (openCategory === index) {
      setOpenCategory(-1)
      setOpenQuestion(-1)
    } else {
      setOpenCategory(index)
      setOpenQuestion(0)
    }
  }

  return (
    <div className="min-h-screen bg-[#faf9f6] font-[Arial] text-[#171717]">

      {/* Hero */}
      <section className="bg-[#171717] px-5 py-16 text-center text-white md:py-20">
        <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-[#d6c5a5]">
          Help & Support
        </p>

        <h1 className="text-4xl font-bold md:text-5xl">
          Frequently Asked Questions
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-300 md:text-base">
          Everything you need to know about ordering smartphones,
          payments, delivery, returns and more.
        </p>
      </section>

      {/* FAQ Categories */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="mb-9 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Find Your Answers
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Browse our help topics below.
          </p>
        </div>

        <div className="space-y-4">
          {faqCategories.map((category, index) => {
            const Icon = category.icon

            return (
              <div
                key={category.title}
                className="overflow-hidden rounded-xl border border-gray-200 bg-white"
              >
                <button
                  onClick={() => toggleCategory(index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left md:px-7"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f3efe7]">
                      <Icon size={20} />
                    </div>

                    <span className="text-sm font-bold md:text-base">
                      {category.title}
                    </span>
                  </div>

                  <FiChevronDown
                    size={20}
                    className={`shrink-0 transition-transform ${
                      openCategory === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {openCategory === index && (
                  <div className="border-t border-gray-100 px-5 md:px-7">
                    {category.questions.map((item, questionIndex) => (
                      <div
                        key={item.question}
                        className="border-b border-gray-100 last:border-0"
                      >
                        <button
                          onClick={() =>
                            setOpenQuestion(
                              openQuestion === questionIndex
                                ? -1
                                : questionIndex
                            )
                          }
                          className="flex w-full items-center justify-between gap-4 py-5 text-left"
                        >
                          <span className="text-sm font-semibold leading-6">
                            {item.question}
                          </span>

                          <FiChevronDown
                            size={18}
                            className={`shrink-0 text-gray-500 transition-transform ${
                              openQuestion === questionIndex
                                ? 'rotate-180'
                                : ''
                            }`}
                          />
                        </button>

                        {openQuestion === questionIndex && (
                          <p className="pb-5 pr-5 text-sm leading-7 text-gray-500">
                            {item.answer}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Related Policies */}
      <section className="bg-white px-5 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10 text-center">
            <p className="mb-3 text-xs font-bold uppercase tracking-[2px] text-[#a18c68]">
              Customer Information
            </p>

            <h2 className="text-3xl font-bold">
              Related Policies & Procedures
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Important information about shopping with MobileHub.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {policies.map((policy) => {
              const Icon = policy.icon

              return (
                <div
                  key={policy.title}
                  className="rounded-xl border border-gray-200 bg-[#faf9f6] p-6 transition hover:-translate-y-1 hover:border-[#c8b797] hover:shadow-md"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#f0e9dc]">
                    <Icon size={21} />
                  </div>

                  <h3 className="font-bold">
                    {policy.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {policy.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="bg-[#171717] px-5 py-16 text-center text-white">
        <h2 className="text-2xl font-bold md:text-3xl">
          Still Have Questions?
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-300">
          Our support team is here to help you with your smartphone
          orders and other questions.
        </p>

        <a
          href="/contact"
          className="mt-7 inline-flex items-center justify-center rounded-lg bg-[#d6c5a5] px-8 py-3.5 text-sm font-bold text-[#171717] transition hover:bg-white"
        >
          Contact Us
        </a>
      </section>

    </div>
  )
}

export default FAQs
