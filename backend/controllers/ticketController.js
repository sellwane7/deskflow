const Ticket = require('../models/Ticket');

const VALID_PRIORITIES = ['Low', 'Medium', 'High'];
const VALID_STATUSES = ['Open', 'In Progress', 'Resolved'];

// @route POST /api/tickets
// @desc  Create a new service request. Employees only.
// @access Private (Employee)
const createTicket = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;

    const missing = [];
    if (!title || !title.trim()) missing.push('title');
    if (!description || !description.trim()) missing.push('description');
    if (!priority) missing.push('priority');

    if (missing.length) {
      return res.status(400).json({
        success: false,
        message: `Missing required field(s): ${missing.join(', ')}`,
      });
    }

    if (!VALID_PRIORITIES.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`,
      });
    }

    const ticket = await Ticket.create({
      title: title.trim(),
      description: description.trim(),
      priority,
      createdBy: req.user.id,
      createdByName: req.user.name,
    });

    res.status(201).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

// @route GET /api/tickets
// @desc  Employees see only their own tickets. Admins see all tickets.
// @access Private (Employee, Admin)
const getTickets = async (req, res, next) => {
  try {
    const filter = req.user.role === 'Admin' ? {} : { createdBy: req.user.id };
    const tickets = await Ticket.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    next(err);
  }
};

// @route PUT /api/tickets/:id
// @desc  Update a ticket's status. Admins only.
// @access Private (Admin)
const updateTicketStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ success: false, message: 'Status is required.' });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${VALID_STATUSES.join(', ')}`,
      });
    }

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found.' });
    }

    ticket.status = status;
    await ticket.save();

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};

module.exports = { createTicket, getTickets, updateTicketStatus };
