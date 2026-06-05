from django.contrib import admin

# Register your models here.
"""Configuración del panel de administración"""
from .models import ProgramaBeca, Estudiante, Postulacion

@admin.register(ProgramaBeca)
class ProgramaBecaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'tipo', 'monto', 'activo', 'fecha_creacion']
    list_filter = ['activo', 'tipo']
    search_fields = ['nombre']

@admin.register(Estudiante)
class EstudianteAdmin(admin.ModelAdmin):
    list_display = ['nombre_completo', 'estudiante_id', 'carrera', 'fecha_registro']
    search_fields = ['nombre_completo', 'estudiante_id']

@admin.register(Postulacion)
class PostulacionAdmin(admin.ModelAdmin):
    list_display = ['estudiante', 'programa', 'estado', 'fecha_postulacion']
    list_filter = ['estado', 'programa']
    search_fields = ['estudiante__nombre_completo']