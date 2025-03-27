
import React, { useEffect, useState } from "react";

const RazorpayPayment: React.FC = () => {
  const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);

  // Load Razorpay script dynamically when the component mounts
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => setIsRazorpayLoaded(true); // Set state when script is loaded

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = () => {
    if (!isRazorpayLoaded) {
      console.error("Razorpay script not loaded yet.");
      return;
    }

    const options = {
      key: "rzp_test_fXVCC0ILCOrj7Y", // Your Razorpay Key ID
      amount: "5000", // Amount in paise (5000 = ₹50)
      currency: "INR",
      name: "EventX",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: "order_PryXnjCizYBGRj", // Your manually provided Order ID
      handler: function (response: any) {
        alert(response.razorpay_payment_id);
        alert(response.razorpay_order_id);
        alert(response.razorpay_signature);
      },
      prefill: {
        name: "Aryan Tiwari",
        email: "aryan.tiwari@gmail.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp1 = new (window as any).Razorpay(options);

    rzp1.on("payment.failed", function (response: any) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });

    rzp1.open();
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
    <button
      id="rzp-button1"
      onClick={(e) => {
        e.preventDefault();
        handlePayment();
      }}
      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-bold py-4 px-8 rounded-full shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none"
    >
      Pay Now
    </button>
  </div>
  );
};

export default RazorpayPayment;

