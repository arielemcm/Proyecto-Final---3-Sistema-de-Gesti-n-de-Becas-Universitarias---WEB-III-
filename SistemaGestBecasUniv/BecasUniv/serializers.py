from rest_framework import serializers
from .models import ProgramaBeca, Estudiante, Postulacion

class ProgramaBecaSerializer(serializers.ModelSerializer):
    """Serializador para Programas de Beca"""
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)
    
    class Meta:
        model = ProgramaBeca
        fields = '__all__'

class EstudianteSerializer(serializers.ModelSerializer):
    """Serializador para Estudiantes"""
    total_postulaciones = serializers.SerializerMethodField()
    
    class Meta:
        model = Estudiante
        fields = '__all__'
    
    def get_total_postulaciones(self, obj):
        """Cuenta cuasntas postulaciones tiene el estudiante"""
        return obj.postulaciones.count()

class PostulacionSerializer(serializers.ModelSerializer):
    """Serializador para Postulaciones"""
    # Campos adicionales para mostrar información relacionada
    estudiante_nombre = serializers.CharField(source='estudiante.nombre_completo', read_only=True)
    estudiante_id_display = serializers.CharField(source='estudiante.estudiante_id', read_only=True)
    programa_nombre = serializers.CharField(source='programa.nombre', read_only=True)
    programa_tipo = serializers.CharField(source='programa.get_tipo_display', read_only=True)
    programa_monto = serializers.CharField(source='programa.monto', read_only=True)
    
    class Meta:
        model = Postulacion
        fields = '__all__'