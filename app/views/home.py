from flask import (Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify)
from app.db.db import get_db
from datetime import datetime


# Routes /...
home_bp = Blueprint('home', __name__)



# Route /
@home_bp.route('/', methods=('GET', 'POST'))
def landing_page():
    # Affichage de la page principale de l'application
    return render_template('home/index.html')

@home_bp.route('/prof', methods=('GET', 'POST'))
def prof():
    # Affichage de la page principale de l'application pour les profs
    return render_template('home/prof.html')



# Gestionnaire d'erreur 404 pour toutes les routes inconnues
@home_bp.route('/<path:text>', methods=['GET', 'POST'])
def not_found_error(text):
    return render_template('home/404.html'), 404

#Test pour rank
@home_bp.route('/testrank', methods=['GET', 'POST'])
def testrank():
    if request.method=='GET':
        return render_template('temporaire/testrank.html')
    
    elif request.method=='POST':
        # Récupération des données du formulaire
        data=request.get_json()
        userid = session['user_id']
        date = data['date']
        satisfaction = data['satisfaction']

        #On récupère la base de données
        db = get_db()

        #Si tous les éléments ont une valeur on essaye de les ajouter à la base de données
        if userid and date and satisfaction:
            #On crontrole que la peronne n'a pas déjà répondu au questionnaire aujourd'hui
            today_reaction = db.execute(
                'SELECT * FROM satisfactionTABLE WHERE id_users=? AND date=?',
                (userid, date)
            ).fetchone()
            db.commit()
            if today_reaction is None:
                db.execute(
                    'INSERT INTO satisfactionTABLE (id_users, date, satisfaction) VALUES (?, ?, ?)',
                    (userid, date, satisfaction)
                )
                
            else:
                db.execute(
                    'UPDATE satisfactionTABLE SET satisfaction=? WHERE id_users=? AND date=?',
                    (satisfaction, userid, date)
                )
            db.commit()
    return "ok"

@home_bp.route('/testrank/get_today_hapiness')
def loadHappiness():
    db = get_db()
    today_reaction = db.execute(
        'SELECT * FROM satisfactionTABLE WHERE satisfactionTABLE.id_users=? AND satisfactionTABLE.date=?',
        (session['user_id'], datetime.now().strftime("%d-%m-%Y"))
    ).fetchone()
    if today_reaction is None:
        value = "None"
    else:
        value = str(today_reaction['satisfaction'])
    return jsonify({'satisfaction': value})


"""if request.content_type == 'application/json':
    data = request.get_json()
    db = get_db()
    today_reaction = db.execute(
        'SELECT * FROM satisfactionTABLE WHERE id_users=? AND date=?',
        (session['user_id'], data['date'])
    ).fetchone()
    if today_reaction is None:
        value = None
    else:
        value = today_reaction['satisfaction']
    return jsonify({'satisfaction': value})"""

