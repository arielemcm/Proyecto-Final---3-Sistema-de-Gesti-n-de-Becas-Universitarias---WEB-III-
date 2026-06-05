from django.db import models

# Create your models here.
# ============================================
# TABLA 1: PROGRAMAS DE BECA
# ============================================
class ProgramaBeca(models.Model):
    """Catálogo de programas de becas disponibles"""
    
    # Tipos de beca (choices)
    TIPOS = [
        ('DOCENCIA', 'Auxiliar Docencia'),
        ('INVESTIGACION', 'Auxiliar Investigación'),
        ('COMEDOR1', 'Beca Comedor Cat.1'),
        ('COMEDOR2', 'Beca Comedor Cat.2'),
        ('TRANSPORTE', 'Beca Transporte'),
        ('DEPORTIVA', 'Beca Deportiva'),
    ]
    
    nombre = models.CharField(max_length=200, verbose_name='Nombre del programa')
    tipo = models.CharField(max_length=20, choices=TIPOS, default='COMEDOR1', verbose_name='Tipo de beca')
    monto = models.CharField(max_length=100, verbose_name='Monto/Beneficio')
    requisito = models.TextField(verbose_name='Requisitos')
    activo = models.BooleanField(default=True, verbose_name='¿Programa activo?')
    fecha_creacion = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de creación')
    
    class Meta:
        db_table = 'programas_beca'
        verbose_name = 'Programa de Beca'
        verbose_name_plural = 'Programas de Becas'
        ordering = ['-fecha_creacion']
    
    def __str__(self):
        return f"{self.get_tipo_display()} - {self.nombre}"

# ============================================
# TABLA 2: ESTUDIANTES
# ============================================
class Estudiante(models.Model):
    """Datos de estudiantes postulantes"""
    
    estudiante_id = models.CharField(max_length=20, unique=True, verbose_name='ID/Carnet Estudiante')
    nombre_completo = models.CharField(max_length=200, verbose_name='Nombre completo')
    carrera = models.CharField(max_length=100, default='Informática', verbose_name='Carrera')
    fecha_registro = models.DateTimeField(auto_now_add=True, verbose_name='Fecha de registro')
    
    class Meta:
        db_table = 'estudiantes'
        verbose_name = 'Estudiante'
        verbose_name_plural = 'Estudiantes'
    
    def __str__(self):
        return f"{self.nombre_completo} ({self.estudiante_id})"

# ============================================
# TABLA 3: POSTULACIONES
# ============================================
class Postulacion(models.Model):
    """Postulaciones de estudiantes a programas de beca"""
    
    ESTADOS = [
        ('PENDIENTE', 'Pendiente'),
        ('APROBADA', 'Aprobada'),
        ('RECHAZADA', 'Rechazada'),
    ]
    
    estudiante = models.ForeignKey(Estudiante, on_delete=models.CASCADE, related_name='postulaciones')
    programa = models.ForeignKey(ProgramaBeca, on_delete=models.CASCADE, related_name='postulaciones')
    estado = models.CharField(max_length=15, choices=ESTADOS, default='PENDIENTE', verbose_name='Estado')
    fecha_postulacion = models.DateField(auto_now_add=True, verbose_name='Fecha de postulación')
    observaciones = models.TextField(blank=True, null=True, verbose_name='Observaciones')
    
    class Meta:
        db_table = 'postulaciones'
        verbose_name = 'Postulación'
        verbose_name_plural = 'Postulaciones'
        ordering = ['-fecha_postulacion']
    
    def __str__(self):
        return f"{self.estudiante.nombre_completo} → {self.programa.nombre}"