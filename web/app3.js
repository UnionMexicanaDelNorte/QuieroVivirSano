//on ready hardcode
var api ="http://quierovivirsano.org/app/qvs.php"
//var api ="http://localhost/app/qvs.php"
myMsgSpinner = msgSpinner("Por favor, espere..");
$("#dialog_Mensaje").dialog({autoOpen: false, modal: true, bgiframe:true, closeOnEscape : false });
  function msgSpinner(mensaje, accion){
  $('#pMensajeSpinner').text(mensaje);

  if (accion != undefined){
    $('#msgSpinner').dialog({
      autoOpen: false,
      closeOnEscape: false,
      resizable : false,
      height: 180,
      modal: true
    });
  }else{
    $('#msgSpinner').dialog({
      autoOpen: false,
      closeOnEscape: false,
      resizable : false,
      height : 180,
      modal: true
    });
  }
  return $('#msgSpinner').dialog('open');
}
myMsgSpinner.dialog('close');
  

function anadeClassAlMainContent(clase)
{
    $("#mainContent").removeAttr('class');
    $("#mainContent").addClass("content-wrapper");
    $("#mainContent").addClass(clase);
}
$(document).on("keydown",".soloNumeros", function(e) {
if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        (e.keyCode == 65 && e.ctrlKey === true) || 
        (e.keyCode >= 35 && e.keyCode <= 39)) {
             return;
    }
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
});
function validateText(idText) {
  var contenido = $("#"+idText).val().trim();
  if(contenido =="")
  {
    $("#messageToChangeMensaje").html("Te falta llenar un campo<br><br>");
    $("#dialog_Mensaje").dialog("open");
    return false;
  }
  return true;
}
$(document).on("click","#dialog_Mensaje_Aceptar", function() {
   $("#dialog_Mensaje").dialog("close");
});

function timeConverter(UNIX_timestamp){
  var zoneTime = 0;//hardcode
  UNIX_timestamp = UNIX_timestamp + (3600*zoneTime);

  var a = new Date(UNIX_timestamp * 1000);
  var year = a.getFullYear();
  var month = parseInt(a.getMonth())+1;
  var mes=""+month;
  if(month<10)
  {
    mes="0"+month;
  }
  var date = parseInt(a.getDate());
  var hour = a.getHours();
  var minute = a.getMinutes();
  var minuteS = minute;
  if(minute<10)
  {
    minuteS="0"+minute
  }
  var dia = ""+date;
  if(date<10)
  {
    dia="0"+date
  }
  var time = year + '-' + mes + '-' + dia + '   '+hour+':'+minuteS;
  return time;
}


//COMMIT


$(document).on("click",".terminarActividad", function () {
  var maximo = parseInt($(this).attr("maximo"));
  var habito = parseInt($(this).attr("habito"));
  var dia = parseInt($(this).attr("dia"));
  var timestampDeInicio = $(this).attr("timestamp");


  var i;
  var valor=0;
  for(i=1;i<=maximo;i++)
  {
    valor = valor + parseInt($('input[name=pregunta'+habito+'_'+dia+'_'+i+']:checked').val());
  }
  if(valor==0)
  {
    $("#messageToChangeMensaje").html("Para poder finalizar la actividad del día, por lo menos una respuesta debe de ser positiva.<br><br>");
    $("#dialog_Mensaje").dialog("open");
    return;
  }
  var param = {
      servicio : 'app',
      accion : 'yaHizeUnaActividad',
      habito : habito,
      diaConsecutivo : dia,
      timestampDeInicio : timestampDeInicio,
      valorObtenido : valor
    };
    $.ajax({
      url: api,
      data : param,
      dataType : "json",
      type : "post",
      async : true,
      beforeSend : function (){
        myMsgSpinner = msgSpinner("Espere...");
      },
      complete : function (){
      }, 
      success : function (resp){
        if(resp.success==3)
        {
          myMsgSpinner.dialog('close');
          $("#messageToChangeMensaje").html("Ya haz contestado la actividad de este día.<br><br>");
          $("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==2)
        {
          myMsgSpinner.dialog('close');
          $("#messageToChangeMensaje").html("Debes de esperar un día para realizar la siguiente actividad, se detecto que realizaste una actividad el dia "+resp.fecha+"<br><br>");
          $("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==1)
        {
          myMsgSpinner.dialog('close');
          $("#messageToChangeMensaje").html("¡Felicidades! Te esperamos mañana con la siguiente actividad.<br><br>");
          $("#dialog_Mensaje").dialog("open");
          cargaHabitoDiaConsecutivo(-1,-1);
        }
      }
    });
});

function toRadians (angle) {
  return angle * (Math.PI / 180);
}
function calculaAguja(maximo,total)
{
  var topBase=160;
  var porcentaje = parseFloat((total*100)/maximo);//7
  var grados = parseFloat((porcentaje*180)/100);//12
  var diferenciaEnTop = 30;
  var senoTop = Math.sin(toRadians(grados));//0.20
  //console.log("seno: "+senoTop);
  var loQueVoyAMoverTop = senoTop*diferenciaEnTop;
  //console.log("mover: "+loQueVoyAMoverTop);
  var topNuevo = topBase-loQueVoyAMoverTop;
  var leftBase =145;//vamos a disminuirlo!
  var diferenciaPorUnidadEnLeft = 25;
  var cosenoLeft = Math.cos(toRadians(grados))+1;
  //console.log("coseno: "+cosenoLeft);
  var loQueVoyADisminuirLeft = cosenoLeft*diferenciaPorUnidadEnLeft;
  var leftNuevo = leftBase-loQueVoyADisminuirLeft;
  $("#aguja").css("top",topNuevo+"px");
  $("#aguja").css("left",leftNuevo+"px");
  $("#aguja").css({transform: 'rotate('+grados+'deg)'});
/*
          grados

          100 = 180
          7.14 = ?

          0:
          top: 160
          left: 95   


          90:

          top: 130
          left: 120

          180:
          top: 160
          left: 145

          top:
          sen 0 = 0
          sen 90 = 1
          sen 180 = 0

          left:
          cos 0 = 1
          cos 90 = 0
          cos 180 = -1

          28 = 100
          2 = ? 
          */
}
$(document).on("click",".desempenoSemanal", function () {
  var habito = parseInt($(this).attr("habito"));
  var param = {
      servicio : 'app',
      accion : 'desempenoSemanal',
      habito : habito
    };
    $.ajax({
      url: api,
      data : param,
      dataType : "json",
      type : "post",
      async : true,
      beforeSend : function (){
        myMsgSpinner = msgSpinner("Espere...");
      },
      complete : function (){
      }, 
      success : function (resp){
        if(resp.success==1)
        {
          var sieteMonos1 = '<img habito="1" dia="1" style="height:50px" src="img/mona0.png"/><img habito="1" dia="2" style="height:50px" src="img/mona0.png"/><img habito="1" dia="3" style="height:50px" src="img/mona0.png"/><img habito="1" dia="4" style="height:50px" src="img/mona0.png"/><img habito="1" dia="5" style="height:50px" src="img/mona0.png"/><img habito="1" dia="6" style="height:50px" src="img/mona0.png"/><img habito="1" dia="7" style="height:50px" src="img/mona0.png"/>';
          var sieteMonos2 = '<img habito="2" dia="1" style="height:50px" src="img/mona0.png"/><img habito="2" dia="2" style="height:50px" src="img/mona0.png"/><img habito="2" dia="3" style="height:50px" src="img/mona0.png"/><img habito="2" dia="4" style="height:50px" src="img/mona0.png"/><img habito="2" dia="5" style="height:50px" src="img/mona0.png"/><img habito="2" dia="6" style="height:50px" src="img/mona0.png"/><img habito="2" dia="7" style="height:50px" src="img/mona0.png"/>';
          var sieteMonos3 = '<img habito="3" dia="1" style="height:50px" src="img/mona0.png"/><img habito="3" dia="2" style="height:50px" src="img/mona0.png"/><img habito="3" dia="3" style="height:50px" src="img/mona0.png"/><img habito="3" dia="4" style="height:50px" src="img/mona0.png"/><img habito="3" dia="5" style="height:50px" src="img/mona0.png"/><img habito="3" dia="6" style="height:50px" src="img/mona0.png"/><img habito="3" dia="7" style="height:50px" src="img/mona0.png"/>';
          var sieteMonos4 = '<img habito="4" dia="1" style="height:50px" src="img/mona0.png"/><img habito="4" dia="2" style="height:50px" src="img/mona0.png"/><img habito="4" dia="3" style="height:50px" src="img/mona0.png"/><img habito="4" dia="4" style="height:50px" src="img/mona0.png"/><img habito="4" dia="5" style="height:50px" src="img/mona0.png"/><img habito="4" dia="6" style="height:50px" src="img/mona0.png"/><img habito="4" dia="7" style="height:50px" src="img/mona0.png"/>';
          var sieteMonos5 = '<img habito="5" dia="1" style="height:50px" src="img/mona0.png"/><img habito="5" dia="2" style="height:50px" src="img/mona0.png"/><img habito="5" dia="3" style="height:50px" src="img/mona0.png"/><img habito="5" dia="4" style="height:50px" src="img/mona0.png"/><img habito="5" dia="5" style="height:50px" src="img/mona0.png"/><img habito="5" dia="6" style="height:50px" src="img/mona0.png"/><img habito="5" dia="7" style="height:50px" src="img/mona0.png"/>';
          var sieteMonos6 = '<img habito="6" dia="1" style="height:50px" src="img/mona0.png"/><img habito="6" dia="2" style="height:50px" src="img/mona0.png"/><img habito="6" dia="3" style="height:50px" src="img/mona0.png"/><img habito="6" dia="4" style="height:50px" src="img/mona0.png"/><img habito="6" dia="5" style="height:50px" src="img/mona0.png"/><img habito="6" dia="6" style="height:50px" src="img/mona0.png"/><img habito="6" dia="7" style="height:50px" src="img/mona0.png"/>';
          var sieteMonos7 = '<img habito="7" dia="1" style="height:50px" src="img/mona0.png"/><img habito="7" dia="2" style="height:50px" src="img/mona0.png"/><img habito="7" dia="3" style="height:50px" src="img/mona0.png"/><img habito="7" dia="4" style="height:50px" src="img/mona0.png"/><img habito="7" dia="5" style="height:50px" src="img/mona0.png"/><img habito="7" dia="6" style="height:50px" src="img/mona0.png"/><img habito="7" dia="7" style="height:50px" src="img/mona0.png"/>';
          var sieteMonos8 = '<img habito="8" dia="1" style="height:50px" src="img/mona0.png"/><img habito="8" dia="2" style="height:50px" src="img/mona0.png"/><img habito="8" dia="3" style="height:50px" src="img/mona0.png"/><img habito="8" dia="4" style="height:50px" src="img/mona0.png"/><img habito="8" dia="5" style="height:50px" src="img/mona0.png"/><img habito="8" dia="6" style="height:50px" src="img/mona0.png"/><img habito="8" dia="7" style="height:50px" src="img/mona0.png"/>';

          var cad = '<section class="content"><div class="row"><div class="col-md-7">';
          cad=cad+'<h2>MI DESEMPEÑO SEMANA '+habito+'</h2><br><br>';
          cad=cad+'<div id="contenedorDesempeno">';
            cad=cad+'<div style="float:left;" id="contenedorHabitos">';
              cad=cad+'<div style="padding-top: 80px; padding-left: 100px;width: 700px;" class="row"><div class="col-md-2"><div style="float:left;height:50px;width:50px;" id="habito1"></div></div><div class="col-md-5"> '+sieteMonos1+'  </div></div>';
              cad=cad+'<div style="padding-left: 100px;width: 700px;" class="row"><div class="col-md-2"><div style="float:left;height:50px;width:50px;" id="habito2"></div></div><div class="col-md-5"> '+sieteMonos2+'  </div></div>';
              cad=cad+'<div style="padding-left: 100px;width: 700px;" class="row"><div class="col-md-2"><div style="float:left;height:50px;width:50px;" id="habito3"></div></div><div class="col-md-5"> '+sieteMonos3+'  </div></div>';
              cad=cad+'<div style="padding-left: 100px;width: 700px;" class="row"><div class="col-md-2"><div style="float:left;height:50px;width:50px;" id="habito4"></div></div><div class="col-md-5"> '+sieteMonos4+'  </div></div>';
              cad=cad+'<div style="padding-left: 100px;width: 700px;" class="row"><div class="col-md-2"><div style="float:left;height:50px;width:50px;" id="habito5"></div></div><div class="col-md-5"> '+sieteMonos5+'  </div></div>';
              cad=cad+'<div style="padding-left: 100px;width: 700px;" class="row"><div class="col-md-2"><div style="float:left;height:50px;width:50px;" id="habito6"></div></div><div class="col-md-5"> '+sieteMonos6+'  </div></div>';
              cad=cad+'<div style="padding-left: 100px;width: 700px;" class="row"><div class="col-md-2"><div style="float:left;height:50px;width:50px;" id="habito7"></div></div><div class="col-md-5"> '+sieteMonos7+'  </div></div>';
              cad=cad+'<div style="padding-left: 100px;width: 700px;" class="row"><div class="col-md-2"><div style="float:left;height:50px;width:50px;" id="habito8"></div></div><div class="col-md-5"> '+sieteMonos8+'  </div></div>';
              /*cad=cad+'<div style="float:left;" id="habito2"><img src="img/2.png"/></div>';
              cad=cad+'<div style="float:left;" id="habito3"><img src="img/3.png"/></div>';
              cad=cad+'<div style="float:left;" id="habito4"><img src="img/4.png"/></div>';
              cad=cad+'<div style="float:left;" id="habito5"><img src="img/5.png"/></div>';
              cad=cad+'<div style="float:left;" id="habito6"><img src="img/6.png"/></div>';
              cad=cad+'<div style="float:left;" id="habito7"><img src="img/7.png"/></div>';
              cad=cad+'<div style="float:left;" id="habito8"><img src="img/8.png"/></div>';*/
            cad=cad+'</div>';//contenedorHabitos
            cad=cad+'<div style="float:right;" id="contenedorMonitos">';
            cad=cad+'</div>';//contenedorMonitos
          cad=cad+'</div>';//contenedorDesempeno
          cad=cad+'</div>';//termina div 7
          cad=cad+'<div class="col-md-5">';//termina div 7
            cad=cad+'<br><br><div id="contenedorProgreso"><img src="img/porcentajeProgresoArco.png" width="300px" height="140px"/><img src="img/agujaPorcentajeProgreso.png" id="aguja" style="position:absolute;top: 160px;left: 95px;" width="90px" height="35px"/></div><br><br><br>';//termina div 7
          cad=cad+'</div>';//termina div 5
          cad=cad+'</div></div></section>';
          $("#mainContent").html(cad);
          anadeClassAlMainContent("actividad"+habito);
          var pasito = 0.4;
          var empiezo=pasito;
          //resp.total=resp.maximo;
          var animacion = setInterval(function() {
            calculaAguja(resp.maximo,empiezo);
            if(empiezo<resp.total)
            {
              empiezo=empiezo+pasito;  
            }
            else
            {
              clearInterval(animacion);
            }
           },100);
          
         
                  
          var i;
          for(i=0;i<resp.todo.length;i++)
          {
            var h = resp.todo[i].habito;
            var d = resp.todo[i].diaConsecutivo;
            var maximo = resp.todo[i].maximo;
            var valorObtenido = resp.todo[i].valorObtenido;
            if(maximo==valorObtenido)
            {
              $('img[habito="'+h+'"][dia="'+d+'"]').attr("src","img/mona1.png");  
            }
            else
            {
              $('img[habito="'+h+'"][dia="'+d+'"]').attr("src","img/mona05.png");  
            }
          }
          myMsgSpinner.dialog('close');
           $('#contenedorDesempeno').css('height', $(window).height() * 0.8);
        }
      }
    });
});
$(document).on("click",".contestarCuestionarioActividad", function () {
  var si = parseInt($(this).attr("si"));
  var habito = parseInt($(this).attr("habito"));
  var dia = parseInt($(this).attr("diaconsecutivo"));
  var maximo = parseInt($(this).attr("maximo"));
  var timestamp = $(this).attr("timestamp");
  var preguntas="",tituloGeneralHabito="";
  var vaFrase = false;
  //doblalos
  switch(habito)
  {
    case 1:
      tituloGeneralHabito="BEBER AGUA NATURAL";
      switch(dia)
      {
        case 1:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/>';
        break;
        case 2:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/>';
        break;
        case 3:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/>';
        break;
        case 4:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">4.- Tomé dos vasos de agua natural 30 minutos antes de la cena.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/>';
        break;
        case 5:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">4.- Tomé dos vasos de agua natural 30 minutos antes de la cena.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">5.- Tomé dos vasos de agua natural dos horas antes de dormir</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_5"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_5"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/>';
        break;
        case 6:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">4.- Tomé dos vasos de agua natural 30 minutos antes de la cena.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">5.- Tomé dos vasos de agua natural dos horas antes de dormir</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_5"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_5"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">6.- Tomé agua natural mientras realicé ejercicio físico.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_6"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_6"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/>';
        break;
        case 7:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">4.- Tomé dos vasos de agua natural 30 minutos antes de la cena.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">5.- Tomé dos vasos de agua natural dos horas antes de dormir</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_5"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_5"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">6.- Tomé agua natural mientras realicé ejercicio físico.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_6"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_6"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">7.- No reemplacé el Agua Natural por refresco o jugo</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_7"/><img style="max-width: 30px;margin: 30px;" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_7"/><img style="max-width: 30px;margin: 30px;" src="img/negativo'+habito+'.png"/>';
        break;
      }
    break;
  }

                   
  var cad = '<section class="content"><div class="row"><div class="col-md-5">\
  <table width="100%" height="100%"><tbody><tr height="25%"><td ></td></tr><tr height="50%"><td  >\
  <img style="display:block;max-width:405px;" src="img/cuadro'+habito+'_'+dia+'.jpg"/></td></tr><tr height="25%"><td >\
  <button type="button" habito="'+habito+'" class="btn btn-block btn-primary btn-lg desempenoSemanal">Ver mi desempeño semanal</button>\
  </td></tr></tbody></table></div>\
  <div class="col-md-7">\
  <table width="100%"><tbody><tr><td width="25%"><img src="img/IconoHabito'+habito+'.png"/></td><td width="75%">'+tituloGeneralHabito+'<br></td><tr></tbody></table>\
  Cuestionario día '+dia+'<br><br> '+preguntas;
  if(vaFrase)
  {
    cad=cad+'<img class="fraseEnLosCuestionariosDeLasActividades" src="img/frase'+habito+'.png"/>';  
  }
  if(si==1)
  {
    cad=cad+'<br><br><button timestamp="'+timestamp+'" type="button" dia="'+dia+'" maximo="'+maximo+'" habito="'+habito+'" class="btn btn-block btn-success btn-lg terminarActividad">Contestar y finalizar actividad del día '+dia+'</button>';
  }
  cad=cad+'</div></div></section>';
  if(si==0)
  {
    $('input[type="radio"]').remove();
  }
  $("#mainContent").html(cad); 
});
$(document).on("click",".quees", function () {
  var habito = parseInt($(this).attr("habito"));
  var nombreHabito = "BEBER AGUA NATURAL";
  var tituloHabito = "¿QUÉ ES EL HÁBITO DE BEBER AGUA NATURAL?";
  switch(habito)
  {
    case 2:
    break;
  }
   var cad = '<section class="content"><div style="color:#FFF !important;" class="row"><div class="col-md-4"><img src="img/gotita'+habito+'.png"/></div><div class="col-md-8">'+nombreHabito+'</div></div>\
  <div style="color:#FFF !important;" class="row"><div class="col-md-6">'+tituloHabito+'\
  </div>\
  </div></section>';
  $("#mainContent").html(cad); 
});
function cargaHabitoDiaConsecutivo(habito,diaConsecutivo)
{
  //mandar negativos cuando inicie la pagina
  //revisar el compromiso activo, si no existe, decir
  habito=parseInt(habito);
  diaConsecutivo=parseInt(diaConsecutivo);
   var param = {
      servicio : 'app',
      accion : 'verQueOndaConLosDias',
      habito : habito,
      diaConsecutivo : diaConsecutivo
    };
    $.ajax({
      url: api,
      data : param,
      dataType : "json",
      type : "post",
      async : true,
      beforeSend : function (){
        myMsgSpinner = msgSpinner("Espere...");
      },
      complete : function (){
      }, 
      success : function (resp){
        if(resp.success==4)
        {
          myMsgSpinner.dialog('close');
          $("#messageToChangeMensaje").html("Tu compromiso que hiciste el día "+resp.fecha+" caduco por que pasaron más de 5 días seguidos sin realizar una actividad de un hábito. Por favor renueva tu compromiso porque Quiero ¡Vivir Sano!<br><br>");
          $("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==3)
        {
          myMsgSpinner.dialog('close');
          $("#messageToChangeMensaje").html("Tu compromiso que hiciste el día "+resp.fecha+" caduco por que pasaron más de 8 días sin realizar una actividad de un hábito. Por favor renueva tu compromiso porque Quiero ¡Vivir Sano!<br><br>");
          $("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==2)
        {
          myMsgSpinner.dialog('close');
          if(habito>0 && diaConsecutivo>0)
          {
            $("#messageToChangeMensaje").html("No tienes un compromiso activo. ¡Haz un compromiso!.<br><br>");
            $("#dialog_Mensaje").dialog("open");  
          }
        }
        if(resp.success==1)
        {
          var habitoActual = parseInt(resp.habito);
          var diaActual = parseInt(resp.dia);
          var reiniciado = resp.reiniciado;
          if(reiniciado==1)
          {
            $("#messageToChangeMensaje").html("Fuiste reiniciado al día 1 del hábito en formacion, debido a que no se realizo la actividad en 2 días seguidos o en más de 2 días salteados en un periodo de 7 días.<br><br>");
            $("#dialog_Mensaje").dialog("open"); 
            myMsgSpinner.dialog('close');
            if(habitoActual!=9)//terminado
            {
              reseteaConCandadosTodo();
              var i,j,limite=7;
              for(i=1;i<=habitoActual;i++)
              {
                habilitaHabito(i);
                if(i==habitoActual){limite=diaActual;}
                for(j=1;j<limite;j++)
                {
                  ponIconoEnElHabitoDia(i,j,"fa-calendar-times-o");
                }
              }
              for(i=0;i<resp.diasConIconoPalomita.length;i++)
              {
                var hab = resp.diasConIconoPalomita[i].habito;
                var d = resp.diasConIconoPalomita[i].diaConsecutivo;
                if(hab<habitoActual || d<diaActual)
                {
                  ponIconoEnElHabitoDia(hab,d,"fa-calendar-check-o");  
                }
              }
              ponIconoEnElHabitoDia(habitoActual,diaActual,"fa-calendar-o");  
            }
            return;
          }


         if(habito>0 && diaConsecutivo>0)
          {
            if(habito>habitoActual ||(habito==habitoActual && diaConsecutivo>diaActual))
            {
              $("#messageToChangeMensaje").html("Aún no puedes acceder a esta actividad. El hábito que te toca es el número "+habitoActual+" en la actividad del día "+diaActual+".<br><br>");
              $("#dialog_Mensaje").dialog("open");  
            }
            else
            {
              var esDiaQueDebeDeContestar=0;
              var si='si="0"';
              if(habito==habitoActual && diaActual==diaConsecutivo)
              {
                si='si="1"';
                esDiaQueDebeDeContestar=1;
              }
              var param2 = {
                servicio : 'app',
                accion : 'cargaHabitoDiaConsecutivo',
                habito : habito,
                diaConsecutivo : diaConsecutivo
              };
              $.ajax({
                url: api,
                data : param2,
                dataType : "json",
                type : "post",
                async : true,
                beforeSend : function (){
                  myMsgSpinner = msgSpinner("Espere...");
                },
                complete : function (){
                }, 
                success : function (resp2){
                  if(resp2.success==1)
                  {
                    var tituloGeneralHabito='BEBER AGUA NATURAL';
                    var fraseGeneralHabito='¡No te esperes a tener sed!';
                    var colorFrase='00F';
                    var peso=parseInt(resp2.kg);
                    var fraseEnTurno="";
                    var existeTip=false;
                    anadeClassAlMainContent("actividad"+habito);
                    switch(habito)
                    {
                      case 1:
                        tituloGeneralHabito='BEBER AGUA NATURAL';
                        fraseGeneralHabito='¡No te esperes a tener sed!';
                        colorFrase='00F';
                        switch(diaConsecutivo)
                        {
                          case 1:
                            fraseEnTurno="Bebe dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar.";
                            existeTip=true;
                          break;
                          case 2:
                            var total = ((30*peso)/2)-1000;
                            var escribir = "";
                            if(total<=250)
                            {
                              escribir=" un vaso de agua de 250 ml ";
                            }
                            else
                            {
                              if(total<=500)
                              {
                                escribir=" dos vasos de agua de 250 ml c/u ";   
                              }
                              else
                              {
                                escribir=" tres vasos de agua de 250 ml c/u ";    
                              }
                            }
                            fraseEnTurno="Bebe "+escribir+" dos horas después del desayuno y "+escribir+" dos horas después de la comida.<br>Y no olvides: Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar.";
                            existeTip=true;
                          break;
                          case 3:
                            fraseEnTurno="Bebe dos vasos de agua natural de 250 ml c/u media hora antes de la comida.<br><br>\
                              Y no olvides:<br><br>\
                              1.- Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar. <br>\
                              2.- Beber los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.";
                            existeTip=true;
                          break;
                          case 4:
                          fraseEnTurno='Bebe dos vasos de agua natural de 250 ml c/u 30 minutos antes de la cena.<br><br>\
                            Y no olvides:<br><br>\
                            1.- Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar. <br>\
                            2.- Beber los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.<br>\
                            3.- Beber dos vasos de agua natural de 250 ml c/u media hora antes de la comida.';
                            existeTip=false;
                          break;
                          case 5:
                          fraseEnTurno='Bebe un vaso de agua natural de 250 ml dos horas antes de dormir.<br><br>\
                            Y no olvides:<br><br>\
                            1.- Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar. <br>\
                            2.- Beber los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.<br>\
                            3.- Beber dos vasos de agua natural de 250 ml c/u media hora antes de la comida.<br>\
                            4.- Beber dos vasos de agua natural de 250 ml c/u 30 minutos antes de la cena.';
                            existeTip=false;
                          break;
                          case 6:
                          fraseEnTurno='Bebe Agua Natural mientras realizas ejercicio físico.<br><br>\
                          Y no olvides<br><br>\
                            1.- Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar. <br>\
                            2.- Beber los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.<br>\
                            3.- Beber dos vasos de agua natural de 250 ml c/u media hora antes de la comida.<br>\
                            4.- Beber dos vasos de agua natural de 250 ml c/u 30 minutos antes de la cena.<br>\
                            5.- Beber dos vasos de agua natural de 250 ml c/u dos horas antes de dormir.';
                            existeTip=false;
                          break;
                          case 7:
                          fraseEnTurno='No reemplaces el agua natural por refresco o jugo.<br><br>\
                            Y no olvides:<br><br>\
                            1.- Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar. <br>\
                            2.- Beber los vasos de agua natural indicados dos horas después del desayuno.<br>\
                            3.- Beber dos vasos de agua natural de 250 ml c/u media hora antes de la comida.<br>\
                            4.- Beber dos vasos de agua natural de 250 ml c/u 30 minutos antes de la cena.<br>\
                            5.- Beber dos vasos de agua natural de 250 ml c/u de dos horas antes de dormir.<br>\
                            6.- Beber Agua Natural mientras realizas ejercicio físico a razón de 120 ml cada 20 minutos';
                            existeTip=false;
                          break;
                        }
                      break;
                    }

                    var cad = '<section class="content"><div style="color:#FFF;" class="row"><div class="col-md-8">';
                    cad=cad+'<table width="100%"><tbody><tr><td width="25%"><img src="img/IconoHabito'+habito+'.png"/></td><td width="75%">'+tituloGeneralHabito+'<br><span style="color:#'+colorFrase+';">'+fraseGeneralHabito+'</span></td><tr></tbody></table>';
                    cad=cad+'<br><span class="diaGrande">Día '+diaConsecutivo+'</span><br><br><span class="fraseHabito'+habito+'">'+fraseEnTurno+'</span>';
                    if(existeTip)
                    {
                      cad=cad+'<br><img src="img/tip'+habito+'_'+diaConsecutivo+'.png" /><br>';
                    }
                    cad=cad+'<div class="divQueVaHastaAbajo"><span class="tituloArticulo'+habito+'">'+resp2.tituloArticulo+'</span><br><br><p><span class="primerasPalabrasArticulo'+habito+'">'+resp2.primerasPalabras+'</span> <a target="_blank" href="'+resp2.link+'"><span class="saberMas'+habito+'">... SABER MÁS</span></a></p></div>';
                    cad=cad+'</div></div>';                    
                    cad=cad+'<button timestamp="'+resp.timestampDeInicio+'" style="position:relative;top:0px;right:0px;z-index:100;"type="button" '+si+' maximo="'+resp2.maximo+'" habito="'+habito+'" diaConsecutivo="'+diaConsecutivo+'" class="btn btn-block btn-success btn-lg contestarCuestionarioActividad">Contestar cuestionario</button>';
                    cad=cad+'</section>';
                    cad=cad+'<img style="position:fixed;bottom:0px;right:0px;z-index:100;height:90%;" src="img/actividad'+habito+'_'+diaConsecutivo+'.png"/>';
                    $("#mainContent").html(cad);
                    myMsgSpinner.dialog('close');
                  }
                }
              });
            }
          }
          else//la actualizacion de iconos de be de hacerse solo cuando entra a la pagina, o cuando realiza un habito!
          {
            if(habitoActual!=9)//terminado
            {
              reseteaConCandadosTodo();
              var i,j,limite=7;
              for(i=1;i<=habitoActual;i++)
              {
                habilitaHabito(i);
                if(i==habitoActual){limite=diaActual;}
                for(j=1;j<limite;j++)
                {
                  ponIconoEnElHabitoDia(i,j,"fa-calendar-times-o");
                }
              }
              for(i=0;i<resp.diasConIconoPalomita.length;i++)
              {
                var hab = resp.diasConIconoPalomita[i].habito;
                var d = resp.diasConIconoPalomita[i].diaConsecutivo;
                if(hab<habitoActual || d<diaActual)
                {
                  ponIconoEnElHabitoDia(hab,d,"fa-calendar-check-o");  
                }
              }
              ponIconoEnElHabitoDia(habitoActual,diaActual,"fa-calendar-o");  
            }
          }
          myMsgSpinner.dialog('close');
        }
      }
    });
}
cargaHabitoDiaConsecutivo(-1,-1);
$(document).on("click",".habitoDia", function () {
  var habito = $(this).attr("habito");
  var dia = $(this).attr("dia");
  cargaHabitoDiaConsecutivo(habito,dia);

});
function ponIconoEnElHabitoDia(habito,dia,icono)
{
  var elemento =$('.habitoDia[habito="'+habito+'"][dia="'+dia+'"] i').first();
  $(elemento).removeAttr("class");
  $(elemento).addClass("fa");
  $(elemento).addClass(icono);
}

function ponIconoEnElHabitoClase(habito,clase,icono)
{
  var elemento =$('.'+clase+'[habito="'+habito+'"] i').first();
  $(elemento).removeAttr("class");
  $(elemento).addClass("fa");
  $(elemento).addClass(icono);
}
function reseteaConCandadosTodo()
{
  var i,j;
  for(i=1;i<=8;i++)
  {
    for(j=1;j<=7;j++)
    {
      ponIconoEnElHabitoDia(i,j,"fa-lock");
    }
    ponIconoEnElHabitoClase(i,"cuestionario","fa-lock");
    ponIconoEnElHabitoClase(i,"quees","fa-lock");
    ponIconoEnElHabitoClase(i,"desempenoSemanal","fa-lock");
  }
}
function habilitaHabito(habito)
{
  ponIconoEnElHabitoClase(habito,"cuestionario","fa-pencil");
  ponIconoEnElHabitoClase(habito,"quees","fa-question-circle");
  ponIconoEnElHabitoClase(habito,"desempenoSemanal","fa-line-chart");
}
$(document).on("click","#aceptarCompromiso", function () {
  var param = {
      servicio : 'app',
      accion : 'insertarCompromiso'
    };
    $.ajax({
      url: api,
      data : param,
      dataType : "json",
      type : "post",
      async : true,
      beforeSend : function (){
        myMsgSpinner = msgSpinner("Registrando compromiso...");
      },
      complete : function (){
      }, 
      success : function (resp){
        if(resp.success==3)
        {
          myMsgSpinner.dialog('close');
          $("#messageToChangeMensaje").html("Primero tienes que registrar tu peso y altura en la sección de 'Mis Datos'.<br><br>");
          $("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==2)
        {
          myMsgSpinner.dialog('close');
          $("#messageToChangeMensaje").html("Ya tienes un compromiso aceptado el día: "+resp.fecha+" ¡Continua!.<br><br>");
          $("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==1)
        {
          myMsgSpinner.dialog('close');
          alert("¡Vamos al día 1!");
          //dia actual es 1
          habilitaHabito(1);
          ponIconoEnElHabitoDia(1,1,"fa-calendar-o");
          cargaHabitoDiaConsecutivo(1,1);
        }
      }
    });
});
$(document).on("click",".compromiso", function () {
  anadeClassAlMainContent("compromisoBackground");
  var nombre = $("#nombre").html().trim();
   //nombre = nombre.replace(/\D/g,'');
  var cad = '<section class="content"><div style="color:#FFF !important;" class="row"><div class="col-md-5"><br><br><h4>MI COMPROMISO</h4>\
  <br><br><br><img width="100%" src="img/ManoCompromiso.png"/>\
  </div>\
  <div class="col-md-7"><br><br><table width="100%"><tbody><tr><td width="34%"></td><td width="33%"><img width="100%" src="img/cursoEnLinea.png"/></td><td width="33%"><img width="100%" src="img/logo.png"/></td></tr></tbody></table>\
<h4>Me comprometo a realizar las actividades de cada semana, sin dejar de practicar las de la semana anterior; y así desarrollar un estilo saludable porque yo Quiero ¡Vivir Sano!</h4>\
  <br><br>'+nombre+'&nbsp;&nbsp;&nbsp;&nbsp;<button type="button" id="aceptarCompromiso" class="btn btn-block btn-success btn-lg">Acepto</button>\
  </div></div></section>';
  $("#mainContent").html(cad); 
});
//COMMIT

$(document).on("click","#miEsClinicos", function () {
  var param = {
      servicio : 'app',
      accion : 'diagnosticoIMCWeb'
    };
    $.ajax({
      url: api,
      data : param,
      dataType : "json",
      type : "post",
      async : true,
      beforeSend : function (){
        myMsgSpinner = msgSpinner("Espere un momento...");
      },
      complete : function (){
      }, 
      success : function (resp){
        if(resp.success==2)
        {
          myMsgSpinner.dialog('close');
          $("#messageToChangeMensaje").html("Primero tienes que llenar tus datos de peso, talla y cintura.<br><br>");
          $("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==1)
        {
          var gender = "misclinicos";//hombres background!
          var indicadorHDL = 45;
          if(resp.gender!="male")
          {
            gender = "misclinicos";//mujeres background!
            indicadorHDL = 55;
          }
          anadeClassAlMainContent(gender);
           



          var ldl = resp.ldl;
          var hdl = resp.hdl;
          var colesterol = resp.colesterol;
          var presion = resp.presion;
          var presionhg = resp.presionhg;
          var glucosa = resp.glucosa;
          var trigliceridos = resp.trigliceridos;
          var cad = '<section class="content"><div style="color: #333 !important;" class="row"><div class="col-md-2 cuerpo"><div class="msgdiag"></div><div class="msgdiag1">¡Te invitamos a realiza ajustes en tu estilo de vida! Este curso te brinda principios y sugerencias prácticas diarias que marcarán una diferencia real en tu vida y te permitirán renovar el diseño de tu rutina diaria de forma saludable</div></div><div class="col-md-10"><h1 style="color: #333 !important;">DIAGNÓSTICO BASADO EN ESTUDIOS CLÍNICOS</h1>';
          var palabraEnTurno="";
          var colorEnTurno="";
          var textoEnTurno="";
          var nombreEnTurno = "COLESTEROL";
          var nombreEnTurnoMinusculas = "colesterol";
          if(colesterol<200)
          {
            palabraEnTurno="DESEABLE";
            colorEnTurno="00A65A";
            textoEnTurno="Este es el nivel que se recomienda tener, ya que con él se reduce el riesgo de padecer enfermedades del corazón. Un estilo de vida saludable te ayuda a mantener los niveles recomendables de colesterol.";
          }
          else
          {
            if(colesterol<240)
            {
              palabraEnTurno="ELEVADO";
              colorEnTurno="FE9A2E";
              textoEnTurno="Este nivel está en el LÍMITE DE RIESGO de padecer enfermedades del corazón, representa una señal de alerta y se aconseja reducirlo. ¡Consulta a tu médico!, ya que el dispone de formas de calcular tus riesgos y decidirá el tratamiento adecuado.";
            }
            else
            {
              palabraEnTurno="ALTO";
              colorEnTurno="F00";
              textoEnTurno="Este nivel representa RIESGO ALTO de padecer enfermedades del corazón, derrame cerebral y otros problemas. ¡Consulta a tu médico!, ya que el dispone de formas de calcular tus riesgos y decidirá el tratamiento adecuado.";
            }
          }
          cad = cad + '<div class="bgdiv"><table width="100%" border="0"><tbody><tr style="color: #333 !important;"><td width="30%" style="color: #337AB7!important; font-weight:bold;" align="center">'+nombreEnTurno+'<br>Tu nivel de '+nombreEnTurnoMinusculas+' es<br> <span style="color:#'+colorEnTurno+'">'+palabraEnTurno+'</span></td><td width="70%">'+textoEnTurno+'</td></tbody></table></div>';
          nombreEnTurno = "COLESTEROL LDL (MALO)";
          nombreEnTurnoMinusculas = "colesterol ldl";
          if(ldl<100)
          {
            palabraEnTurno="DESEABLE";
            colorEnTurno="00A65A";
            textoEnTurno="Este es el NIVEL ÓPTIMO que se recomienda tener, ya que con él se reduce el riesgo de sufrir un infarto o embolia. Un estilo de vida saludable te ayuda a mantener bajos los niveles de colesterol Malo.";
          }
          else
          {
            if(ldl<130)
            {
              palabraEnTurno="ACEPTABLE";
              colorEnTurno="FF0";
              textoEnTurno="Este nivel está CERCA DE UN NIVEL ÓPTIMO, se aconseja reducirlo a un nivel deseable. Un estilo de vida saludable te ayuda a mantener bajos los niveles de colesterol Malo.";
            }
            else
            {
              if(ldl<160)
              {
                palabraEnTurno="ELEVADO";
                colorEnTurno="FE9A2E";
                textoEnTurno="Este nivel está en el LÍMITE DE RIESGO de padecer enfermedades del corazón, representa una señal de alerta y se aconseja reducirlo. ¡Consulta a tu médico!, ya que el dispone de formas de calcular tus riesgos y decidirá el tratamiento adecuado.";
              }
              else
              {
                if(ldl<190)
                {
                  palabraEnTurno="ALTO";
                  colorEnTurno="C00";
                  textoEnTurno="Este nivel representa RIESGO ALTO de padecer enfermedades del corazón, derrame cerebral y otros problemas. ¡Consulta a tu médico!, ya que el dispone de formas de calcular tus riesgos y decidirá el tratamiento adecuado.";
                }
                else
                {
                  palabraEnTurno="MUY ALTO";
                  colorEnTurno="F00";
                  textoEnTurno="Este nivel está en el RIESGO MUY ALTO de padecer enfermedades del corazón, representa una señal de alerta y se aconseja reducirlo. ¡Consulta a tu médico!, ya que el dispone de formas de calcular tus riesgos y decidirá el tratamiento adecuado.";
                }  
              }   
            }
          }
          cad = cad + '<div class="bgdiv"><table width="100%" border="0"><tbody><tr style="color: #333 !important;"><td width="30%" style="color: #337AB7!important; font-weight:bold;" align="center">'+nombreEnTurno+'<br>Tu nivel de '+nombreEnTurnoMinusculas+' es<br> <span style="color:#'+colorEnTurno+'">'+palabraEnTurno+'</span></td><td width="70%">'+textoEnTurno+'</td></tbody></table></div>';
          nombreEnTurno = "COLESTEROL HDL (BUENO)";
          nombreEnTurnoMinusculas = "colesterol hdl";
          if(hdl<indicadorHDL)
          {
            palabraEnTurno="BAJO";
            colorEnTurno="F00";
            textoEnTurno="A diferencia del colesterol malo (LDL), mantener este tipo de colesterol bueno (HDL), en niveles bajos, representa un RIESGO MAYOR de problemas del corazón.";
          }
          else
          {
            palabraEnTurno="BAJO";
            colorEnTurno="F00";
            textoEnTurno="A diferencia del colesterol malo (LDL), mantener este tipo de colesterol bueno (HDL), en niveles altos, es MEJOR PARA LA SALUD y puede brindarte cierta protección contra enfermedades del corazón.";
          }
          cad = cad + '<div class="bgdiv"><table width="100%" border="0"><tbody><tr style="color: #333 !important;"><td width="30%" style="color: #337AB7!important; font-weight:bold;" align="center">'+nombreEnTurno+'<br>Tu nivel de '+nombreEnTurnoMinusculas+' es<br> <span style="color:#'+colorEnTurno+'">'+palabraEnTurno+'</span></td><td width="70%">'+textoEnTurno+'</td></tbody></table></div>';
          nombreEnTurno = "TRIGLICÉRIDOS";
          nombreEnTurnoMinusculas = "triglicéridos";
          if(trigliceridos<150)
          {
            palabraEnTurno="NORMAL";
            colorEnTurno="00A65A";
            textoEnTurno="Este es el nivel que se recomienda tener, ya que con él se reduce el riesgo de padecer enfermedades del corazón, diabetes y derrame cerebral. Un estilo de vida saludable te ayuda a mantener los niveles recomendables de colesterol.";
          }
          else
          {
            if(trigliceridos<200)
            {
              palabraEnTurno="LEVEMENTE ELEVADO";
              colorEnTurno="FF0";
              textoEnTurno="Este nivel está en el LÍMITE DE RIESGO de padecer enfermedades del corazón, representa una señal de alerta y se aconseja reducirlo. ¡Consulta a tu médico!, el calculará tus riesgos y decidirá el tratamiento adecuado.";
            }
            else
            {
              if(trigliceridos<500)
              {
                palabraEnTurno="ELEVADO";
                colorEnTurno="FE9A2E";
                textoEnTurno="Este nivel representa un RIESGO ALTO de desarrollar enfermedades del corazón, diabetes y derrame cerebral. ¡Consulta a tu médico!, el calculará tus riesgos y decidirá el tratamiento adecuado.";
              }
              else
              {
                palabraEnTurno="MUY ELEVADO";
                colorEnTurno="F00";
                textoEnTurno="Este representa un RIESGO MUY ALTO de desarrollar enfermedades del corazón, diabetes y derrame cerebral. Además, puede generar enfermedades en el páncreas, el hígado y el bazo. ¡Consulta a tu médico!, el calculará tus riesgos y decidirá el tratamiento adecuado.";
              }
            }
          }
          cad = cad + '<div class="bgdiv"><table width="100%" border="0"><tbody><tr style="color: #333 !important;"><td width="30%" style="color: #337AB7!important; font-weight:bold;" align="center">'+nombreEnTurno+'<br>Tu nivel de '+nombreEnTurnoMinusculas+' es<br> <span style="color:#'+colorEnTurno+'">'+palabraEnTurno+'</span></td><td width="70%">'+textoEnTurno+'</td></tbody></table></div>';
          nombreEnTurno = "GLUCOSA EN AYUNAS";
          nombreEnTurnoMinusculas = "glucosa";
          if(glucosa<100 && glucosa >=70)
          {
            palabraEnTurno="NORMAL";
            colorEnTurno="00A65A";
            textoEnTurno="Un estilo de vida saludable influye en el control de la glucosa en la sangre. Consulta cualquier inquietud sobre tus niveles de glucosa con tu médico.";
          }
          else
          {
            if(glucosa>=100 && glucosa <=125)
            {
              palabraEnTurno="POSIBLE PREDIABETES";
              colorEnTurno="FE9A2E";
              textoEnTurno="Es necesario tomar 2 veces la prueba para confirmar el diagnóstico. Consulta a tu médico, ya que el dispone de formas de calcular tus riesgos y decidirá el tratamiento adecuado.";
            }
            else
            {
              if(glucosa>125)
              {
                palabraEnTurno="POSIBLE DIABETES";
                colorEnTurno="F00";
                textoEnTurno="Es necesario tomar 2 veces la prueba para confirmar el diagnóstico. Consulta a tu médico, ya que el dispone de formas de calcular tus riesgos y decidirá el tratamiento adecuado.";
              } 
            }
          }
          cad = cad + '<div class="bgdiv"><table width="100%" border="0"><tbody><tr style="color: #333 !important;"><td width="30%" style="color: #337AB7!important; font-weight:bold;" align="center">'+nombreEnTurno+'<br>Tu nivel de '+nombreEnTurnoMinusculas+' es<br> <span style="color:#'+colorEnTurno+'">'+palabraEnTurno+'</span></td><td width="70%">'+textoEnTurno+'</td></tbody></table></div>';
          nombreEnTurno = "PRESIÓN ARTERIAL";
          nombreEnTurnoMinusculas = "presión arterial";
          var diagnosticoSegunPresion = 0;
          var diagnosticoSegunPresionHg = 0;
          if(presion<90)
          {
            diagnosticoSegunPresion=0;
          }
          else
          {
            if(presion<120)
            {
              diagnosticoSegunPresion=1;
            }
            else
            {
              if(presion<140)
              {
                diagnosticoSegunPresion=2;
              }
              else
              {
                if(presion<160)
                {
                  diagnosticoSegunPresion=3;
                }
                else
                {
                  if(presion<180)
                  {
                    diagnosticoSegunPresion=4;
                  }
                  else
                  {
                    diagnosticoSegunPresion=5;
                  }
                  
                }
              }
            }  
          }
          if(presionhg<60)
          {
            diagnosticoSegunPresionHg=0;
          }
          else
          {
            if(presionhg<80)
            {
              diagnosticoSegunPresionHg=1;
            }
            else
            {
              if(presionhg<90)
              {
                diagnosticoSegunPresionHg=2;
              }
              else
              {
                if(presionhg<100)
                {
                  diagnosticoSegunPresionHg=3;
                }
                else
                {
                  if(presionhg<110)
                  {
                    diagnosticoSegunPresionHg=4;
                  }
                  else
                  {
                    diagnosticoSegunPresionHg=5;
                  }
                  
                }
              }
            }  
          }
          var finalPresion=diagnosticoSegunPresion;
          if(diagnosticoSegunPresionHg>diagnosticoSegunPresion)
          {
            finalPresion=diagnosticoSegunPresionHg;
          }
          switch(finalPresion)
          {
            case 0:
              palabraEnTurno="BAJA";
              colorEnTurno="C00";
              textoEnTurno="Puedes presentar mareos, trastornos de la concentración, cansancio y problemas de concentración. ¡Consulta a tu médico!, ya que el dispone de formas de calcular tus riesgos y decidirá el tratamiento adecuado.";
            break;
            case 1:
              palabraEnTurno="ÓPTIMA";
              colorEnTurno="F00";
              textoEnTurno="Este es el nivel aconsejable para evitar el riesgo de enfermedades del corazón, riñones y derrames cerebrales.";
            break;
            case 2:
              palabraEnTurno="PREHIPERTENSIÓN";
              colorEnTurno="FE9A2E";
              textoEnTurno="Esto significa que puede desarrollar presión arterial alta, es una alerta para prevenir la hipertensión. Se aconseja realizar cambios en el estilo de vida.";
            break;
            case 3:
              palabraEnTurno="HIPERTENSIÓN GRADO 1";
              colorEnTurno="C00";
              textoEnTurno="Es una forma temprana de presión arterial alta que Representa peligro de daño a órganos como los riñones, el hígado y el corazón. ¡Consulta a tu médico!, el calculará tus riesgos y decidirá el tratamiento adecuado para evitar progresión al grado II.";
            break;
            case 4:
              palabraEnTurno="HIPERTENSIÓN GRADO 2";
              colorEnTurno="F00";
              textoEnTurno="Puede causarte derrames cerebrales, insuficiencia cardiaca, ¡Consulta a tu médico!, el calculará tus riesgos y decidirá el tratamiento adecuado.";
            break;
            case 5:
              palabraEnTurno="HIPERTENSIÓN GRADO 3";
              colorEnTurno="DC3B22";
              textoEnTurno="Es uno de los tres factores de riesgo cardiovascular más importante y es modificable. Puede causarte derrames cerebrales, insuficiencia cardiaca, infarto e insuficiencia renal. ¡Consulta a tu médico!, el calculará tus riesgos y decidirá el tratamiento adecuado.";
            break;
          }
          cad = cad + '<div class="bgdiv"><table width="100%" border="0"><tbody><tr style="color: #333 !important;"><td width="30%" style="color: #337AB7!important; font-weight:bold;" align="center">'+nombreEnTurno+'<br>Tu nivel de '+nombreEnTurnoMinusculas+' es<br> <span style="color:#'+colorEnTurno+'">'+palabraEnTurno+'</span></td><td width="70%">'+textoEnTurno+'</td></tbody></table></div>';
          cad=cad+'</div></div></section>';
          $("#mainContent").html(cad); 
          myMsgSpinner.dialog('close');
        }
      }
    });
});
var cuantosPuntosLlevo, preguntaActual;
function pasaALaSiguientePregunta(habito)
{
  anadeClassAlMainContent("evaluacion"+habito);
  var param = {
      servicio : 'app',
      accion : 'siguientePregunta',
      habito : habito,
      preguntaRequerida : preguntaActual
    };
    $.ajax({
      url: api,
      data : param,
      dataType : "json",
      type : "post",
      async : true,
      beforeSend : function (){
        myMsgSpinner = msgSpinner("Espere un momento...");
      },
      complete : function (){
      }, 
      success : function (resp){
        if(resp.success==2)
        {
          //YA TERMINARON
          var resultado1 = cuantosPuntosLlevo-resp.limite;
          var resultado2 = (resp.limite*5)-resp.limite;
          var resultado3 = parseInt((resultado1/resultado2)*100);
          var imagenACargar = "";
          if(resultado3<61)
          {
            imagenACargar="c1_fMM";
          }
          else
          {
            if(resultado3<71)
            {
              imagenACargar="c1_fM";
            }
            else
            {
              if(resultado3<81)
              {
                imagenACargar="c1_fB";
              }
              else
              {
                if(resultado3<91)
                {
                  imagenACargar="c1_fMB";
                }
                else
                {
                  imagenACargar="c1_fE";
                }
              }
            }
          }
          var cad='<button type="button" habito="'+habito+'" class="btn miCompromiso btn-block btn-success btn-lg">Mi Compromiso</button><img id="imagenLlena" width="100%" height="100%" src="img/'+imagenACargar+'.jpg"/>';
          $("#mainContent").html(cad); 
          myMsgSpinner.dialog('close');
          //$("#messageToChangeMensaje").html("Tu puntuación fue: "+resultado3+".<br><br>");
          //$("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==1)
        {
          myMsgSpinner.dialog('close');          
          var cad='<section class="content"><div class="row"><div style="text-align: center;" class="col-md-12">';
          cad = cad +'<br><br><h2>'+preguntaActual+'. '+resp.pregunta+'</h2><br><br></div><div class="col-md-6"><img style="left:20%;width:80%;" src="img/c'+habito+'_'+preguntaActual+'.png"/></div>';
          cad=cad+'<div class="col-md-6">';
          var puntosNo = 5;
          var puntosRara = 4;
          var puntosAveces = 3;
          var puntosFrecuentemente = 2;
          var puntosSi = 1;
          if(resp.ascendente==1)
          {
            puntosNo = 1;
            puntosRara = 2;
            puntosAveces = 3;
            puntosFrecuentemente = 4;
            puntosSi = 5;
          }
          cad=cad+'<br><button type="button" puntos="'+puntosNo+'" habito="'+habito+'" class="siguientePregunta btn btn-block btn-success btn-lg">No / nunca</button>';
          cad=cad+'<br><button type="button" puntos="'+puntosRara+'" habito="'+habito+'" class="siguientePregunta btn btn-block btn-primary btn-lg">Rara vez</button>';
          cad=cad+'<br><button type="button" puntos="'+puntosAveces+'" habito="'+habito+'" class="siguientePregunta btn btn-block btn-info btn-lg">A veces</button>';
          cad=cad+'<br><button type="button" puntos="'+puntosFrecuentemente+'" habito="'+habito+'" class="siguientePregunta btn btn-block btn-danger btn-lg">Frecuentemente</button>';
          cad=cad+'<br><button type="button" puntos="'+puntosSi+'" habito="'+habito+'" class="siguientePregunta btn btn-block btn-warning btn-lg">Si / siempre</button>';
          cad = cad +'</div></div></section>';
          $("#mainContent").html(cad); 
          preguntaActual++;
        }
      }
    });
}


$(document).on("click",".siguientePregunta", function () {
  var habito = $(this).attr("habito");
  var puntos = parseInt($(this).attr("puntos"));
  cuantosPuntosLlevo+=puntos;
  pasaALaSiguientePregunta(habito);
});
$(document).on("click","#realizaCuestionario", function () {
  var habito = $(this).attr("habito");
  pasaALaSiguientePregunta(habito);
});
$(document).on("click",".cuestionario", function () {
  cuantosPuntosLlevo=0;
  preguntaActual=1;
  var habito = $(this).attr("habito");
  var cad='<button type="button" habito="'+habito+'" id="realizaCuestionario" class="btn btn-block btn-success btn-lg">Realizar cuestionario</button><img id="imagenLlena" width="100%" height="100%" src="img/cuestionario'+habito+'.jpg"/>';
  var style='';
   //cad = cad + '<button type="button" habito="'+habito+'" id="realizaCuestionario" class="btn btn-block btn-success btn-lg">Realizar cuestionario</button>';
  $("#mainContent").html(cad); 
  //var imgClass = ($('#imagenLlena').width/$('#imagenLlena').height > 1) ? 'wide' : 'tall';
  //$("#imagenLlena").addClass(imgClass);

 
});
$(document).on("click","#miIMC", function () {
  var param = {
      servicio : 'app',
      accion : 'diagnosticoIMCWeb'
    };
    $.ajax({
      url: api,
      data : param,
      dataType : "json",
      type : "post",
      async : true,
      beforeSend : function (){
        myMsgSpinner = msgSpinner("Espere un momento...");
      },
      complete : function (){
      }, 
      success : function (resp){
        if(resp.success==2)
        {
          $("#messageToChangeMensaje").html("Primero tienes que llenar tus datos de peso, talla y cintura.<br><br>");
          $("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==1)
        {
          myMsgSpinner.dialog('close');
        
            var gender = "welcomeFemale";//hombres background!
            var cintura = resp.cintura;
            var cinturaRiesgo="";
            var cinturaColor="";
           


            var indicador1 = 90;
            var indicador2 = 102;

            if(resp.gender!="male")
            {
              gender = "welcomeMale";//mujeres background!
              indicador1 = 80;
              indicador2 = 88;
            }
            if(cintura<indicador1)
            {
              cinturaRiesgo="RIESGO BAJO";
              cinturaColor="FF0";
            }
            else
            {
              if(cintura<indicador2)
              {
                cinturaRiesgo="RIESGO MODERADO";
                cinturaColor="FE9A2E";
              }
              else
              {
                cinturaRiesgo="RIESGO ALTO";
                cinturaColor="F00";
              }
            }
            anadeClassAlMainContent(gender);
            var cm = parseInt(resp.cm)/100;
            var kg = resp.kg;
            var cuadrado = cm*cm;
            var imc = kg/cuadrado;
            var cad = '<section class="content"><div style="color: #FFF !important;" class="row"><div class="col-md-12">Hola  nosticos </div><div class="col-md-9 marcoizq">';
            var palabra = "";
            var riesgos = "";
            var color = "";
            var enfermedadesAdicionales="";
            imc = Math.round(imc * 100) / 100
            if(imc<18.5)
            {
              palabra = "BAJO PESO";
              riesgos = "RIESGOS";
              color = "F00";
            }
            else
            {
              if(imc<25)
              {
                palabra = "PESO NORMAL";
                riesgos = "RIESGO BAJO";
                color = "00A65A";
              }
              else
              {
                if(imc<30)
                {
                  palabra = "SOBREPESO";
                  riesgos = "RIESGO MODERADO";
                  color = "FF0";
                }
                else
                {
                  if(imc<35)
                  {
                    palabra = "OBESO";
                    riesgos = "RIESGO ALTO";
                    color = "FE9A2E";
                  }
                  else
                  {
                    if(imc<40)
                    {
                      palabra = "OBESO SEVERO";
                      riesgos = "RIESGO MUY ALTO";
                      color = "F00";
                    }
                    else
                    {
                      palabra = "OBESO MORBIDO";
                      riesgos = "RIESGO MUY ALTO";
                      color = "F00";
                    } 
                  }   
                }
                
              }
            }

            cad=cad+'Tu IMC (Índice de Masa Corporal) es: '+imc+'<br> De acuerdo a tu IMC entras en el rango de: <span style="color:#'+color+'">'+palabra+'</span>\
            <div>De acuerdo a esto tienes <span style="color:#'+color+'">'+riesgos+'</span> de sufrir alguna o más de una de las siguientes enfermedades:\
<ul>\
<li>Trastornos del sistema inmunológico (Las defensas de tu cuerpo)</li>\
<li>Pérdida de masa ósea</li>\
<li>Anemia por deficiencia de hierro</li>\
<li>Problemas cardíacos</li>\
<li>Mayor riesgo de sufrir infecciones</li>\
<li>Problemas de fertilidad</li>\
<li>Mayor riesgo de sufrir osteoporosis</li>\
<li>Desarrollar demencia</li>\
'+enfermedadesAdicionales+'\
<li>Ausencia de período menstrual en mujeres (Amenorrea)</li></ul></div>';
           
            cad = cad + '</div><div class="col-md-3 marcoder">';

cad = cad + '<div>Tu perímetro abdominal es: '+cintura+'<br>\
De acuerdo a ello tienes un: <span style="color:#'+cinturaColor+'">'+cinturaRiesgo+'</span> de padecer afecciones relacionadas con la obesidad como:\
<ul>\
<li>Diabetes </li>\
<li>Presión arterial alta (hipertensión) </li>\
<li>Osteoartritis </li>\
<li>Insuficiencia cardíaca </li>\
<li>Algunos tipos de cáncer </li>\
<li>Problemas para respirar durante el sueño </li>\
<li>Ataques cardíacos debido a cardiopatía </li>\
<li>Derrame cerebral</li>\
<li>Cálculos biliares y problemas del hígado   </li>\
<li>Problemas óseos y articulares  </li>\
<li>Disfunción de la vesícula</li>\
<li>Estrés </li>\
<li>Ansiedad </li>\
<li>Depresión</li>\
<li>Niveles altos de colesterol y triglicéridos en la sangre</li>\
<li>Niveles bajos de HDL (Colesterol bueno)</li>\
<li>Niveles altos de LDL (Colesterol malo)</li>\
<li>Síndrome metabólico</li>\
<li>Varices</li>\
<li>Infartos al corazón</li>\
<li>Gastritis</li>\
<li>Reflujo gastroesofágico</li>\
<li>Alteraciones menstruales en las mujeres</li>\
<li>Infertilidad </li>\
</ul>\
</div>';
            cad=cad+'</div></div></section>';
            $("#mainContent").html(cad);
         
        }
      }
    });
});
$(document).on("click","#historialDeMisDatos", function () {
  var param = {
      servicio : 'app',
      accion : 'historialDeMisDatos'
    };
    $.ajax({
      url: api,
      data : param,
      dataType : "json",
      type : "post",
      async : true,
      beforeSend : function (){
        myMsgSpinner = msgSpinner("Espere un momento...");
      },
      complete : function (){
      }, 
      success : function (resp){
        if(resp.success==1)
        {
          myMsgSpinner.dialog('close');
          if(resp.datos.length>0)
          {
            var gender = "welcomeFemale";//hombres background!
            if(resp.datos[0].gender!="male")
            {
              gender = "welcomeMale";//muejeres background!
            }
            anadeClassAlMainContent(gender);
            var cad = '<section class="content"><div style="color: #FFF !important;" class="row"><div class="col-md-12"><div class="box-header"><h3 class="box-title">Historial de mis registros</h3></div><div class="box-body table-responsive no-padding"><table class="table table-hover"><tbody><tr><th>Peso</th><th>Talla</th><th>Cintura</th><th>Presión arterial</th><th>Glucosa</th><th>Colesterol</th><th>Colesterol LDL</th><th>Colesterol HDL</th><th>Triglicéridos</th><th>Fecha de registro</th></tr>';
            var i = 0;
            for(i=0;i<resp.datos.length;i++)
            {
              cad=cad+'<tr><td>'+resp.datos[i].kg+' kg</td><td>'+resp.datos[i].cm+' cm</td><td>'+resp.datos[i].cintura+' cm</td><td>'+resp.datos[i].presion+'/'+resp.datos[i].presionhg+' mmHg</td><td>'+resp.datos[i].glucosa+' mg/dl</td><td>'+resp.datos[i].colesterol+' mg/dl</td><td>'+resp.datos[i].ldl+' mg/dl</td><td>'+resp.datos[i].hdl+' mg/dl</td><td>'+resp.datos[i].trigliceridos+' mg/dl</td><td>'+timeConverter(parseInt(resp.datos[i].timestamp))+' </td></tr>';
            }
            cad = cad + '</tbody></table></div></div></section>';
            $("#mainContent").html(cad);
          }
          else
          {
            $("#messageToChangeMensaje").html("Primero tienes que llenar tus datos de peso, talla y cintura.<br><br>");
            $("#dialog_Mensaje").dialog("open");
          }
        }
      }
    });
});
$(document).on("click","#guardarMisDatos", function () {
  if(!validateText("peso")){return;}
  if(!validateText("talla")){return;}
  if(!validateText("cintura")){return;}
    var param = {
      servicio : 'app',
      accion : 'saveIMCWeb',
      peso : $("#peso").val().trim(),
      talla : $("#talla").val().trim(),
      cintura : $("#cintura").val().trim(),
      presion : $("#presion").val().trim(),
      glucosa : $("#glucosa").val().trim(),
      colesterol : $("#colesterol").val().trim(),
      trigliceridos : $("#trigliceridos").val().trim(),
      presionhg : $("#presionhg").val().trim(),
      ldl : $("#ldl").val().trim(),
      hdl : $("#hdl").val().trim(),
    };
    $.ajax({
      url: api,
      data : param,
      dataType : "json",
      type : "post",
      async : true,
      beforeSend : function (){
    //    myMsgSpinner = msgSpinner("Guardando tus datos...");
      },
      complete : function (){
      }, 
      success : function (resp){
        if(resp.success==1)
        {
      //    myMsgSpinner.dialog('close');
        //  $("#messageToChangeMensaje").html("Tus datos fueron guardados, por favor pasa a.<br><br>");
          //$("#dialog_Mensaje").dialog("open");
          var cad='<div id="wrpCircleAnim">\
                      <div class="cajaCircle rotate" data-anim="">\
                      </div>\
                      <div class="dinamicCircle">\
                      </div>\
                      <div class="dinamicCircle invisible-roulette">\
                      </div>\
                  </div>';
          $("#imcDinamico").html(cad);
           var wrpCircle = $('#wrpCircleAnim');
                var boxCircle = wrpCircle.find('.cajaCircle');
                //var imcAnim = boxCircle.data('anim'),
                var centros = wrpCircle.find('.dinamicCircle');
          var peso = parseInt($("#peso").val().trim());
          var talla = parseInt($("#talla").val().trim())/100;
          var imc = peso/(talla*talla);
          var imcAnim="";
           if(imc<18.5)
            {
              imcAnim="bajo_peso";
            }
            else
            {
              if(imc<25)
              {
                imcAnim="normal";
              }
              else
              {
                if(imc<30)
                {
                  imcAnim="sobrepeso";
                }
                else
                {
                  if(imc<35)
                  {
                    imcAnim="obesidad_grado_i";
                  }
                  else
                  {
                    if(imc<40)
                    {
                      imcAnim="obesidad_grado_ii";
                    }
                    else
                    {
                      imcAnim="obesidad_grado_iii";
                    } 
                  }   
                }
                
              }
            }




            
            //if( imcAnim !== "" ) {
                animRoulette( boxCircle, imcAnim );
                centros.eq(0).fadeOut(1900);
                centros.eq(1).addClass( imcAnim ).fadeIn( 2500 );
            //}
        }
      }
    });
});
       function updateRouletteRotation( elem, deg ){
                elem.css({
                    'transform': 'rotate('+ deg + 'deg)',
                    '-moz-transform': 'rotate(' + deg + 'deg )',
                    '-ms-transform': 'rotate(' + deg + 'deg )',
                    '-webkit-transform': 'rotate(' + deg + 'deg )',
                    '-o-transform': 'rotate(' + deg + 'deg )'
                })
        }

        function animRoulette( elem, imcAnim ){
            if( Modernizr.csstransitions ){
                elem.addClass( imcAnim );
            }else{
                var deg = 0;
                switch( imcAnim ) {
                    case 'normal':
                        deg = -720;
                        break;
                    case 'bajo_peso':
                        deg = -780;
                        break;
                    case 'obesidad_grado_iii':
                        deg = -840;
                        break;
                    case 'obesidad_grado_ii':
                        deg = -900;
                        break;
                    case 'obesidad_grado_i':
                        deg = -960;
                        break;
                    case 'sobrepeso':
                        deg = -1020;
                        break;

                }

                $({deg: 0}).animate({deg: deg }, {
                    duration: 1900,
                    step: function(now) {
                        updateRouletteRotation(elem, now);
                    },
                    done:function(){
                    }
                });
            }
        }
$(document).on("click","#misDatos", function () {
    anadeClassAlMainContent("misDatos");
    var cad = '<div class="row"><div id="imcDinamico" class="col-md-6"></div><div class="col-md-6"><h3>MI INSCRIPCIÓN</h3>\
    <br><br>\
    <label>Por favor, proporciona la siguiente información</label><br>\
    <label for="peso">Peso:</label>\
    <input class="soloNumeros" type="number" id="peso"/>kg\
    <br>\
    <label for="talla">Talla:</label>\
    <input class="soloNumeros" type="number" id="talla"/>cms\
    <br>\
    <label>(Recuerde ingresar la estatura de su cuerpo en centímetros. De este modo si mide 1.70 metros, escriba 170)</label>\
    <br>\
    <label for="cintura">Cintura:</label>\
    <input class="soloNumeros" type="number" id="cintura"/>cms (Ingrese su perímetro de Cintura)\
    <br>\
    <label>Si lo conseguiste, proporciona la siguiente información OPCIONAL:</label>\
    <br>\
    <label for="presion">Presion arterial:</label>\
    <input class="soloNumeros" type="number" id="presion"/>/<input class="soloNumeros" type="number" id="presionhg"/>mm/Hg\
    <br>\
    <label for="glucosa">Glucosa:</label>\
    <input class="soloNumeros" type="number" id="glucosa"/>mg/dl\
    <br>\
    <label for="colesterol">Colesterol total:</label>\
    <input class="soloNumeros" type="number" id="colesterol"/>mg/dl\
    <br>\
    <label for="ldl">Colesterol LDL: (malo)</label>\
    <input class="soloNumeros" type="number" id="ldl"/>mg/dl\
    <br>\
    <label for="hdl">Colesterol HDL: (bueno)</label>\
    <input class="soloNumeros" type="number" id="hdl"/>mg/dl\
    <br>\
    <table width="100%"><tbody><tr><td>\
    <label for="trigliceridos">Triglicéridos</label>\
    <input class="soloNumeros" type="number" id="trigliceridos"/>mg/dl\
    </td>\
    <td>\
    <button type="button" class="btn btn-block btn-success btn-lg" id="guardarMisDatos">Guardar</button>\
    </td></tr></tbody></table>\
    <br><br>\
    </div></div>';
    $("#mainContent").html(cad);
    
});     
$(document).on("click","#slideCaractarerizticas", function () {
var cad = '<ul class="bxslider">\
  <li><img src="img/slider/1.jpg" /></li>\
  <li><img src="img/slider/2.jpg" /></li>\
  <li><img src="img/slider/3.jpg" /></li>\
  <li><img src="img/slider/4.jpg" /></li>\
  <li><img src="img/slider/5.jpg" /></li>\
  <li><img src="img/slider/6.jpg" /></li>\
  <li><img src="img/slider/7.jpg" /></li>\
  <li><img src="img/slider/8.jpg" /></li>\
  <li><img src="img/slider/9.jpg" /></li>\
</ul>';
    $("#mainContent").html(cad);
    $('.bxslider').bxSlider({
      auto: true,
      autoControls: true
    });
});    
$(document).on("click",".comenzemosButton", function () {
	var nombre = $("#nombre").html().trim();
	var cad = ' <section>\
        <div class="txtH4 colorBlack titleWelcome">¡Bienvenido!'+nombre+'</div>\
            <div class="txtH4 colorGray titleWelcome">\
              <p>ya estoy en ottro contenido,<br>hacia la Plenitud!</p>\
            </div>\
            <div>\
            </div>\
    </section>';
	$("#mainContent").html(cad);
});