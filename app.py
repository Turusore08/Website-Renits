# Impor library yang dibutuhkan
from flask import Flask, request
from flask_restful import reqparse, Api, Resource
from flask_cors import CORS
import pickle
import pandas as pd
import os
from werkzeug.exceptions import BadRequest

# --- 1. Inisialisasi Aplikasi Flask dan Flask-Restful ---
app = Flask(__name__)
api = Api(app)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# --- Penyimpanan Sementara untuk Data dari Patch ---
patch_data_storage = {}

# --- 2. Memuat Model Machine Learning ---
try:
    base_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(base_dir, 'model.pkl')
    with open(model_path, 'rb') as model_file:
        loaded_model = pickle.load(model_file)
    print("Model berhasil dimuat.")
except Exception as e:
    print(f"ERROR memuat model: {e}")
    loaded_model = None

# --- 3. Parser untuk Berbagai Endpoint ---
predict_parser = reqparse.RequestParser()
predict_parser.add_argument('patch_id', type=str, required=True, help='ID unik dari patch tidak boleh kosong')
predict_parser.add_argument('age', type=float, required=True, help='Nilai age tidak boleh kosong')
predict_parser.add_argument('appetite', type=bool, required=True, help='Nilai appetite tidak boleh kosong')
predict_parser.add_argument('hypertension', type=bool, required=True, help='Nilai hypertension tidak boleh kosong')
predict_parser.add_argument('diabetes_mellitus', type=bool, required=True, help='Nilai diabetes_mellitus tidak boleh kosong')
predict_parser.add_argument('coronary_artery_disease', type=bool, required=True, help='Nilai coronary_artery_disease tidak boleh kosong')
predict_parser.add_argument('peda_edema', type=bool, required=True, help='Nilai peda_edema tidak boleh kosong')

patch_parser = reqparse.RequestParser()
patch_parser.add_argument('patch_id', type=str, required=True, help='ID unik dari patch tidak boleh kosong')
patch_parser.add_argument('sugar', type=int, required=True, help='Nilai sugar dari patch tidak boleh kosong')
patch_parser.add_argument('potassium', type=float, required=True, help='Nilai potassium dari patch tidak boleh kosong')


# --- 4. Resource BARU untuk Menerima Data dari Patch ---
class PatchDataResource(Resource):
    def post(self):
        try:
            args = patch_parser.parse_args()
            patch_id = args['patch_id']
            patch_data_storage[patch_id] = {'sugar': args['sugar'], 'potassium': args['potassium']}
            print(f"--- DEBUG PATCH DATA ---: Diterima dari ID {patch_id}. Data: {patch_data_storage[patch_id]}", flush=True)
            return {'status': 'success', 'message': f'Data untuk patch {patch_id} berhasil disimpan.'}, 201
        except Exception as e:
            return {'status': 'error', 'message': f'Gagal menerima data patch: {str(e)}'}, 400


# --- 5. Resource Prediksi yang Diperbarui ---
class PredictionResource(Resource):
    def post(self):
        if loaded_model is None:
            return {'status': 'error', 'message': 'Model tidak tersedia, periksa log server.'}, 500

        try:
            args = predict_parser.parse_args()
            patch_id = args['patch_id']

            if patch_id not in patch_data_storage:
                return {'status': 'error', 'message': f'Data untuk patch ID {patch_id} belum diterima. Mohon sinkronkan patch terlebih dahulu.'}, 404

            patch_data = patch_data_storage[patch_id]

            input_df = pd.DataFrame([{
                'age': args['age'], 'sugar': patch_data['sugar'], 'potassium': patch_data['potassium'],
                'appetite': args['appetite'], 'hypertension': args['hypertension'],
                'diabetes_mellitus': args['diabetes_mellitus'], 'coronary_artery_disease': args['coronary_artery_disease'],
                'peda_edema': args['peda_edema']
            }])
            
            prediction_result = loaded_model.predict(input_df)
            del patch_data_storage[patch_id]
            result_text = "Terindikasi Penyakit Ginjal" if prediction_result[0] == 1 else "Tidak Terindikasi Penyakit Ginjal"
            
            # --- PERUBAHAN KRITIS DI SINI ---
            # Kirim kembali hasil prediksi DAN data patch yang digunakan
            return {
                'status': 'success', 
                'prediction': result_text,
                'used_patch_data': {
                    'sugar': patch_data['sugar'],
                    'potassium': patch_data['potassium']
                }
            }, 200

        except BadRequest as e:
            error_details = e.data.get('message', 'Format data tidak diketahui.')
            return {'status': 'error', 'message': f"Data yang dikirim tidak valid: {error_details}"}, 400
        except Exception as e:
            return {'status': 'error', 'message': f'Terjadi kesalahan tak terduga di server: {str(e)}'}, 500


# --- 6. Resource Autentikasi (Tidak Berubah) ---
class UserLogin(Resource):
    def post(self):
        return {'status': 'success', 'message': 'Login berhasil', 'token': 'contoh_token_jwt_yang_aman'}, 200

class UserRegister(Resource):
    def post(self):
        return {'status': 'success', 'message': 'Registrasi berhasil'}, 201


# --- 7. Menambahkan Semua Resource ke API ---
api.add_resource(PatchDataResource, '/patch-data')
api.add_resource(PredictionResource, '/predict')
api.add_resource(UserLogin, '/login')
api.add_resource(UserRegister, '/register')


# --- 8. Menjalankan Aplikasi ---
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
