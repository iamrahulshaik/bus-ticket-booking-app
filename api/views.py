from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets
from django.db import transaction
from django.utils import timezone
import datetime
import traceback

from .models import Bus, Schedule, Seat, Booking, Route
from .serializers import BusSerializer, ScheduleSerializer, BookingSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(['GET'])
def get_cities(request):
    try:
        # ✅ Get all unique origins and destinations from the database
        origins = list(Route.objects.values_list('origin', flat=True).distinct())
        destinations = list(Route.objects.values_list('destination', flat=True).distinct())

        # ✅ Combine and remove duplicates
        all_cities = sorted(list(set(origins + destinations)))

        # ✅ Optional: filter by search term
        query = request.GET.get("q", "")
        if query:
            all_cities = [city for city in all_cities if query.lower() in city.lower()]

        return Response(all_cities, status=200)

    except Exception as e:
        print("❌ Error fetching cities:", e)
        return Response({"error": str(e)}, status=500)



# ====================================================
# ✅ ViewSets for API router
# ====================================================
class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer


class ScheduleViewSet(viewsets.ModelViewSet):
    queryset = Schedule.objects.all()
    serializer_class = ScheduleSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer


# ====================================================
# ✅ 1️⃣ Register Bus (Bus + Schedule)
# ====================================================
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.utils.dateparse import parse_date, parse_time
import json
from .models import Bus, Route, Schedule

@csrf_exempt
def register_bus(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            bus_name = data.get('bus_name')
            travels_name = data.get('travels_name')
            category = data.get('category')
            origin = data.get('origin')
            destination = data.get('destination')
            departure_time = data.get('departure_time')
            arrival_time = data.get('arrival_time')
            fare_amount = int(data.get('fare_amount'))
            total_seats = int(data.get('total_seats'))

            travel_date = data.get('travel_date')

            if not all([bus_name, travels_name, category, origin, destination, departure_time, arrival_time, fare_amount, total_seats, travel_date]):
                return JsonResponse({'error': 'Missing required fields'}, status=400)

            route, _ = Route.objects.get_or_create(
                origin__iexact=origin.strip(),
                destination__iexact=destination.strip(),
                defaults={'origin': origin, 'destination': destination}
            )

            bus = Bus.objects.create(
                name=bus_name,
                travels_name=travels_name,
                total_seats=total_seats,
                category=category
            )

            schedule = Schedule.objects.create(
                bus=bus,
                route=route,
                travel_date=parse_date(travel_date),
                departure_time=parse_time(departure_time),
                arrival_time=parse_time(arrival_time),
                fare_amount=fare_amount
            )

            # ✅ Auto-create seats for this schedule
            from .views import create_seats_for_schedule
            create_seats_for_schedule(schedule)

            return JsonResponse({'message': 'Bus registered successfully!'})

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=400)

    return JsonResponse({'error': 'Invalid request method'}, status=405)



# ====================================================
# ✅ 2️⃣ Search Buses by Route + Date
# ====================================================
from django.http import JsonResponse
from django.utils.dateparse import parse_date
from .models import Schedule

def search_buses(request):
    origin = request.GET.get("from")
    destination = request.GET.get("to")
    date = request.GET.get("date")

    if not all([origin, destination, date]):
        return JsonResponse({"error": "Missing required query parameters"}, status=400)

    try:
        travel_date = parse_date(date)
        if not travel_date:
            return JsonResponse({"error": "Invalid date format"}, status=400)

        # ✅ Correct relation field names
        schedules = (
            Schedule.objects
            .filter(
                route__origin__iexact=origin.strip(),
                route__destination__iexact=destination.strip(),
                travel_date=travel_date
            )
            .select_related("bus", "route")
        )

        if not schedules.exists():
            return JsonResponse([], safe=False)

        data = [
            {
                "id": s.id,
                "bus_name": s.bus.name,
                "travels_name": s.bus.travels_name,
                "category": s.bus.category,
                "origin": s.route.origin,
                "destination": s.route.destination,
                "departure_time": s.departure_time.strftime("%H:%M"),
                "arrival_time": s.arrival_time.strftime("%H:%M"),
                "fare_amount": str(s.fare_amount),
                "travel_date": s.travel_date.strftime("%Y-%m-%d"),
            }
            for s in schedules
        ]

        return JsonResponse(data, safe=False)

    except Exception as e:
        print("❌ Error searching buses:", e)
        return JsonResponse({"error": str(e)}, status=500)


# ====================================================
# ✅ 3️⃣ Auto-create Seats
# ====================================================
def create_seats_for_schedule(schedule):
    bus = schedule.bus
    seats_to_create = [
        Seat(schedule=schedule, seat_number=f"Seat {i+1}", seat_type="Regular")
        for i in range(bus.total_seats)
    ]
    Seat.objects.bulk_create(seats_to_create)
    print(f"✅ Created {bus.total_seats} seats for schedule {schedule.id}")


# ====================================================
# ✅ 4️⃣ Fetch Seats
# ====================================================
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Seat
from .serializers import SeatSerializer

@api_view(['GET'])
def get_seats(request, schedule_id):
    seats = Seat.objects.filter(schedule_id=schedule_id).order_by('seat_number')
    serializer = SeatSerializer(seats, many=True)
    return Response(serializer.data)


# ====================================================
# ✅ 5️⃣ Book Seats
# ====================================================

@api_view(['POST'])
@transaction.atomic
def book_seats(request):
    try:
        data = request.data
        schedule_id = data.get("schedule_id")
        seat_numbers = data.get("seat_numbers", [])
        username = data.get("username")

        if not schedule_id or not seat_numbers:
            return Response({"error": "Missing schedule_id or seat_numbers"}, status=400)

        user = AppUser.objects.filter(username=username).first()
        if not user:
            return Response({"error": "Invalid user"}, status=400)

        # ✅ SEAT NUMBER FORMAT FIXED HERE
        formatted_numbers = [f"Seat {n}" for n in seat_numbers]

        seats = Seat.objects.filter(
            schedule_id=schedule_id,
            seat_number__in=formatted_numbers,
            is_available=True
        )

        if seats.count() != len(seat_numbers):
            return Response({"error": "Some selected seats are already booked!"}, status=400)

        for seat in seats:
            Booking.objects.create(
                user_id=user.id,
                schedule_id=schedule_id,
                seat_id=seat.id,
                status="CONFIRMED",
                price=seat.schedule.fare_amount
            )
            seat.is_available = False
            seat.save()

        return Response({"message": f"{len(seat_numbers)} seat(s) booked successfully!"}, status=201)

    except Exception as e:
        traceback.print_exc()
        return Response({"error": str(e)}, status=400)


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import AppUser
from django.contrib.auth.hashers import make_password, check_password
import json


@csrf_exempt
def signup_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            name = data.get("name")
            age = data.get("age")
            mobile = data.get("mobile")
            username = data.get("username")
            password = data.get("password")
            confirm = data.get("confirm")

            # ✅ Validation
            if not all([name, mobile, username, password, confirm]):
                return JsonResponse({"error": "All fields are required"}, status=400)

            if password != confirm:
                return JsonResponse({"error": "Passwords do not match"}, status=400)

            # ✅ Unique checks
            if AppUser.objects.filter(username=username).exists():
                return JsonResponse({"error": "Username already exists"}, status=400)

            if AppUser.objects.filter(mobile=mobile).exists():
                return JsonResponse({"error": "Mobile number already registered"}, status=400)

            # ✅ Save user (use Django hasher)
            AppUser.objects.create(
                name=name,
                age=age,
                mobile=mobile,
                username=username,
                password=make_password(password),  # <-- hashed using pbkdf2_sha256
            )

            return JsonResponse({"message": "Signup successful"}, status=201)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=405)


@csrf_exempt
def login_user(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            username = data.get("username")
            password = data.get("password")

            user = AppUser.objects.filter(username=username).first()

            if user and check_password(password, user.password):  # ✅ Properly verify PBKDF2 hash
                return JsonResponse({"message": "Login successful", "username": user.username}, status=200)
            else:
                return JsonResponse({"error": "Invalid username or password"}, status=400)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=400)

    return JsonResponse({"error": "Invalid request"}, status=405)



import razorpay
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.db import transaction
from .models import Seat, Booking, AppUser, Payment, Schedule
import traceback

# ✅ Razorpay Test Keys
RAZORPAY_KEY_ID = "rzp_test_Rc9a1tetxWiY2z"
RAZORPAY_KEY_SECRET = "UeeJvzEFnKsurJndj6NLEDsp"


@csrf_exempt
@api_view(['POST'])
@transaction.atomic
def book_seats_with_payment(request):
    """
    Handles seat booking with Razorpay payment integration.
    1️⃣ Checks if user exists and seats are available.
    2️⃣ Creates a Razorpay order.
    3️⃣ After payment verification, marks seats booked and stores payment info.
    """
    try:
        data = request.data
        schedule_id = data.get("schedule_id")
        seat_numbers = data.get("seat_numbers", [])
        username = data.get("username")
        amount = float(data.get("amount", 0))

        if not all([schedule_id, seat_numbers, username, amount]):
            return Response({"error": "Missing required fields"}, status=400)

        user = AppUser.objects.filter(username=username).first()
        if not user:
            return Response({"error": "Invalid user"}, status=400)

        # ✅ Validate seat availability
        seats = Seat.objects.filter(
            schedule_id=schedule_id,
            seat_number__in=[f"Seat {n}" for n in seat_numbers],
            is_available=True
        )

        if seats.count() != len(seat_numbers):
            return Response({"error": "Some selected seats are already booked"}, status=400)

        # ✅ Create a Razorpay Order (test mode)
        client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
        order_data = {
            "amount": int(amount * 100),  # Razorpay expects amount in paise
            "currency": "INR",
            "payment_capture": 1,
            "notes": {"username": username, "schedule_id": schedule_id},
        }
        order = client.order.create(order_data)

        # ✅ Save booking temporarily as 'PENDING'
        bookings = []
        for seat in seats:
            booking = Booking.objects.create(
                user_id=user.id,
                schedule_id=schedule_id,
                seat_id=seat.id,
                status="PENDING",
                price=seat.schedule.fare_amount,
            )
            bookings.append(booking)

        # ✅ Response with order info
        return Response({
            "message": "Order created successfully",
            "order_id": order["id"],
            "razorpay_key": RAZORPAY_KEY_ID,
            "amount": amount,
        }, status=200)

    except Exception as e:
        traceback.print_exc()
        return Response({"error": str(e)}, status=400)


@api_view(['POST'])
@transaction.atomic
def confirm_booking(request):
    try:
        order_id = request.data.get("order_id")
        username = request.data.get("username")

        user = AppUser.objects.filter(username=username).first()
        if not user:
            return Response({"error": "Invalid user"}, status=400)

        # ✅ find pending bookings
        bookings = Booking.objects.filter(
            user_id=user.id,
            status="PENDING"
        )

        # ✅ confirm and mark seats unavailable
        for b in bookings:
            seat = Seat.objects.get(id=b.seat_id)
            seat.is_available = False
            seat.save()

            b.status = "CONFIRMED"
            b.save()

        return Response({"message": "Booking confirmed!"}, status=200)

    except Exception as e:
        return Response({"error": str(e)}, status=400)

