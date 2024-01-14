
const TeamCards_big = document.querySelectorAll('div.teamCard_big');


const searchInputTeam = document.querySelector('[data-search-big]');

let teams = [];

let selectedTeam = null;


TeamCards_big.forEach(card => {

    const teamName = card.children[0].textContent.trim();
    const teamId = card.getAttribute("teamid");

    teams.push({ teamName: teamName, element: card, id: teamId });

    card.addEventListener("click", e => {

        selectedTeam = e.currentTarget.getAttribute("teamid");
        TeamCards_big.forEach(card => {
            card.classList.remove("activeTeam_big");
        });
        e.currentTarget.classList.add("activeTeam_big");
        
    });
});

searchInputTeam.addEventListener("input", e => {
    const value = e.target.value.toLowerCase();

    teams.forEach(team => {
        const isVisible = team.teamName.toLowerCase().includes(value);
        team.element.classList.toggle("hide", !isVisible);
    });
});