"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Instagram from "../../assets/svg/Instagram";
import LinkedIn from "../../assets/svg/LinkedIn";
import Facebook from "../../assets/svg/Facebook";
import Phone from "../../assets/svg/Phone";
import Email from "../../assets/svg/Email";
import logo from "../../assets/logo/logo.png";
import {
  ROOT,
  ABOUT_US_PREFIX_PATH,
  CONTACT_US_PREFIX_PATH,
  FAQS_PREFIX_PATH,
  PRIVACY_POLICY_PREFIX_PATH,
  TERMS_AND_CONDITIONS_PREFIX_PATH,
  RETURN_POLICY_PREFIX_PATH,
  DELIVERY_INFORMATION_PREFIX_PATH,
  TERMS_OF_USE_PREFIX_PATH,
  PRODUCTS_PREFIX_PATH,
} from "../../constants/route.constant";
import { capitalizeFirstLetter } from "../../utils/commonFunctions";
import Image from "next/image";

const Footer = ({ footerData, qrCodes, social = [] }) => {
  const pathname = usePathname();

  const handleHomeClick = () => {
    if (pathname === ROOT) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="mt-auto bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-white">
          {/* Logo & Description */}
          <div>
            <Image
              src={logo}
              alt="logo"
              className="w-36 h-12 md:w-40 md:h-12"
            />
            <p className="mt-4 font-semibold text-sm">
              {capitalizeFirstLetter(footerData?.details) ||
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-4 mt-4">
              <Link
                href="https://instagram.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-black bg-opacity-10 flex items-center justify-center rounded-md hover:bg-opacity-25 hover:scale-105 transition duration-300 cursor-pointer"
              >
                <Instagram />
              </Link>
              <Link
                href="https://linkedin.com/in/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-black bg-opacity-10 flex items-center justify-center rounded-md hover:bg-opacity-25 hover:scale-105 transition duration-300 cursor-pointer"
              >
                <LinkedIn />
              </Link>
              <Link
                href="https://facebook.com/yourprofile"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-black bg-opacity-10 flex items-center justify-center rounded-md hover:bg-opacity-25 hover:scale-105 transition duration-300 cursor-pointer"
              >
                <Facebook />
              </Link>
            </div>

            {/* Dynamic Social Icons */}
            {social.length > 0 && (
              <div className="flex items-center gap-4 mt-4">
                {social.map((item) => {
                  const name = item.name.toLowerCase();
                  return (
                    <a
                      key={item.id}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={name}
                      className="w-8 h-8 bg-black bg-opacity-10 flex items-center justify-center rounded-md hover:bg-opacity-25 hover:scale-105 transition duration-300 cursor-pointer"
                    >
                      <Image
                        src={item.logo}
                        alt={`${name} logo`}
                        className="w-5 h-5 object-contain"
                        loading="lazy"
                      />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="font-semibold space-y-3">
              <li>
                <Link href={ROOT} onClick={handleHomeClick}>
                  Home
                </Link>
              </li>
              <li>
                <Link href={ABOUT_US_PREFIX_PATH}>About Us</Link>
              </li>
              <li>
                <Link href={PRODUCTS_PREFIX_PATH}>Blogs</Link>
              </li>
              <li>
                <Link href={CONTACT_US_PREFIX_PATH}>Contact Us</Link>
              </li>
              <li>
                <Link href={FAQS_PREFIX_PATH}>FAQ’s</Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h3 className="text-xl font-bold mb-4">Policies</h3>
            <ul className="font-semibold space-y-3">
              <li>
                <Link href={PRIVACY_POLICY_PREFIX_PATH}>Privacy Policy</Link>
              </li>
              <li>
                <Link href={TERMS_AND_CONDITIONS_PREFIX_PATH}>
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href={RETURN_POLICY_PREFIX_PATH}>Refund/Return Policy</Link>
              </li>
              <li>
                <Link href={DELIVERY_INFORMATION_PREFIX_PATH}>
                  Delivery Information
                </Link>
              </li>
              <li>
                <Link href={TERMS_OF_USE_PREFIX_PATH}>Term of Use</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black bg-opacity-10 flex items-center justify-center rounded-md">
                <Phone />
              </div>
              <a href={`tel:${footerData?.phoneNo || "+64 8554675590"}`} className="font-semibold">
                {footerData?.phoneNo || "+64 8554675590"}
              </a>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <div className="w-8 h-8 bg-black bg-opacity-10 flex items-center justify-center rounded-md">
                <Email />
              </div>
              <a
                href={`mailto:${footerData?.email || "task@yopmail.com"}`}
                className="font-semibold"
              >
                {footerData?.email || "task@yopmail.com"}
              </a>
            </div>

            {qrCodes?.length > 0 && (
              <div className="flex items-center gap-6 mt-6">
                <div>
                  <span className="font-semibold">Android</span>
                  <Image
                    src={qrCodes[0].android}
                    alt="android"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <span className="font-semibold">iOS</span>
                  <Image
                    src={qrCodes[0].ios}
                    alt="ios"
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 text-center text-white font-semibold">
          {footerData?.rightReservedText || (
            <div>© {new Date().getFullYear()} xyz. All Rights Reserved.</div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
