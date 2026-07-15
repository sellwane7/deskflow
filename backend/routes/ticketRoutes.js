const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  createTicket,
  getTickets,
  updateTicketStatus,
} = require('../controllers/ticketController');

router.use(protect); // every ticket route requires a valid token

router.post('/', authorize('Employee'), createTicket);
router.get('/', authorize('Employee', 'Admin'), getTickets);
router.put('/:id', authorize('Admin'), updateTicketStatus);

module.exports = router;
