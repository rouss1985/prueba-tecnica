$(document).foundation()


//contenedor del ajax ->  evento -> selector al que le voy a dar click
$("#btn").click(function(){
    //busqueda es
    let busqueda = $("#busqueda").val();
    //llamo a la api para ver el perfiles
    gitApi(busqueda);
});

//esta función
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
            console.log(data);
            //genero un template
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
