import { Facebook, Twitter, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-gray-900 text-gray-400 py-16 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute bottom-0 left-0 w-full h-[500px] bg-gradient-to-t from-blue-900/10 to-transparent pointer-events-none"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full pointer-events-none"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand Section */}
          <div className="space-y-6">
            <Link to="/" className="text-2xl font-bold text-white flex items-center space-x-2">
              <span className="bg-blue-600 w-8 h-8 rounded-lg flex items-center justify-center text-white">H</span>
              <span>HelpBro</span>
            </Link>
            <p className="text-sm leading-relaxed">
              Leading the way in premium home services. Trusted professionals at your doorstep, instantly.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Twitter size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Quick Links</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-blue-500 transition-colors">Find a Service</Link>
              </li>
              <li>
                <Link to="/become-partner" className="hover:text-blue-500 transition-colors">Become a Partner</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-blue-500 transition-colors">Login / Register</Link>
              </li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div>
            <h3 className="text-lg font-bold text-white mb-6">Company</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">About Us</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">Terms of Service</a>
              </li>
              <li>
                <a href="#" className="hover:text-blue-500 transition-colors">Support Center</a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white mb-6">Get in Touch</h3>
            <ul className="space-y-4 text-sm">
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
            
            {/* Newsletter Input */}
            <div className="pt-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2 block">Subscribe to Newsletter</label>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Enter email" 
                  className="bg-white/5 border border-white/10 rounded-l-lg px-4 py-2 w-full text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg text-sm font-medium transition-colors">
                  Go
                </button>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600">
          <p>&copy; {new Date().getFullYear()} HelpBro Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-gray-400">Privacy</a>
            <a href="#" className="hover:text-gray-400">Terms</a>
            <a href="#" className="hover:text-gray-400">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
