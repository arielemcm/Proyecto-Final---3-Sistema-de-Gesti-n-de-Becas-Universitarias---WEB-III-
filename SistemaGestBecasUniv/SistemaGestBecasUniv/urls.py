"""
URL configuration for SistemaGestBecasUniv project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# Importar vistas
from BecasUniv.views import (
    login_view, index_view, logout_view,
    ProgramaBecaViewSet, EstudianteViewSet, PostulacionViewSet,
    consulta_estado_estudiante, consulta_estadisticas,
    consulta_por_estado, consulta_por_programa, estudiante_view
)

# Router para API REST (CRUD automático)
router = DefaultRouter()
router.register(r'api/programas', ProgramaBecaViewSet, basename='programas')
router.register(r'api/estudiantes', EstudianteViewSet, basename='estudiantes')
router.register(r'api/postulaciones', PostulacionViewSet, basename='postulaciones')

urlpatterns = [
    # ============================================
    # FRONTEND
    # ============================================
    path('', login_view, name='login'),           # Login (página principal)
    path('index/', index_view, name='index'),     # Dashboard (protegido)
    path('logout/', logout_view, name='logout'),  # Cerrar sesión
    path('estudiante/', estudiante_view, name='estudiante'),
    
    # ============================================
    # ADMIN DJANGO
    # ============================================
    path('admin/', admin.site.urls),
    
    # ============================================
    # API REST (CRUD automático)
    # ============================================
    path('', include(router.urls)),
    
    # ============================================
    # JWT (autenticación)
    # ============================================
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # ============================================
    # CONSULTAS PERSONALIZADAS
    # ============================================
    path('api/consulta/estado/<str:estudiante_id>/', consulta_estado_estudiante, name='consulta_estado'),
    path('api/consulta/estadisticas/', consulta_estadisticas, name='consulta_estadisticas'),
    path('api/consulta/por-estado/<str:estado>/', consulta_por_estado, name='consulta_por_estado'),
    path('api/consulta/por-programa/<int:programa_id>/', consulta_por_programa, name='consulta_por_programa'),
]