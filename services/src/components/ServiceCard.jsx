import { Star, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  return (
    <Link 
        to={`/services/${service._id}`}
        className="group bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="aspect-w-16 aspect-h-10 bg-gray-100 dark:bg-gray-900 relative overflow-hidden">
        {service.image ? (
                    <img 
                        src={service.image} 
                        alt={service.name} 
                        className="w-full h-24 sm:h-32 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
        ) : (
            <div className="w-full h-32 md:h-56 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <span className="text-2xl md:text-4xl font-serif font-bold text-gray-300 dark:text-gray-600 transition-colors uppercase">{service.name[0]}</span>
            </div>
        )}
            <div className="absolute top-2 right-2 bg-white/90 dark:bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded flex items-center text-gray-900 dark:text-yellow-400 text-[10px] sm:text-xs font-bold shadow-sm">
                <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-0.5 text-yellow-500 dark:text-yellow-400 fill-current" />
                {service.rating || 4.8}
            </div>
      </div>
      
      <div className="p-3 sm:p-4 bg-white dark:bg-[#111] flex flex-col flex-1">
        <h3 className="text-xs sm:text-sm md:text-xl font-bold font-serif text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight mb-2">
            {service.name}
        </h3>
        
        <div className="flex flex-col mt-auto">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-gray-900 dark:text-white font-black text-[12px] sm:text-sm md:text-base shrink-0">
                    ₹{service.price}
                </span>
                
                {service.provider && service.provider.name && (
                    <div className="flex items-center text-[10px] sm:text-[11px] md:text-xs text-gray-500 dark:text-gray-400 font-medium truncate ml-1 border-l pl-2 border-gray-200 dark:border-gray-700">
                        <span className="w-3.5 h-3.5 shrink-0 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center text-[7.5px] font-bold text-blue-600 dark:text-blue-400 mr-1.5 hidden sm:flex">
                            {service.provider.name[0]?.toUpperCase()}
                        </span>
                        <span className="truncate">{service.provider.name}</span>
                    </div>
                )}
            </div>
            
            {service.duration && (
                <div className="flex items-center text-[9px] sm:text-[10px] md:text-xs text-gray-400 dark:text-gray-500 font-sans font-medium">
                    <Clock className="w-2.5 h-2.5 md:w-3 md:h-3 mr-1 text-gray-400" />
                    {service.duration} mins
                </div>
            )}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
