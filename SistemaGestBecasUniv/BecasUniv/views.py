from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required

# API REST
from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .models import ProgramaBeca, Estudiante, Postulacion
from .serializers import ProgramaBecaSerializer, EstudianteSerializer, PostulacionSerializer
from django.db.models import Q
# ============================================
# VISTAS DE AUTENTICACIÓN
# ============================================

def login_view(request):
    """
    Vista de inicio de sesión
    Si el usuario ya está autenticado, redirige al index
    """
    # Si ya está logueado, redirigir al index
    if request.user.is_authenticated:
        return redirect('index')
    
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('index')  # Redirige al index después de login
        else:
            messages.error(request, 'Usuario o contraseña inválidos')
    
    return render(request, 'login.html')

@login_required
def index_view(request):
    """
    Vista principal del sistema (protegida, requiere login)
    """
    return render(request, 'index.html')

def logout_view(request):
    """
    Cierra la sesión y redirige al login
    """
    logout(request)
    return redirect('login')

# ============================================
# VIEWSETS API REST
# ============================================

class ProgramaBecaViewSet(viewsets.ModelViewSet):
    """CRUD para Programas de Beca"""
    queryset = ProgramaBeca.objects.all()
    serializer_class = ProgramaBecaSerializer

class EstudianteViewSet(viewsets.ModelViewSet):
    """CRUD para Estudiantes"""
    queryset = Estudiante.objects.all()
    serializer_class = EstudianteSerializer

class PostulacionViewSet(viewsets.ModelViewSet):
    """CRUD para Postulaciones"""
    queryset = Postulacion.objects.all()
    serializer_class = PostulacionSerializer
    
    @action(detail=True, methods=['post'])
    def cambiar_estado(self, request, pk=None):
        """
        POST /api/postulaciones/{id}/cambiar_estado/
        Body: { "estado": "APROBADA" }
        """
        postulacion = self.get_object()
        nuevo_estado = request.data.get('estado')
        
        if nuevo_estado not in ['APROBADA', 'RECHAZADA', 'PENDIENTE']:
            return Response({'error': 'Estado inválido'}, status=400)
        
        postulacion.estado = nuevo_estado
        postulacion.save()
        return Response(PostulacionSerializer(postulacion).data)

# ============================================
# CONSULTAS PERSONALIZADAS
# ============================================

@api_view(['GET'])
def consulta_estado_estudiante(request, estudiante_id):
    """
    CONSULTA 1: Buscar por CI o Registro Universitario
    GET /api/consulta/estado/{ci_o_registro}/
    """
    # Buscar por CI o por Registro Universitario
    postulaciones = Postulacion.objects.filter(
        Q(estudiante__ci=estudiante_id) | 
        Q(estudiante__registro_universitario=estudiante_id)
    )
    
    if not postulaciones.exists():
        return Response({'mensaje': f'No se encontraron postulaciones para CI/RU: {estudiante_id}'})
    
    serializer = PostulacionSerializer(postulaciones, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def consulta_estadisticas(request):
    """
    CONSULTA 2: KPIs del dashboard
    GET /api/consulta/estadisticas/
    """
    return Response({
        'programas_activos': ProgramaBeca.objects.filter(activo=True).count(),
        'total_postulaciones': Postulacion.objects.count(),
        'aprobadas': Postulacion.objects.filter(estado='APROBADA').count(),
        'rechazadas': Postulacion.objects.filter(estado='RECHAZADA').count(),
        'pendientes': Postulacion.objects.filter(estado='PENDIENTE').count(),
    })

@api_view(['GET'])
def consulta_por_estado(request, estado):
    """
    CONSULTA 3: Filtrar por estado
    GET /api/consulta/por-estado/aprobada/
    """
    estado = estado.upper()
    postulaciones = Postulacion.objects.filter(estado=estado)
    serializer = PostulacionSerializer(postulaciones, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def consulta_por_programa(request, programa_id):
    """
    CONSULTA 4: Filtrar por programa
    GET /api/consulta/por-programa/1/
    """
    postulaciones = Postulacion.objects.filter(programa_id=programa_id)
    serializer = PostulacionSerializer(postulaciones, many=True)
    return Response(serializer.data)