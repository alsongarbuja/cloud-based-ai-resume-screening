from rest_framework import serializers
from .models import Application
from accounts.serializers import UserSerializer
from jobs.serializers import JobSerializer

class ApplicationSerializer(serializers.ModelSerializer):
    jobseeker_details = UserSerializer(source='jobseeker', read_only=True)
    job_details = JobSerializer(source='job', read_only=True)
    
    class Meta:
        model = Application
        fields = '__all__'
        read_only_fields = ['id', 'applied_at', 'updated_at', 'match_score', 'score_breakdown']