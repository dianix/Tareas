var api = {
    url: 'https://lab-api-test.herokuapp.com/tasks/'
};

var $taskList = $("#task-list");

var cargarPagina = function () {
    cargarTareas();
    $("#add-form").submit(agregarTarea);
    $("body").on("click",".mostrar",obtenerDatos);
    $("body").on("click",".borrar",borrarTarea);
};

var cargarTareas = function () {
    $.getJSON(api.url, function (tareas) {
        tareas.forEach(crearTarea);
    });
};

var plantillaAcciones = '<button data-toggle="modal" data-target="#datosTarea"><span class="mostrar glyphicon glyphicon-eye-open" aria-hidden="true"></span></button>'+'&nbsp;'+
                        '<button><span class="borrar glyphicon glyphicon-trash" aria-hidden="true"></span></button>';

var crearTarea = function (tarea) {
    var nombre = tarea.name;
    var estado = tarea.status[0];
    var id = tarea._id;
    //se crea fila de tabla
    var $tr = $("<tr />").attr("data-id",id);
    //se crean celdas de nombre y estado
    var $nombreTd = $("<td />");
    $nombreTd.text(nombre);
    var $estadoTd = $("<td />");
    $estadoTd.text(estado);
    var $accionesTd = $("<td />");
    $accionesTd.html(plantillaAcciones);
    $tr.append($nombreTd).append($estadoTd).append($accionesTd);
    $taskList.append($tr);
};

var plantillaDatos ='<h4><b>Tarea:</b> __nombre__</h4>'+
                    '<h4><b>Hora de creación:</b> __fecha__</h4>'+
                    '<h4><b>Estatus:</b> __status__</h4>';

var agregarTarea = function (e) {
    e.preventDefault();
    var nombre = $("#nombre-tarea").val();
    
    $.post(api.url, {name: nombre}, function(tarea){
        $("#myModal").modal("hide");
        crearTarea(tarea);
    });
};

var obtenerDatos = function(){
    var tareaId = $(this).closest("tr").data("id");
    var urlTarea = api.url+tareaId;
    //console.log(urlTarea)
    $.getJSON(urlTarea,function(response){
        console.log(response)
        var nombre = response.name;
        var fecha = response.created_at;
        var estatus = response.status[0];
        mostrarDatos({
            nombre:nombre,
            fecha:fecha,
            estatus:estatus
        });
    });
};

var mostrarDatos = function(datos){
    var areaDatos = $("#areaDatos");
    plantillaFinal = "";
    plantillaFinal += plantillaDatos.replace("__nombre__",datos.nombre)
    .replace("__fecha__",datos.fecha)
    .replace("__status__",datos.estatus);
    areaDatos.html(plantillaFinal);
};

var borrarTarea = function(){
    var tarea = $(this);
    var tareaId = $(this).closest("tr").data("id");
    var urlTarea = api.url+tareaId;
    console.log(urlTarea)
    $.ajax({
        url: urlTarea,
        type: 'DELETE',
        success: function(data){
            tarea.closest("tr").remove();
        }
    });
};

$(document).ready(cargarPagina);
