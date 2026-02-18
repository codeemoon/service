import { Star, Clock, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const ServiceCard = ({ service }) => {
  return (
    <Link 
        to={`/services/${service._id}`}
        className="group bg-[#111] border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 block"
    >
      <div className="aspect-w-16 aspect-h-10 bg-gray-900 relative overflow-hidden">
        {service.image ? (
            <img 
                src={service.image} 
                alt={service.name} 
                className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-500" 
            />
        ) : (
            <div className="w-full h-56 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                <span className="text-4xl font-bold text-gray-700 group-hover:text-gray-600 transition-colors">{service.name[0]}</span>
            </div>
        )}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center text-yellow-400 text-sm font-bold border border-white/10">
            <Star className="w-3 h-3 mr-1 fill-current" />
            {service.rating || 4.8}
        </div>
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">{service.name}</h3>
            <span className="text-white font-bold bg-blue-600/20 text-blue-400 px-2 py-1 rounded text-xs">
                ₹{service.price}
            </span>
        </div>
        
        <p className="text-gray-400 text-sm mb-4 line-clamp-2 h-10">{service.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/10 pt-4">
            <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {service.duration} mins
            </div>
            
            {service.provider && (
                <div className="flex items-center">
                    <span className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center text-[8px] text-white mr-1">
                        {service.provider.name?.[0]}
                    </span>
                    {service.provider.name}
                </div>
            )}
        </div>
      </div>
    </Link>
  );
};

export default ServiceCard;
