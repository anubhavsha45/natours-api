import axios from 'axios';

export const bookTour = async (tourId) => {
  try {
    const stripe = Stripe(
      'pk_test_51T8z15LmaAnyJMdfkieQJOOdx8Fu5oNgn0q6u1Ri16oOS8YezJ3ScGbesRiQTGt1UwP8jlUZ2VhrjSWPK3OaayRk005hkhDUnx',
    );

    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });
  } catch (err) {
    console.log(err);
  }
};
