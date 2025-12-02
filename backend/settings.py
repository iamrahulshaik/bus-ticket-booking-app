import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-test-key'
DEBUG = True
ALLOWED_HOSTS = ['*']  # Allow all for local testing

# ============================
# ✅ INSTALLED APPS
# ============================
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party
    'rest_framework',
    'corsheaders',  # ✅ For frontend-backend connection

    # Local apps
    'api',
]

# ============================
# ✅ MIDDLEWARE (order matters!)
# ============================
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # ✅ Must be first
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'backend.urls'

# ============================
# ✅ TEMPLATES
# ============================
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],  # optional
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'backend.wsgi.application'

# ============================
# ✅ DATABASE (MySQL)
# ============================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'wegooo',          # ✅ your database
        'USER': 'root',            # ✅ MySQL username
        'PASSWORD': 'mysql',       # ✅ MySQL password
        'HOST': 'localhost',       # ✅ or 127.0.0.1
        'PORT': '3306',
        'OPTIONS': {
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        },
    }
}

# ============================
# ✅ REST FRAMEWORK
# ============================
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.AllowAny',
    ]
}

# ============================
# ✅ PASSWORD VALIDATION (simplified for dev)
# ============================
AUTH_PASSWORD_VALIDATORS = []

# ============================
# ✅ GENERAL SETTINGS
# ============================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'Asia/Kolkata'  # optional - matches your local time
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ============================
# ✅ CORS SETTINGS
# ============================
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# ✅ Allow cookies / authorization headers if needed
CORS_ALLOW_CREDENTIALS = True

# ✅ Allow all methods (GET, POST, PUT, etc.)
CORS_ALLOW_ALL_METHODS = True

# ✅ Allow all headers
CORS_ALLOW_HEADERS = [
    'content-type',
    'authorization',
    'x-csrftoken',
    'accept',
    'origin',
    'user-agent',
]

# Optional (for testing if CORS still blocks)
# CORS_ALLOW_ALL_ORIGINS = True
