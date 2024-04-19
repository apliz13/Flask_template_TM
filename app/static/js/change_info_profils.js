const changePageButton = document.querySelectorAll(".change-page-button");
const PAGES = document.querySelectorAll(".container_auth");

changePageButton.forEach(button => {
    button.addEventListener("click", e => {
        const targetPageId = e.currentTarget.dataset.pageId;
        PAGES.forEach(page => {
            if (page.id === targetPageId) {
                page.classList.remove("hide");
            } else {
                page.classList.add("hide");
            }
        });
    });
});


