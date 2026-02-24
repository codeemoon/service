import { Link } from "react-router-dom";
import { IndianRupee, Calendar, Users, TrendingUp, CheckCircle, Star, Briefcase, Clock, Shield } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const ProviderLanding = () => {
  const { user } = useAuth();

  return (
    <div className="text-gray-900 dark:text-white bg-gray-50 dark:bg-[#0a0a0a]">
      {/* Hero Section */}
      <section className="relative pt-12 pb-8 md:pt-24 md:pb-12 overflow-hidden border-b border-gray-100 dark:border-gray-900/50">
        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 px-3 py-1.5 rounded-full mb-6">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-xs md:text-sm font-bold text-blue-600 dark:text-blue-400">Accepting New Partners</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 md:mb-6 leading-[1.1] text-gray-900 dark:text-white">
            Grow your business <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
              with HelpBro
            </span>
          </h1>
          
          <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2">
            Join thousands of professionals earning on their own schedule. 
            Reach more customers and maximize your income today.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 px-4 sm:px-0">
            {user ? (
               <Link
                 to="/dashboard"
                 className="w-full sm:w-auto relative group inline-flex items-center justify-center pt-0.5 pb-0.5 mb-1 sm:mb-0 mr-0 sm:mr-2 overflow-hidden text-sm font-medium rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-blue-500/25"
               >
                 <span className="relative w-full px-8 py-3.5 flex justify-center items-center font-bold text-base tracking-wide">
                   Go To Dashboard
                 </span>
               </Link>
            ) : (
               <Link
                 to="/provider-register"
                 className="w-full sm:w-auto relative group inline-flex items-center justify-center pt-0.5 pb-0.5 mb-1 sm:mb-0 mr-0 sm:mr-2 overflow-hidden text-sm font-medium rounded-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all shadow-lg shadow-blue-500/25"
               >
                 <span className="relative w-full px-8 py-3.5 flex justify-center items-center font-bold text-base tracking-wide">
                   Start Earning Today
                 </span>
               </Link>
            )}
          </div>
        </div>
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-blue-500/10 via-purple-500/5 to-transparent blur-[100px] rounded-b-full pointer-events-none -z-10"></div>
      </section>



      {/* Benefits Section */}
      <section className="pt-8 pb-4 md:pt-16 md:pb-8 bg-gray-50 dark:bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-2">Why Partner With Us?</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
            <BenefitCard
              icon={<IndianRupee className="w-5 h-5 md:w-7 md:h-7" />}
              title="Maximize Your Earnings"
              description="Keep exactly 70% of every booking with our transparent commission plan."
              color="green"
            />
            <BenefitCard
              icon={<Calendar className="w-5 h-5 md:w-7 md:h-7" />}
              title="Flexible Schedule"
              description="Work when you want. You're in complete control."
              color="blue"
            />
            <BenefitCard
              icon={<Users className="w-5 h-5 md:w-7 md:h-7" />}
              title="Steady Customer Flow"
              description="Access thousands of customers actively looking for services."
              color="purple"
            />
            <BenefitCard
              icon={<TrendingUp className="w-5 h-5 md:w-7 md:h-7" />}
              title="Grow Your Business"
              description="Build your reputation with reviews and top placement."
              color="yellow"
            />
            <BenefitCard
              icon={<Shield className="w-5 h-5 md:w-7 md:h-7" />}
              title="Payment Protection"
              description="Guaranteed payment for all completed jobs."
              color="red"
            />
            <BenefitCard
              icon={<Briefcase className="w-5 h-5 md:w-7 md:h-7" />}
              title="Professional Tools"
              description="Easily manage bookings, tracking, and communication."
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="pt-4 pb-4 md:pt-8 md:pb-12 bg-white dark:bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">How It Works</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-12 max-w-5xl mx-auto">
            <StepCard
              number="1"
              title="Sign Up & Create Profile"
              description="Register as a provider, add your services, set your rates, and upload your portfolio."
            />
            <StepCard
              number="2"
              title="Receive Booking Requests"
              description="Customers find your services and send booking requests. Accept the ones that fit your schedule."
            />
            <StepCard
              number="3"
              title="Complete & Get Paid"
              description="Provide excellent service, mark the job as complete, and receive payment directly to your account."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="pt-8 pb-12 md:pt-16 md:pb-20 bg-gray-50 dark:bg-[#050505] border-y border-gray-100 dark:border-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-6">
            <h2 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">What Our Partners Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto">
            <TestimonialCard
              name="Sarah Johnson"
              role="House Cleaning Specialist"
              rating={5}
              text="I've tripled my income since joining! The platform is easy to use and customers are great."
            />
            <TestimonialCard
              name="Mike Rodriguez"
              role="Plumber"
              rating={5}
              text="Best decision for my business. Steady bookings and I control my schedule completely."
            />
            <TestimonialCard
              name="Emily Chen"
              role="Salon Professional"
              rating={5}
              text="The payment system is reliable and the support team is always helpful. Highly recommend!"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

const BenefitCard = ({ icon, title, description, color }) => {
  const colorClasses = {
    green: "bg-green-500/10 text-green-500",
    blue: "bg-blue-500/10 text-blue-500",
    purple: "bg-purple-500/10 text-purple-500",
    yellow: "bg-yellow-500/10 text-yellow-500",
    red: "bg-red-500/10 text-red-500",
    indigo: "bg-indigo-500/10 text-indigo-500",
  };

  return (
    <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 md:p-6 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-lg transition-all shadow-sm flex flex-col items-center text-center">
      <div className={`w-10 h-10 md:w-14 md:h-14 ${colorClasses[color]} rounded-full flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <h3 className="text-sm md:text-lg font-bold mb-1.5 text-gray-900 dark:text-white leading-tight">{title}</h3>
      <p className="text-[10px] md:text-sm text-gray-600 dark:text-gray-400 leading-snug">{description}</p>
    </div>
  );
};

const StepCard = ({ number, title, description }) => (
  <div className="text-left md:text-center flex flex-row md:flex-col items-start md:items-center bg-gray-50 dark:bg-[#111] border border-gray-100 dark:border-gray-800 p-4 rounded-2xl md:bg-transparent md:border-transparent md:p-0 md:rounded-none">
    <div className="shrink-0 w-12 h-12 md:w-16 md:h-16 bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-500 rounded-full flex items-center justify-center mr-4 md:mr-0 md:mx-auto md:mb-5 text-xl md:text-2xl font-black shadow-sm">
      {number}
    </div>
    <div>
        <h3 className="text-base md:text-xl font-bold mb-1 md:mb-3 text-gray-900 dark:text-white">{title}</h3>
        <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">{description}</p>
    </div>
  </div>
);

const TestimonialCard = ({ name, role, rating, text }) => (
  <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl p-4 md:p-6 shadow-sm">
    <div className="flex items-center mb-2 md:mb-3">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-4 h-4 text-yellow-500 fill-yellow-500" />
      ))}
    </div>
    <p className="text-xs md:text-sm text-gray-700 dark:text-gray-300 mb-3 md:mb-4 leading-relaxed italic">"{text}"</p>
    <div>
      <div className="font-bold text-gray-900 dark:text-white text-sm md:text-base">{name}</div>
      <div className="text-[10px] md:text-xs text-gray-500">{role}</div>
    </div>
  </div>
);

export default ProviderLanding;
