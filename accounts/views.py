from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import User, JobSeekerProfile, EmployerProfile
from .serializers import UserSerializer, JobSeekerProfileSerializer, EmployerProfileSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class JobSeekerProfileViewSet(viewsets.ModelViewSet):
    queryset = JobSeekerProfile.objects.all()
    serializer_class = JobSeekerProfileSerializer
    
    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get profile by user ID"""
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "user_id parameter required"}, status=400)
        
        try:
            profile = JobSeekerProfile.objects.get(user_id=user_id)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except JobSeekerProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)


class EmployerProfileViewSet(viewsets.ModelViewSet):
    queryset = EmployerProfile.objects.all()
    serializer_class = EmployerProfileSerializer
    
    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get profile by user ID"""
        user_id = request.query_params.get('user_id')
        if not user_id:
            return Response({"error": "user_id parameter required"}, status=400)
        
        try:
            profile = EmployerProfile.objects.get(user_id=user_id)
            serializer = self.get_serializer(profile)
            return Response(serializer.data)
        except EmployerProfile.DoesNotExist:
            return Response({"error": "Profile not found"}, status=404)