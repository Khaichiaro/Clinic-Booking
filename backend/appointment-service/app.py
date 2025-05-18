from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Appointment, Status, ServiceType, User, Doctor  # import โมเดลครบ
import os
from datetime import datetime
from prometheus_client import make_wsgi_app
from werkzeug.middleware.dispatcher import DispatcherMiddleware

app = Flask(__name__)
CORS(app)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv(
    "DATABASE_URL", "postgresql://admin:1234@db:5432/mydb"
)
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Metrics endpoint for Prometheus
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})

@app.route('/api/appointments/', methods=['GET'])
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

@app.route('/api/appointments/', methods=['POST'])
def create_appointment():
    try:
        data = request.get_json(force=True)

        iso_time = data.get('appointment_time')
        # แปลงเวลาล้วนๆ เป็น time object
        appointment_time = datetime.strptime(iso_time, "%H:%M:%S").time()

        iso_date = data.get('appointment_date')
        appointment_date = datetime.fromisoformat(iso_date).date()

        appointment = Appointment(
            appointment_time=appointment_time,
            appointment_date=appointment_date,
            user_id=data.get('user_id'),
            servicetype_id=data.get('servicetype_id'),
            status_id=data.get('status_id'),
            doctor_id=data.get('doctor_id')
        )
        db.session.add(appointment)
        db.session.commit()
        return jsonify({"message": "Appointment created", "id": appointment.id}), 201
    except Exception as e:
        print("Error creating appointment:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/service_types/', methods=['GET'])
def get_service_types():
    service_types = ServiceType.query.all()
    result = []
    for s in service_types:
        result.append({
            'id': s.id,
            'service_type': s.service_type
        })
    return jsonify(result)

@app.route('/api/appointments/<int:appointment_id>/', methods=['PATCH'])
def update_appointment_status(appointment_id):
    data = request.get_json(force=True)
    appointment = Appointment.query.get_or_404(appointment_id)
    if 'status_id' in data:
        appointment.status_id = data['status_id']
    db.session.commit()
    return jsonify({"message": "Appointment updated"})


if __name__ == '__main__':
    with app.app_context():
        print("Creating tables...")
        db.create_all()
        print("Tables created.")
    app.run(host='0.0.0.0', port=5003)
