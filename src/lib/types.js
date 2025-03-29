/**
 * @typedef {Object} Event
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} venue
 * @property {string} date
 * @property {string} time
 * @property {string} endTime
 * @property {string} organizerId
 * @property {string} organizerName
 * @property {number} capacity
 * @property {number} price
 * @property {string} imageUrl
 * @property {string} category
 * @property {string[]} tags
 * @property {"draft" | "published" | "cancelled" | "completed"} status
 * @property {string} createdAt
 * @property {boolean} [featured]
 * @property {number} [registrations]
 */

/**
 * @typedef {Object} Ticket
 * @property {string} id
 * @property {string} eventId
 * @property {string} userId
 * @property {string} userName
 * @property {string} userEmail
 * @property {number} price
 * @property {"pending" | "confirmed" | "checked-in" | "cancelled"} status
 * @property {"standard" | "vip" | "early-bird"} ticketType
 * @property {string} purchaseDate
 * @property {string} [checkInTime]
 * @property {string} qrData
 */

/**
 * @typedef {"admin" | "organizer" | "user"} UserRole
 */

/**
 * @typedef {Object} User
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {UserRole} role
 * @property {string} [phone]
 * @property {string} [organization]
 * @property {string} [profileImageUrl]
 * @property {string} [bio]
 * @property {string} createdAt
 */

/**
 * @typedef {Object} Payment
 * @property {string} id
 * @property {string} ticketId
 * @property {string} userId
 * @property {number} amount
 * @property {string} currency
 * @property {"pending" | "completed" | "failed" | "refunded"} status
 * @property {"card" | "upi" | "netbanking" | "wallet"} paymentMethod
 * @property {string} transactionId
 * @property {string} createdAt
 */

/**
 * @typedef {Object} EventStats
 * @property {number} totalRegistrations
 * @property {number} checkedIn
 * @property {number} remaining
 * @property {number} revenue
 * @property {number} ticketsSold
 * @property {number} ticketsAvailable
 * @property {Object.<string, number>} ticketCategories
 */

/**
 * @typedef {Object} Notification
 * @property {string} id
 * @property {string} userId
 * @property {string} title
 * @property {string} message
 * @property {"info" | "success" | "warning" | "error"} type
 * @property {boolean} read
 * @property {string} createdAt
 * @property {string} [link]
 */

/**
 * @typedef {Object} TicketTemplate
 * @property {string} id
 * @property {string} name
 * @property {string} organizerId
 * @property {string} backgroundColor
 * @property {string} textColor
 * @property {"top" | "bottom" | "none"} logoPosition
 * @property {boolean} showQR
 * @property {string[]} additionalFields
 * @property {string} createdAt
 */

module.exports = {
  /**
   * @typedef {import('@/types').Event} Event
   * @typedef {import('@/types').Ticket} Ticket
   * @typedef {import('@/types').User} User
   * @typedef {import('@/types').Payment} Payment
   * @typedef {import('@/types').EventStats} EventStats
   * @typedef {import('@/types').Notification} Notification
   * @typedef {import('@/types').TicketTemplate} TicketTemplate
   * @typedef {import('@/types').UserRole} UserRole
   */
};