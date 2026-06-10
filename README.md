### 📥 1. Clonar repositorio
Ejecuta el comando para descargar el proyecto en tu máquina local:

```bash
git clone https://github.com
cd SistemaGestBecasUniv
```

---

### 📦 2. Crear entorno virtual
Inicializa un entorno aislado de Python en la raíz del proyecto:

```bash
python -m venv env
```

---

### 🔌 3. Activar el entorno virtual
Enciende el entorno virtual desde tu terminal:

```bash
.\env\Scripts\activate
```

---

### 📚 4. Instalar las bibliotecas
Descarga todos los paquetes necesarios requeridos por la aplicación:

```bash
pip install -r requirements.txt
```

O pruebe este otro comando si falla:

```bash
python -m pip install -r requirements.txt
python -m pip install --upgrade pip
```

---

### 🗄️ 5. Crear base de datos en MySQL
Entrar a DBeaver y hacer una nueva conexión. Crear manualmente la base de datos:

```sql
CREATE DATABASE becas_db;
```
*(En caso de que aparezca un archivo más que sys, eliminarlo y respectivamente crear: becas_db)*.

---

### ⚙️ 6. Migrar
Sincroniza los modelos del código con tu base de datos:

```bash
python .\manage.py makemigrations BecasUniv
python .\manage.py migrate
```

---

### 👤 7. Crear superusuario
Genera las credenciales de acceso para la interfaz de administración:

```bash
python .\manage.py createsuperuser
```

---

### 🚀 8. Ejecutar
Inicia el servidor de desarrollo local de Django:

```bash
python .\manage.py runserver
```
