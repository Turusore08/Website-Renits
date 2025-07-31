import os

# Dapatkan path absolut ke direktori proyek
base_dir = os.path.abspath(os.path.dirname(__file__))

class Config:
    """
    Kelas konfigurasi dasar.
    """
    # Kunci rahasia untuk keamanan, terutama untuk JWT.
    # Di produksi, ini harus diambil dari environment variable.
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'kunci-rahasia-yang-sangat-sulit-ditebak'
    
    # Konfigurasi database
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(base_dir, 'app.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
