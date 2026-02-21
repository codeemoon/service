import { Link } from "react-router-dom";
import { DollarSign, Calendar, Users, TrendingUp, CheckCircle, Star, Briefcase, Clock, Shield } from "lucide-react";

const ProviderLanding = () => {
  return (
    <div className="text-white">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
            Become a Partner
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join thousands of professionals earning on their own schedule. 
            Grow your business, reach more customers, and maximize your income.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link
              to="/provider-register"
              className="px-8 py-4 bg-[#ff4d4d] hover:bg-[#ff3333] text-white rounded-full font-bold text-lg transition-all shadow-lg hover:shadow-red-500/30 flex items-center"
            >
              Start Earning Today
            </Link>
            <a
              href="#how-it-works"
              className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-full font-bold text-lg transition-all border border-gray-700"
            >
              Learn More
            </a>
          </div>
        </div>
        
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-[#0a0a0a] border-y border-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-[#ff4d4d] mb-2">10,000+</div>
              <div className="text-gray-400">Active Partners</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#ff4d4d] mb-2">$2,500</div>
              <div className="text-gray-400">Avg. Monthly Earnings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#ff4d4d] mb-2">50,000+</div>
              <div className="text-gray-400">Bookings Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-[#ff4d4d] mb-2">4.8/5</div>
              <div className="text-gray-400">Partner Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Why Partner With Us?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We provide everything you need to succeed and grow your business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BenefitCard
              icon={<DollarSign className="w-8 h-8" />}
              title="Maximize Your Earnings"
              description="Set your own rates and keep up to 85% of every booking. No hidden fees, transparent pricing."
              color="green"
            />
            <BenefitCard
              icon={<Calendar className="w-8 h-8" />}
              title="Flexible Schedule"
              description="Work when you want. Accept bookings that fit your schedule. You're in complete control."
              color="blue"
            />
            <BenefitCard
              icon={<Users className="w-8 h-8" />}
              title="Steady Customer Flow"
              description="Access thousands of customers actively looking for your services. We handle the marketing."
              color="purple"
            />
            <BenefitCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Grow Your Business"
              description="Build your reputation with reviews and ratings. Top performers get priority placement."
              color="yellow"
            />
            <BenefitCard
              icon={<Shield className="w-8 h-8" />}
              title="Payment Protection"
              description="Guaranteed payment for completed jobs. We handle disputes and ensure you get paid on time."
              color="red"
            />
            <BenefitCard
              icon={<Briefcase className="w-8 h-8" />}
              title="Professional Tools"
              description="Dashboard to manage bookings, track earnings, and communicate with customers seamlessly."
              color="indigo"
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Get started in 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
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
      <section className="py-24 bg-[#050505]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">What Our Partners Say</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Real stories from real professionals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-t border-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Start Earning?</h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            Join our community of successful professionals today. No commitments, no monthly fees.
          </p>
          <Link
            to="/provider-register"
            className="inline-block px-10 py-5 bg-[#ff4d4d] hover:bg-[#ff3333] text-white rounded-full font-bold text-xl transition-all shadow-lg hover:shadow-red-500/30"
          >
            Become a Partner Now
          </Link>
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
    <div className="bg-[#111] border border-gray-800 rounded-2xl p-8 hover:border-gray-700 transition-all">
      <div className={`w-16 h-16 ${colorClasses[color]} rounded-full flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed">{description}</p>
    </div>
  );
};

const StepCard = ({ number, title, description }) => (
  <div className="text-center">
    <div className="w-16 h-16 bg-[#ff4d4d] rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
      {number}
    </div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </div>
);

const TestimonialCard = ({ name, role, rating, text }) => (
  <div className="bg-[#111] border border-gray-800 rounded-2xl p-8">
    <div className="flex items-center mb-4">
      {[...Array(rating)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-yellow-500 fill-yellow-500" />
      ))}
    </div>
    <p className="text-gray-300 mb-6 leading-relaxed">"{text}"</p>
    <div>
      <div className="font-bold text-white">{name}</div>
      <div className="text-sm text-gray-500">{role}</div>
    </div>
  </div>
);

export default ProviderLanding;
