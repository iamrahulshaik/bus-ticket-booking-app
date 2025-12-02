from rest_framework import serializers
from .models import Bus, Route, Schedule, Booking


# -------------------------------------------------------------------
# ✅ Bus Serializer
# -------------------------------------------------------------------
class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'


# -------------------------------------------------------------------
# ✅ Route Serializer
# -------------------------------------------------------------------
class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'


# -------------------------------------------------------------------
# ✅ Schedule Serializer
# -------------------------------------------------------------------
class ScheduleSerializer(serializers.ModelSerializer):
    bus_name = serializers.CharField(source='bus.name', read_only=True)
    travels_name = serializers.CharField(source='bus.travels_name', read_only=True)
    category = serializers.CharField(source='bus.category', read_only=True)
    origin = serializers.CharField(source='route.origin', read_only=True)
    destination = serializers.CharField(source='route.destination', read_only=True)

    class Meta:
        model = Schedule
        fields = [
            'id',
            'bus_name',
            'travels_name',
            'category',
            'origin',
            'destination',
            'departure_time',
            'arrival_time',
            'fare_amount',
            'travel_date',
        ]



# -------------------------------------------------------------------
# ✅ Booking Serializer
# -------------------------------------------------------------------
class BookingSerializer(serializers.ModelSerializer):
    schedule_details = ScheduleSerializer(source='schedule', read_only=True)

    class Meta:
        model = Booking
        fields = '__all__'

from rest_framework import serializers
from .models import Seat

class SeatSerializer(serializers.ModelSerializer):
    class Meta:
        model = Seat
        fields = ['seat_number', 'is_available']
