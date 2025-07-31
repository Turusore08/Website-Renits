from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class UserModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    
    # Menambahkan relasi ke riwayat prediksi
    predictions = db.relationship('PredictionHistoryModel', backref='user', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

class PatchDataModel(db.Model):
    patch_id = db.Column(db.String(80), primary_key=True)
    sugar = db.Column(db.Integer, nullable=False)
    potassium = db.Column(db.Float, nullable=False)
    timestamp = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

# --- MODEL BARU UNTUK RIWAYAT PREDIKSI ---
class PredictionHistoryModel(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    timestamp = db.Column(db.DateTime, index=True, default=datetime.utcnow)
    
    # Kunci asing untuk menghubungkan prediksi ini dengan pengguna yang membuatnya
    user_id = db.Column(db.Integer, db.ForeignKey('user_model.id'), nullable=False)
    
    # Menyimpan hasil dan data yang digunakan
    prediction_result = db.Column(db.String(100), nullable=False)
    age = db.Column(db.Float, nullable=False)
    sugar = db.Column(db.Integer, nullable=False)
    potassium = db.Column(db.Float, nullable=False)
    hypertension = db.Column(db.Boolean, nullable=False)
    diabetes_mellitus = db.Column(db.Boolean, nullable=False)
    # ... Anda bisa menambahkan semua fitur lain yang digunakan jika perlu
