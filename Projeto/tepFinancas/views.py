from django.http import JsonResponse
from .models import dados  # Certifique-se de importar o modelo de dados correto
from django.shortcuts import render




def dashboard(request):
    return render(request, 'dashboard.html')  # Ou qualquer outra lógica para renderizar a página

def criar_item_ajax(request):
    if request.method == "POST":
        valor = request.POST.get('valor')
        tipo = request.POST.get('tipo')

        # Verificar se os dados são válidos
        if not valor or not tipo:
            return JsonResponse({"error": "Dados inválidos"}, status=400)

        # Salvar no banco de dados
        item = dados.objects.create(valor=valor, tipo=tipo)

        return JsonResponse({"id": item.id, "valor": item.valor, "tipo": item.tipo})

    # Caso o método não seja POST
    return JsonResponse({"error": "Método inválido"}, status=405)


 # Certifique-se de importar o modelo de dados correto

def criar_item_ajax(request):
    if request.method == "POST":
        valor = request.POST.get('valor')
        tipo = request.POST.get('tipo')

        # Verificar se os dados são válidos
        if not valor or not tipo:
            return JsonResponse({"error": "Dados inválidos"}, status=400)

        # Salvar no banco de dados
        item = dados.objects.create(valor=valor, tipo=tipo)

        return JsonResponse({"id": item.id, "valor": item.valor, "tipo": item.tipo})

    # Caso o método não seja POST
    return JsonResponse({"error": "Método inválido"}, status=405)
