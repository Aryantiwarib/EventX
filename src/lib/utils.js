const { clsx } = require("clsx");
const { twMerge } = require("tailwind-merge");
const { format: formatDate, isValid } = require("date-fns");
const { toast } = require("sonner");

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function parseDate(date) {
  if (!date) return null;
  const parsed = new Date(date);
  return isValid(parsed) ? parsed : null;
}

function formatDateTime(date, formatString = "PPpp") {
  const parsedDate = parseDate(date);
  return parsedDate ? formatDate(parsedDate, formatString) : "Invalid date";
}

function formatDateShort(date) {
  const parsedDate = parseDate(date);
  return parsedDate ? formatDate(parsedDate, "MMM d, yyyy") : "TBD";
}

function formatTime(date) {
  const parsedDate = parseDate(date);
  return parsedDate ? formatDate(parsedDate, "h:mm a") : "TBD";
}

function generateTicketId() {
  return `TX-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
}

function debounce(func, wait) {
  let timeout = null;
  return function(...args) {
    const later = () => {
      timeout = null;
      func(...args);
    };
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

function calculateReadingTime(text) {
  const wordsPerMinute = 200;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}

function encryptData(data) {
  return btoa(JSON.stringify(data));
}

function decryptData(encryptedData) {
  try {
    return JSON.parse(atob(encryptedData));
  } catch (e) {
    console.error("Failed to decrypt data", e);
    return null;
  }
}

function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function getInitials(name) {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function observeElement(element, callback, options = { threshold: 0.1 }) {
  const observer = new IntersectionObserver(callback, options);
  observer.observe(element);
  return () => observer.unobserve(element);
}

async function sendEmailNotification(
  email,
  subject,
  htmlContent,
  attachments = []
) {
  console.log(`Sending email to ${email}`);
  console.log(`Subject: ${subject}`);
  console.log(`Content: ${htmlContent}`);
  
  if (attachments.length) {
    console.log(`With ${attachments.length} attachments`);
  }
  
  toast.info(`Sending email to ${email}...`);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`Email sent to ${email}`);
      toast.success(`Email sent successfully to ${email}`, {
        description: `Subject: ${subject}`,
      });
      resolve(true);
    }, 1500);
  });
}

async function sendTicketEmail(userEmail, userName, eventTitle, ticketId) {
  const subject = `Your Ticket for ${eventTitle}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #4f46e5; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">Your Event Ticket</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #e2e8f0; border-top: none;">
        <p>Hello ${userName},</p>
        <p>Thank you for registering for <strong>${eventTitle}</strong>!</p>
        <p>Your ticket has been confirmed. Please find your ticket details below:</p>
        <div style="background-color: #f8fafc; border: 1px dashed #cbd5e1; padding: 15px; margin: 20px 0; text-align: center;">
          <p style="margin: 5px 0; font-size: 14px; color: #64748b;">Ticket ID</p>
          <p style="margin: 5px 0; font-weight: bold; font-size: 18px;">${ticketId}</p>
        </div>
        <p>Please bring this ticket (digital or printed) to the event for check-in.</p>
        <p>We're looking forward to seeing you!</p>
        <p>Best regards,<br>EventX Team</p>
      </div>
      <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
        &copy; ${new Date().getFullYear()} EventX. All rights reserved.
      </div>
    </div>
  `;
  
  return sendEmailNotification(userEmail, subject, htmlContent);
}

module.exports = {
  cn,
  formatCurrency,
  parseDate,
  formatDateTime,
  formatDateShort,
  formatTime,
  generateTicketId,
  debounce,
  calculateReadingTime,
  truncateText,
  encryptData,
  decryptData,
  validateEmail,
  getInitials,
  observeElement,
  sendEmailNotification,
  sendTicketEmail
};