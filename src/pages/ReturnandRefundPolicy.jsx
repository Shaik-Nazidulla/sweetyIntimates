import { Package, RefreshCw, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ReturnRefundPolicy = () => {
  const eligibilityCriteria = [
    {
      icon: <CheckCircle className="w-6 h-6 text-green-500" />,
      title: "Eligible Returns",
      items: [
        "Product must be unworn, unwashed, and unused",
        "Original tags and packaging must be intact",
        "Hygiene seal must be unbroken",
        "Return initiated within 7 days of delivery",
        "Product must be in original saleable condition"
      ]
    },
    {
      icon: <XCircle className="w-6 h-6 text-red-500" />,
      title: "Non-Returnable Items",
      items: [
        "Products with broken hygiene seals",
        "Worn, washed, or used products",
        "Items without original tags or packaging",
        "Sale items marked as 'Final Sale'",
        "Customized or personalized products"
      ]
    }
  ];

  const returnProcess = [
    {
      step: "1",
      title: "Initiate Return",
      description: "Log into your account, go to Orders, and select 'Return' for the item you wish to return within 7 days of delivery."
    },
    {
      step: "2",
      title: "Return Approval",
      description: "Our team will review your request within 24 hours and send you return instructions via email."
    },
    {
      step: "3",
      title: "Package & Ship",
      description: "Pack the item securely in its original packaging with all tags. We'll arrange pickup or provide a return shipping label."
    },
    {
      step: "4",
      title: "Quality Check",
      description: "Once we receive the item, our team will inspect it to ensure it meets return criteria within 2-3 business days."
    },
    {
      step: "5",
      title: "Refund Processing",
      description: "If approved, refund will be initiated within 5-7 business days to your original payment method."
    }
  ];

  const refundTimeline = [
    { method: "Credit/Debit Card", time: "5-7 business days", note: "After refund initiation" },
    { method: "Net Banking", time: "5-7 business days", note: "After refund initiation" },
    { method: "UPI", time: "3-5 business days", note: "After refund initiation" },
    { method: "Wallet", time: "2-3 business days", note: "After refund initiation" },
    { method: "Cash on Delivery", time: "7-10 business days", note: "Bank transfer to provided account" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      
      {/* Header */}
      <div className="bg-pink-300 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-center mb-4">
            <RefreshCw className="w-12 h-12 mr-4" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center" style={{ fontFamily: "Montaga, serif" }}>
            Return & Refund Policy
          </h1>
          <p className="text-lg md:text-xl text-center opacity-90 max-w-3xl mx-auto">
            Your satisfaction is our priority. We've made returns and refunds simple and hassle-free.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        
        {/* Important Notice */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-12 rounded-r-lg">
          <div className="flex items-start">
            <AlertCircle className="w-6 h-6 text-yellow-600 mr-3 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Important: Hygiene & Safety Policy
              </h3>
              <p className="text-gray-700">
                Due to the intimate nature of our products, we maintain strict hygiene standards. All products must be returned in their original condition with hygiene seals intact and tags attached. Products that have been worn, washed, or have broken seals cannot be accepted for returns to ensure the safety and hygiene of all our customers.
              </p>
            </div>
          </div>
        </div>

        {/* Return Window */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 mb-12">
          <div className="flex items-center mb-6">
            <Clock className="w-8 h-8 text-pink-500 mr-3" />
            <h2 className="text-3xl font-bold text-gray-900">7-Day Return Window</h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            You have <span className="font-semibold text-pink-600">7 days from the date of delivery</span> to initiate a return. Returns requested after this period will not be accepted. Please ensure you inspect your order immediately upon delivery.
          </p>
          <div className="bg-pink-50 p-4 rounded-lg">
            <p className="text-sm text-gray-700">
              <strong>Pro Tip:</strong> Take photos/videos while unboxing to document the product condition. This helps expedite the return process if needed.
            </p>
          </div>
        </div>

        {/* Eligibility Criteria */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Return Eligibility</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {eligibilityCriteria.map((criteria, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100">
                <div className="flex items-center mb-6">
                  {criteria.icon}
                  <h3 className="text-xl font-bold text-gray-900 ml-3">{criteria.title}</h3>
                </div>
                <ul className="space-y-3">
                  {criteria.items.map((item, idx) => (
                    <li key={idx} className="flex items-start">
                      <span className="text-pink-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Return Process */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">How to Return</h2>
          <div className="relative">
            {/* Connection Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-pink-300  transform -translate-x-1/2" />
            
            <div className="space-y-8">
              {returnProcess.map((step, index) => (
                <div key={index} className={`flex items-center ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-100">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                      <p className="text-gray-700">{step.description}</p>
                    </div>
                  </div>
                  <div className="hidden md:flex w-16 h-16 rounded-full bg-pink-500 text-white items-center justify-center text-2xl font-bold shadow-lg z-10">
                    {step.step}
                  </div>
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Refund Timeline */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Refund Timeline</h2>
          <p className="text-gray-700 mb-6">
            Once your return is approved, refunds are processed based on your original payment method:
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-pink-200">
                  <th className="text-left py-3 px-4 text-gray-900 font-semibold">Payment Method</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-semibold">Refund Time</th>
                  <th className="text-left py-3 px-4 text-gray-900 font-semibold">Note</th>
                </tr>
              </thead>
              <tbody>
                {refundTimeline.map((item, index) => (
                  <tr key={index} className="border-b border-pink-100">
                    <td className="py-3 px-4 text-gray-700">{item.method}</td>
                    <td className="py-3 px-4 text-pink-600 font-semibold">{item.time}</td>
                    <td className="py-3 px-4 text-gray-600 text-sm">{item.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Exchange Policy */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Exchange Policy</h2>
          <p className="text-gray-700 text-lg mb-6">
            We offer easy size exchanges to ensure you get the perfect fit. Exchange requests follow the same eligibility criteria as returns.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-pink-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Size Exchange Process</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">→</span>
                  Select "Exchange" when initiating return
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">→</span>
                  Choose your preferred size
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">→</span>
                  Free reverse pickup arranged
                </li>
                <li className="flex items-start">
                  <span className="text-pink-500 mr-2">→</span>
                  New size shipped after quality check
                </li>
              </ul>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="font-semibold text-gray-900 mb-3">Exchange Guidelines</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">→</span>
                  Only one exchange per order
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">→</span>
                  Subject to size availability
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">→</span>
                  No price difference adjustment
                </li>
                <li className="flex items-start">
                  <span className="text-purple-500 mr-2">→</span>
                  Same product, different size only
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Damaged/Defective Products */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-100 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Damaged or Defective Products</h2>
          <p className="text-gray-700 text-lg mb-6">
            If you receive a damaged or defective product, we'll replace it immediately at no extra cost.
          </p>
          <div className="bg-red-50 border-l-4 border-red-400 p-6 rounded-r-lg">
            <h3 className="font-semibold text-gray-900 mb-3">Steps for Damaged Products:</h3>
            <ol className="space-y-2 text-gray-700 list-decimal list-inside">
              <li>Contact us within 48 hours of delivery</li>
              <li>Provide order number and photos of the damaged item</li>
              <li>Our team will verify and approve replacement</li>
              <li>Free pickup arranged for damaged item</li>
              <li>Replacement shipped immediately</li>
            </ol>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReturnRefundPolicy;