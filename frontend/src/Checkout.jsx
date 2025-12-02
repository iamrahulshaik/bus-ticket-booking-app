// in Checkout.jsx
const handleBook = async () => {
  try {
    const payload = { schedule_id: schedule.id, seat_id: chosenSeat.id, price: schedule.fare_amount };
    const res = await API.post('bookings/book/', payload); // endpoint in BookingViewSet
    // success -> redirect to bookings page
  } catch (err) {
    // handle error (seat already taken)
  }
}
