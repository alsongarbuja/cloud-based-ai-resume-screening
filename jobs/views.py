from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Job
from .serializers import JobSerializer

class JobViewSet(viewsets.ModelViewSet):
    queryset = Job.objects.all()
    serializer_class = JobSerializer
    
    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get only active jobs"""
        active_jobs = Job.objects.filter(status='active')
        serializer = self.get_serializer(active_jobs, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_employer(self, request):
        """Get jobs by employer"""
        employer_id = request.query_params.get('employer_id')
        if not employer_id:
            return Response({"error": "employer_id parameter required"}, status=400)
        
        jobs = Job.objects.filter(employer_id=employer_id)
        serializer = self.get_serializer(jobs, many=True)
        return Response(serializer.data)
