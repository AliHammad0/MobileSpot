import React from "react";
import { Link } from "react-router-dom";
import {
  FiSmartphone,
  FiMail,
  FiPhone,
  FiMapPin,
  FiFacebook,
  FiInstagram,
  FiYoutube,
  FiTwitter,
} from "react-icons/fi";

const Footer = () => {
  const brands = [
    "Apple",
    "Samsung",
    "Vivo",
    "Oppo",
    "Infinix",
    "Tecno",
    "Xiaomi",
    "Realme",
    "OnePlus",
    "Google Pixel",
  ];

  return (
    <footer className="bg-[#111111] font-[Arial,sans-serif] text-white">

      {/* Main Footer */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-14 sm:grid-cols-2 lg:grid-cols-4">

        {/* Brand Information */}
        <div>
          <Link to="/" className="mb-5 inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-500 text-black">
              <FiSmartphone size={26} />
            </div>

            <span className="text-2xl font-extrabold tracking-tight">
              Mobile<span className="text-amber-500">Spot</span>
            </span>
          </Link>

          <p className="mb-6 max-w-xs text-sm leading-7 text-gray-400">
            Your trusted destination for the latest smartphones.
            Explore top mobile brands, compare prices and find
            the perfect phone for your needs.
          </p>

          <div className="flex items-center gap-3">
            <a href="https://www.facebook.com/" target="_blank" rel="noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#252525] transition hover:bg-amber-500 hover:text-black">
              <FiFacebook size={17} />
            </a>

            <a href="https://www.instagram.com/" target="_blank" rel="noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#252525] transition hover:bg-amber-500 hover:text-black">
              <FiInstagram size={17} />
            </a>

            <a href="https://www.youtube.com/" target="_blank" rel="noreferrer"
              aria-label="YouTube"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#252525] transition hover:bg-amber-500 hover:text-black">
              <FiYoutube size={17} />
            </a>

            <a href="https://www.twitter.com/" target="_blank" rel="noreferrer"
              aria-label="Twitter"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[#252525] transition hover:bg-amber-500 hover:text-black">
              <FiTwitter size={17} />
            </a>
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h3 className="mb-6 text-base font-bold">
            Company
            <span className="mt-2 block h-0.5 w-10 bg-amber-500"></span>
          </h3>

          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <Link to="/" className="transition hover:text-amber-500">
                Home
              </Link>
            </li>
            <li>
              <Link to="/mobiles" className="transition hover:text-amber-500">
                All Mobiles
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition hover:text-amber-500">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="transition hover:text-amber-500">
                Contact Us
              </Link>
            </li>
            <li>
              <Link to="/faq" className="transition hover:text-amber-500">
                FAQs
              </Link>
            </li>
            <li>
              <Link to="/terms" className="transition hover:text-amber-500">
                Terms & Conditions
              </Link>
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="mb-6 text-base font-bold">
            Customer Service
            <span className="mt-2 block h-0.5 w-10 bg-amber-500"></span>
          </h3>

          <ul className="space-y-4 text-sm text-gray-400">
            <li>
              <Link to="/contact" className="transition hover:text-amber-500">
                Help Center
              </Link>
            </li>
            <li>
              <Link to="/track-order" className="transition hover:text-amber-500">
                Track Your Order
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="transition hover:text-amber-500">
                Shipping Information
              </Link>
            </li>
            <li>
              <Link to="/returns" className="transition hover:text-amber-500">
                Returns & Refunds
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="transition hover:text-amber-500">
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Brands */}
        <div>
          <h3 className="mb-6 text-base font-bold">
            Popular Brands
            <span className="mt-2 block h-0.5 w-10 bg-amber-500"></span>
          </h3>

          <ul className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm text-gray-400">
            {brands.map((brand) => (
              <li key={brand}>
                <Link
                  to={`/brand/${brand.toLowerCase().replace(/\s+/g, "-")}`}
                  className="transition hover:text-amber-500"
                >
                  {brand}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="border-t border-[#292929]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 py-7 md:flex-row">

          <div>
            <h4 className="mb-3 text-sm font-bold">
              Secure Payment Methods
            </h4>

            <div className="flex flex-wrap gap-2">
              <span className="rounded-md bg-white px-4 py-2 text-xs font-bold text-black">
                CASH ON DELIVERY
              </span>
              <span className="rounded-md bg-white px-4 py-2 text-xs font-bold text-blue-800">
                VISA
              </span>
              <span className="rounded-md bg-white px-4 py-2 text-xs font-bold text-red-600">
                Mastercard
              </span>
            </div>
          </div>

          <div className="text-center md:text-right">
            <p className="mb-2 text-sm font-semibold">
              Need Help?
            </p>
            <Link
              to="/contact"
              className="text-sm text-amber-500 transition hover:text-amber-400"
            >
              Contact Our Support Team
            </Link>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[#292929]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-center sm:flex-row">

          <p className="text-xs text-gray-500">
            Copyright © {new Date().getFullYear()} MobileSpot. All Rights Reserved.
          </p>

          <p className="text-xs text-gray-500">
            Made for Smartphone Lovers.
          </p>

        </div>
      </div>

    </footer>
  );
};

export default Footer;