
import React from 'react'

const Returns = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-12 font-[Arial]">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Returns & Refunds
        </h1>

        <p className="mb-10 text-gray-500">
          Our return and refund policy for a better shopping experience.
        </p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Return Policy
            </h2>
            <p className="leading-7">
              If you receive a damaged, defective, or incorrect product,
              please contact MobileSpot customer support as soon as possible.
              Our team will guide you through the return process.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Return Conditions
            </h2>
            <p className="mb-3 leading-7">
              To request a return, please make sure:
            </p>
            <ul className="list-disc space-y-2 pl-6 leading-7">
              <li>The product is unused and in its original condition.</li>
              <li>Original packaging and accessories are included.</li>
              <li>You provide your order details or receipt.</li>
              <li>The issue is reported within the applicable return period.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Refund Process
            </h2>
            <p className="leading-7">
              Once your returned product has been inspected and approved,
              our support team will inform you about the refund process.
              Refund processing time may vary depending on the payment method.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Non-Returnable Items
            </h2>
            <p className="leading-7">
              Products damaged due to misuse, unauthorized repairs, or
              physical damage after delivery may not qualify for a return.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              How to Request a Return
            </h2>
            <p className="leading-7">
              Contact our customer support team with your order number,
              product details, and a description of the issue. Our team
              will help you with the next steps.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Need Help?
            </h2>
            <p className="leading-7">
              For return or refund questions, please contact MobileSpot
              customer support.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Returns
