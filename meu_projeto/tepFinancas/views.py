
from django.http import HttpResponse
from django.shortcuts import render

def dashboard(request):
    return render(request, 'dashboard.html')
# Create your views here.
