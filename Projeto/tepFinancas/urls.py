from django.urls import path
from . import views

urlpatterns = [
        path('dashboard/', views.dashboard, name='dashboard'),  # URL para acessar o dashboard
  # Exemplo de rota inicial
]