```text
1. Clonar repositorio
git clone https://github.com
cd SistemaGestBecasUniv
```

```text
2. Crear entorno virtual
python -m venv env
```

```text
3. Activar el entorno virtual
.\env\Scripts\activate
```

```text
4. Instalar las bibliotecas
pip install -r requirements.txt

o pruebe este otro comando si falla:
python -m pip install -r requirements.txt
python -m pip install --upgrade pip
```

```text
5. Crear base de datos en MySQL
Entrar a DBeaver y hacer una nueva conexión con el puerto y contraseña configurados.
Crear manualmente la base de datos: becas_db
(En caso de que aparezca un archivo más que sys, eliminarlo y respectivamente crear: becas_db)
```

```text
6. Migrar
python .\manage.py makemigrations BecasUniv
python .\manage.py migrate
```

```text
7. Crear superusuario
python .\manage.py createsuperuser
```

```text
8. Ejecutar
python .\manage.py runserver
```
