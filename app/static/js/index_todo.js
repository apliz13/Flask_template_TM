const cards = document.querySelectorAll('.todo');

cards.forEach(card => {
    card.addEventListener('click', () => {
        card.classList.add('completed');
    });
}   );

cards.forEach(card => {
    card.addEventListener('dblclick', () => {
        card.classList.remove('completed');
    });
}    );