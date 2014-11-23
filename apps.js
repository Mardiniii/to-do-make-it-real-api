$(document).ready(function(){

  var server = "http://makeitreal-todo.herokuapp.com/todo_items";
  
  //Funcion para ingrear una nueva tarea
  function insertTask(data){
    var newDivTask = '<li id="'+data.id+'" class="itemTask">';
    newDivTask += data.done ? '<input class="done" type="checkbox" name="check" checked="checked">' : '<input class="done" type="checkbox" name="check" >'; 
    newDivTask += data.title;
     newDivTask += '</li>';
     var ndt = $(newDivTask);
    $(".todo-list").append(ndt);
    if( $(".done", ndt).is(':checked') ){
      ndt.addClass("checked");
    }
  }

  //Funcion para recorrer arreglo de objetos que envia el servidor - JSON
  function procesarDatos(data){
    data.forEach(insertTask);
  }

  //Funcion para mostrar tarea en el website
  function showTask(text,data){
    var newDivTask = $('<li id="'+data.id+'" class="itemTask"><input class="done" type="checkbox" name="check">' + text + '</li>');
    console.log(data.id);
    $(".todo-list").append(newDivTask);
  }

  //Funcion para cambiar background al posicionar mouse agregando boton remove
  $('.todo-list').on('mouseenter','.itemTask',function(){
    $(this).css('background-color', '#edeff0');
    var clearTask = $('<div class="remove" style="display: inline-block;float: right"><strong>X</strong></div>');
    $(this).append(clearTask);
  });

  //Funcion para cambiar background al abandonar mouse borrando boton remove
  $('.todo-list').on('mouseleave','.itemTask',function(){
    $(this).css('background-color', 'white');
    $(this).find(".remove").remove();
  });

  //Funcion para marcar tarea como hecha
  $('.todo-list').on('click','.done',function(){
    if( $(this).is(':checked')){
      $(this).parent().addClass("checked");
    }else{
      $(this).parent().removeClass("checked");      
    }
    var id = $(this).parent().attr('id');
    console.log(id);
    $.ajax({
      type: "PATCH",
      url: server+"/"+id,
      contentType: "application/json",
      data: JSON.stringify({ "done": this.checked }),
      success: function(){console.log("Tarea actualizada")}
    });
  });
  
  //Deteccion de click para eliminar tarea
  $('.todo-list').on('click','.remove',function(){
    var id = $(this).closest("li").attr('id');
    console.log(id);
    $.ajax({
      type: "DELETE",
      url: server+"/"+id,
      success: function(){console.log("Tarea eliminada")}
    });
    $(this).parent().remove();
  });

  //Evento para determinar cuando una tarea ha sido introducida con la tecla enter
  $('#input').keyup(function(event){     //Analiza el tipo de tecla que digita el usuario
    var keycode = event.keyCode;         //Almacene el keycode de cada tecla que digita el usuario
    if(keycode == '13'){                 //Si el keycode es igual a 13 agregue tarea
      var textTask = $(this).val();      //Almacene el nombre de la tarea en task
      $.ajax({
        type: "POST",
        url: server,
        contentType: "application/json",
        data: JSON.stringify({ "title": textTask }),
        dataType: "json",
        success: function(data){
          console.log("Tarea enviada");
          showTask(textTask,data)}
      });
      $("#input").val('');
    }
  });
  $.get(server, procesarDatos); //Peticion al servidor de las tareas existentes
});