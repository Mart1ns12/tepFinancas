from django.urls import path
from . import views

urlpatterns = [
        path('dashboard/', views.dashboard, name='dashboard'),
        path('criar-item-ajax/', views.criar_item_ajax, name='criar_item_ajax'),# URL para acessar o dashboard
  # Exemplo de rota inicial
]