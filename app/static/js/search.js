// Select all team cards and student cards
const TeamCards = document.querySelectorAll('div.teamCard');
const StudentCards = document.querySelectorAll('div.studentCard');

// Select search inputs for teams and students
const searchInputTeam = document.querySelector('[data-search]');
const searchInputStudent = document.querySelector('[data-search-student]');

// Arrays to store team and student data
let teams = [];
let students = [];
let studentString = "";

// Variable to track the selected team
let selectedTeam = null;

// Process team cards
TeamCards.forEach(card => {
    // Extract team name and id from the card
    const teamName = card.children[0].textContent.trim();
    const teamId = card.getAttribute("teamid");

    // Store team data in the teams array
    teams.push({ teamName: teamName, element: card, id: teamId });

    // Add click event listener to team card
    card.addEventListener("click", e => {
        // Update selected team when the card is clicked
        selectedTeam = e.currentTarget.getAttribute("teamid");
        // Iterate through students to filter and toggle visibility
        students.forEach(student => {
            const isVisible = student.teamId == selectedTeam && (student.studentFirstName.toLowerCase().includes(studentString) || student.studentLastName.toLowerCase().includes(studentString));
            student.element.classList.toggle("hide", !isVisible);
        });
    });
});

// Process student cards
StudentCards.forEach(card => {
    // Extract student details and team id from the card
    const studentFirstName = card.children[0].textContent.trim();
    const studentLastName = card.children[1].textContent.trim();
    const teamId = card.getAttribute("teamid");

    // Store student data in the students array
    students.push({ studentFirstName: studentFirstName, studentLastName: studentLastName, element: card, teamId: teamId });
});

// Add event listener for team search input
searchInputTeam.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();
    // Iterate through teams to filter and toggle visibility
    teams.forEach(team => {
        const isVisible = team.teamName.toLowerCase().includes(value);
        team.element.classList.toggle("hide", !isVisible);
    });
});

// Add event listener for student search input
searchInputStudent.addEventListener("input", e => {
    studentString = e.target.value.toLowerCase();
    // Iterate through students to filter and toggle visibility
    students.forEach(student => {
        const isVisible = student.teamId == selectedTeam && (student.studentFirstName.toLowerCase().includes(studentString) || student.studentLastName.toLowerCase().includes(studentString));
        student.element.classList.toggle("hide", !isVisible);
    });
});

