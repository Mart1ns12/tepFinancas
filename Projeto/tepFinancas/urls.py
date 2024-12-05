from django.urls import path
from . import views

urlpatterns = [
        path('dashboard/', views.dashboard, name='dashboard'),
        path('criar-item-ajax/', views.criar_item_ajax, name='criar_item_ajax'),
        path('obter-dados-ajax/', views.obter_dados_ajax, name='obter_dados_ajax'),# URL para acessar o dashboard
        path('excluir-item-ajax/', views.excluir_item_ajax, name='excluir_item_ajax'),
]