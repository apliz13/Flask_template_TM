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
        if session['type_user'] == 0:
            
            db = get_db()

            id_user = session['user_id']
            try:
                id_team_of_user = db.execute('''SELECT teams_composition.id_teams
                    FROM teams_composition
                    WHERE teams_composition.id_users = ?''', (id_user,)).fetchone()['id_teams']
            except:
                id_team_of_user = None
            today_date = datetime.now().strftime("%d-%m-%Y")
            
            training_data = db.execute('''SELECT elements.name, elements.type
                FROM elements
                INNER JOIN trainings_compositions ON elements.id_elements = trainings_compositions.id_element
                INNER JOIN trainings ON trainings.id_trainings = trainings_compositions.id_trainings
                INNER JOIN trainings_appartenance ON trainings.id_trainings = trainings_appartenance.id_trainings
                WHERE trainings.date = ? AND (trainings_appartenance.id_users = ? OR trainings_appartenance.id_teams = ?)
                ORDER BY elements.type''', (today_date, id_user, id_team_of_user,)).fetchall()

            last_type = 0
            last_type_index = 0
            sorted_data = [[]]*6
            for i, element in enumerate(training_data):
                if element['type'] != last_type:
                    sorted_data[last_type] = training_data[last_type_index:i]
                    last_type = element['type']
                    last_type_index = i
                
            return render_template('home/index.html', sets=sorted_data[0], sauts=sorted_data[1], progs=sorted_data[2], moities=sorted_data[3], spins=sorted_data[4], sequences=sorted_data[5])

        elif session['type_user'] == 1:
            return render_template('home/index_prof.html')
    except:
        return redirect('auth/login')

@home_bp.route('/prof', methods=('GET', 'POST'))
def prof():
    # Affichage de la page principale de l'application pour les profs
    db = get_db()
    user_id = str(session['user_id'])
    print(user_id)
    teams_query = """
            SELECT teams.name, teams.id_teams
            FROM teams
            INNER JOIN teams_appartenance ON teams.id_teams = teams_appartenance.id_teams
            WHERE teams_appartenance.id_coachs = ?
        """
    teams = db.execute(teams_query, (int(user_id),)).fetchall()
    print(teams)

    eleves_query = """
            SELECT users.first_name, users.last_name, teams_composition.id_teams
            FROM teams_appartenance
            INNER JOIN teams_composition ON teams_appartenance.id_teams = teams_composition.id_teams
			INNER JOIN users ON teams_composition.id_users = users.id_users
            WHERE id_coachs = ?
            
        """
    eleves = db.execute(eleves_query, (int(user_id),)).fetchall()

    db.close()
    return render_template('home/index_prof.html',teams=teams, eleves=eleves)

@home_bp.route('/send_team', methods=('GET', 'POST'))
def send_team():
    # Affichage de la page principale de l'application pour les profs
    db = get_db()
    user_id = str(session['user_id'])
    teams_query = """
            SELECT teams.name, teams.id_teams
            FROM teams
            INNER JOIN teams_appartenance ON teams.id_teams = teams_appartenance.id_teams
            WHERE teams_appartenance.id_coachs = ?
        """
    teams = db.execute(teams_query, (user_id,)).fetchall()

    eleves_query = """
            SELECT users.first_name, users.last_name, teams_composition.id_teams 
            FROM teams_appartenance
            INNER JOIN teams_composition ON teams_appartenance.id_teams = teams_composition.id_teams
            INNER JOIN users ON teams_composition.id_users = users.id_users
            WHERE teams_appartenance.id_coachs = ? AND users.id_users != ?
        """
    eleves = db.execute(eleves_query, (user_id,user_id,)).fetchall() 
    print(eleves)
    return render_template('home/send_team.html',teams=teams, eleves=eleves)

@home_bp.route('/send_student', methods=('GET', 'POST'))
def send_student():
    # Affichage de la page principale de l'application pour les profs
    db = get_db()
    user_id = str(session['user_id'])
    teams_query = """
            SELECT teams.name, teams.id_teams
            FROM teams
            INNER JOIN teams_appartenance ON teams.id_teams = teams_appartenance.id_teams
            WHERE teams_appartenance.id_coachs = ?
        """
    teams = db.execute(teams_query, (user_id,)).fetchall()

    eleves_query = """
            SELECT users.first_name, users.last_name, teams_composition.id_teams 
            FROM teams_appartenance
            INNER JOIN teams_composition ON teams_appartenance.id_teams = teams_composition.id_teams
            INNER JOIN users ON teams_composition.id_users = users.id_users
            WHERE teams_appartenance.id_coachs = ? AND users.id_users != ?
        """
    eleves = db.execute(eleves_query, (user_id,user_id,)).fetchall() 
    
    return render_template('home/send_student.html',teams=teams, eleves=eleves)

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
    teams = db.execute(teams_query, (user_id,)).fetchall()

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
    if request.method == 'GET':

        db = get_db()
        user_id = str(session['user_id'])
        teams_query = """
                SELECT teams.name, teams.id_teams
                FROM teams
                INNER JOIN teams_appartenance ON teams.id_teams = teams_appartenance.id_teams
                WHERE teams_appartenance.id_coachs = ?
            """
        teams = db.execute(teams_query, (user_id,)).fetchall()

        eleves_query = """
                SELECT *
                FROM teams_appartenance
                INNER JOIN teams_composition ON teams_appartenance.id_teams = teams_composition.id_teams
                INNER JOIN users ON teams_composition.id_users = users.id_users
                
            """
        eleves = db.execute(eleves_query).fetchall() 
        return render_template('home/add_training.html',teams=teams, eleves=eleves)
    
    elif request.method == 'POST':
        dataJson = request.get_json()
        if not dataJson or not dataJson['id_teams'] and not dataJson['id_users']:
            return "No body, missing id_teams or missing id_users", 206
        db = get_db()
        elements = dict()
        for Type, elem_of_type in dataJson['elements'].items():
            for element in elem_of_type :
                fetchone = db.execute("SELECT elements.id_elements FROM elements WHERE elements.name == ?", (element,)).fetchone()
                try:
                    elements[element] = fetchone['id_elements']
                except:
                    db.execute("INSERT INTO elements (name,type) VALUES (?,?)",(element,Type,))
                    db.commit()
                    fetchone = db.execute("SELECT elements.id_elements FROM elements WHERE elements.name == ?", (element,)).fetchone()
                    elements[element] = fetchone['id_elements']

        db.execute("INSERT INTO trainings (date) VALUES (?)",(dataJson['date'],))
        db.commit()
        id_training = db.execute("SELECT sqlite_sequence.seq FROM sqlite_sequence WHERE sqlite_sequence.name = 'trainings'").fetchone()['seq']
        
        for team in dataJson['id_teams']:
            db.execute("INSERT INTO trainings_appartenance (id_trainings, id_teams) VALUES (?,?)",(id_training,team,))
        for user in dataJson['id_users']:
            db.execute("INSERT INTO trainings_appartenance (id_trainings, id_users) VALUES (?,?)",(id_training,user,))
        for element in elements.values():
            db.execute("INSERT INTO trainings_compositions (id_trainings, id_element) VALUES (?,?)",(id_training,element,))
        db.commit()
        
        db.close()
        return "ok"

            

"""
fetch(window.location.href, {method: 'POST', headers: {'Content-Type': 'application/json'},body: JSON.stringify({date: "15-02-2024", elements: { 1:["axel", "lutz"]}, id_teams: [1,2], id_users: []})})


"""


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

@home_bp.route('/get_my_teams')
def get_my_teams():
    db = get_db()
    user_id = session['user_id']
    teams_query = """
            SELECT teams.name, teams.id_teams
            FROM teams
            INNER JOIN teams_appartenance ON teams.id_teams = teams_appartenance.id_teams
            WHERE teams_appartenance.id_coachs = ?
        """
    teams = db.execute(teams_query, (user_id,)).fetchall()
    db.close()
    return jsonify(dict(teams))