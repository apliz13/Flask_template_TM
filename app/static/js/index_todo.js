const cards = document.querySelectorAll('.todo');

cards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.toggle('completed');
    });
}   );

