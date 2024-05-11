


function fetchHappiness(){
    fetch(window.location.href + "/testrank/get_today_hapiness",
    {
        method: 'GET',
    }).then(response => response.json()).then(data => {
        

        if(data['satisfaction'] != null && data['satisfaction'] != "None"){
        var object = document.getElementById(data['satisfaction']);
        object.classList.add("Active");
        }

    }).catch(error => console.log(error));
    
}


window.onload = function(){
    fetchHappiness();
}


var objects = document.getElementsByClassName("Object");
var i;
var myfunction = function() {
    for (i = 0; i < objects.length; i++) {
        objects[i].classList.remove("Active");
    }
    this.classList.add("Active");

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


for (i = 0; i < objects.length; i++) {
    objects[i].addEventListener('click', myfunction, false);
}
