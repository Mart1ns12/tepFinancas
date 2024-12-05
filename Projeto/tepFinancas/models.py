from django.db import models

# Create your models here.
class Dados(models.Model):
    valor = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="Valor")
    tipo = models.CharField(max_length=50, verbose_name="Tipo")
    data = models.DateTimeField(auto_now_add=True, verbose_name="Data e Hora")

    class Meta:
        verbose_name = "Dado"
        verbose_name_plural = "Dados"
        ordering = ["-data"]  # Ordena do mais recente ao mais antigo

    def __str__(self):
        return f"{self.tipo}: {self.valor} em {self.data}"