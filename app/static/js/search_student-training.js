
const TeamCards = document.querySelectorAll('div.teamCard');
const StudentCards = document.querySelectorAll('div.teamCard_big2');

const searchInputTeam = document.querySelector('[data-search]');
const searchInputStudent = document.querySelector('[data-search-big]');

let teams = [];
let students = [];
let studentString = "";

let selectedTeam = null;

TeamCards.forEach(card => {

    const teamName = card.children[0].textContent.trim();
    const teamId = card.getAttribute("teamid");

    teams.push({ teamName: teamName, element: card, id: teamId });

    card.addEventListener("click", e => {

        selectedTeam = e.currentTarget.getAttribute("teamid");
        TeamCards.forEach(card => {
            card.classList.remove("activeTeam");
        });
        e.currentTarget.classList.add("activeTeam");

        students.forEach(student => {
            const isVisible = student.teamId == selectedTeam && (student.studentFirstName.toLowerCase().includes(studentString) || student.studentLastName.toLowerCase().includes(studentString));
            student.element.classList.toggle("hide", !isVisible);
        });
    });
});


StudentCards.forEach(card => {

    const studentFirstName = card.children[0].textContent.trim();
    const studentLastName = card.children[1].textContent.trim();
    const teamId = card.getAttribute("teamid");


    students.push({ studentFirstName: studentFirstName, studentLastName: studentLastName, element: card, teamId: teamId });
});


searchInputTeam.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();

    teams.forEach(team => {
        const isVisible = team.teamName.toLowerCase().includes(value);
        team.element.classList.toggle("hide", !isVisible);
    });
});


searchInputStudent.addEventListener("input", e => {
    studentString = e.target.value.toLowerCase();

    students.forEach(student => {
        const isVisible = student.teamId == selectedTeam && (student.studentFirstName.toLowerCase().includes(studentString) || student.studentLastName.toLowerCase().includes(studentString));
        student.element.classList.toggle("hide", !isVisible);
    });
});

