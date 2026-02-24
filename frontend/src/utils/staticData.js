// Static data for Categories and Services testing

export const staticCategories = [
  {
    _id: "cat_static_1",
    name: "AC & Appliance Repair",
    image: "/services/Ac and aplliemce/AC and applience Category images.jpg",
  },
  {
    _id: "cat_static_2",
    name: "Electrical Help",
    image: "/services/electrical help/catefory image.jpg",
  },
  {
    _id: "cat_static_3",
    name: "Home Cleaning",
    image: "/services/homecleaning/home cleaning category photo.png",
  },
  {
    _id: "cat_static_4",
    name: "Plumbing Repair",
    image: "/services/plumbing repair/plumbing repair category image..jpg",
  },
];

export const staticServices = [
  // AC & Appliance Repair (cat_static_1)
  {
    _id: "srv_static_1_1",
    title: "AC Service & Repair",
    description: "Professional AC servicing, gas filling, and fixing any issues.",
    price: 499,
    category: { _id: "cat_static_1", name: "AC & Appliance Repair" },
    image: "/services/Ac and aplliemce/Ac and service repair.jpg",
    rating: 4.8,
    reviews: 124,
  },
  {
    _id: "srv_static_1_2",
    title: "Refrigerator Repair",
    description: "Cooling issues, compressor damage or thermostat changes.",
    price: 299,
    category: { _id: "cat_static_1", name: "AC & Appliance Repair" },
    image: "/services/Ac and aplliemce/refrigerator-repairing-service-500x500.webp",
    rating: 4.6,
    reviews: 89,
  },
  {
    _id: "srv_static_1_3",
    title: "Washing Machine Repair",
    description: "Fully automatic and semi-automatic machine repairs.",
    price: 349,
    category: { _id: "cat_static_1", name: "AC & Appliance Repair" },
    image: "/services/Ac and aplliemce/washing mahine repair.jpg",
    rating: 4.7,
    reviews: 210,
  },

  // Electrical Help (cat_static_2)
  {
    _id: "srv_static_2_1",
    title: "Fan/Light & Switchboard",
    description: "Installation, replacement or repair of standard electrical fittings.",
    price: 149,
    category: { _id: "cat_static_2", name: "Electrical Help" },
    image: "/services/electrical help/fan  light and swith board.jpg",
    rating: 4.9,
    reviews: 350,
  },
  {
    _id: "srv_static_2_2",
    title: "Inverter & Battery Wiring",
    description: "Setup your inverter or fix wiring and voltage trips.",
    price: 599,
    category: { _id: "cat_static_2", name: "Electrical Help" },
    image: "/services/electrical help/inverter and batter wiring.webp",
    rating: 4.5,
    reviews: 65,
  },
  {
    _id: "srv_static_2_3",
    title: "MCB & Fuse Replacement",
    description: "Quick dispatch for power outages, blown fuses, or faulty MCBs.",
    price: 199,
    category: { _id: "cat_static_2", name: "Electrical Help" },
    image: "/services/electrical help/mcb and fuse.webp",
    rating: 4.8,
    reviews: 110,
  },

  // Home Cleaning (cat_static_3)
  {
    _id: "srv_static_3_1",
    title: "Deep Home Cleaning",
    description: "Thorough deep cleaning of all rooms including bathroom and kitchen.",
    price: 2499,
    category: { _id: "cat_static_3", name: "Home Cleaning" },
    image: "/services/homecleaning/DeepHomecleaning.jpeg",
    rating: 4.7,
    reviews: 310,
  },
  {
    _id: "srv_static_3_2",
    title: "Move-in / Move-out Cleaning",
    description: "Complete dust and dirt removal for your new or old space.",
    price: 1999,
    category: { _id: "cat_static_3", name: "Home Cleaning" },
    image: "/services/homecleaning/moveinmoveoutcleaning.jpg",
    rating: 4.6,
    reviews: 45,
  },
  {
    _id: "srv_static_3_3",
    title: "Sofa Cleaning",
    description: "Wet vacuuming and stain removal for fabric and leather sofas.",
    price: 699,
    category: { _id: "cat_static_3", name: "Home Cleaning" },
    image: "/services/homecleaning/sofaCleaning.webp",
    rating: 4.9,
    reviews: 420,
  },

  // Plumbing Repair (cat_static_4)
  {
    _id: "srv_static_4_1",
    title: "Bathroom Fitting",
    description: "Install taps, showers, washbasins, and toilet seats.",
    price: 250,
    category: { _id: "cat_static_4", name: "Plumbing Repair" },
    image: "/services/plumbing repair/bathroom fitting.jpg",
    rating: 4.7,
    reviews: 215,
  },
  {
    _id: "srv_static_4_2",
    title: "Drain & Sink Unblocking",
    description: "Fast unblocking of kitchen sinks, floor drains, and toilets.",
    price: 350,
    category: { _id: "cat_static_4", name: "Plumbing Repair" },
    image: "/services/plumbing repair/drain and sink unblocking.jpg",
    rating: 4.5,
    reviews: 180,
  },
  {
    _id: "srv_static_4_3",
    title: "Leak Detection",
    description: "Identify and seal concealed pipe leaks to prevent water damage.",
    price: 800,
    category: { _id: "cat_static_4", name: "Plumbing Repair" },
    image: "/services/plumbing repair/leak detection.jpeg",
    rating: 4.8,
    reviews: 90,
  },
];
