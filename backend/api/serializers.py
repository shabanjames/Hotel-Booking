from rest_framework import serializers
from .models import User, Hotel, Booking
from django.utils import timezone
from decimal import Decimal

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role']

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'

class BookingSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    hotel = HotelSerializer(read_only=True)
    hotel_id = serializers.IntegerField(write_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'user', 'hotel', 'hotel_id', 'check_in', 'check_out', 'total_price', 'status', 'created_at']

    def create(self, validated_data):
        # Get user from request context (set by ViewSet's perform_create via serializer.save())
        # or from validated_data
        request = self.context.get('request')
        if request and hasattr(request, 'user') and request.user.is_authenticated:
            user = request.user
        else:
            user = validated_data.pop('user', None)
        
        # Remove user from validated_data if it exists to avoid duplicate keyword argument
        validated_data.pop('user', None)
        
        hotel_id = validated_data.pop('hotel_id')
        hotel = Hotel.objects.get(id=hotel_id)
        check_in = validated_data['check_in']
        check_out = validated_data['check_out']
        nights = (check_out - check_in).days
        total_price = hotel.price_per_night * Decimal(nights)
        booking = Booking.objects.create(user=user, hotel=hotel, total_price=total_price, **validated_data)
        return booking
