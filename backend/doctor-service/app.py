from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Doctor, Gender, DoctorSchedule, Appointment
import os
from datetime import datetime, timedelta, time
from prometheus_client import make_wsgi_app
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from sqlalchemy.orm import joinedload
from models import User, ServiceType, Status  # อย่าลืม import model เหล่านี้ด้วย



app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})


# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "postgresql://admin:1234@db:5432/mydb")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db.init_app(app)

# Metrics endpoint for Prometheus
app.wsgi_app = DispatcherMiddleware(app.wsgi_app, {
    '/metrics': make_wsgi_app()
})

# Routes
# Helper: สร้าง dict จาก doctor object
def doctor_to_dict(doctor):
    return {
        "id": doctor.id,
        "password": doctor.password,
        "first_name": doctor.first_name,
        "last_name": doctor.last_name,
        "email": doctor.email,
        "phone_number": doctor.phone_number,
        "gender_id": doctor.gender_id,
        "gender": {
            "id": doctor.gender.id,
            "gender": doctor.gender.gender
        } if doctor.gender else None
    }

def gender_to_dict(gender):
    return {
        "id": gender.id,
        "gender": gender.gender
    }

# ------------------------------------ 
# Get All Doctor
@app.route('/api/doctors/', methods=['GET'])
def get_doctors():
    try:
        doctors = Doctor.query.options(joinedload(Doctor.gender)).all()
        result = []
        for doctor in doctors:
            doctor_dict = {
                "id": doctor.id,
                "password": doctor.password,
                "first_name": doctor.first_name,
                "last_name": doctor.last_name,
                "email": doctor.email,
                "phone_number": doctor.phone_number,
                "gender_id": doctor.gender_id,
                "gender": {
                    "id": doctor.gender.id,
                    "gender": doctor.gender.gender
                } if doctor.gender else None
            }
            result.append(doctor_dict)
        return jsonify(result)
    except Exception as e:
        print("Error fetching doctors:", e)
        return jsonify({"error": str(e)}), 500
    
# ------------------------------------
# Get One Doctor
@app.route("/api/doctor/<int:doctor_id>/", methods=["GET"])
def get_doctor(doctor_id):
    try:
        doctor = Doctor.query.options(joinedload(Doctor.gender)).get(doctor_id)
        if not doctor:
            return jsonify({"message": "Doctor not found", "data": None}), 404
        return jsonify({"message": "Doctor found", "data": doctor_to_dict(doctor)})
    except Exception as e:
        print("xxx ERROR [GET /doctor/<id>]:", e)
        return jsonify({"message": "Failed to get doctor", "data": None, "error": str(e)}), 500

# ------------------------------------ 
# Create Doctor
@app.route('/api/doctor/', methods=['POST'])
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
        return jsonify({
            "message": "Doctor created", 
            "id": doctor.id
        }), 201
    except Exception as e:
        print("Error creating doctor:", e)
        return jsonify({"message": "Failed to create user", "data": None, "error": str(e)}), 500


# ------------------------------------
# Delete Doctor
@app.route("/api/doctor/<int:doctor_id>/", methods=["DELETE"])
def delete_doctor(doctor_id):
    try:
        doctor = Doctor.query.get(doctor_id)
        if not doctor:
            return jsonify({"message": "Doctor not found", "data": None}), 404
        db.session.delete(doctor)
        db.session.commit()
        return jsonify({"message": "Doctor deleted", "data": {"id": doctor_id}})
    except Exception as e:
        print("xxx ERROR [DELETE /doctor/<id>]:", e)
        return jsonify({"message": "Failed to delete doctor", "data": None, "error": str(e)}), 500
    
# ------------------------------------
# Get All Genders
@app.route("/api/doctor-genders/", methods=["GET"])
def get_genders():
    try:
        genders = Gender.query.order_by(Gender.id.asc()).all()
        return jsonify({
            "message": "All genders",
            "data": [gender_to_dict(g) for g in genders]
        })
    except Exception as e:
        print("xxx ERROR [GET /genders]:", e)
        return jsonify({"message": "Failed to get genders", "data": None, "error": str(e)}), 500

# ------------------------------------
# Available Appointment Slots For A Doctor
@app.route('/api/doctor/<int:doctor_id>/available_times/', methods=['GET'])
def get_doctor_available_times(doctor_id):
    date_str = request.args.get('date')
    if not date_str:
        return jsonify({"error": "Missing date parameter"}), 400

    try:
        work_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format, expected YYYY-MM-DD"}), 400

    print(f"Fetching available times for doctorId: {doctor_id} date: {work_date}")  # debug

    # query ตาราง DoctorSchedule
    schedules = DoctorSchedule.query.filter_by(doctor_id=doctor_id, work_date=work_date).all()
    print(f"Doctor schedules found: {len(schedules)}")
    for s in schedules:
        print(f"  Schedule: {s.start_time} - {s.end_time}")

    if not schedules:
        return jsonify({"available_times": []})  # ไม่มีเวลาทำงานวันนั้น

    # query นัดหมายที่จองแล้วในวันนั้น (status_id != 4 = Cancelled)
    booked_appointments = Appointment.query.filter_by(doctor_id=doctor_id, appointment_date=work_date).filter(
        Appointment.status_id != 4
    ).all()
    print(f"Booked appointments found: {len(booked_appointments)}")
    for appt in booked_appointments:
        print(f"  Appointment time: {appt.appointment_time} status_id: {appt.status_id}")

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

    print(f"Available slots: {available_slots}")  # debug

    return jsonify({"available_times": available_slots})

# ------------------------------------
# Get All Appointments พร้อมข้อมูล user, service_type, status, doctor
@app.route('/api/doctor/appointments/', methods=['GET'])
def get_appointments():
    try:
        appointments = Appointment.query.options(
            joinedload(Appointment.user),
            joinedload(Appointment.service_type),
            joinedload(Appointment.status),
            joinedload(Appointment.doctor)
        ).all()

        def appointment_to_dict(app):
            return {
                "id": app.id,
                "appointment_date": app.appointment_date.strftime('%Y-%m-%d') if app.appointment_date else None,
                "appointment_time": app.appointment_time.strftime('%H:%M:%S') if app.appointment_time else None,
                "doctor_id": app.doctor_id,
                "user_id": app.user_id,
                "servicetype_id": app.servicetype_id,
                "status_id": app.status_id,
                "user": {
                    "id": app.user.id,
                    "first_name": app.user.first_name,
                    "last_name": app.user.last_name,
                    "gender_id": app.user.gender_id,
                    "email": app.user.email,
                    "phone_number": app.user.phone_number,
                } if app.user else None,
                "service_name": app.service_type.service_type if app.service_type else None,
                "status": {
                    "id": app.status.id,
                    "status": app.status.status
                } if app.status else None,
                "doctor": {
                    "id": app.doctor.id,
                    "first_name": app.doctor.first_name,
                    "last_name": app.doctor.last_name
                } if app.doctor else None
            }

        result = [appointment_to_dict(app) for app in appointments]

        return jsonify(result)
    except Exception as e:
        print("xxx ERROR [GET /appointments]:", e)
        return jsonify({"message": "Failed to get appointments", "data": None, "error": str(e)}), 500

# ------------------------------------ 
# Create Doctor Schedule  
@app.route('/api/doctor/doctor_schedule/', methods=['POST'])
def create_doctor_schedule():
    try:
        data = request.get_json(force=True)

        doctor_id = data.get('doctor_id')
        dates = data.get('dates')  # ควรเป็น list ของ string "YYYY-MM-DD"
        start_time_str = data.get('start_time')  # เช่น "09:00"
        end_time_str = data.get('end_time')      # เช่น "17:00"

        # Validate input
        if not doctor_id or not dates or not start_time_str or not end_time_str:
            return jsonify({"error": "Missing required fields"}), 400

        # แปลงเวลาเป็น datetime.time
        start_time = datetime.strptime(start_time_str, "%H:%M").time()
        end_time = datetime.strptime(end_time_str, "%H:%M").time()

        # สร้างรายการ doctor schedules
        schedules = []
        for date_str in dates:
            work_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            schedule = DoctorSchedule(
                doctor_id=doctor_id,
                work_date=work_date,
                start_time=start_time,
                end_time=end_time
            )
            schedules.append(schedule)

        # เพิ่มข้อมูลลงฐานข้อมูล
        db.session.add_all(schedules)
        db.session.commit()

        return jsonify({
            "message": f"Created {len(schedules)} schedules for doctor {doctor_id}"
        }), 201

    except Exception as e:
        print("Error creating doctor schedule:", e)
        return jsonify({"error": str(e)}), 500

# ------------------------------------
if __name__ == '__main__':
    with app.app_context():
        print("Creating tables...")
        db.create_all()
        print("Tables created.")
    app.run(host='0.0.0.0', port=5002)
