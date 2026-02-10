import { Link } from 'react-router-dom';
import { motion as Motion } from "framer-motion";

const Footer = () => {
  const fadetup = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
  };

  return (
    <Motion.footer 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="mt-12 border-t border-blue-50 bg-white font-['DM_Sans']"
    >
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Brand - 4 Cols */}
          <Motion.div variants={fadetup} className="lg:col-span-4 space-y-6">
            <Link 
  to="/library" 
  className="flex items-center gap-3 group transition-all duration-300"
>
  {/* Logo with a soft rounded edge and hover lift */}
  <img 
    src="./logo1.jpg" 
    alt="GoLibrary Logo" 
    className="h-9 w-auto rounded-lg object-contain transition-transform group-hover:scale-110" 
  />
  
  {/* Text using DM Sans SemiBold (600) */}
  <p className="font-['DM_Sans'] font-semibold text-xl tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
   <span className="text-black-600">GoLibrary</span>
  </p>
</Link>
            <p className="text-gray-500 font-normal leading-relaxed text-base">
              The premium academic repository for modern students. 
              Upload, search, and download resources with zero friction.
            </p>
          </Motion.div>

          {/* Links - 4 Cols */}
          <Motion.div variants={fadetup} className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-gray-900 uppercase tracking-widest">Library</span>
              <Link to="/library" className="text-gray-500 font-normal hover:text-blue-600 transition-colors">Lecture Notes</Link>
              <Link to="/library" className="text-gray-500 font-normal hover:text-blue-600 transition-colors">Past Questions</Link>
            </div>
            <div className="flex flex-col gap-4">
              <span className="text-xs font-semibold text-gray-900 uppercase tracking-widest">Community</span>
              <Link to="/upload" className="text-gray-500 font-normal hover:text-blue-600 transition-colors">Upload Notes</Link>
              <Link to="/upload" className="text-gray-500 font-normal hover:text-blue-600 transition-colors">Upload Past Questions</Link>
            </div>
          </Motion.div>

          {/* Premium CTA - 4 Cols */}
          <Motion.div 
            variants={fadetup}
            className="lg:col-span-4 bg-blue-600 rounded-3xl p-8 text-white shadow-2xl shadow-blue-200 relative overflow-hidden group"
          >
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-2">Contribute Today</h3>
              <p className="text-blue-100 font-normal text-sm mb-6 opacity-90">
                Join 5,000+ students sharing resources.
              </p>
              <Link 
                to="/upload" 
                className="inline-block bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-all active:scale-95"
              >
                Get Started
              </Link>
            </div>
            {/* Visual Flair */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
          </Motion.div>
        </div>

        {/* Minimal Bottom Bar */}
        <Motion.div 
          variants={fadetup}
          className="mt-20 pt-10 border-t border-gray-100 text-center"
        >
          <p className="text-sm font-normal text-gray-400">
            © {new Date().getFullYear()} UniLibrary. All rights reserved.
          </p>
        </Motion.div>
      </div>
    </Motion.footer>
  );
};

export default Footer;