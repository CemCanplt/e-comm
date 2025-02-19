import { Facebook, Instagram, Twitter } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700">
      <div className="container mx-auto px-9 py-5 lg:gap-5 lg:px-25">
        <div className="text-left mb-6 bg-(--Light-Gray) py-12 lg:flex lg:flex-row lg:justify-between lg:items-center">
          <h3 className="text-2xl font-bold text-gray-900">Bandage</h3>
          <div className="flex space-x-4 mt-2">
            <Facebook className="text-(--ilk-renk) cursor-pointer" />
            <Instagram className="text-(--ilk-renk) cursor-pointer" />
            <Twitter className="text-(--ilk-renk) cursor-pointer" />
          </div>
        </div>

        <div className="flex flex-col lg:gap-5 lg:flex-row lg:justify-between space-y-12 text-left">
          <div className="space-y-2">
            <h3 className="font-bold">Company Info</h3>
            <ul className="text-sm space-y-2 font-bold text-(--ikinci-metin-rengi)">
              <li>About Us</li>
              <li>Carrier</li>
              <li>We are hiring</li>
              <li>Blog</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold">Legal</h3>
            <ul className="text-sm space-y-2 font-bold text-(--ikinci-metin-rengi)">
              <li>About Us</li>
              <li>Carrier</li>
              <li>We are hiring</li>
              <li>Blog</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold">Features</h3>
            <ul className="text-sm space-y-2 font-bold text-(--ikinci-metin-rengi)">
              <li>Business Marketing</li>
              <li>User Analytic</li>
              <li>Live Chat</li>
              <li>Unlimited Support</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold">Resources</h3>
            <ul className="text-sm space-y-2 font-bold text-(--ikinci-metin-rengi)">
              <li>IOS & Android</li>
              <li>Watch a Demo</li>
              <li>Customers</li>
              <li>API</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-bold">Get In Touch</h3>
            <div className="flex items-center">
              <input
                type="email"
                placeholder="Your Email"
                className="border rounded-l-lg p-5 w-full bg-(--Light-Gray) border-gray-700/40"
              />

              <button className="bg-(--ilk-renk) text-white px-4 py-5 rounded-r-lg">
                Subscribe
              </button>
            </div>
            <p className="text-xs mt-2">Lore imp sum dolor Amit</p>
          </div>
        </div>

        <div className="text-center font-bold py-8 text-gray-500 mt-8 bg-(--Light-Gray)">
          Made With Love By
          <br />
          Finland All Right Reserved
        </div>
      </div>
    </footer>
  );
}

export default Footer;
