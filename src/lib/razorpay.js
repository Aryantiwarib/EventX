// payment.js
const { toast } = require("sonner");
const { generateTicketId, encryptData } = require("./utils");

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error("Failed to load Razorpay SDK");
      toast.error("Payment service unavailable. Please try again later.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

const initiatePayment = async (event, user, onSuccess, alternateEmail) => {
  const isRazorpayLoaded = await loadRazorpayScript();
  if (!isRazorpayLoaded) return;

  const amountInPaise = event.price * 100;
  
  const options = {
    key: "rzp_test_YourTestApiKey",
    amount: amountInPaise,
    currency: "INR",
    name: "EventX",
    description: `Ticket for ${event.title}`,
    image: "https://placehold.co/100x100?text=EventX",
    prefill: {
      name: user.name,
      email: user.email,
      contact: user.phone || "",
    },
    notes: {
      eventId: event.id,
      userId: user.id,
      eventTitle: event.title,
      alternateEmail: alternateEmail || "",
    },
    theme: { color: "#6366F1" },
    handler: function (response) {
      const ticketId = generateTicketId();
      const newTicket = {
        id: ticketId,
        eventId: event.id,
        userId: user.id,
        userName: user.name,
        userEmail: alternateEmail || user.email,
        price: event.price,
        status: "confirmed",
        ticketType: "standard",
        purchaseDate: new Date().toISOString(),
        qrData: encryptData({
          ticketId,
          eventId: event.id,
          userId: user.id,
          paymentId: response.razorpay_payment_id,
        }),
      };
      
      onSuccess(newTicket);
      toast.success("Payment successful! Your ticket has been generated.");
      console.log(`Sending ticket to ${alternateEmail || user.email}`);
    },
  };

  try {
    const razorpay = new window.Razorpay(options);
    razorpay.on("payment.failed", (response) => {
      console.error("Payment failed", response.error);
      toast.error(`Payment failed: ${response.error.description}`);
    });
    razorpay.open();
  } catch (error) {
    console.error("Error initializing payment", error);
    toast.error("Failed to initialize payment. Please try again.");
  }
};

module.exports = {
  loadRazorpayScript,
  initiatePayment
};