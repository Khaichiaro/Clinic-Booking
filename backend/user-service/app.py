# user-service/app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from models import db, User, Gender

import os


app = Flask(__name__)
CORS(app)

# Database config
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URL", "postgresql://myuser:mypassword@db:5432/mydb")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)  # 👉 initialize ที่นี่


# Routes
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([{ 'id': u.id, 'first_name': u.first_name, 'last_name': u.last_name, 'email': u.email } for u in users])

@app.route('/api/users', methods=['POST'])
def create_user():
    data = request.json
    user = User(
        first_name=data['first_name'],
        last_name=data['last_name'],
        password=data['password'],
        email=data['email'],
        phone_number=data['phone_number'],
        gender_id=data['gender_id']
    )
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created", "id": user.id}), 201


if __name__ == '__main__':
    with app.app_context():
        db.create_all()   # สร้างตารางตอนเริ่ม app
    app.run(host='0.0.0.0', port=5000)

