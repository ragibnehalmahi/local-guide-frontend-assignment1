// src/components/modules/Home/CTASection.tsx   

import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-5xl font-bold mb-6">
          Ready for Your Next Adventure?
        </h2>

        <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
          Join thousands of travelers who have discovered hidden gems with local guides
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/explore"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:scale-105"
          >
            Explore Tours
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/become-a-guide"
            className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white/10 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300"
          >
            Become a Guide
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold mb-2">500+</div>
            <div className="text-blue-200">Local Guides</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">2,000+</div>
            <div className="text-blue-200">Experiences</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">10,000+</div>
            <div className="text-blue-200">Happy Travelers</div>
          </div>
          <div>
            <div className="text-4xl font-bold mb-2">4.8/5</div>
            <div className="text-blue-200">Average Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
}