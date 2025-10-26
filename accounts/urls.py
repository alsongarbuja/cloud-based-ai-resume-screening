from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, JobSeekerProfileViewSet, EmployerProfileViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'jobseeker-profiles', JobSeekerProfileViewSet)
router.register(r'employer-profiles', EmployerProfileViewSet)

urlpatterns = [
    path('', include(router.urls)),
]