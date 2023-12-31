

/*Creating function for fetch the last happiness of the day and apply the selection on the buttion*/
function fetchHappiness(){
    fetch(window.location.href + "/testrank/get_today_hapiness",
    {
        method: 'GET',
    }).then(response => response.json()).then(data => {
        

        if(data['satisfaction'] != null){
        var object = document.getElementById(data['satisfaction']);
        object.classList.add("Active");
        }

    }).catch(error => console.log(error));
    
}

/*Call the function while the windows is loading*/
window.onload = function(){
    fetchHappiness();
}


/*Creating function for fetch the last happiness of the day and apply the selection on the buttion*/
var objects = document.getElementsByClassName("Object");
var i;
var myfunction = function() {
    for (i = 0; i < objects.length; i++) {
        objects[i].classList.remove("Active");
    }
    this.classList.add("Active");
    /*A terminer, requete pour envoyer le resultat du sondage/*/
    /*g.user*/
    try{
    fetch(window.location.href + "/testrank", {
        method: 'POST',
        headers:{'Content-Type': 'application/json'},
        body:JSON.stringify({
            'date':new Date().getDate() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getFullYear(),
            'satisfaction': this.id
        })
    })}catch(error){console.log(error)}
};

/*Adding event listener on each button*/

for (i = 0; i < objects.length; i++) {
    objects[i].addEventListener('click', myfunction, false);
}
