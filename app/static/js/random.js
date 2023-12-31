colors = ['#fed032', '#ffc259', '#ffb97c', '#ffb59a', '#ffb7b2', '#febcc9', '#f6c3de', '#ebcced', '#d9d9fb', '#cce4fd', '#ccedf8', '#d7f3f2'];

rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,
      selectRandom = items => items[rand(0, items.length - 1)];

cards = document.getElementsByClassName('studentCard');

for (let i = 0; i < cards.length; i++) {
  cards[i].style.color = selectRandom(colors);
  cards[i].style.border = "2px solid" + selectRandom(colors);
}

console.log("TEST LOG");