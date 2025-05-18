from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Doctor, Gender, DoctorSchedule, Appointment
import os
from datetime import datetime, timedelta
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
@app.route('/api/doctors/', methods=['GET'])
def get_doctors():
    try:
        doctors = Doctor.query.all()
        return jsonify([
            {
                'id': d.id,
                'first_name': d.first_name,
                'last_name': d.last_name,
                'email': d.email
            } for d in doctors
        ])
    except Exception as e:
        print("Error fetching doctors:", e)
        return jsonify({"error": str(e)}), 500

@app.route('/api/doctors/', methods=['POST'])
def create_doctor():
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
        return jsonify({"message": "Doctor created", "id": doctor.id}), 201
    except Exception as e:
        print("Error creating doctor:", e)
        return jsonify({"error": str(e)}), 500

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

@app.route('/api/doctor/<int:doctor_id>/available_times/', methods=['GET'])
def get_doctor_available_times(doctor_id):
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({"error": "Missing date parameter"}), 400

    try:
        work_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format, expected YYYY-MM-DD"}), 400

    # ตัวอย่าง: query ตาราง DoctorSchedule
    schedules = DoctorSchedule.query.filter_by(doctor_id=doctor_id, work_date=work_date).all()
    if not schedules:
        return jsonify({"available_times": []})  # ไม่มีเวลาทำงานวันนั้น

    # query นัดหมายที่จองแล้วในวันนั้น (status_id != 4 = Cancelled สมมติ)
    booked_appointments = Appointment.query.filter_by(doctor_id=doctor_id, appointment_date=work_date).filter(
        Appointment.status_id != 4
    ).all()

    def is_overlap(start1, end1, start2, end2):
        return max(start1, start2) < min(end1, end2)

    available_slots = []
    slot_duration = timedelta(hours=1)  # สมมติ slot 1 ชั่วโมง

    for schedule in schedules:
        slot_start = datetime.combine(work_date, schedule.start_time)
        slot_end_time = datetime.combine(work_date, schedule.end_time)

        while slot_start + slot_duration <= slot_end_time:
            slot_finish = slot_start + slot_duration

            overlap = False
            for appt in booked_appointments:
                appt_start = datetime.combine(work_date, appt.appointment_time)
                appt_end = appt_start + slot_duration
                if is_overlap(slot_start, slot_finish, appt_start, appt_end):
                    overlap = True
                    break

            if not overlap:
                time_str = f"{slot_start.time().strftime('%H:%M')} - {slot_finish.time().strftime('%H:%M')}"
                available_slots.append(time_str)

            slot_start = slot_finish

    return jsonify({"available_times": available_slots})

if __name__ == '__main__':
    with app.app_context():
        print("Creating tables...")
        db.create_all()
        print("Tables created.")
    app.run(host='0.0.0.0', port=5002)
