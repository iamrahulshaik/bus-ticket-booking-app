from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    BusViewSet,
    ScheduleViewSet,
    BookingViewSet,
    register_bus,
    get_cities,
    search_buses,
    get_seats,
    book_seats,
    signup_user,
    login_user,
    book_seats_with_payment,   # ✅ new import for Razorpay booking
)

# DRF routers for CRUD endpoints
router = DefaultRouter()
router.register(r"buses", BusViewSet, basename="bus")
router.register(r"schedules", ScheduleViewSet, basename="schedule")
router.register(r"bookings", BookingViewSet, basename="booking")

urlpatterns = [
    # ✅ DRF router endpoints (CRUD for buses, schedules, bookings)
    path("", include(router.urls)),

    # ✅ Bus registration and city search
    path("register-bus/", register_bus, name="register_bus"),
    path("cities/", get_cities, name="get_cities"),
    path("search_buses/", search_buses, name="search_buses"),

    # ✅ Seat management
    path("schedules/<int:schedule_id>/seats/", get_seats, name="get_seats"),
    path("book_seats/", book_seats, name="book_seats"),  # original seat booking (no payment)
    path("book_seats/payment/", book_seats_with_payment, name="book_seats_with_payment"),  # ✅ new route with Razorpay integration

    # ✅ Authentication
    path("signup/", signup_user, name="signup_user"),
    path("login/", login_user, name="login_user"),
]


# rzp_test_Rc9a1tetxWiY2z
# UeeJvzEFnKsurJndj6NLEDsp



