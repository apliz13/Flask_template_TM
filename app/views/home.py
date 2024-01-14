from flask import (Blueprint, flash, g, redirect, render_template, request, session, url_for, jsonify)
from app.db.db import get_db
from datetime import datetime



# Routes /...
home_bp = Blueprint('home', __name__)


# Route /
@home_bp.route('/', methods=('GET', 'POST'))
def landing_page():
    # Affichage de la page principale de l'application
    try:
        if session['type_user']:
            return render_template('home/index.html')

        elif not session['type_user']:
            return render_template('home/index_prof.html')
    except:
        return render_template('auth/login.html')

@home_bp.route('/prof', methods=('GET', 'POST'))
def prof():
    # Affichage de la page principale de l'application pour les profs
    db = get_db()
    user_id = str(session['user_id'])
    teams_query = """
            SELECT teams.name, teams.id_teams
            FROM teams
            INNER JOIN teams_appartenance ON teams.id_teams = teams_appartenance.id_teams
            WHERE teams_appartenance.id_coachs = ?
        """
    teams = db.execute(teams_query, user_id,).fetchall()

    eleves_query = """
            SELECT *
            FROM teams_appartenance
            INNER JOIN teams_composition ON teams_appartenance.id_teams = teams_composition.id_teams
			INNER JOIN users ON teams_composition.id_users = users.id_users
            
        """
    eleves = db.execute(eleves_query).fetchall() 
    return render_template('home/index_prof.html',teams=teams, eleves=eleves)

@home_bp.route('/team_prof', methods=('GET', 'POST'))
def team_prof():
    # Affichage de la page principale de l'application pour les profs
    db = get_db()
    user_id = str(session['user_id'])
    teams_query = """
            SELECT teams.name, teams.id_teams
            FROM teams
            INNER JOIN teams_appartenance ON teams.id_teams = teams_appartenance.id_teams
            WHERE teams_appartenance.id_coachs = ?
        """
    teams = db.execute(teams_query, user_id,).fetchall()

    eleves_query = """
            SELECT users.first_name, users.last_name, teams_composition.id_teams 
            FROM teams_appartenance
            INNER JOIN teams_composition ON teams_appartenance.id_teams = teams_composition.id_teams
            INNER JOIN users ON teams_composition.id_users = users.id_users
            WHERE teams_appartenance.id_coachs = ? AND users.id_users != ?
        """
    eleves = db.execute(eleves_query, (user_id,user_id,)).fetchall() 
    
    return render_template('home/team_prof.html',teams=teams, eleves=eleves)

@home_bp.route('/add_team', methods=('GET', 'POST'))
def add_team():
    if request.method == 'POST':

        name = request.form['add_name']
        
        if name:
            try:
                db = get_db()
                db.execute("INSERT INTO teams (name) VALUES (?)",(name,))
                db.commit()
                return redirect(url_for("home.add_team"))
            except db.IntegrityError:

                
                error = f"User {name} is already registered."
                flash(error)
                return redirect(url_for("home.add_team"))
            

        else:
            error = "name invalid"
            flash(error)
            return redirect(url_for("home.add_team"))
    else:
        # Si aucune donnée de formulaire n'est envoyée, on affiche le formulaire d'inscription
        return render_template('home/add_team.html')
    
@home_bp.route('/add_training', methods=('GET', 'POST'))
def add_training():
    # Affichage de la page principale de l'application pour les profs
    db = get_db()
    user_id = str(session['user_id'])
    teams_query = """
            SELECT teams.name, teams.id_teams
            FROM teams
            INNER JOIN teams_appartenance ON teams.id_teams = teams_appartenance.id_teams
            WHERE teams_appartenance.id_coachs = ?
        """
    teams = db.execute(teams_query, user_id,).fetchall()

    eleves_query = """
            SELECT *
            FROM teams_appartenance
            INNER JOIN teams_composition ON teams_appartenance.id_teams = teams_composition.id_teams
			INNER JOIN users ON teams_composition.id_users = users.id_users
            
        """
    eleves = db.execute(eleves_query).fetchall() 
    return render_template('home/add_training.html',teams=teams, eleves=eleves)

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


