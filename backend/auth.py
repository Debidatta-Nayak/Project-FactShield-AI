from flask import Blueprint, request, jsonify, session
import mysql.connector
from mysql.connector import Error
from werkzeug.security import generate_password_hash, check_password_hash
import os


# =========================================================
# AUTH BLUEPRINT
# =========================================================

auth_bp = Blueprint("auth", __name__, url_prefix="/auth")


# =========================================================
# DATABASE CONNECTION
# =========================================================

def get_db_connection():

    try:

        connection = mysql.connector.connect(
            host=os.getenv("DB_HOST"),
            user=os.getenv("DB_USER"),
            password=os.getenv("DB_PASSWORD"),
            database=os.getenv("DB_NAME")
        )

        return connection

    except Error as e:

        print("Database connection error:", e)

        return None


# =========================================================
# REGISTER
# =========================================================

@auth_bp.route("/register", methods=["POST"])
def register():

    data = request.get_json()

    full_name = data.get("fullName", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")


    # -----------------------------------------------------
    # Validation
    # -----------------------------------------------------

    if not full_name:

        return jsonify({
            "success": False,
            "message": "Full name is required."
        }), 400


    if not email:

        return jsonify({
            "success": False,
            "message": "Email is required."
        }), 400


    if not password:

        return jsonify({
            "success": False,
            "message": "Password is required."
        }), 400


    # -----------------------------------------------------
    # Database connection
    # -----------------------------------------------------

    connection = get_db_connection()

    if connection is None:

        return jsonify({
            "success": False,
            "message": "Database connection failed."
        }), 500


    cursor = connection.cursor(dictionary=True)


    try:

        # -------------------------------------------------
        # Check existing email
        # -------------------------------------------------

        cursor.execute(
            "SELECT id FROM users WHERE email = %s",
            (email,)
        )

        existing_user = cursor.fetchone()


        if existing_user:

            return jsonify({
                "success": False,
                "message": "An account with this email already exists."
            }), 409


        # -------------------------------------------------
        # Hash password
        # -------------------------------------------------

        password_hash = generate_password_hash(password,method="pbkdf2:sha256",salt_length=16)


        # -------------------------------------------------
        # Insert user
        # -------------------------------------------------

        cursor.execute(
            """
            INSERT INTO users
            (full_name, email, password_hash)
            VALUES (%s, %s, %s)
            """,
            (
                full_name,
                email,
                password_hash
            )
        )

        connection.commit()


        return jsonify({
            "success": True,
            "message": "Account created successfully."
        }), 201


    except Error as e:

        connection.rollback()

        print("Registration error:", e)

        return jsonify({
            "success": False,
            "message": "Something went wrong while creating the account."
        }), 500


    finally:

        cursor.close()
        connection.close()


# =========================================================
# LOGIN
# =========================================================

@auth_bp.route("/login", methods=["POST"])
def login():

    data = request.get_json()

    email = data.get("email", "").strip().lower()
    password = data.get("password", "")


    # -----------------------------------------------------
    # Validation
    # -----------------------------------------------------

    if not email or not password:

        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400


    connection = get_db_connection()

    if connection is None:

        return jsonify({
            "success": False,
            "message": "Database connection failed."
        }), 500


    cursor = connection.cursor(dictionary=True)


    try:

        # -------------------------------------------------
        # Find user
        # -------------------------------------------------

        cursor.execute(
            """
            SELECT id, full_name, email, password_hash
            FROM users
            WHERE email = %s
            """,
            (email,)
        )

        user = cursor.fetchone()


        # -------------------------------------------------
        # User not found
        # -------------------------------------------------

        if user is None:

            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401


        # -------------------------------------------------
        # Verify password
        # -------------------------------------------------

        password_valid = check_password_hash(
            user["password_hash"],
            password
        )


        if not password_valid:

            return jsonify({
                "success": False,
                "message": "Invalid email or password."
            }), 401


        # -------------------------------------------------
        # Create Flask session
        # -------------------------------------------------

        session.clear()

        session["user_id"] = user["id"]
        session["full_name"] = user["full_name"]
        session["email"] = user["email"]


        return jsonify({
            "success": True,
            "message": "Login successful.",
            "user": {
                "id": user["id"],
                "fullName": user["full_name"],
                "email": user["email"]
            }
        }), 200


    except Error as e:

        print("Login error:", e)

        return jsonify({
            "success": False,
            "message": "Something went wrong during login."
        }), 500


    finally:

        cursor.close()
        connection.close()


# =========================================================
# CURRENT USER
# =========================================================

@auth_bp.route("/me", methods=["GET"])
def current_user():

    if "user_id" not in session:

        return jsonify({
            "authenticated": False,
            "message": "User is not logged in."
        }), 401


    return jsonify({
        "authenticated": True,
        "user": {
            "id": session["user_id"],
            "fullName": session["full_name"],
            "email": session["email"]
        }
    }), 200


# =========================================================
# LOGOUT
# =========================================================

@auth_bp.route("/logout", methods=["POST"])
def logout():

    session.clear()

    return jsonify({
        "success": True,
        "message": "Logged out successfully."
    }), 200