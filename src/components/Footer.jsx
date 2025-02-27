import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gray-50 text-gray-700">
      <div className="container mx-auto px-9 py-5 lg:px-25">
        {/* Header */}
        <div className="mb-6 py-12 text-left lg:flex lg:items-center lg:justify-between">
          <h3 className="text-2xl font-bold text-gray-900">Bandage</h3>
          <div className="mt-2 flex space-x-4">
            <Facebook className="cursor-pointer" />
            <Instagram className="cursor-pointer" />
            <Twitter className="cursor-pointer" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col space-y-12 text-left lg:flex-row lg:justify-between lg:gap-5">
          {/* Company Info */}
          <FooterSection title="Company Info" links={["About Us", "Carrier", "We are hiring", "Blog"]} />
          
          {/* Legal */}
          <FooterSection title="Legal" links={["About Us", "Carrier", "We are hiring", "Blog"]} />
          
          {/* Features */}
          <FooterSection 
            title="Features" 
            links={["Business Marketing", "User Analytic", "Live Chat", "Unlimited Support"]} 
          />
          
          {/* Resources */}
          <FooterSection 
            title="Resources" 
            links={["IOS & Android", "Watch a Demo", "Customers", "API"]} 
          />
          
          {/* Newsletter */}
          <div className="space-y-2">
            <h3 className="font-bold">Get In Touch</h3>
            <div className="flex items-center">
              <input
                type="email"
                placeholder="Your Email"
                className="w-full rounded-l-lg border border-gray-700/40 p-5"
              />
              <button className="rounded-r-lg bg-blue-600 px-4 py-5 text-white">
                Subscribe
              </button>
            </div>
            <p className="mt-2 text-xs">Lore imp sum dolor Amit</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 py-8 text-center font-bold text-gray-500">
          Made With Love By
          <br />
          Finland All Right Reserved
        </div>
      </div>
    </footer>
  );
}

// Helper component for footer sections
function FooterSection({ title, links }) {
  return (
    <div className="space-y-2">
      <h3 className="font-bold">{title}</h3>
      <ul className="space-y-2 text-sm font-bold text-gray-600">
        {links.map((link, index) => (
          <li key={index}>
            {link === "About Us" ? <Link to="/aboutUs">{link}</Link> : link}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Footer;
