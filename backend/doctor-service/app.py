from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Doctor, Gender  # 👉 import จาก model.py
import os

from datetime import datetime
from prometheus_client import make_wsgi_app
from werkzeug.middleware.dispatcher import DispatcherMiddleware

app = Flask(__name__)
CORS(app)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "postgresql://admin:1234@db:5432/mydb")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Metrics endpoint for Prometheus
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})

# Routes
@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    doctors = Doctor.query.all()
    return jsonify([{ 'id': d.id, 'first_name': d.first_name, 'last_name': d.last_name, 'email': d.email } for d in doctors])

@app.route('/api/doctors', methods=['POST'])
def create_doctor():
    data = request.json
    doctor = Doctor(
        first_name=data['first_name'],
        last_name=data['last_name'],
        phone_number=data['phone_number'],
        email=data['email'],
        password=data['password'],
        gender_id=data['gender_id']
    )
    db.session.add(doctor)
    db.session.commit()
    return jsonify({ "message": "Doctor created", "id": doctor.id }), 201

@app.route('/api/init_genders', methods=['POST'])
def init_genders():
    try:
        default_genders = [
            {"id": 1, "gender": "ชาย"},
            {"id": 2, "gender": "หญิง"},
            {"id": 3, "gender": "อื่น ๆ"},
        ]

        added = 0
        for g in default_genders:
            exists = Gender.query.get(g["id"])
            if not exists:
                new_gender = Gender(id=g["id"], gender=g["gender"])
                db.session.add(new_gender)
                added += 1
        db.session.commit()
        return jsonify({"message": f"{added} genders added or already exist."}), 201
    except Exception as e:
        print("Error initializing genders:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/doctors', methods=['POST'])
def add_doctor():
    try:
        data = request.get_json(force=True)
        doctor = Doctor(
            first_name=data.get('first_name'),
            last_name=data.get('last_name'),
            phone_number=data.get('phone_number'),
            email=data.get('email'),
            password=data.get('password'),  # ควร hash password ในระบบจริง
            gender_id=data.get('gender_id')
        )
        db.session.add(doctor)
        db.session.commit()
        return jsonify({"message": "Doctor added", "id": doctor.id}), 201
    except Exception as e:
        print("Error adding doctor:", e)
        return jsonify({"error": str(e)}), 500


# @app.before_first_request
# def create_tables():
#     db.create_all()

if __name__ == '__main__':
    with app.app_context():
        print("Creating tables...")
        db.create_all()
        print("Tables created.")
    app.run(host='0.0.0.0', port=5002)

