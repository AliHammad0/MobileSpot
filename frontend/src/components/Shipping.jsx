
import React from 'react'

const Shipping = () => {
  return (
    <div className="min-h-screen bg-white px-4 py-12 font-[Arial]">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-3 text-3xl font-bold text-gray-900">
          Shipping Information
        </h1>

        <p className="mb-10 text-gray-500">
          Everything you need to know about delivery and shipping.
        </p>

        <div className="space-y-8 text-gray-700">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Delivery Coverage
            </h2>
            <p className="leading-7">
              MobileSpot delivers orders across Pakistan. Delivery availability
              may depend on your city and delivery address.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Delivery Time
            </h2>
            <p className="leading-7">
              Orders are generally delivered within 3–7 working days.
              Delivery time may vary depending on your location and product
              availability.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Shipping Charges
            </h2>
            <p className="leading-7">
              Shipping charges, if applicable, will be displayed during
              checkout before you confirm your order.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Order Processing
            </h2>
            <p className="leading-7">
              Orders are processed after confirmation. Our team may contact
              you to verify your order details before dispatch.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Track Your Order
            </h2>
            <p className="leading-7">
              Once your order is dispatched, you can contact our support team
              for delivery updates and tracking information.
            </p>
          </section>

          <section>
            <h2 className="mb-3 text-xl font-semibold text-gray-900">
              Need Help?
            </h2>
            <p className="leading-7">
              If you have any questions about shipping, please contact our
              customer support team.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}

export default Shipping
