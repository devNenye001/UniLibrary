import { motion as Motion } from "framer-motion";
import { Link } from "react-router-dom";
import { IoArrowForward, IoSearch, IoCloudDownload, IoCloudUpload, IoCloudUploadOutline, IoSearchOutline, IoCheckmarkCircle, IoPeopleOutline, IoShieldCheckmarkOutline, IoRocketOutline } from "react-icons/io5";
import Footer from "../components/Footer";

export default function LandingPage() {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <div className="bg-[#f8fafc] font-['DM_Sans']">

        {/* 1. NAVBAR */}
      <nav className="fixed top-0 w-full z-[100] bg-white/70 backdrop-blur-xl border-b border-blue-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <img src="./logo1.jpg" alt="Logo" className="h-8 w-auto rounded-lg" />
             <p className="font-semibold text-xl tracking-tight">GoLibrary</p>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition">How It Works</a>
            <Link to="/library" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition">
              Get Started
            </Link>
          </div>
        </div>
      </nav>
      {/* --- HERO SECTION --- */}
<section className="relative pt-32 pb-20 px-6 overflow-hidden font-['DM_Sans']">
  <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
    
    {/* Left Side: Content */}
    <Motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{ visible: { transition: { staggerChildren: 0.2 } } }}
    >
      {/* New Feature Tag */}
      <Motion.div 
        variants={fadeInUp}
        className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-full pl-1 pr-4 py-1 mb-8 hover:bg-blue-100 transition-colors cursor-default group"
      >
        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          New
        </span>
        <span className="text-blue-700 text-xs font-semibold">
          You can now search for past questions
        </span>
        <IoArrowForward className="text-blue-400 group-hover:translate-x-1 transition-transform" size={12} />
      </Motion.div>

      <Motion.h1 variants={fadeInUp} className="text-5xl lg:text-7xl font-semibold text-gray-900 leading-[1.1] mb-6">
        All your academic resources, one <span className="text-blue-600">library.</span>
      </Motion.h1>

      <Motion.p variants={fadeInUp} className="text-lg text-gray-500 font-normal mb-10 leading-relaxed max-w-lg">
        GoLibrary gives you instant access to years of campus past questions and lecture notes. Search, preview, and download everything you need to ace your courses.
      </Motion.p>

      <Motion.div variants={fadeInUp} className="flex gap-4">
        <Link 
          to="/library" 
          className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-semibold shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all flex items-center gap-2 group"
        >
          Get Started 
          <IoArrowForward className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </Motion.div>
    </Motion.div>

    {/* Right Side: Laptop Mockup */}
    <Motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="relative flex justify-center lg:justify-end"
    >
      <img 
        src="./image.png" 
        alt="GoLibrary Laptop Mockup" 
        className="w-full max-w-[650px] h-auto object-contain drop-shadow-[0_35px_35px_rgba(59,130,246,0.15)] transition-transform hover:scale-[1.02] duration-500" 
      />
      {/* Soft background glow behind laptop */}
      <div className="absolute -z-10 w-80 h-80 bg-blue-400/10 blur-[120px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
    </Motion.div>
  </div>
</section>

      <section id="about" className="py-24 bg-white font-['DM_Sans'] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          
          {/* Visual Side */}
          <Motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Main Image Frame */}
            <div className="relative z-10 rounded-[3rem] overflow-hidden border-[12px] border-blue-50/50 shadow-2xl shadow-blue-900/10">
              <img 
                src="./about1.png" 
                alt="Students studying together" 
                className="w-full h-full object-cover aspect-[4/5] lg:aspect-square" 
              />
            </div>

            {/* Floating Glass Stat Card */}
            <Motion.div 
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-10 -right-6 z-20 bg-white/90 backdrop-blur-xl border border-white p-8 rounded-[2rem] shadow-2xl shadow-blue-500/10 max-w-[220px]"
            >
              <p className="text-4xl font-semibold text-blue-600 leading-none tracking-tighter">100%</p>
              <p className="text-sm font-semibold text-gray-800 mt-3 leading-tight">Student-Led & Community Driven</p>
            </Motion.div>
          </Motion.div>

          {/* Text Content Side */}
          <div className="space-y-10">
            <div className="space-y-6">
             
              <h2 className="text-4xl md:text-5xl font-semibold text-gray-900 leading-[1.15]">
                Built to Bridge the <span className="text-blue-600">Resource Gap.</span>
              </h2>
              <p className="text-lg text-gray-500 font-normal leading-relaxed">
                GoLibrary started with a single mission: to ensure no student is left behind due to a lack of study materials. We’ve built a digital bridge between senior students with wealths of knowledge and new students navigating their academic journey.
              </p>
            </div>

            {/* Core Values List */}
            <div className="grid sm:grid-cols-2 gap-y-10 gap-x-8">
              <ValueCard 
                icon={<IoPeopleOutline className="text-blue-600" size={24} />} 
                title="By Students" 
                desc="Content curated and uploaded by the campus community." 
              />
              <ValueCard 
                icon={<IoShieldCheckmarkOutline className="text-blue-600" size={24} />} 
                title="Verified" 
                desc="Systematic sorting to ensure you get the right year and course." 
              />
              <ValueCard 
                icon={<IoRocketOutline className="text-blue-600" size={24} />} 
                title="Efficient" 
                desc="Spend less time searching and more time actually studying." 
              />
              <ValueCard 
                icon={<IoCheckmarkCircle className="text-blue-600" size={24} />} 
                title="Free Access" 
                desc="Core academic resources should always be accessible to all." 
              />
            </div>
          </div>
        </div>
      </div>
    </section>
{/* 3. FEATURES (Glassmorphism Cards) */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-semibold text-gray-900">Why Students Choose GoLibrary</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<IoCloudUploadOutline />} 
              title="Fast Uploads" 
              desc="Snap a photo of your past question or upload a PDF note in seconds." 
            />
            <FeatureCard 
              icon={<IoSearchOutline />} 
              title="Smart Search" 
              desc="Find materials instantly by course name or course code." 
            />
            <FeatureCard 
              icon={<IoCheckmarkCircle />} 
              title="Zero Friction" 
              desc="Download materials instantly. No broken links or complex signups." 
            />
          </div>
        </div>
      </section>
      {/* --- HOW IT WORKS (Sectioned with recordings) --- */}
      <section id="how-it-works" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
             <h2 className="text-3xl font-semibold text-gray-900">How GoLibrary Works</h2>
             <div className="h-1 w-20 bg-blue-600 rounded-full mt-4" />
          </div>

          <div className="space-y-32">
            {/* Step 1 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">1</div>
                <h3 className="text-2xl font-semibold mb-4">Find your course</h3>
                <p className="text-gray-500 font-normal leading-relaxed text-lg">
                  Instantly search for specific materials using course names or codes like <span className="text-blue-600 font-semibold">CSC 201</span>. Our smart library indexes everything for quick access.
                </p>
              </div>
              <div className="order-1 lg:order-2 aspect-video  overflow-hidden flex items-center justify-center italic text-gray-400">
                <video src="./search.mp4" alt="Search Demo" className="w-full h-full object-cover" controls autoPlay />
              </div>
            </div>

            {/* Step 2 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-1 lg:order-2 aspect-video  overflow-hidden flex items-center justify-center italic text-gray-400">
                <video src="./preview.mp4" alt="Preview Demo" className="w-full h-full object-cover" controls autoPlay />
              </div>
              <div>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">2</div>
                <h3 className="text-2xl font-semibold mb-4">Preview & Download</h3>
                <p className="text-gray-500 font-normal leading-relaxed text-lg">
                  Browse through modern glassmorphism cards. Preview the content directly in your browser and download high-quality PDFs or images with one click.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="order-2 lg:order-1">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-xl mb-6">3</div>
                <h3 className="text-2xl font-semibold mb-4">Upload Materials</h3>
                <p className="text-gray-500 font-normal leading-relaxed text-lg">
                  Help build the largest campus academic repository. Upload your own lecture notes or photos of past questions to support your fellow students.
                </p>
              </div>
             <div className="order-1 lg:order-2 aspect-video  overflow-hidden flex items-center justify-center italic text-gray-400">
                <video src="./upload.mp4" alt="Upload Demo" className="w-full h-full object-cover" controls autoPlay />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-4 px-6">
        <div className="max-w-5xl mx-auto bg-blue-600 rounded-[3rem] p-12 md:p-20 text-center text-white shadow-2xl shadow-blue-200 overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-semibold mb-6">Ready to start studying?</h2>
            <p className="text-blue-100 font-normal mb-10 max-w-md mx-auto">Access the library today and get the materials you need to excel in your next exam.</p>
            <Link to="/library" className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-semibold hover:bg-gray-50 transition-all inline-block">
              Get Started for Free
            </Link>
          </div>
          {/* Subtle animated background shapes */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
        </div>
      </section>
      <Footer />
    </div>
  );
}

// Sub-components
function FeatureCard({ icon, title, desc }) {
  return (
    <Motion.div 
      whileHover={{ y: -10 }}
      className="p-8 bg-white border border-blue-50 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all"
    >
      <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
    </Motion.div>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-blue-100">
        {icon}
      </div>
      <div>
        <h4 className="font-semibold text-gray-900 text-lg mb-1">{title}</h4>
        <p className="text-sm text-gray-500 font-normal leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}