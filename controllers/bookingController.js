const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const Booking = require('../models/bookingModel');

const catchAsync = require('../utils/catchAsync');
const factory = require('./buildFactory');

////////////////////////////////////////////////
// CREATE STRIPE CHECKOUT SESSION
////////////////////////////////////////////////

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get tour
  const tour = await Tour.findById(req.params.tourId);

  // 2) Create Stripe checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],

    mode: 'payment',

    success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
      req.params.tourId
    }&user=${req.user.id}&price=${tour.price}`,

    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,

    customer_email: req.user.email,

    client_reference_id: req.params.tourId,

    metadata: {
      price: tour.price,
    },

    line_items: [
      {
        price_data: {
          currency: 'usd',

          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,

            images: [
              `${req.protocol}://${req.get('host')}/img/tours/${tour.imageCover}`,
            ],
          },

          unit_amount: tour.price * 100,
        },

        quantity: 1,
      },
    ],
  });

  // 3) Send session to client
  res.status(200).json({
    status: 'success',
    session,
  });
});

////////////////////////////////////////////////
// CREATE BOOKING AFTER SUCCESSFUL PAYMENT
////////////////////////////////////////////////

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour || !user || !price) return next();

  await Booking.create({ tour, user, price });

  res.redirect(req.originalUrl.split('?')[0]);
});

////////////////////////////////////////////////
// STRIPE WEBHOOK
////////////////////////////////////////////////

exports.webhookCheckout = async (req, res) => {
  const signature = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET,
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    await createBookingCheckout(event.data.object);
  }

  res.status(200).json({ received: true });
};

////////////////////////////////////////////////
// CRUD BOOKINGS
////////////////////////////////////////////////

exports.createBooking = factory.createOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
