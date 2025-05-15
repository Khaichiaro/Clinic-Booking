from flask import Flask, request, jsonify
from flask_cors import CORS
from model import db, Appointment, Status, ServiceType
import os

app = Flask(__name__)
CORS(app)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "postgresql://myuser:mypassword@db:5432/mydb")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

@app.route('/api/appointments', methods=['GET'])
def get_appointments():
    appointments = Appointment.query.all()
    result = []
    for a in appointments:
        result.append({
            'id': a.id,
            'appointment_time': a.appointment_time.isoformat() if a.appointment_time else None,
            'appointment_date': a.appointment_date.isoformat() if a.appointment_date else None,
            'user_id': a.user_id,
            'servicetype_id': a.servicetype_id,
            'status_id': a.status_id,
            'doctor_id': a.doctor_id
        })
    return jsonify(result)

@app.route('/api/appointments', methods=['POST'])
def create_appointment():
    data = request.json
    appointment = Appointment(
        appointment_time=data.get('appointment_time'),
        appointment_date=data.get('appointment_date'),
        user_id=data.get('user_id'),
        servicetype_id=data.get('servicetype_id'),
        status_id=data.get('status_id'),
        doctor_id=data.get('doctor_id')
    )
    db.session.add(appointment)
    db.session.commit()
    return jsonify({"message": "Appointment created", "id": appointment.id}), 201

@app.before_first_request
def create_tables():
    db.create_all()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002)
