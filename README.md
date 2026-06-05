# 🎓 Sistema de Gestión de Becas Universitarias

Sistema de getión de becas universitarias...

\---

## Requisitos

|Herramienta|Versión|
|-|-|
|Python|3.10+|
|Git|2.0+|
|Dbeaver|25.0+|
|MySQL server|9.6+|

\---

Previamente a la instalación deberá configurar MySQL Server
Esto definira el apartado de settings.py

En este caso deberá ir a settings.py y verificar que su contraseña y puerto este correctos,
Para luego hacer una conexcion correcta con DBeaver o otra herramienta.

## Instalación

```bash
1. Clonar repositorio
git clone https://github.com/arielemcm/Proyecto-Final---3-Sistema-de-Gesti-n-de-Becas-Universitarias---WEB-III-
cd SistemaGestBecasUniv

2. Crear entorno virtual
python -m venv env

3. Activar el entorno virtual
.\env\Scripts\activate

4. Instalar las bilbiotecas
- pip install -r requirements.txt
o pruebe este otro comando
- python -m pip install -r requirements.txt
despues ejecute lo siguiente
- python -m pip install --upgrade pip

5. Crear base de datos en MySQL
 Entrar a DBeaver y hacer una nieva conexión, con el puerto y contraseña que configuro previamente a instalacion,

&#x20;crear manualmente el la base de datos: becas\_db, en caso de que aparezca un archivo mas que sys, eliminarlo y respectivamente crear: becas\_db
6. Migrar
- python .\manage.py makemigrations BecasUniv
- python .\manage.py migrate

7. Crear superusuario
- python .\manage.py createsuperuser

8. Ejecutar
- python .\manage.py runserver



