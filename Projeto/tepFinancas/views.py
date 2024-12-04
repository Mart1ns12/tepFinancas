
from django.http import HttpResponse
from django.shortcuts import render
from django.http import JsonResponse
from .models import dados
from django.db import connection

def dashboard(request):
    return render(request, 'dashboard.html')

# Create your views here.

def criar_item_ajax(request):
    if request.method == "POST":
        valor = request.POST.get('valor')
        tipo = request.POST.get('tipo')

        # Salvar no banco de dados
        item = dados.objects.create(valor=valor, tipo=tipo)

        return JsonResponse({"id": item.id, "valor": item.valor, "tipo": item.tipo})

    JsonResponse({"error": "Dados inválidos"}, status=400)

def executar_script_sql():
    script_sql = """
        
        CREATE DATABASE IF NOT EXISTS tepFinancas;
        
        USE tepFinancas;
        
        CREATE TABLE IF NOT EXISTS tepFinancas_dados (
            id serial PRIMARY KEY,
            valor FLOAT,
            tipo VARCHAR(255)
        );
    """
    with connection.cursor() as cursor:
        cursor.execute(script_sql)
        print("Script SQL executado com sucesso!")	
        
executar_script_sql()