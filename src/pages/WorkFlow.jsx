import React, { useState } from 'react';

const EventXHowItWorks = () => {
  const [hoveredCard, setHoveredCard] = useState(null);
  
  const steps = [
    {
      id: 1,
      icon: '📅',
      title: 'Browse Events',
      description: 'Explore upcoming events in your city or online. Filter by category, date, or price to find the perfect event for you.'
    },
    {
      id: 2,
      icon: '🎟️',
      title: 'Register For Events',
      description: 'Select your tickets and complete the registration process. For free events, you\'ll get instant confirmation.'
    },
    {
      id: 3,
      icon: '💳',
      title: 'Make Payment',
      description: 'For paid events, complete the secure payment process using our trusted payment gateway.'
    },
    {
      id: 4,
      icon: '📧',
      title: 'Receive Confirmation',
      description: 'Get your e-ticket via email and in your account. You can download or print your ticket for the event.'
    },
    {
      id: 5,
      icon: '📲',
      title: 'Attend the Event',
      description: 'Show your QR code ticket at the venue entrance for seamless check-in. Enjoy the event!'
    },
    {
      id: 6,
      icon: '👥',
      title: 'Stay Connected',
      description: 'Keep track of your events in your profile and discover more events based on your interests.'
    }
  ];
  
  const faqs = [
    {
      question: 'Can I get a refund if I can\'t attend an event?',
      answer: 'Refund policies vary by event. Please check the specific event\'s details for refund information.'
    },
    {
      question: 'How do I transfer my ticket to someone else?',
      answer: 'You can transfer tickets by updating the attendee information in your account or contacting our support team.'
    },
    {
      question: 'What happens if an event is cancelled?',
      answer: 'If an event is cancelled, you\'ll receive a full refund and notification by email.'
    }
  ];

  return (
    <div className="flex flex-col items-center w-full bg-gray-50">
      <div className="max-w-6xl w-full px-6 py-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">How EventX Works</h1>
          <p className="text-gray-600">Discover how easy it is to join and enjoy events using our platform</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {steps.map((step) => (
            <div 
              key={step.id}
              className="bg-white rounded-lg p-6 border border-gray-100 relative shadow-sm transition-all duration-300"
              style={{
                transform: hoveredCard === step.id ? 'translateY(-5px)' : 'none',
                boxShadow: hoveredCard === step.id ? '0 8px 20px rgba(0, 0, 0, 0.08)' : '0 1px 3px rgba(0, 0, 0, 0.05)'
              }}
              onMouseEnter={() => setHoveredCard(step.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-100 rounded-full opacity-20 -mr-6 -mt-6">
                <div className="flex items-center justify-center h-full w-full text-blue-500 font-bold text-2xl">
                  {step.id}
                </div>
              </div>
              <div className="relative z-10">
                <div className="text-3xl mb-4 bg-blue-100 w-10 h-10 flex items-center justify-center rounded-full text-blue-500">{step.icon}</div>
                <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600 text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-lg p-8 border border-gray-100 mb-10">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <h3 className="text-base font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600 text-sm">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventXHowItWorks;