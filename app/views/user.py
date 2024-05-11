from flask import (Blueprint, flash, g, redirect, render_template, request, session, url_for)
from app.db.db import get_db
from app.utils import *


user_bp = Blueprint('user', __name__, url_prefix='/user')


@user_bp.route('/profile', methods=('GET', 'POST'))
@login_required 
def show_profile():
    if request.method == 'POST':

        username = request.form['username']
        first_name = request.form['first_name']
        last_name = request.form['last_name']

        db = get_db()

        id_user = session['user_id']

        if username and first_name and last_name:
            try:
                db.execute("UPDATE users SET username = ?, first_name = ?, last_name = ? WHERE id_users = ?",(username, first_name, last_name, id_user))
                db.commit()
            except db.IntegrityError:
                error = f"User {username} is already registered."
                flash(error)
                return redirect(url_for("user.show_profile"))
            
            return redirect(url_for("user.show_profile"))

    return render_template('user/profile.html')



@user_bp.route('/profile_prof', methods=('GET', 'POST'))
@login_required 
def show_profile_prof():
    if request.method == 'POST':

        username = request.form['username']
        first_name = request.form['first_name']
        last_name = request.form['last_name']

        db = get_db()

        id_user = session['user_id']

        if username and first_name and last_name:
            try:
                db.execute("UPDATE users SET username = ?, first_name = ?, last_name = ? WHERE id_users = ?",(username, first_name, last_name, id_user))
                db.commit()
            except db.IntegrityError:
                error = f"User {username} is already registered."
                flash(error)
                return redirect(url_for("user.show_profile_prof"))
            
            return redirect(url_for("user.show_profile_prof"))

    return render_template('user/profile_prof.html')
