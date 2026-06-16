from django.contrib import admin
from .models import ProgramaBeca, Estudiante, Postulacion


@admin.register(ProgramaBeca)
class ProgramaBecaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'tipo', 'monto', 'activo', 'fecha_creacion']
    list_filter = ['activo', 'tipo']
    search_fields = ['nombre']

@admin.register(Estudiante)
class EstudianteAdmin(admin.ModelAdmin):
    list_display = ['nombre_completo', 'ci', 'registro_universitario', 'carrera', 'fecha_registro']  #ACTUALIZADO
    search_fields = ['nombre_completo', 'ci', 'registro_universitario']  #ACTUALIZADO

@admin.register(Postulacion)
class PostulacionAdmin(admin.ModelAdmin):
    list_display = ['estudiante', 'programa', 'estado', 'fecha_postulacion']
    list_filter = ['estado', 'programa']
    search_fields = ['estudiante__nombre_completo', 'estudiante__ci']