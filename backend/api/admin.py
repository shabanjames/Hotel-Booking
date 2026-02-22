from django.contrib import admin
from .models import User, Hotel, Booking

# Register your models here.
admin.site.register(User)
admin.site.register(Hotel)
admin.site.register(Booking)
