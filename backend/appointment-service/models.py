from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Status(db.Model):
    __tablename__ = 'status'
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(50))

class ServiceType(db.Model):
    __tablename__ = 'service_type'
    id = db.Column(db.Integer, primary_key=True)
    service_type = db.Column(db.String(100))

class Appointment(db.Model):
    __tablename__ = 'appointment'
    id = db.Column(db.Integer, primary_key=True)
    appointment_time = db.Column(db.DateTime)
    appointment_date = db.Column(db.Date)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id', ondelete='CASCADE'))
    servicetype_id = db.Column(db.Integer, db.ForeignKey('service_type.id'))
    status_id = db.Column(db.Integer, db.ForeignKey('status.id'))
    doctor_id = db.Column(db.Integer)
