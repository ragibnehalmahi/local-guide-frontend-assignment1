// src/components/shared/PublicFooter.tsx 

import Link from 'next/link';
import { Globe, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function PublicFooter() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Explore: [
      { name: 'All Tours', href: '/explore' },
      { name: 'Food & Drink', href: '/explore?category=food' },
      { name: 'History & Culture', href: '/explore?category=history' },
      { name: 'Nature & Adventure', href: '/explore?category=nature' },
      { name: 'Photography Tours', href: '/explore?category=photography' },
    ],
    'For Travelers': [
      { name: 'How It Works', href: '/how-it-works' },
      { name: 'Safety Guidelines', href: '/safety' },
      { name: 'Booking Tips', href: '/tips' },
      { name: 'Travel Stories', href: '/stories' },
      { name: 'Gift Cards', href: '/gift-cards' },
    ],
    'For Guides': [
      { name: 'Become a Guide', href: '/become-a-guide' },
      { name: 'Guide Resources', href: '/guide-resources' },
      { name: 'Safety Guidelines', href: '/guide-safety' },
      { name: 'Earning Calculator', href: '/earnings' },
      { name: 'Community Forum', href: '/community' },
    ],
    Company: [
      { name: 'About Us', href: '/about' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press', href: '/press' },
      { name: 'Contact', href: '/contact' },
      { name: 'Blog', href: '/blog' },
    ],
  };

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
    { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  ];

  const contactInfo = [
    { icon: Mail, text: 'support@localguide.bd' },
    { icon: Phone, text: '+880 1700-123456' },
    { icon: MapPin, text: 'Dhaka, Bangladesh' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center">
                <Globe className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">LocalGuide</h2>
                <p className="text-cyan-300 font-semibold">.bd</p>
              </div>
            </div>

            <p className="text-gray-300 mb-6 max-w-md">
              Connecting travelers with passionate local guides for authentic experiences
              across Bangladesh. Discover hidden gems, taste local flavors, and create
              unforgettable memories.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {contactInfo.map((item, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <item.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-800 hover:bg-cyan-600 flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-lg font-semibold mb-4 text-white">{category}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-gray-300 hover:text-cyan-400 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="max-w-2xl">
            <h3 className="text-xl font-semibold mb-3">Stay Updated</h3>
            <p className="text-gray-300 mb-4">
              Subscribe to our newsletter for the latest tours, travel tips, and guide stories.
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 rounded-lg font-semibold transition-all"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gray-950 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm">
              © {currentYear} LocalGuide.bd. All rights reserved.
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/cancellation" className="text-gray-400 hover:text-white transition-colors">
                Cancellation Policy
              </Link>
              <Link href="/sitemap" className="text-gray-400 hover:text-white transition-colors">
                Sitemap
              </Link>
              <Link href="/faq" className="text-gray-400 hover:text-white transition-colors">
                FAQ
              </Link>
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>Made with ❤️ in Bangladesh</span>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 pt-6 border-t border-gray-800 flex flex-wrap justify-center gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">4.8/5</div>
              <div className="text-xs text-gray-400">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">10K+</div>
              <div className="text-xs text-gray-400">Happy Travelers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">500+</div>
              <div className="text-xs text-gray-400">Verified Guides</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400">24/7</div>
              <div className="text-xs text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}