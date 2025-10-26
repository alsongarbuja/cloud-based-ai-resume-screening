from django.contrib import admin
from .models import User, JobSeekerProfile, EmployerProfile

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'user_type', 'date_joined']
    list_filter = ['user_type']

@admin.register(JobSeekerProfile)
class JobSeekerProfileAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'location', 'experience_years', 'created_at']

@admin.register(EmployerProfile)
class EmployerProfileAdmin(admin.ModelAdmin):
    list_display = ['company_name', 'industry', 'location', 'created_at']
