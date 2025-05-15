from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Status(db.Model):
    __tablename__ = 'status'
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(50))

class ServiceType(db.Model):
    __tablename__ = 'ServiceType'
    id = db.Column(db.Integer, primary_key=True)
    ServiceType = db.Column(db.String(100))

class Appointment(db.Model):
    __tablename__ = 'Appointment'
    id = db.Column(db.Integer, primary_key=True)
    appointment_time = db.Column(db.DateTime)
    appointment_date = db.Column(db.Date)
    user_id = db.Column(db.Integer)       # อ้างอิง user_id จาก User service (ถ้าแยก microservices)
    servicetype_id = db.Column(db.Integer, db.ForeignKey('ServiceType.id'))
    status_id = db.Column(db.Integer, db.ForeignKey('status.id'))
    doctor_id = db.Column(db.Integer)     # อ้างอิง doctor_id จาก Doctor service
