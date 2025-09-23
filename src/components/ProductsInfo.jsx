// ProductsInfo.js - Example structure with categories and subcategories
const infoproducts = [
  {
    id: 1,
    name: "Comfort Push-Up Bra",
    category: "bras",
    subcategory: "push-up-bras", // Add subcategory field
    price: "₹899",
    images: [
      "/images/bra1-1.jpg",
      "/images/bra1-2.jpg"
    ],
    description: "Ultra-comfortable push-up bra with seamless design",
    sizes: ["32A", "32B", "34A", "34B", "36B"],
    colors: ["Black", "White", "Nude"]
  },
  {
    id: 2,
    name: "Sports Bra Pro",
    category: "bras",
    subcategory: "sports-bras",
    price: "₹1,299",
    images: [
      "/images/sportsbra1-1.jpg",
      "/images/sportsbra1-2.jpg"
    ],
    description: "High-impact sports bra for intense workouts",
    sizes: ["32A", "32B", "34A", "34B", "36B", "38B"],
    colors: ["Black", "Grey", "Pink"]
  },
  {
    id: 3,
    name: "Wireless Comfort Bra",
    category: "bras",
    subcategory: "wireless-bras",
    price: "₹699",
    images: [
      "/images/wireless1-1.jpg",
      "/images/wireless1-2.jpg"
    ],
    description: "All-day comfort with no underwire",
    sizes: ["32A", "32B", "34A", "34B", "36B"],
    colors: ["Black", "White", "Beige"]
  },
  {
    id: 4,
    name: "Strapless Push-Up Bra",
    category: "bras",
    subcategory: "strapless-bras",
    price: "₹1,099",
    images: [
      "/images/strapless1-1.jpg",
      "/images/strapless1-2.jpg"
    ],
    description: "Perfect for off-shoulder and strapless outfits",
    sizes: ["32B", "34B", "36B", "38B"],
    colors: ["Black", "Nude"]
  },
  {
    id: 5,
    name: "Bikini Brief Set",
    category: "panties",
    subcategory: "bikini-briefs",
    price: "₹399",
    images: [
      "/images/bikini1-1.jpg",
      "/images/bikini1-2.jpg"
    ],
    description: "Comfortable everyday bikini briefs",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Pink", "Blue"]
  },
  {
    id: 6,
    name: "High-Waist Brief",
    category: "panties",
    subcategory: "high-waist",
    price: "₹499",
    images: [
      "/images/highwaist1-1.jpg",
      "/images/highwaist1-2.jpg"
    ],
    description: "High-waist design for extra coverage and comfort",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "White", "Nude"]
  },
  {
    id: 7,
    name: "Lace Thong",
    category: "panties",
    subcategory: "thongs",
    price: "₹299",
    images: [
      "/images/thong1-1.jpg",
      "/images/thong1-2.jpg"
    ],
    description: "Delicate lace thong with comfort fit",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Red", "White"]
  },
  {
    id: 8,
    name: "Cotton Boy Shorts",
    category: "panties",
    subcategory: "boy-shorts",
    price: "₹449",
    images: [
      "/images/boyshorts1-1.jpg",
      "/images/boyshorts1-2.jpg"
    ],
    description: "100% cotton boy shorts for maximum comfort",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Grey", "Pink"]
  },
  {
    id: 9,
    name: "Silk Nightgown",
    category: "sleep-lingerie",
    subcategory: "nightgowns",
    price: "₹1,899",
    images: [
      "/images/nightgown1-1.jpg",
      "/images/nightgown1-2.jpg"
    ],
    description: "Luxurious silk nightgown for elegant nights",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Champagne", "Navy"]
  },
  {
    id: 10,
    name: "Cotton Pajama Set",
    category: "sleep-lingerie",
    subcategory: "pajama-sets",
    price: "₹1,299",
    images: [
      "/images/pajama1-1.jpg",
      "/images/pajama1-2.jpg"
    ],
    description: "Soft cotton pajama set for comfortable sleep",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Pink", "Blue", "White"]
  },
  {
    id: 11,
    name: "Satin Robe",
    category: "sleep-lingerie",
    subcategory: "robes",
    price: "₹1,599",
    images: [
      "/images/robe1-1.jpg",
      "/images/robe1-2.jpg"
    ],
    description: "Elegant satin robe for lounging",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Pink", "White"]
  },
  {
    id: 12,
    name: "Lace Babydoll",
    category: "sleep-lingerie",
    subcategory: "babydolls",
    price: "₹999",
    images: [
      "/images/babydoll1-1.jpg",
      "/images/babydoll1-2.jpg"
    ],
    description: "Romantic lace babydoll with matching panties",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Black", "Red", "White"]
  },
  {
    id: 13,
    name: "Yoga Leggings",
    category: "apparel",
    subcategory: "activewear",
    price: "₹899",
    images: [
      "/images/leggings1-1.jpg",
      "/images/leggings1-2.jpg"
    ],
    description: "High-waist yoga leggings with compression",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Grey", "Navy"]
  },
  {
    id: 14,
    name: "Lounge Set",
    category: "apparel",
    subcategory: "loungewear",
    price: "₹1,499",
    images: [
      "/images/lounge1-1.jpg",
      "/images/lounge1-2.jpg"
    ],
    description: "Cozy lounge set for relaxing at home",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Grey", "Pink", "Beige"]
  },
  {
    id: 15,
    name: "Body Shaper",
    category: "apparel",
    subcategory: "shapewear",
    price: "₹1,799",
    images: [
      "/images/shaper1-1.jpg",
      "/images/shaper1-2.jpg"
    ],
    description: "Full-body shaper for smooth silhouette",
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Nude", "Black"]
  },
  {
    id: 16,
    name: "Hydrating Face Serum",
    category: "beauty",
    subcategory: "skincare",
    price: "₹1,299",
    images: [
      "/images/serum1-1.jpg",
      "/images/serum1-2.jpg"
    ],
    description: "Intensive hydrating serum with hyaluronic acid",
    sizes: ["30ml"],
    colors: ["Clear"]
  },
  {
    id: 17,
    name: "Body Butter",
    category: "beauty",
    subcategory: "body-care",
    price: "₹699",
    images: [
      "/images/butter1-1.jpg",
      "/images/butter1-2.jpg"
    ],
    description: "Rich body butter for deep moisturization",
    sizes: ["200ml"],
    colors: ["Vanilla", "Coconut", "Lavender"]
  },
  {
    id: 18,
    name: "Signature Perfume",
    category: "beauty",
    subcategory: "fragrances",
    price: "₹2,499",
    images: [
      "/images/perfume1-1.jpg",
      "/images/perfume1-2.jpg"
    ],
    description: "Exclusive signature fragrance with floral notes",
    sizes: ["50ml", "100ml"],
    colors: ["Pink Bottle"]
  },
  {
    id: 19,
    name: "Clearance Bra Set",
    category: "clearance",
    // Note: Clearance items might not have subcategories
    price: "₹399",
    originalPrice: "₹899",
    images: [
      "/images/clearance1-1.jpg",
      "/images/clearance1-2.jpg"
    ],
    description: "Beautiful bra set at clearance price",
    sizes: ["32B", "34B"],
    colors: ["Black", "White"]
  },
  {
    id: 20,
    name: "Clearance Nightwear",
    category: "clearance",
    price: "₹599",
    originalPrice: "₹1,299",
    images: [
      "/images/clearance2-1.jpg",
      "/images/clearance2-2.jpg"
    ],
    description: "Comfortable nightwear at discounted price",
    sizes: ["S", "M", "L"],
    colors: ["Pink", "Blue"]
  }
];

export default infoproducts;