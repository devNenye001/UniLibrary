import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  IoArrowForward,
  IoCloudUploadOutline,
  IoSearchOutline,
  IoSparklesOutline,
  IoDocumentTextOutline,
  IoStatsChartOutline,
  IoShieldCheckmarkOutline,
  IoDownloadOutline,
} from "react-icons/io5";
import Footer from "../components/layouts/Footer";

export default function LandingPage() {
  useEffect(() => {
    document.title = "GoLibrary | Premium University Portal";
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden selection:bg-campus-600/30">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/20 bg-white/60 backdrop-blur-2xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <img src="/logo1.jpg" alt="GoLibrary Logo" className="h-10 w-10 rounded-xl object-cover shadow-sm" />
            <span className="text-xl font-bold tracking-tight text-slate-900">GoLibrary</span>
          </div>
          <div className="flex items-center gap-4">
            <Link className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors" to="/login">
              Sign In
            </Link>
            <Link className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-medium text-white shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] hover:-translate-y-[1px]" to="/register">
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center px-6 pt-16 pb-24 text-center">
          <div className="absolute inset-0 aurora-bg -z-10 opacity-70"></div>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto flex flex-col items-center"
          >
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-semibold tracking-tight text-slate-900 leading-[1.1] mb-8 font-sans">
              Every academic resource. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-campus-600 to-campus-300">Beautifully organized.</span>
            </motion.h1>
            
            <motion.p variants={itemVariants} className="text-lg md:text-xl leading-relaxed text-slate-600 max-w-2xl mx-auto mb-10">
              Experience the world's most elegant academic platform. AI-powered search, seamless uploads, and smart recommendations tailored for Godfrey Okoye University.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-16">
              <Link className="group flex h-14 items-center justify-center gap-2 rounded-full bg-slate-900 px-8 text-base font-semibold text-white shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] hover:-translate-y-1 w-full sm:w-auto" to="/register">
                Start Exploring
                <IoArrowForward className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link className="flex h-14 items-center justify-center gap-2 rounded-full glass-card px-8 text-base font-semibold text-slate-700 transition-all hover:bg-white/80 w-full sm:w-auto" to="/login">
                Sign In to Account
              </Link>
            </motion.div>

            {/* Realistic Application Mockup */}
            <motion.div variants={itemVariants} className="relative w-full max-w-3xl mx-auto px-4 md:px-0">
              {/* Floating Widgets */}
              <div className="absolute -left-12 top-16 z-20 hidden lg:block">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="glass-card p-4 shadow-xl flex items-center gap-3 border border-white/60"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-campus-600/10 text-campus-600">
                    <IoSparklesOutline className="text-lg text-campus-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">AI Recommended</p>
                    <p className="text-xs font-bold text-slate-800">CSC 305 Notes</p>
                  </div>
                </motion.div>
              </div>

              <div className="absolute -right-12 bottom-12 z-20 hidden lg:block">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="glass-card p-4 shadow-xl flex items-center gap-3 border border-white/60"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/10 text-green-600">
                    <IoStatsChartOutline className="text-lg text-green-600" />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Downloads</p>
                    <p className="text-xs font-bold text-slate-800">14.8k Materials</p>
                  </div>
                </motion.div>
              </div>

              {/* Browser frame */}
              <div className="glass-card overflow-hidden border border-white/70 shadow-[0_20px_50px_rgba(0,0,0,0.06)] bg-white/45">
                {/* Browser Title Bar */}
                <div className="flex items-center gap-2 border-b border-white/40 bg-white/40 px-6 py-3">
                  <div className="flex gap-1.5">
                    <span className="h-3 w-3 rounded-full bg-red-400/80"></span>
                    <span className="h-3 w-3 rounded-full bg-yellow-400/80"></span>
                    <span className="h-3 w-3 rounded-full bg-green-400/80"></span>
                  </div>
                  <div className="mx-auto flex h-6 w-1/2 items-center justify-center rounded-full bg-white/50 px-3 text-[10px] font-semibold text-slate-400">
                    go-library.vercel.app
                  </div>
                </div>

                {/* Dashboard Inner UI */}
                <div className="bg-slate-50/20 p-6 md:p-8 text-left">
                  {/* Mock Navbar */}
                  <div className="flex items-center justify-between pb-6 border-b border-slate-200/40">
                    <div className="flex items-center gap-2">
                      <img src="/logo1.jpg" alt="Logo" className="h-7 w-7 rounded-lg object-cover shadow-sm" />
                      <span className="text-sm font-bold text-slate-800 tracking-tight">GoLibrary</span>
                    </div>
                    <div className="flex items-center gap-4 text-[11px] font-bold text-slate-400">
                      <span className="text-campus-600 font-extrabold">Search</span>
                      <span>Browse</span>
                      <span>Upload</span>
                    </div>
                  </div>

                  {/* Search Bar Illustration */}
                  <div className="mt-8 max-w-lg mx-auto text-center">
                    <div className="relative">
                      <IoSearchOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                      <input
                        type="text"
                        disabled
                        value="CSC 301 - Operating Systems"
                        className="w-full rounded-full border border-slate-200/50 bg-white/80 py-2.5 pl-11 pr-4 text-xs font-semibold text-slate-800 outline-none shadow-sm"
                      />
                    </div>
                  </div>

                  {/* Results Illustration */}
                  <div className="mt-8 grid sm:grid-cols-2 gap-4">
                    {/* Material Card Mock 1 */}
                    <div className="glass-card p-5 border border-white bg-white/60 flex flex-col justify-between h-36 shadow-sm">
                      <div className="flex justify-between items-start">
                        <span className="rounded-full bg-campus-600/10 px-2.5 py-0.5 text-[9px] font-bold text-campus-700 uppercase tracking-wider">
                          CSC 301
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-400 flex items-center gap-1">
                          <IoDownloadOutline /> 142
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 leading-snug tracking-tight">
                        Operating Systems Past Question (2022/2023 Exam)
                      </h4>
                      <div className="flex items-center justify-between pt-2 text-[9px] font-bold text-slate-400">
                        <span>Computer Science</span>
                        <span>300 Level</span>
                      </div>
                    </div>

                    {/* Material Card Mock 2 */}
                    <div className="glass-card p-5 border border-white bg-white/60 flex flex-col justify-between h-36 shadow-sm">
                      <div className="flex justify-between items-start">
                        <span className="rounded-full bg-campus-600/10 px-2.5 py-0.5 text-[9px] font-bold text-campus-700 uppercase tracking-wider">
                          GST 101
                        </span>
                        <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-400 flex items-center gap-1">
                          <IoDownloadOutline /> 589
                        </span>
                      </div>
                      <h4 className="font-bold text-xs text-slate-800 leading-snug tracking-tight">
                        Use of English & Study Skills Notes
                      </h4>
                      <div className="flex items-center justify-between pt-2 text-[9px] font-bold text-slate-400">
                        <span>General Studies</span>
                        <span>100 Level</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Feature Section: Students */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-sm font-semibold tracking-widest text-campus-600 uppercase mb-3">For Students</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">Learn at the speed of thought.</h3>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                Finding the right study material shouldn't be a chore. With GoLibrary's AI-powered search, pinpoint exactly what you need in milliseconds.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <IoSearchOutline />, title: "AI-Powered Search", desc: "Instantly find notes, past questions, and slides." },
                  { icon: <IoSparklesOutline />, title: "Smart Recommendations", desc: "Discover materials tailored to your department and level." },
                  { icon: <IoDocumentTextOutline />, title: "Easy Downloads", desc: "Access your files anywhere, anytime, completely hassle-free." }
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl glass-card text-xl text-campus-600 shadow-sm">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">{feature.title}</h4>
                      <p className="text-slate-600 text-sm mt-1">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="aspect-[4/3] rounded-[2rem] glass-card p-6 bg-gradient-to-tr from-slate-100 to-white overflow-hidden shadow-2xl relative border border-white/60">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(10,132,255,0.1),transparent_50%)]"></div>
                 
                 {/* Student View Mockup */}
                 <div className="flex flex-col gap-4 h-full">
                    {/* Header search bar */}
                    <div className="w-full h-11 rounded-full bg-white/80 border border-slate-200/60 shadow-sm flex items-center px-4">
                       <IoSearchOutline className="text-slate-400 mr-2 text-sm shrink-0" />
                       <span className="text-xs font-semibold text-slate-800">COM 301 - Computer Architecture</span>
                    </div>
                    
                    {/* Simulated Note Card */}
                    <div className="flex-1 glass-card bg-white/90 p-5 flex flex-col border border-white shadow-md">
                      {/* Document Preview Area */}
                      <div className="w-full h-24 bg-slate-50 flex items-center justify-center rounded-xl mb-4 border border-slate-200/50 shadow-inner">
                        <div className="flex flex-col items-center">
                          <span className="text-3xl">📄</span>
                          <span className="text-[9px] font-bold text-campus-600 mt-2 tracking-[0.25em]">PDF DOCUMENT</span>
                        </div>
                      </div>
                      
                      <h4 className="font-bold text-sm text-slate-800 truncate mb-1">
                        Lecture notes on MIPS Assembly Language
                      </h4>
                      <p className="text-[9px] font-bold text-campus-600 mb-1 uppercase tracking-widest">
                        COM 301
                      </p>
                      <p className="text-xs font-medium text-slate-400 mb-4">2023/2024 Session • 2.4 MB</p>

                      <div className="mt-auto flex justify-end gap-2">
                        <button className="rounded-full bg-slate-100 px-4 py-2 text-[10px] font-bold text-slate-600 transition hover:bg-slate-200">
                          View details
                        </button>
                        <button className="rounded-full bg-slate-900 px-4 py-2 text-[10px] font-bold text-white transition hover:bg-slate-800">
                          Preview Note
                        </button>
                      </div>
                    </div>
                 </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Section: Lecturers */}
        <section className="py-24 px-6 bg-slate-900 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(94,92,230,0.15),transparent_50%)]"></div>
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="order-2 lg:order-1 relative"
            >
              <div className="aspect-[4/3] rounded-[2rem] glass-card-dark p-6 border border-white/10 overflow-hidden shadow-2xl relative">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(94,92,230,0.15),transparent_50%)]"></div>
                 
                 {/* Lecturer Upload Mockup */}
                 <div className="flex flex-col gap-4 h-full justify-between">
                    <div className="flex justify-between items-center pb-2 border-b border-white/5">
                      <span className="text-xs font-bold text-slate-300">Upload New Resource</span>
                      <span className="text-[10px] font-bold text-campus-300">LECTURER PORTAL</span>
                    </div>

                    {/* Drag and Drop Zone Mock */}
                    <div className="flex-1 rounded-xl border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center p-4">
                       <IoCloudUploadOutline className="text-4xl text-campus-300 mb-2" />
                       <span className="text-xs font-bold text-white mb-1">Drag file here to upload</span>
                       <span className="text-[10px] text-slate-400">PDF, DOCX up to 50MB</span>
                    </div>

                    {/* File Upload Progress Item */}
                    <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-2">
                       <div className="flex justify-between text-[10px] font-bold">
                          <span className="text-white truncate max-w-[70%]">CSC_402_Computer_Graphics.pdf</span>
                          <span className="text-green-400 font-extrabold">100% Uploaded</span>
                       </div>
                       <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-green-400 h-full w-full"></div>
                       </div>
                    </div>

                    {/* Form Fields & Submit Button */}
                    <div className="flex gap-2">
                      <div className="flex-1 bg-white/5 border border-white/10 rounded-full py-1.5 px-3 text-[10px] text-slate-300 flex items-center">
                        CSC 402
                      </div>
                      <button className="rounded-full bg-campus-600 hover:bg-campus-700 px-4 py-2 text-[10px] font-bold text-white shadow-sm transition">
                        Publish Material
                      </button>
                    </div>
                 </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="order-1 lg:order-2"
            >
              <h2 className="text-sm font-semibold tracking-widest text-campus-300 uppercase mb-3">For Lecturers</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6">Effortless distribution.</h3>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                Upload and manage your course materials with unprecedented ease. Keep track of resources and ensure every student has access to knowledge.
              </p>
              
              <div className="space-y-6">
                {[
                  { icon: <IoCloudUploadOutline />, title: "Streamlined Uploads", desc: "Drag and drop your lecture materials in seconds." },
                  { icon: <IoDocumentTextOutline />, title: "Resource Tracking", desc: "Organize materials by session, semester, and course." },
                  { icon: <IoStatsChartOutline />, title: "Better Distribution", desc: "Instantly share academic content across your entire class." }
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl glass-card border border-white/10 bg-white/5 text-xl text-campus-300 shadow-sm">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{feature.title}</h4>
                      <p className="text-slate-400 text-sm mt-1">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Feature Section: Admin */}
        <section className="py-24 px-6 relative overflow-hidden">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-sm font-semibold tracking-widest text-campus-600 uppercase mb-3">University Administration</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 max-w-2xl mx-auto">
              Scalable infrastructure for digital preservation.
            </h3>
            
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              {[
                { icon: <IoShieldCheckmarkOutline />, title: "Centralized Library", desc: "A single, secure repository for all university knowledge and resources." },
                { icon: <IoStatsChartOutline />, title: "Platform Analytics", desc: "Gain insights into platform usage, active users, and popular materials." },
                { icon: <IoDocumentTextOutline />, title: "Knowledge Preservation", desc: "Ensure past questions and notes are safely archived for future generations." }
              ].map((item, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="glass-card p-8 text-left hover:-translate-y-2 transition-transform duration-300 cursor-default"
                >
                  <div className="h-14 w-14 rounded-2xl bg-campus-50 text-campus-600 flex items-center justify-center text-2xl mb-6">
                    {item.icon}
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h4>
                  <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-6">
          <div className="max-w-5xl mx-auto rounded-[3rem] glass-card p-12 md:p-20 text-center relative overflow-hidden shadow-2xl bg-gradient-to-b from-white to-slate-50">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(10,132,255,0.08),transparent_70%)]"></div>
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6 relative z-10">
              Ready to elevate your learning?
            </h2>
            <p className="text-lg text-slate-600 mb-10 max-w-xl mx-auto relative z-10">
              Join GoLibrary today and experience the future of academic resource management at Godfrey Okoye University.
            </p>
            <div className="relative z-10">
              <Link className="inline-flex h-14 items-center justify-center rounded-full bg-slate-900 px-10 text-base font-medium text-white shadow-xl transition-all hover:shadow-2xl hover:scale-105 active:scale-95" to="/register">
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
