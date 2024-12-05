from django.http import JsonResponse
from .models import Dados  # Corrija o nome para Dados (primeira letra maiúscula)
from django.shortcuts import render
from django.utils.timezone import localtime
from django.views.decorators.csrf import csrf_exempt
import json
from django.views.decorators.http import require_http_methods


def dashboard(request):
    return render(request, 'dashboard.html')

@csrf_exempt
def criar_item_ajax(request):
    if request.method == "POST":
        valor = request.POST.get("valor")
        tipo = request.POST.get("tipo")

        # Valida os dados antes de criar
        if not valor or not tipo:
            return JsonResponse({"erro": "Dados inválidos"}, status=400)

        try:
            # Cria o item no banco
            dado = Dados.objects.create(valor=valor, tipo=tipo)
            return JsonResponse({
                "id": dado.id,
                "valor": str(dado.valor),
                "tipo": dado.tipo,
                "data": dado.data.isoformat(),
            })
        except Exception as e:
            return JsonResponse({"erro": str(e)}, status=500)



def obter_dados_ajax(request):
    dados = Dados.objects.all().values('id', 'valor', 'tipo', 'data')  # Inclui 'id'
    
    dados_lista = []
    for dado in dados:
        dados_lista.append({
            'id': dado['id'],
            'valor': dado['valor'],
            'tipo': dado['tipo'],
            'data_hora': dado['data'].strftime('%d/%m/%Y %H:%M:%S'),  # Formatação da data
        })

    return JsonResponse(dados_lista, safe=False)



@csrf_exempt
def excluir_item_ajax(request):
    if request.method == "POST":
        try:
            print("Requisição recebida:", request.body)  # Log do corpo recebido
            body = json.loads(request.body)
            item_id = body.get("id")
            print("ID recebido:", item_id)  # Verificar se o ID foi enviado corretamente

            if not item_id:
                return JsonResponse({"erro": "ID não fornecido"}, status=400)

            transacao = Dados.objects.get(id=item_id)
            transacao.delete()
            return JsonResponse({"mensagem": "Transação excluída com sucesso!"})
        except Dados.DoesNotExist:
            return JsonResponse({"erro": "Transação não encontrada"}, status=404)
        except json.JSONDecodeError as e:
            print("Erro de decodificação JSON:", e)
            return JsonResponse({"erro": "Dados inválidos no corpo da requisição"}, status=400)
