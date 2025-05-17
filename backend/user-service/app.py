# user-service/app.py
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from prometheus_client import make_wsgi_app
from werkzeug.middleware.dispatcher import DispatcherMiddleware
from models import db, Gender, User
from sqlalchemy.orm import joinedload

import os

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
# Helper: สร้าง dict จาก user object
def user_to_dict(user):
    return {
        "id": user.id,
        "password": user.password,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "email": user.email,
        "phone_number": user.phone_number,
        "gender_id": user.gender_id,
        "gender": {
            "id": user.gender.id,
            "gender": user.gender.gender
        } if user.gender else None
    }

def gender_to_dict(gender):
    return {
        "id": gender.id,
        "gender": gender.gender
    }

# ------------------------------------ 
# [C] Create User
@app.route('/api/user', methods=['POST'])
def create_user():
    try:
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
        return jsonify({
            "message": "User created",
            "data": user_to_dict(user)
        }), 201
    except Exception as e:
        print("xxx ERROR [POST /user]:", e)
        return jsonify({"message": "Failed to create user", "data": None, "error": str(e)}), 500

# ------------------------------------
# [R] Read All Users
@app.route("/api/users", methods=["GET"])
def get_users():
    try:
        users = User.query.options(joinedload(User.gender)).order_by(User.id.asc()).all()
        return jsonify({
            "message": "All users",
            "data": [user_to_dict(u) for u in users]
        })
    except Exception as e:
        print("xxx ERROR [GET /users]:", e)
        return jsonify({"message": "Failed to get users", "data": None, "error": str(e)}), 500

# ------------------------------------
# [R] Read One User
@app.route("/api/user/<int:user_id>", methods=["GET"])
def get_user(user_id):
    try:
        user = User.query.options(joinedload(User.gender)).get(user_id)
        if not user:
            return jsonify({"message": "User not found", "data": None}), 404
        return jsonify({"message": "User found", "data": user_to_dict(user)})
    except Exception as e:
        print("xxx ERROR [GET /user/<id>]:", e)
        return jsonify({"message": "Failed to get user", "data": None, "error": str(e)}), 500

# ------------------------------------
# [U] Update User
@app.route("/api/user/<int:user_id>", methods=["PATCH"])
def update_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found", "data": None}), 404
        data = request.json
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.password = data.get("password", user.password)
        user.email = data.get("email", user.email)
        user.phone_number = data.get("phone_number", user.phone_number)
        user.gender_id = data.get("gender_id", user.gender_id)
        db.session.commit()
        return jsonify({"message": "User updated", "data": user_to_dict(user)})
    except Exception as e:
        print("xxx ERROR [PATCH /user/<id>]:", e)
        return jsonify({"message": "Failed to update user", "data": None, "error": str(e)}), 500

# ------------------------------------
# [D] Delete User
@app.route("/api/user/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    try:
        user = User.query.get(user_id)
        if not user:
            return jsonify({"message": "User not found", "data": None}), 404
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted", "data": {"id": user_id}})
    except Exception as e:
        print("xxx ERROR [DELETE /user/<id>]:", e)
        return jsonify({"message": "Failed to delete user", "data": None, "error": str(e)}), 500

# ------------------------------------
# [R] Read All Genders
@app.route("/api/genders", methods=["GET"])
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
if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5001)