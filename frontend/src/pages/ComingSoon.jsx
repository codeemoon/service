import { Link } from "react-router-dom";
import { Hammer, ArrowLeft, Wrench, Sparkles } from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 dark:bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-400/10 dark:bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-400/5 dark:bg-orange-500/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg mx-auto">
        {/* Animated Icon */}
        <div className="flex justify-center mb-8">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-orange-500/30 rotate-3 hover:rotate-0 transition-all duration-500">
              <Hammer className="w-12 h-12 text-white" />
            </div>
            {/* Sparkle */}
            <div className="absolute -top-2 -right-2 w-7 h-7 bg-yellow-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
              <Sparkles className="w-4 h-4 text-yellow-900" />
            </div>
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-orange-50 dark:bg-orange-500/10 border border-orange-100 dark:border-orange-500/20 px-4 py-1.5 rounded-full mb-6">
          <Wrench className="w-3.5 h-3.5 text-orange-500" />
          <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-widest">Work Under Construction</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white tracking-tight mb-4 leading-tight">
          We're building<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-purple-600">
            something great
          </span>
        </h1>

        {/* Description */}
        <p className="text-base text-gray-600 dark:text-gray-400 leading-relaxed mb-10 max-w-md mx-auto">
          The Service Provider onboarding portal is currently under development. 
          Check back soon — we're working hard to bring it live for you!
        </p>

        {/* Progress bar */}
        <div className="w-full max-w-xs mx-auto mb-10">
          <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
            <span>Progress</span>
            <span>72%</span>
          </div>
          <div className="h-2 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
            <div className="h-full w-[72%] bg-gradient-to-r from-orange-400 to-purple-500 rounded-full animate-pulse" />
          </div>
        </div>

        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-700 dark:hover:bg-gray-200 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
