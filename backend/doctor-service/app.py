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

@app.route('/api/doctors', methods=['GET'])
def get_doctors():
    print("📢 /api/doctors was called")
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


# @app.before_first_request
# def create_tables():
#     db.create_all()

if __name__ == '__main__':
    with app.app_context():
        print("Creating tables...")
        db.create_all()
        print("Tables created.")
    app.run(host='0.0.0.0', port=5001)

