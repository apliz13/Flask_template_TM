// Select all team cards and student cards
const TeamCards_big = document.querySelectorAll('div.teamCard_big');

// Select search inputs for teams and students
const searchInputTeam = document.querySelector('[data-search-big]');


// Arrays to store team and student data
let teams = [];


// Variable to track the selected team
let selectedTeam = null;


//Process team cards
TeamCards_big.forEach(card => {
    // Extract team name and id from the card
    const teamName = card.children[0].textContent.trim();
    const teamId = card.getAttribute("teamid");

    // Store team data in the teams array
    teams.push({ teamName: teamName, element: card, id: teamId });

    // Add click event listener to team card
    card.addEventListener("click", e => {
        // Update selected team when the card is clicked
        selectedTeam = e.currentTarget.getAttribute("teamid");
        TeamCards_big.forEach(card => {
            card.classList.remove("activeTeam_big");
        });
        e.currentTarget.classList.add("activeTeam_big");
        
    });
});

searchInputTeam.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();
    // Iterate through teams to filter and toggle visibility
    teams.forEach(team => {
        const isVisible = team.teamName.toLowerCase().includes(value);
        team.element.classList.toggle("hide", !isVisible);
    });
});