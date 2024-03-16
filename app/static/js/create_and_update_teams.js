const teams_coach_array = init_list_team_coach();


let selected_team = null;
let selected_team_student_array = [];

const team_name_input = document.getElementById("team_name_input");
const team_comp_HTML = document.getElementsByClassName("comp_team");
const student_username_input = document.getElementById("student_username_input");
const student_div_HTML = document.getElementsByClassName("student_div");
const send_button = document.getElementById("send_button");


init_event_listeners();




async function init_list_team_coach() {
    return fetch("/get_my_teams").then(response => response.json());
}
function init_event_listeners() {
    team_name_input.addEventListener("input", async function() {
        hide_teams_completion();
        let team_name = team_name_input.value;
        setTimeout(()=>{if (team_name == team_name_input.value) {
            show_teams_completion();

        }}, 1000);
        
    });
    student_username_input.addEventListener("input", async function() {
        
    });
    send_button.addEventListener("click", async function() {
        
    });
}


function hide_teams_completion() {
    team_comp_HTML[0].innerHTML = "";
}

async function show_teams_completion() {
    await teams_coach_array.then((values) => {
        for (const value in values) {
            if (value.includes(team_name_input.value)) {
                const comp_team_card = get_comp_team_card(value);
                team_comp_HTML[0].childNodes.append(comp_team_card);
            }
        }
    });

}
    

function get_student_card(student_username) {
    const card = document.createElement('div');
    card.classList.add('student_card');
    
    const paragraph = document.createElement('p');
    paragraph.textContent = student_username;
    
    card.appendChild(paragraph);

    // Add event listener to remove the card when clicked
    card.addEventListener('click', function() {
        card.remove();
    });

    return card;
}
function get_comp_team_card(team_name) {
    const card = document.createElement('div');
    card.classList.add('comp_team_card');
    
    const paragraph = document.createElement('p');
    paragraph.textContent = team_name;
    
    card.appendChild(paragraph);

    // Add event listener to remove the card when clicked
    card.addEventListener('click', function() {
        card.remove();
    });

    return card;
}
