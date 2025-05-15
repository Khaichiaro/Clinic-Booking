from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Gender(db.Model):
    __tablename__ = 'gender'
    id = db.Column(db.Integer, primary_key=True)
    gender = db.Column(db.String(10))

class User(db.Model):
    __tablename__ = 'user'  # lowercase
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    password = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    gender_id = db.Column(db.Integer, db.ForeignKey('gender.id'))
    gender = db.relationship('Gender', backref='users')
