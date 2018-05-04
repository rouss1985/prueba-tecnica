$(document).foundation();


$("#notas").hide();
//contenedor del ajax ->  evento -> selector al que le voy a dar click
$("#btn").click(function(){
    //busqueda es el parametro que voy a buscar en github
    let busqueda = $("#busqueda").val();

    if(busqueda){
        //llamo a la api para ver el perfiles
        gitApi(busqueda);
        //llamo a la api para ver los repositorios
        gitRepos(busqueda);

        $("#notas").show();

        //verifico si hay notas asociadas al Usuario
        let ref = firebase.database().ref();
        ref.child('repos/'+busqueda).on("value", function(snapshot) {
            if(snapshot.val()){
                let q = snapshot.val();
                let templateNotas = ``;
                for (var i in q) {
                    templateNotas += `
                    <div class="notas">
                         <p>${q[i].nota}<i class="fa fa-trash delete"></i></p>
                    </div>
                     `;
                }
                $("#listanotas").html(templateNotas);
            }else{
                $("#listanotas").html("No hay registros");
            }
        });
    }else{
        alert("Debes ingresar un usuario");
    }
});

//Este evento es para añadir la nota en firebase
$('#btn2').click(function(){
    let user= $("#busqueda").val();
    let nota= $("#textNote").val();
    writeNewNote(user, nota);
});

//esta función es el llamado a la Api de gitHub con el metodo GET al endPoint users
const gitApi =(busqueda) =>{
    $.ajax({
        type: "GET",
        dataType: "json",
        cache: true,
        url: "https://api.github.com/users/"+busqueda,
        beforeSend: function(){
            $("#perfil").html('Esperando respuesta...');
        },
        success: function(data){
            //console.log(data);
            //genero un template string y le paso dinamicamente los valores obtenidos de la respuesta
            let templatePerfil = `
                <h3 class="titleP">Perfil del usuario</h3>
                <div class="small-12 columns">
                    <img src="${data.avatar_url}" class="fotoPerfil" alt="">
                </div>
                <div class="small-12 columns datosPerfil">
                    <p class="name">Nombre: ${data.name}</p>
                    <p class="user">Usuario: ${data.login}</p>
                    <p class="mail">Email: ${data.email}</p>
                    <p class="ubi">Ubicación: ${data.location}</p>
                </div>
             `;
             //mando la respuesta
            $("#perfil").html(templatePerfil);

        },
        //en caso de error
        fail: function(jqXHR, textStatus, errorThrown){
            $("#perfil").html('Hubo un error al llamar a la API. Error: '+ errorThrown);
        }
    });
}

//esta función es el llamado a la Api de gitHub con el metodo GET al endPoint repos
const gitRepos =(busqueda) =>{
    $.ajax({
        type: "GET",
        dataType: "json",
        cache: true,
        url: "https://api.github.com/users/"+busqueda+"/repos",
        beforeSend: function(){
            $("#repos").html('Esperando respuesta...');
        },
        success: function(data){
            console.log(data);
            //genero un template string y le paso dinamicamente los valores obtenidos de la respuesta
            let templateRepos = `<h3>Repositorios</h3>`;
            for (var i in data) {
                templateRepos+=`
                <div class="repositorio">
                    <p>Nombre del repositorio: ${data[i].name}</p>
                    <p>Descripción: ${data[i].description}</p>
                </div>`;
                //console.log(data[i]);
            }
             //mando la respuesta
            $("#repos").html(templateRepos);

        },
        //en caso de error
        fail: function(jqXHR, textStatus, errorThrown){
            $("#repos").html('Hubo un error al llamar a la API. Error: '+ errorThrown);
        }
    });
}

const writeNewNote = (user, nota) =>{
    let database = firebase.database();
    // A post entry.
    let postData = {
      nota: nota
    };
    // Get a key for a new Post.
    let newPostKey = firebase.database().ref().child('repos').push().key;

    let updates = {};
    updates['/repos/' + user + '/' + newPostKey] = postData;

    return firebase.database().ref().update(updates);
}
