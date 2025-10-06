import { Truck, Package, MapPin, Clock, IndianRupee, CheckCircle } from 'lucide-react';

const ShippingPolicy = () => {
  const shippingZones = [
    {
      zone: "Metro Cities",
      cities: "Mumbai, Delhi, Bengaluru, Chennai, Kolkata, Hyderabad, Pune, Ahmedabad",
      standard: "3-5 business days",
      express: "2-3 business days",
      charge: "Free above ₹999"
    },
    {
      zone: "Tier 1 Cities",
      cities: "Jaipur, Lucknow, Surat, Kochi, Chandigarh, Indore, etc.",
      standard: "4-6 business days",
      express: "3-4 business days",
      charge: "Free above ₹999"
    },
    {
      zone: "Tier 2/3 Cities",
      cities: "Other cities and towns across India",
      standard: "5-7 business days",
      express: "4-5 business days",
      charge: "Free above ₹999"
    },
    {
      zone: "Remote Areas",
      cities: "Villages, hill stations, island territories",
      standard: "7-10 business days",
      express: "Not Available",
      charge: "₹99 flat rate"
    }
  ];

  const shippingMethods = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Standard Delivery",
      time: "5-7 Business Days",
      cost: "Free above ₹999",
      description: "Our regular shipping option available across India. Tracking provided."
    },
    {
      icon: <Package className="w-8 h-8" />,
      title: "Express Delivery",
      time: "2-3 Business Days",
      cost: "₹149 (Select Cities)",
      description: "Faster delivery for metro and tier 1 cities. Priority processing."
    }
  ];

  const orderProcessing = [
    {
      step: "Order Placed",
      description: "Your order is confirmed and payment is verified",
      time: "Immediate"
    },
    {
      step: "Processing",
      description: "Quality check, packaging, and shipping label creation",
      time: "1-2 business days"
    },
    {
      step: "Shipped",
      description: "Order dispatched with tracking number sent via email/SMS",
      time: "Within 24 hours"
    },
    {
      step: "In Transit",
      description: "Package is on its way to your delivery address",
      time: "3-7 business days"
    },
    {
      step: "Out for Delivery",
      description: "Package is with delivery partner for final delivery",
      time: "Same day"
    },
    {
      step: "Delivered",
      description: "Package successfully delivered to your address",
      time: "Complete"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      
      {/* Header */}
      <div className="bg-pink-300 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center mb-4">
            <Truck className="w-12 h-12 mr-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ fontFamily: "Montaga, serif" }}>
            Shipping Policy
          </h1>
          <p className="text-lg md:text-xl text-center opacity-90 max-w-3xl mx-auto">
            Fast, reliable, and discreet shipping across India. Track your order every step of the way.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Key Highlights */}
        <div className="grid md:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 text-center">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Free Shipping</h3>
            <p className="text-gray-600 text-sm">On orders above ₹999</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 text-center">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Discreet Packaging</h3>
            <p className="text-gray-600 text-sm">Plain, unmarked boxes</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 text-center">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Pan-India Delivery</h3>
            <p className="text-gray-600 text-sm">We ship everywhere</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 text-center">
            <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-bold text-gray-900 mb-2">Real-Time Tracking</h3>
            <p className="text-gray-600 text-sm">Track your order 24/7</p>
          </div>
        </div>

        {/* Shipping Methods */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Shipping Options</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {shippingMethods.map((method, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 hover:shadow-xl transition-shadow">
                <div className="flex items-center mb-4">
                  <div className="w-14 h-14 bg-pink-300 rounded-xl flex items-center justify-center text-white mr-4">
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{method.title}</h3>
                    <p className="text-pink-600 font-semibold">{method.time}</p>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="inline-block bg-pink-100 text-pink-700 px-4 py-2 rounded-full font-semibold">
                    {method.cost}
                  </span>
                </div>
                <p className="text-gray-700">{method.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Zones & Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Delivery Timeline by Location</h2>
          <div className="bg-white rounded-2xl shadow-lg border border-pink-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-pink-300 text-white">
                  <tr>
                    <th className="text-left py-4 px-6 font-semibold">Zone</th>
                    <th className="text-left py-4 px-6 font-semibold">Coverage Areas</th>
                    <th className="text-left py-4 px-6 font-semibold">Standard Delivery</th>
                    <th className="text-left py-4 px-6 font-semibold">Express Delivery</th>
                    <th className="text-left py-4 px-6 font-semibold">Shipping Charge</th>
                  </tr>
                </thead>
                <tbody>
                  {shippingZones.map((zone, index) => (
                    <tr key={index} className="border-b border-pink-100 hover:bg-pink-50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-gray-900">{zone.zone}</td>
                      <td className="py-4 px-6 text-gray-700 text-sm">{zone.cities}</td>
                      <td className="py-4 px-6 text-gray-700">{zone.standard}</td>
                      <td className="py-4 px-6 text-gray-700">{zone.express}</td>
                      <td className="py-4 px-6 text-pink-600 font-semibold">{zone.charge}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <p className="text-sm text-gray-700">
              <strong>Note:</strong> Delivery timelines are estimates and may vary due to weather, holidays, or courier delays. Business days exclude Sundays and public holidays.
            </p>
          </div>
        </div>

        {/* Order Processing Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Order Journey</h2>
          <div className="relative">
            <div className="hidden md:block absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-pink-300 to-purple-300" />
            
            <div className="space-y-6">
              {orderProcessing.map((stage, index) => (
                <div key={index} className="flex items-start">
                  <div className="hidden md:flex w-16 h-16 rounded-full bg-pink-400 text-white items-center justify-center text-xl font-bold shadow-lg z-10 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 md:ml-8 bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{stage.step}</h3>
                      <span className="text-sm font-semibold text-pink-600 bg-pink-100 px-3 py-1 rounded-full">
                        {stage.time}
                      </span>
                    </div>
                    <p className="text-gray-700">{stage.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Packaging Details */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Discreet & Secure Packaging</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Plain Packaging</h3>
              <p className="text-gray-600 text-sm">
                Unmarked boxes with no brand logo or product details visible from outside.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Quality Protected</h3>
              <p className="text-gray-600 text-sm">
                Bubble wrap and protective layers ensure products arrive in perfect condition.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100 text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-pink-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Privacy First</h3>
              <p className="text-gray-600 text-sm">
                Generic sender name on shipping label to maintain your privacy.
              </p>
            </div>
          </div>
        </div>

        {/* Shipping Charges */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Shipping Charges</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-pink-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Orders above ₹999</h3>
                <p className="text-gray-600 text-sm">Applicable to all locations except remote areas</p>
              </div>
              <span className="text-2xl font-bold text-green-600">FREE</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Orders below ₹999</h3>
                <p className="text-gray-600 text-sm">Standard delivery charges apply</p>
              </div>
              <span className="text-2xl font-bold text-pink-600">₹99</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Express Delivery (Select Cities)</h3>
                <p className="text-gray-600 text-sm">Faster delivery in metro and tier 1 cities</p>
              </div>
              <span className="text-2xl font-bold text-purple-600">₹149</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h3 className="font-semibold text-gray-900">Remote Areas</h3>
                <p className="text-gray-600 text-sm">Villages, hill stations, island territories</p>
              </div>
              <span className="text-2xl font-bold text-gray-600">₹99</span>
            </div>
          </div>
        </div>

        {/* Cash on Delivery */}
        <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-8 shadow-lg mb-16">
          <div className="flex items-start">
            <IndianRupee className="w-12 h-12 text-pink-600 mr-4 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Cash on Delivery (COD)</h2>
              <p className="text-gray-700 mb-4">
                We offer COD for orders across India. Pay for your order at the time of delivery.
              </p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>COD available on orders below ₹5,000</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Additional COD charges: ₹50 per order</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Exact change preferred at delivery</span>
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">•</span>
                  <span>Prepaid orders get 5% extra discount</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Order Tracking */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Track Your Order</h2>
          <p className="text-gray-700 text-lg mb-6">
            Once your order is shipped, you'll receive a tracking number via email and SMS. Track your order in real-time:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-pink-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Track via Website</h3>
              <ol className="space-y-2 text-gray-700 text-sm">
                <li>1. Log into your account</li>
                <li>2. Go to "My Orders"</li>
                <li>3. Click "Track Order"</li>
                <li>4. View real-time status</li>
              </ol>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Track via Link</h3>
              <ol className="space-y-2 text-gray-700 text-sm">
                <li>1. Check your email/SMS</li>
                <li>2. Click tracking link</li>
                <li>3. Enter tracking number</li>
                <li>4. View delivery updates</li>
              </ol>
            </div>
          </div>
        </div>

        {/* Delivery Issues */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Delivery Issues?</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Order Not Delivered</h3>
              <p className="text-gray-700 text-sm">
                If your order isn't delivered within the expected timeline, contact us immediately with your order number. We'll track and resolve the issue within 24 hours.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Incorrect Address</h3>
              <p className="text-gray-700 text-sm">
                Address changes can be made within 2 hours of order placement. Contact us immediately. After shipment, address changes may not be possible.
              </p>
            </div>
            <div className="border-l-4 border-pink-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Damaged During Transit</h3>
              <p className="text-gray-700 text-sm">
                Inspect your package before accepting delivery. If damaged, refuse delivery or report it within 48 hours with photos for immediate replacement.
              </p>
            </div>
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-semibold text-gray-900 mb-2">Delivery Attempts</h3>
              <p className="text-gray-700 text-sm">
                Courier will attempt delivery 3 times. If unsuccessful, order returns to us. Contact customer support to reschedule delivery or provide alternate address.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notes */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg mb-16">
          <h3 className="font-semibold text-gray-900 mb-3">Important Information</h3>
          <ul className="space-y-2 text-gray-700 text-sm">
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">→</span>
              <span>Please provide complete address with landmark and pin code for accurate delivery</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">→</span>
              <span>Orders placed on weekends/holidays will be processed on next business day</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">→</span>
              <span>We don't deliver to PO Box addresses - only physical addresses accepted</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">→</span>
              <span>Custom/Import duties may apply for shipments to certain regions</span>
            </li>
            <li className="flex items-start">
              <span className="text-yellow-600 mr-2">→</span>
              <span>Delivery timelines may be affected during sale periods or festive seasons</span>
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default ShippingPolicy;