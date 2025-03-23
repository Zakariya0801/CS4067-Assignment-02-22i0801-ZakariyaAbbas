const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/BookingController');

router.post('/', bookingController.createBooking);
router.get('/', bookingController.getAllBookings);
router.post('/user', bookingController.getUserBookings);
router.get('/:id', bookingController.getBookingById);
router.put('/:id', bookingController.updateBooking);
router.delete('/:id', bookingController.deleteBooking);

module.exports = router;
