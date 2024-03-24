const teams_coach_array = init_list_team_coach();


let selected_team = null;
let selected_team_student_array = [];

const team_name_input = document.getElementById("team_name_input");
const team_comp_HTML = document.getElementsByClassName("comp_team");
const student_username_input = document.getElementById("student_username_input");
const student_comp_HTML = document.getElementById("student_comp_div")
const student_div_HTML = document.getElementsByClassName("student_div");



init_event_listeners();




async function init_list_team_coach() {
    return fetch("/get_my_teams").then(response => response.json());
}
function init_event_listeners() {
    team_name_input.addEventListener("input", async function() {
        selected_team = null;
        hide_teams_completion();
        let team_name = team_name_input.value;
        setTimeout(()=>{if (team_name == team_name_input.value && team_name != "") {
            show_teams_completion();
        }}, 1000);
        
    });
    student_username_input.addEventListener("input", async function() {
        hide_students_completion();
        let student_surname = student_username_input.value;
        setTimeout(()=>{if (student_surname == student_username_input.value && student_surname != "") {
            show_students_completion();
        }}, 1000);
    });
}


function hide_teams_completion() {
    team_comp_HTML[0].innerHTML = "";
}
async function show_teams_completion() {
    await teams_coach_array.then((values) => {
        let card_array = [];
        for (const value in values) {
            if (value.includes(team_name_input.value)) {
                card_array.push(get_comp_team_card(values[value], value));
            }
        }
        team_comp_HTML[0].innerHTML = card_array.join("");
    });
}
function complete_this_team(team) {
    selected_team = team.getAttribute("team-id");
    get_selected_team_students_and_show()
    team_name_input.value = team.firstChild.textContent;
    hide_teams_completion();
}
function get_comp_team_card(team_id, team_name) {
    return `<div class="comp_team_card" onclick="complete_this_team(this)" team-id=${team_id}><span>${team_name}</span></div>`;
}



function hide_students_completion() {
    student_comp_HTML.innerHTML = "";
}
async function show_students_completion() {
    get_similar_student(student_username_input.value).then((values) => {
        student_comp_HTML.innerHTML = values.filter(student => student != " " && !selected_team_student_array.includes(student)).map(student => get_comp_student_card(student)).join("");
    });
}
async function get_similar_student(student_surname){
    return fetch(`/get_similar_student/${student_surname}`).then(response => response.json());
}
function get_comp_student_card(student_username) {
    return `<div class="comp_student_card" onclick="add_this_student(this)"><span>${student_username}</span></div>`
}
function add_this_student(student) {
    let student_username = student.firstChild.textContent;
    selected_team_student_array.push(student_username);
    hide_selected_students();
    student_username_input.value = "";
    show_selected_students();
    hide_students_completion();
}
function get_student_card(student) {
    return `<div class="student_card"><span>${student}</span><button onclick="remove_this_student(this)">X</button></div>`;
}
function remove_this_student(button) {
    let student_username = button.previousSibling.textContent;
    selected_team_student_array = selected_team_student_array.filter(student => student != student_username);
    show_selected_students();
}
function hide_selected_students() {
    student_div_HTML[0].innerHTML = "";
}
function show_selected_students() {
    student_div_HTML[0].innerHTML = selected_team_student_array.map(student => get_student_card(student)).join("");
}
async function get_selected_team_students_and_show(){
    return fetch(`/get_similar_student/${selected_team}`).then(response => response.json()).then(usernames => {
        for (key in usernames){
            if (usernames[key] != " " && !selected_team_student_array.includes(usernames[key])){
            selected_team_student_array.push(usernames[key])
        }}
    }).then(()=>show_selected_students())

}
function submit() {
    if (selected_team != null && selected_team_student_array.length > 0) {
        fetch("/update_teams", {
            method: "POST",
            body: JSON.stringify({type:"update",data:{team_id: selected_team, students: selected_team_student_array}}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json()).then(response => {
            if (response.status == "ok") {
                window.location.replace("/teams");
            }
        });
    }
    else if(team_name_input.value != "" && selected_team_student_array.length > 0){
        fetch("/update_teams", {
            method: "POST",
            body: JSON.stringify({type:"create",data:{team_name: team_name_input.value, students: selected_team_student_array}}),
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response => response.json()).then(response => {
            if (response.status == "ok") {
                window.location.replace("/teams");
            }
        });
    }
}