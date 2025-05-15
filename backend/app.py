from flask import Flask, jsonify, request
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = f"postgresql://admin:1234@db:5432/clinic_db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db = SQLAlchemy(app)

CORS(app, resources={r"/api/*": {"origins": "*"}})

class Gender(db.Model):
    __tablename__ = 'gender'
    id = db.Column(db.Integer, primary_key=True)
    gender = db.Column(db.String(10))

class User(db.Model):
    __tablename__ = 'user'
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(100))
    last_name = db.Column(db.String(100))
    password = db.Column(db.String(100))
    email = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    gender_id = db.Column(db.Integer, db.ForeignKey('gender.id'))


# -------------------------- user --------------------------

@app.route("/api/user", methods=["GET"])
def get_user():
    try:
        user = user.query.order_by(user.id.desc()).all()
        return jsonify([
            {
                "user_id": u.id,
                "firstname": u.first_name,
                "lastname": u.last_name,
                "email": u.email,
                "phonenumber": u.phone_number,
                "gender": u.gender_id
            } for u in user
        ])
    except Exception as e:
        print("xxx ERROR [GET /user]:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/user/<int:id>", methods=["GET"])
def get_user(id):
    try:
        user = user.query.get(id)
        if not user:
            return jsonify({"error": "user not found"}), 404
        return jsonify({
            "id": user.id,
            "firstname": user.first_name,
            "lastname": user.last_name,
            "email": user.email,
            "phonenumber": u.phone_number,
            "gender": user.gender_id
        })
    except Exception as e:
        print("xxx ERROR [GET /user/:id]:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/user", methods=["POST"])
def create_user():
    try:
        data = request.json
        user = User(
            name=data["name"],
            description=data.get("description", ""),
            price=data["price"],
            quantity=data["quantity"]
        )
        db.session.add(user)
        db.session.commit()
        return jsonify({"message": "user created", "user_id": user.id}), 201
    except Exception as e:
        print("xxx ERROR [POST /user]:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/user/<int:user_id>", methods=["PUT"])
def update_user(user_id):
    try:
        user = user.query.get(user_id)
        if not user:
            return jsonify({"error": "user not found"}), 404
        data = request.json
        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.password = data.get("password", user.password)
        user.email = data.get("email", user.email)
        user.phone_number = data.get("phone_number", user.phone_number)
        user.gender_id = data.get("gender_id", user.gender_id)
        db.session.commit()
        return jsonify({"message": "user updated"})
    except Exception as e:
        print("xxx ERROR [PUT /user/:id]:", e)
        return jsonify({"error": str(e)}), 500

@app.route("/api/user/<int:user_id>", methods=["DELETE"])
def delete_user(id):
    try:
        user = user.query.get(id)
        if not user:
            return jsonify({"error": "user not found"}), 404
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "user deleted"})
    except Exception as e:
        print("xxx ERROR [DELETE /user/:id]:", e)
        return jsonify({"error": str(e)}), 500


# -------------------------- INIT --------------------------
if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000)

