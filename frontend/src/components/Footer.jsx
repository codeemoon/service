import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-gray-900 text-gray-400 pt-6 pb-8 md:pt-10 md:pb-10 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-2">
          
          {/* Brand & Social Section */}
          <div className="space-y-4">
            <Link to="/" className="text-2xl font-bold text-white flex items-center space-x-3">
              <img src="/companyLogo/abcdservices_converted.avif" alt="Helpbro Logo" className="h-10 w-auto object-contain bg-white rounded-lg p-1" />
            </Link>
            <div className="flex space-x-4 pt-0">
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Facebook size={16} className="md:w-[18px] md:h-[18px]" />
              </a>
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Twitter size={16} className="md:w-[18px] md:h-[18px]" />
              </a>
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Instagram size={16} className="md:w-[18px] md:h-[18px]" />
              </a>
              <a href="#" className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Linkedin size={16} className="md:w-[18px] md:h-[18px]" />
              </a>
            </div>
          </div>

          {/* Menus side-by-side for Mobile */}
          <div className="flex gap-10 sm:gap-16 md:hidden">
            {/* Quick Links */}
            <div>
              <h3 className="text-base font-bold text-white mb-3">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li><Link to="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
                <li><Link to="/services" className="hover:text-blue-500 transition-colors">Find a Service</Link></li>
                <li><Link to="/become-partner" className="hover:text-blue-500 transition-colors">Become a Partner</Link></li>
                <li><Link to="/login" className="hover:text-blue-500 transition-colors">Login / Register</Link></li>
              </ul>
            </div>
            {/* Legal / Policy */}
            <div>
              <h3 className="text-base font-bold text-white mb-3">Company</h3>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-blue-500 transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-blue-500 transition-colors">Support Center</a></li>
              </ul>
            </div>
          </div>

          {/* Desktop Menus */}
          <div className="hidden md:block">
            <h3 className="text-lg font-bold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-blue-500 transition-colors">Home</Link></li>
              <li><Link to="/services" className="hover:text-blue-500 transition-colors">Find a Service</Link></li>
              <li><Link to="/become-partner" className="hover:text-blue-500 transition-colors">Become a Partner</Link></li>
              <li><Link to="/login" className="hover:text-blue-500 transition-colors">Login / Register</Link></li>
            </ul>
          </div>
          <div className="hidden md:block">
            <h3 className="text-lg font-bold text-white mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-blue-500 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-500 transition-colors">Support Center</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-base md:text-lg font-bold text-white mb-3 md:mb-4">Get in Touch</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="shrink-0 text-blue-500" size={18} />
                <span>123 Innovation Drive, Tech Valley, CA 94043</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="shrink-0 text-blue-500" size={18} />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="shrink-0 text-blue-500" size={18} />
                <span>support@helpbro.com</span>
              </li>
            </ul>
            
            {/* Action Button */}
            <div className="pt-3 md:pt-4">
              <Link 
                to="/become-partner"
                className="relative group inline-block w-full sm:w-auto"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-blue-500 rounded-lg blur opacity-40 group-hover:opacity-75 transition duration-300"></div>
                
                {/* Button */}
                <div className="relative px-5 py-2.5 bg-gradient-to-r from-[#2dd4bf] to-[#3b82f6] rounded-lg text-white text-sm font-medium text-center hover:shadow-lg transition-all duration-300">
                  Become a service provider
                </div>
              </Link>
            </div>
          </div>

        </div>

        <div className="text-center text-[10px] text-gray-600">
          <p>&copy; {new Date().getFullYear()} HelpBro Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
