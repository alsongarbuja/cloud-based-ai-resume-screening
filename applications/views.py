from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Application
from .serializers import ApplicationSerializer

class ApplicationViewSet(viewsets.ModelViewSet):
    queryset = Application.objects.all()
    serializer_class = ApplicationSerializer
    
    @action(detail=False, methods=['get'])
    def by_jobseeker(self, request):
        """Get applications by jobseeker"""
        jobseeker_id = request.query_params.get('jobseeker_id')
        if not jobseeker_id:
            return Response({"error": "jobseeker_id parameter required"}, status=400)
        
        applications = Application.objects.filter(jobseeker_id=jobseeker_id)
        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_job(self, request):
        """Get applications for a job"""
        job_id = request.query_params.get('job_id')
        if not job_id:
            return Response({"error": "job_id parameter required"}, status=400)
        
        applications = Application.objects.filter(job_id=job_id)
        serializer = self.get_serializer(applications, many=True)
        return Response(serializer.data)
    
    @action(detail=True, methods=['patch'])
    def update_status(self, request, pk=None):
        """Update application status"""
        application = self.get_object()
        new_status = request.data.get('status')
        
        if not new_status:
            return Response({"error": "status field required"}, status=400)
        
        application.status = new_status
        application.save()
        serializer = self.get_serializer(application)
        return Response(serializer.data)