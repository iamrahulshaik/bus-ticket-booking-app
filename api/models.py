from django.db import models
from django.contrib.auth import get_user_model
import datetime

User = get_user_model()

# ---------------------------------------------------------
# 🚌 Bus model
# ---------------------------------------------------------
class Bus(models.Model):
    name = models.CharField(max_length=128)                 # e.g., "Volvo Multi Axle"
    travels_name = models.CharField(max_length=128)         # e.g., "VRL Travels"
    category = models.CharField(
        max_length=64,
        choices=[
            ('AC Seater', 'AC Seater'),
            ('Non-AC Seater', 'Non-AC Seater'),
            ('AC Sleeper', 'AC Sleeper'),
            ('Non-AC Sleeper', 'Non-AC Sleeper'),
        ],
    )
    total_seats = models.PositiveIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'bus'          # ✅ matches existing MySQL table name
        managed = False           # ✅ prevents Django from altering your table

    def __str__(self):
        return f"{self.travels_name} - {self.name}"


# ---------------------------------------------------------
# 🌆 City model (for origin/destination use)
# ---------------------------------------------------------
class City(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        db_table = 'city'
        managed = True  # ✅ New model; Django can create this safely

    def __str__(self):
        return self.name


# ---------------------------------------------------------
# 🗺 Route model
# ---------------------------------------------------------
class Route(models.Model):
    origin = models.CharField(max_length=128)
    destination = models.CharField(max_length=128)
    distance_km = models.IntegerField(null=True, blank=True)
    duration_minutes = models.IntegerField(null=True, blank=True)

    class Meta:
        db_table = 'route'  # 👈 force Django to use your existing SQL table
        managed = False

    def __str__(self):
        return f"{self.origin} → {self.destination}"


# ---------------------------------------------------------
# 🕒 Schedule model
# ---------------------------------------------------------
class Schedule(models.Model):
    bus = models.ForeignKey(Bus, on_delete=models.CASCADE)
    route = models.ForeignKey(Route, on_delete=models.CASCADE)
    travel_date = models.DateField()
    departure_time = models.TimeField()
    arrival_time = models.TimeField()
    fare_amount = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'schedule'
        managed = False  # ✅ prevents Django from altering your table

    def __str__(self):
        return f"{self.bus.name} ({self.route.origin} → {self.route.destination})"


# ---------------------------------------------------------
# 💺 Seat model
# ---------------------------------------------------------
class Seat(models.Model):
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='seats')
    seat_number = models.CharField(max_length=10)
    seat_type = models.CharField(max_length=32, blank=True, null=True)
    is_available = models.BooleanField(default=True)

    class Meta:
        db_table = 'seat'
        managed = False
        unique_together = ('schedule', 'seat_number')

    def __str__(self):
        return f"{self.schedule.bus.name} - {self.seat_number}"


# ---------------------------------------------------------
# 🎟 Booking model
# ---------------------------------------------------------
class Booking(models.Model):
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('CONFIRMED', 'Confirmed'),
        ('CANCELLED', 'Cancelled'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bookings', null=True)
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE)
    seat = models.ForeignKey(Seat, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'booking'
        managed = False

    def __str__(self):
        return f"{self.user.username if self.user else 'Guest'} - {self.schedule.bus.name} ({self.status})"




from django.db import models

class AppUser(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128)
    age = models.IntegerField(null=True, blank=True)
    mobile = models.CharField(max_length=15, unique=True)
    username = models.CharField(max_length=128, unique=True)
    password = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'user'
        managed = False

    def __str__(self):
        return self.username

class Payment(models.Model):
    id = models.AutoField(primary_key=True)
    booking = models.ForeignKey("Booking", on_delete=models.CASCADE, db_column="booking_id")
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    provider = models.CharField(max_length=64)
    status = models.CharField(max_length=32)
    payment_time = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "payment"
        managed = False

    def __str__(self):
        return f"Payment {self.id} - {self.status}"
