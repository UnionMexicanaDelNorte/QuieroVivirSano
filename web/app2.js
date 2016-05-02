//on ready hardcode
var api ="http://quierovivirsano.org/app/qvs.php"
//var api ="http://localhost/app/qvs.php"
myMsgSpinner = msgSpinner("Por favor, espere..");
 $('.tooltip').tooltipster();
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
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
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
function subeDeNivel (nivel) {
  var param = {
      servicio : 'app',
      accion : 'subeDeNivel',
      nivel : nivel
    };
    $.ajax({
      url: api,
      data : param,
      dataType : "json",
      type : "post",
      async : true,
      beforeSend : function (){
       },
      complete : function (){
      }, 
      success : function (resp){
        if(resp.success==1)
        {
          cargaHabitoDiaConsecutivo(-1,-1);
        }
      }
    });
}
// {
$(document).on("click",".verLaActiviDadDelDia", function() {
  var habito = parseInt($(this).attr("habito"));
  var dia = parseInt($(this).attr("dia"));
  var param2 = {
    servicio : 'app',
    accion : 'cargaHabitoDiaConsecutivo',
    habito : habito,
    diaConsecutivo : dia
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
        ponDescripcion(resp2.tituloArticulo,resp2.link,resp2.kg,resp2.primerasPalabras,habito,dia);
      }
    }
  });
});
  
function terminarActividadConParametros(timestampDeInicio,habito,dia,valor)
{
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
          if(!(habito==1 && dia==1))
          {
            $("#messageToChangeMensaje").html("Ya haz contestado la actividad de este día.<br><br>");
            $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");  
          }
        }
        if(resp.success==2)
        {
          myMsgSpinner.dialog('close');
          $("#messageToChangeMensaje").html("Debes de esperar un día para realizar la siguiente actividad, se detecto que realizaste una actividad el dia "+resp.fecha+"<br><br>");
          $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==1)
        {
          myMsgSpinner.dialog('close');
         // $("#messageToChangeMensaje").html("¡Felicidades! Te esperamos mañana con la siguiente actividad.<br><br>");
         // $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
          //cargaHabitoDiaConsecutivo(-1,-1);
          var habitoPrimo2=parseInt(habito);
          var diaPrimo2=parseInt(dia);
          if(diaPrimo2<7)
          {
            diaPrimo2++;
          }
          else
          {
            if(habitoPrimo2<8)
            {
              habitoPrimo2++;
              diaPrimo2=7;
            }
          }

          var param2 = {
                servicio : 'app',
                accion : 'cargaHabitoDiaConsecutivo',
                habito : habitoPrimo2,
                diaConsecutivo : diaPrimo2
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
                   /* var habitoPrimo = parseInt(habitoPrimo2);
                    var diaPrimo = parseInt(diaPrimo2);
                    var deboDeMostrarCustionario=true;
                    if(diaPrimo>1)
                    {
                      diaPrimo--;
                    }
                    else
                    {
                      if(habitoPrimo>1)
                      {
                        habitoPrimo--;
                        diaPrimo=7;
                      }
                      else
                      {
                        deboDeMostrarCustionario=false;
                      }
                    }
                    if(deboDeMostrarCustionario)
                    {
                      muestraCuestionario(siPrima,habitoPrimo,diaPrimo,resp2.maximo,resp.timestampDeInicio);  
                    }
                    else
                    {*/
                      ponDescripcion(resp2.tituloArticulo,resp2.link,resp2.kg,resp2.primerasPalabras,habitoPrimo2,diaPrimo2);
                    //}
                  }
                }
              });
        }
      }
    });
}
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
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
    return;
  }
   terminarActividadConParametros(timestampDeInicio,habito,dia,valor);
});

function toRadians (angle) {
  return angle * (Math.PI / 180);
}
function calculaAguja(maximo,total)
{
  var topBase=110; //160
  var porcentaje = parseFloat((total*100)/maximo);//7
  var grados = parseFloat((porcentaje*180)/100);//12
  var diferenciaEnTop = 30;
  var senoTop = Math.sin(toRadians(grados));//0.20
  //console.log("seno: "+senoTop);
  var loQueVoyAMoverTop = senoTop*diferenciaEnTop;
  //console.log("mover: "+loQueVoyAMoverTop);
  var topNuevo = topBase-loQueVoyAMoverTop;
  var leftBase =286;// 145 vamos a disminuirlo!
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
// {
  
function cambiaFraseFunction()
{
 var param = {
      servicio : 'app',
      accion : 'obtenFraseAleatoria'
    };
    $.ajax({
      url: api,
      data : param,
      dataType : "json",
      type : "post",
      async : true,
      beforeSend : function (){
      },
      complete : function (){
      }, 
      success : function (resp){
        if(resp.success==1)
        {
          $("#cambiaFrase").html(resp.frase);
        }
      }
    });
}
cambiaFraseFunction();
$(document).on("click",".desempenoSemanal", function () {
  var habito = parseInt($(this).attr("habito"));
  var elemento =$('.desempenoSemanal[habito="'+habito+'"] i').first();
  if($(elemento).hasClass("fa-lock"))
  {
    $("#messageToChangeMensaje").html("Para realizar esta actividad tienes que realizar la anterior.");
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
    return;
  }
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

          var cad = '<section class="row" style="position: fixed;">\
                  <div class="col-md-12">\
                    <div class="col-md-6 col-md-10 FlamaSemicondensedBasic size20 colorAzulMarino">\
                    MI DESEMPEÑO <span class="FlamaSemicondensedBold colorAzulMarino">SEMANA '+habito+'</span>\
                    </div>\
                    <div class="col-md-6 ">\
                    </div>\
                  </div>\
                   <div class="col-md-12">\
                    <div class="col-md-5" style="margin-top 3%">\
                    <div class="fondoDesempeno" style="width: 456px; height: 534px; padding-left: 90px; transform:  rotate(-2deg);">';
            cad=cad+'<div>';
            cad=cad+'<div style="float:left;" id="contenedorHabitos">';
              cad=cad+'<div style="padding-top: 90px;" class="row"><div class="col-md-1"><div style="float:left;height:50px;width:50px;" id="habito1"></div></div><div class="col-md-5"> '+sieteMonos1+'  </div></div>';
              cad=cad+'<div style="width: 700px;" class="row"><div class="col-md-1"><div style="float:left;height:50px;width:50px;" id="habito2"></div></div><div class="col-md-5"> '+sieteMonos2+'  </div></div>';
              cad=cad+'<div style="width: 700px;" class="row"><div class="col-md-1"><div style="float:left;height:50px;width:50px;" id="habito3"></div></div><div class="col-md-5"> '+sieteMonos3+'  </div></div>';
              cad=cad+'<div style="width: 700px;" class="row"><div class="col-md-1"><div style="float:left;height:50px;width:50px;" id="habito4"></div></div><div class="col-md-5"> '+sieteMonos4+'  </div></div>';
              cad=cad+'<div style="width: 700px;" class="row"><div class="col-md-1"><div style="float:left;height:50px;width:50px;" id="habito5"></div></div><div class="col-md-5"> '+sieteMonos5+'  </div></div>';
              cad=cad+'<div style="width: 700px;" class="row"><div class="col-md-1"><div style="float:left;height:50px;width:50px;" id="habito6"></div></div><div class="col-md-5"> '+sieteMonos6+'  </div></div>';
              cad=cad+'<div style="width: 700px;" class="row"><div class="col-md-1"><div style="float:left;height:50px;width:50px;" id="habito7"></div></div><div class="col-md-5"> '+sieteMonos7+'  </div></div>';
              cad=cad+'<div style="width: 700px;" class="row"><div class="col-md-1"><div style="float:left;height:50px;width:50px;" id="habito8"></div></div><div class="col-md-5"> '+sieteMonos8+'  </div></div>';
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
          cad=cad+'</div>\
                    </div>\
                    <div class="col-md-7" style="text-align: center">\
                      <div  style="padding-top: 5px;">\
                        <div id="contenedorProgreso" style="text-align: center">\
                          <img src="img/porcentajeProgresoArco.png" width="300px" height="140px"/>\
                          <img src="img/agujaPorcentajeProgreso.png" id="aguja" style="position:absolute;top:50%;left:0" width="90px" height="35px"/>\
                          </div>\
                      </div>\
                      <div class="margenTop5 FlamaSemicondensedMedium size14">\
                        PORCENTAJE DE PROGRESO DEL HÁBITO BEBER AGUA NATURAL\
                      </div>\
                      <div class="outsideWrapper">\
                          <div class="insideWrapper">\
                              <img src="img/diasRealizadosGrafica.png" class="coveredImage">\
                              <canvas id="myChart" width="400" height="400" class="coveringCanvas"></canvas>\
                          </div>\
                      </div>\
                       <div class="margenTop5">\
                        <span class="FlamaSemicondensedMedium size18">DÍAS REALIZADOS:</span><span class="size20 colorAzulMarino">1 DÍA</span><br>\
                        <span class="FlamaSemicondensedMedium size18">OBJETIVO SEMANAL:</span><span class="size20 colorAzulMarino"> 7 DÍAS</span>\
                      </div>\
                    </div>\
                  </div>\
                  </div>\
            </section>';    
           /* cad=cad+'</div>\
                    </div>\
                    <div class="col-md-7" style="text-align: center">\
                      <div  style="padding-top: 5px;">\
                        <div id="contenedorProgreso" style="text-align: center">\
                          <img src="img/porcentajeProgresoArco.png" width="300px" height="140px"/>\
                          <img src="img/agujaPorcentajeProgreso.png" id="aguja" style="position:absolute;top:50%;left:0" width="90px" height="35px"/>\
                          </div>\
                      </div>\
                      <div class="margenTop5 FlamaSemicondensedMedium size14">\
                        PORCENTAJE DE PROGRESO DEL HÁBITO BEBER AGUA NATURAL\
                      </div>\
                      <div  style="margin-top: 5%;">\
                         <img src="img/diasRealizadosGrafica.png" style="width: 250px">\
                      </div>\
                       <div class="margenTop5">\
                        <span class="FlamaSemicondensedMedium size18">DÍAS REALIZADOS:</span><span class="size20 colorAzulMarino">1 DÍA</span><br>\
                        <span class="FlamaSemicondensedMedium size18">OBJETIVO SEMANAL:</span><span class="size20 colorAzulMarino"> 7 DÍAS</span>\
                      </div>\
                    </div>\
                  </div>\
                  </div>\
            </section>';*/
          $("#mainContent").html(cad);
           // {
            var sinLLenar = "#e7e7e8",
    lleno = "#bcbdc0",
    orange = "#d08770",
    yellow = "#ebcb8b",
    green = "#a3be8c",
    teal = "#96b5b4",
    pale_blue = "#8fa1b3",
    purple = "#b48ead",
    brown = "#ab7967";
    var data = [],
    barsCount = 50,
    labels = new Array(barsCount),
    updateDelayMax = 500,
    $id = function(id){
      return document.getElementById(id);
    },
    random = function(max){ return Math.round(Math.random()*100)},
    helpers = Chart.helpers;
var canvas = document.getElementById('myChart'),
      colours = {
        "sinLLenar": sinLLenar,
        "lleno": lleno
      };
      var siLoHizoONo = ["sinLLenar","sinLLenar","sinLLenar","sinLLenar","sinLLenar","sinLLenar","sinLLenar"];
      for(i=0;i<resp.todo.length;i++)
      {
        var d = resp.todo[i].diaConsecutivo-1;
        siLoHizoONo[d]="lleno";
      }
    var moduleData = [
    
      {
        value: 14.2857142857,
        color: colours[siLoHizoONo[0]],
        //highlight: Colour(colours["Core"], 10),
        label: "Día 1"
      },
      {
        value: 14.2857142857,
        color: colours[siLoHizoONo[1]],
       // highlight: Colour(colours["Core"], 10),
        label: "Día 2"
      },
      {
        value: 14.2857142857,
        color: colours[siLoHizoONo[2]],
        //highlight: Colour(colours["Core"], 10),
        label: "Día 3"
      },
      {
        value: 14.2857142857,
        color: colours[siLoHizoONo[3]],
        //highlight: Colour(colours["Core"], 10),
        label: "Día 4"
      },
      {
        value: 14.2857142857,
        color: colours[siLoHizoONo[4]],
        //highlight: Colour(colours["Core"], 10),
        label: "Día 5"
      },
      {
        value: 14.2857142857,
        color: colours[siLoHizoONo[5]],
        //highlight: Colour(colours["Core"], 10),
        label: "Día 6"
      },
      {
        value: 14.2857142857,
        color: colours[siLoHizoONo[6]],
        //highlight: Colour(colours["Core"], 10),
        label: "Día 7"
      }
    
    ];
    // 
    var moduleDoughnut = new Chart(canvas.getContext('2d')).Doughnut(moduleData, { tooltipTemplate : "<%if (label){%><%=label%> <%}%>", animation: false, percentageInnerCutout : 90 ,   showTooltips: true});
    // 
    var legendHolder = document.createElement('div');
    legendHolder.innerHTML = moduleDoughnut.generateLegend();
    // Include a html legend template after the module doughnut itself
    helpers.each(legendHolder.firstChild.childNodes, function(legendNode, index){
      helpers.addEvent(legendNode, 'mouseover', function(){
        var activeSegment = moduleDoughnut.segments[index];
        activeSegment.save();
        activeSegment.fillColor = activeSegment.highlightColor;
        moduleDoughnut.showTooltip([activeSegment]);
        activeSegment.restore();
      });
    });
    helpers.addEvent(legendHolder.firstChild, 'mouseout', function(){
      moduleDoughnut.draw();
    });
    canvas.parentNode.parentNode.appendChild(legendHolder.firstChild);
    $(".doughnut-legend").css("display","none");



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
// {
function muestraCuestionario(si,habito,dia,maximo,timestamp)
{
var preguntas="",respuestaOpc="",tituloGeneralHabito="";
var vaFrase = true;
  switch(habito)
  {
    case 1:
      tituloGeneralHabito="BEBER AGUA NATURAL";
      switch(dia)
      {
        case 1:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>';
          respuestaOpc='<input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 10px 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 10px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/>';
        break;
        case 2:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>';
          respuestaOpc='<input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 10px 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 10px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="margin: 10px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio"  value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="margin: 10px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/>';
        break;
        case 3:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>';
          respuestaOpc='<input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 10px 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 10px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="margin: 10px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio"  value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="margin: 10px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="margin: 10px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="margin: 10px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/>';
        break;
        case 4:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>'
          respuestaOpc='<input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 10px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 10px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="margin: 10px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio"  value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="margin: 10px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="margin: 10px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="margin: 10px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">4.- Tomé dos vasos de agua natural 30 minutos antes de la cena.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_4"/><img style="margin: 10px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_4"/><img style="margin: 10px 30px;"   class="negativos" src="img/negativo'+habito+'.png"/>';
        break;
        case 5:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>'
          respuestaOpc='<input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 10px 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 10px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="margin: 10px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio"  value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="margin: 10px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="margin: 10px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="margin: 10px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">4.- Tomé dos vasos de agua natural 30 minutos antes de la cena.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_4"/><img style="margin: 10px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_4"/><img style="margin: 10px 30px;"   class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">5.- Tomé dos vasos de agua natural dos horas antes de dormir</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_5"/><img style="margin: 10px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_5"/><img style="margin: 10px 30px;"   class="negativos" src="img/negativo'+habito+'.png"/>';
        break;
        case 6:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>'
          respuestaOpc='<input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 5px 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 5px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="margin: 5px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio"  value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="margin: 5px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="margin: 5px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="margin: 5px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">4.- Tomé dos vasos de agua natural 30 minutos antes de la cena.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_4"/><img style="margin: 5px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_4"/><img style="margin: 5px 30px;"   class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">5.- Tomé dos vasos de agua natural dos horas antes de dormir</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_5"/><img style="margin: 5px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_5"/><img style="margin: 5px 30px;"   class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">6.- Tomé agua natural mientras realicé ejercicio físico.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_6"/><img style="margin: 5px 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_6"/><img style="margin: 5px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>';
        break;
        case 7:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>'
          respuestaOpc='<input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 5px 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="margin: 5px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="margin: 5px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio"  value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="margin: 5px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="margin: 5px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="margin: 8px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">4.- Tomé dos vasos de agua natural 30 minutos antes de la cena.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_4"/><img style="margin: 5px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_4"/><img style="margin: 5px 30px;"   class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">5.- Tomé dos vasos de agua natural dos horas antes de dormir</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_5"/><img style="margin: 5px 30px;"  class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_5"/><img style="margin: 5px 30px;"   class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">6.- Tomé agua natural mientras realicé ejercicio físico.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_6"/><img style="margin: 5px 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_6"/><img style="margin: 5px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">7.- No reemplacé el Agua Natural por refresco o jugo</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_7"/><img style="margin: 5px 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_7"/><img style="margin: 5px 30px;"  class="negativos" src="img/negativo'+habito+'.png"/>';
        break;
      }
    break;
  }

  anadeClassAlMainContent("actividad1");

  var cad = '<section class="row" style="position: fixed;">\
                  <div class="col-md-12">\
                    <div class="col-md-5 ">\
                    </div>\
                    <div class="col-md-7" style="margin-top: 2%;">\
                    <div class="col-md-2">\
                      <img id="habitoIcono" src="img/IconoHabito'+habito+'.png" style=" text-align: right;">\
                    </div>\
                    <div class="col-md-10 MonserratRegular size24">'+tituloGeneralHabito+'</div>\
                    </div>\
                  </div>\
                   <div class="col-md-12">\
                    <div class="col-md-5 ">\
                    </div>\
                    <div class="col-md-7">\
                    <div class="FlamaSemiBold size20" style="padding-top: 5px; color:#003c71;">CUESTIONARIO '+dia+'</div>\
                    </div>\
                  </div>\
                  <div class="col-md-12">\
                    <div class="col-md-5">\
                      <div>';
  if(vaFrase)
  {
    cad=cad+'<img id="cuadro" src="img/cuadro'+habito+'_'+dia+'.jpg" style="padding-left: 10%; transform: rotate(-3deg);"/>';  
  }
  cad=cad+'</div><div class="margenTop10 size12" style="padding-left: 12%; padding-right: 12%;"><div>';
  if(si==1)
  {
    cad=cad+'<button timestamp="'+timestamp+'" type="button" dia="'+dia+'" maximo="'+maximo+'" habito="'+habito+'" class="btn btn-block btn-success btn-lg terminarActividad size18">CONTESTAR ACTIVIDAD DEL DÍA '+dia+'</button>';
  }
  else
  {
    var habitoPrimo = parseInt(habito);
    var diaPrimo = parseInt(dia);
    if(diaPrimo<7)
    {
      diaPrimo++;
    }
    else
    {
      if(habitoPrimo<8)
      {
        habitoPrimo++;
        diaPrimo=1;
      }
    }
    cad=cad+'<button timestamp="'+timestamp+'" type="button" dia="'+diaPrimo+'" habito="'+habitoPrimo+'" class="btn btn-block btn-success btn-lg verLaActiviDadDelDia size18">VER ACTIVIDAD DEL DÍA '+diaPrimo+'</button>';
  }
  cad=cad+'</div><div class="margenTop5">\
                          <button type="button" habito="'+habito+'" class="btn btn-block btn-primary btn-lg desempenoSemanal size18">VER MI DESEMPEÑO SEMANAL</button>\
                        </div>\
                    </div>\
                    </div>\
                    <div class="col-md-7">\
                      <div class="FlamaSemicondensedBasic size12" style="color:#000;">'+preguntas+'</div>\
                      <div class="FlamaSemicondensedBasic size12" style="color:#000;">'+respuestaOpc+'</div>\
                    </div>\
                  </div>\
            </section>';
  if(si==0)
  {
    $('input[type="radio"]').remove();
  }
  
  $("#mainContent").html(cad); 
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  var octavo = myHeight*0.125;
  $("#habitoIcono").css("height",octavo+"px"); 
  var size18 = myHeight*0.0287081339713;
  $(".size18").css("font-size",size18+"px");   
  var size12 = myHeight*0.0255183413078;
  $(".size12").css("font-size",size12+"px");   
  var size20 = myHeight*0.0382775119617;
  $(".size20").css("font-size",size20+"px");   
  var size24 = myHeight*0.0478468899522;
  $(".size24").css("font-size",size24+"px");  
  var wgotita = myWidth*0.0211598746082; 
  var hgotita = myHeight*0.0542264752791;
  $(".positivos").css("width",wgotita+"px");  
  $(".positivos").css("height",hgotita+"px");  
  $(".negativos").css("width",wgotita+"px");  
  $(".negativos").css("height",hgotita+"px");  

  var anchoCuadro = myWidth*0.274294670846;
  $("#cuadro").css("width",anchoCuadro+"px");   
}

$(document).on("click",".contestarCuestionarioActividad", function () {
  var si = parseInt($(this).attr("si"));
  var habito = parseInt($(this).attr("habito"));
  var dia = parseInt($(this).attr("diaconsecutivo"));
  var maximo = parseInt($(this).attr("maximo"));
  var timestamp = $(this).attr("timestamp");
  muestraCuestionario(si,habito,dia,maximo,timestamp);
});
// }
/*
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
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/>';
        break;
        case 2:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/>';
        break;
        case 3:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/>';
        break;
        case 4:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">4.- Tomé dos vasos de agua natural 30 minutos antes de la cena.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/>';
        break;
        case 5:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">4.- Tomé dos vasos de agua natural 30 minutos antes de la cena.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">5.- Tomé dos vasos de agua natural dos horas antes de dormir</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_5"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_5"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/>';
        break;
        case 6:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">4.- Tomé dos vasos de agua natural 30 minutos antes de la cena.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">5.- Tomé dos vasos de agua natural dos horas antes de dormir</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_5"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_5"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">6.- Tomé agua natural mientras realicé ejercicio físico.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_6"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_6"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/>';
        break;
        case 7:
          preguntas='<span class="cuestionarioPregunta">1. Tomé dos vasos de agua natural al levantarme.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_1"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">2.- Tomé los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_2"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">3.- Tomé dos vasos de agua media hora antes de la comida.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_3"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">4.- Tomé dos vasos de agua natural 30 minutos antes de la cena.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_4"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">5.- Tomé dos vasos de agua natural dos horas antes de dormir</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_5"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_5"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">6.- Tomé agua natural mientras realicé ejercicio físico.</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_6"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_6"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/><br>\
          <span class="cuestionarioPregunta">7.- No reemplacé el Agua Natural por refresco o jugo</span><br>\
          <input type="radio" class="doblalos" value="1" name="pregunta'+habito+'_'+dia+'_7"/><img style="max-width: 30px;margin: 30px;" class="positivos" src="img/positivo'+habito+'.png"/>\
          <input type="radio" class="doblalos" value="0" checked="checked" name="pregunta'+habito+'_'+dia+'_7"/><img style="max-width: 30px;margin: 30px;"  class="negativos" src="img/negativo'+habito+'.png"/>';
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
*/

$(document).on("click",".quees", function () {
  var habito = parseInt($(this).attr("habito"));
  var elemento =$('.quees[habito="'+habito+'"] i').first();
  if($(elemento).hasClass("fa-lock"))
  {
    $("#messageToChangeMensaje").html("Para realizar esta actividad tienes que realizar la anterior.");
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
    return;
  }
  var nombreHabito = "BEBER AGUA NATURAL";
  var tituloHabito = "¿QUÉ ES EL HÁBITO DE BEBER AGUA NATURAL?";
  switch(habito)
  {
    case 2:
    break;
  }
  var ventana_ancho = $(window).width();
  var ventana_alto = $(window).height();
  
  var ventana_ancho2 = ventana_ancho+"px";
 
  //$(".fondoQeHBA").css("background-size", ventana_ancho2);

   var cad = '<section class="row fondoQeHBA" style="position:fixed; height:'+ ventana_alto+'px">\
                  <div class="col-md-12 margenTop15 ">\
                    <div class="col-md-3 contenidoResize" style="text-align: right;">\
                      <img src="img/IconoHabito'+habito+'.png" style="width: 104px;">\
                    </div>\
                    <div class="col-md-9 MonserratRegular size42">BEBER AGUA NATURAL</div>\
                  </div>\
                  <div class="col-md-12 margenTop5">\
                    <div class="col-md-1">\
                    </div>\
                    <div class="col-md-5">\
                      <div class="FlamaSemiBold size32">\
                        ¿QUÉ ES EL HÁBITO DE BEBER AGUA NATURAL?\
                      </div>\
                      <div class="FlamaBasicItalic size14 margenTop5">\
                      El Beber Agua Natural es vital para el funcionamiento del organismo ya que...  Saber más\
                      </div>\
                    </div>\
                    <div class="col-md-6">\
                    </div>\
                  </div>\
      </section>';
  $("#mainContent").html(cad); 
});

$('#slideCaractarerizticas').tooltipster({
  content: '<div id="cierrame">Hola, cuando veas el icono de candado significa<br>que debes de completar la actividad<br>anterior para desbloquear la siguiente</div>',
  position: 'right',
  multiple: true,
  hideOnClick: true,
  contentAsHTML: true,
  animation: 'fade',
  delay: 400,
  autoClose : true
});
$(document).on("click","#cierrame", function () {
  $('#slideCaractarerizticas').tooltipster('hide');
});
function ponCandadosSegunElNivel(nivel)
{
  nivel = parseInt(nivel);
  if(nivel==1)
  {
    $('#slideCaractarerizticas').tooltipster('show');
  }
  var todos = $("a[nivel]");
  var ii=0;
  for(ii=0;ii<todos.length;ii++)
  {
    var a = todos[ii];
    var nivelActual = parseInt($(a).attr("nivel"));
    var iii = $(a).find("i").first();
    $(iii).removeAttr("class");
    $(iii).addClass("fa");
    if(nivelActual<=nivel)
    {
      if(nivelActual==-2)
      {
        $(iii).addClass("fa-map-pin");// todo el if
      }
      if(nivelActual==-1)
      {
        $(iii).addClass("fa-users");// todo el if
      }
      if(nivelActual==1)
      {
        $(iii).addClass("fa-bars");
      }
      if(nivelActual==2)
      {
        $(iii).addClass("fa-map-signs");
      }
      if(nivelActual==3)
      {
        $(iii).addClass("fa-pencil-square-o");
      }
      if(nivelActual==4)
      {
        if($(a).attr('id')=="miIMC")
        {
          $(iii).addClass("fa-user-md");
        }
        else
        {
          $(iii).addClass("fa-heartbeat");
        }
      }
      if(nivelActual==5)
      {
        $(iii).addClass("fa-hand-paper-o");
      }
      if(nivelActual==6)
      {
        $(iii).addClass("fa-pencil-square-o");
      }
      if(nivelActual==7)
      {
        if($(a).attr('id')=="miIMC")
        {
          $(iii).addClass("fa-user-md");
        }
        else
        {
          $(iii).addClass("fa-heartbeat");
        }
      }
    }
    else
    {
      $(iii).addClass("fa-lock");
    }
  }
}

function ponDescripcion(tituloArticulo,link,peso,primerasPalabras,habito,dia)
{
  var peso=parseInt(peso);
  habito=parseInt(habito);
  dia=parseInt(dia);
  var diaConsecutivo = dia;
  var tituloGeneralHabito='BEBER AGUA NATURAL';
  var fraseGeneralHabito='¡No te esperes a tener sed!';
  var colorFrase='00F';
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
          fraseEnTurno="<span class='FlamaSemicondensedBold size14 colorCereza'>Bebe dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar.</span>";
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
          fraseEnTurno="<span class='FlamaSemicondensedBold size14 colorCereza' style='width: 90%'>Bebe "+escribir+" dos horas después del desayuno y "+escribir+" dos horas después de la comida.</span><br>\
          <span class='FlamaBasic size14'>Y no olvides:</span><br>\
          Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar.";
          existeTip=true;
        break;
        case 3:
          fraseEnTurno="<span class='FlamaSemicondensedBold size14 colorCereza' style='width: 90%'>Bebe dos vasos de agua natural de 250 ml c/u media hora antes de la comida.</span><br><br>\
            <span class='FlamaBasic size14'>Y no olvides:</span><br>\
            1.- Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar. <br>\
            2.- Beber los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.";
          existeTip=true;
        break;
        case 4:
        fraseEnTurno='<span class="FlamaSemicondensedBold size14 colorCereza" style="width: 95%">Bebe dos vasos de agua natural de 250 ml c/u 30 minutos antes de la cena.</span><br><br>\
          <span class="FlamaBasic size14">Y no olvides:</span><br>\
          1.- Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar. <br>\
          2.- Beber los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.<br>\
          3.- Beber dos vasos de agua natural de 250 ml c/u media hora antes de la comida.';
          existeTip=false;
        break;
        case 5:
        fraseEnTurno='<span class="FlamaSemicondensedBold size14 colorCereza" style="width: 95%">Bebe un vaso de agua natural de 250 ml dos horas antes de dormir.</span><br><br>\
          <span class="FlamaBasic size14">Y no olvides:</span><br>\
          1.- Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar. <br>\
          2.- Beber los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.<br>\
          3.- Beber dos vasos de agua natural de 250 ml c/u media hora antes de la comida.<br>\
          4.- Beber dos vasos de agua natural de 250 ml c/u 30 minutos antes de la cena.';
          existeTip=false;
        break;
        case 6:
        fraseEnTurno='<span class="FlamaSemicondensedBold size14 colorCereza" style="width: 95%">Bebe Agua Natural mientras realizas ejercicio físico.</span><br><br>\
        <span class="FlamaBasic size14">Y no olvides</span><br>\
          1.- Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar. <br>\
          2.- Beber los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.<br>\
          3.- Beber dos vasos de agua natural de 250 ml c/u media hora antes de la comida.<br>\
          4.- Beber dos vasos de agua natural de 250 ml c/u 30 minutos antes de la cena.<br>\
          5.- Beber dos vasos de agua natural de 250 ml c/u dos horas antes de dormir.';
          existeTip=false;
        break;
        case 7:
        fraseEnTurno='<span class="FlamaSemicondensedBold size14 colorCereza" style="width: 95%">No reemplaces el agua natural por refresco o jugo.</span><br><br>\
          <span class="FlamaBasic size14">Y no olvides:</span><br>\
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

  /*var cad = '<section class="content"><div style="color:#FFF;" class="row"><div class="col-md-8">';
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
  */
  var cad = '<section class="content ">\
  <div class="row contenidoAguaDiasRVM">\
    <div class="col-md-8 espacioColAguaDiasRVM">\
      <div class="row">\
        <div class="col-md-2" style="max-width: 100%; text-align: center;"><img src="img/IconoHabito'+habito+'.png" id="habitoIcono"/></div>\
        <div class="col-md-10">\
          <div class="MonserratRegular size24">'+tituloGeneralHabito+'</div>\
          <div class="FlamaSemiBold size16 colorAzul">'+fraseGeneralHabito+'</div>\
        </div>\
      </div>\
      <div class="tituloDiaAguaDiasRVM FlamaUltralight colorAzul" id="diafont">DÍA '+diaConsecutivo+'</div>\
      <div style="width:85%"><span class="fraseHabito'+habito+'">'+fraseEnTurno+'</span></div>';
      if(existeTip)
        {
          cad=cad+'<div class="tipsAguaDiasRVM"><img id="tiptip" src="img/tip'+habito+'_'+diaConsecutivo+'.png" /></div>';
        }

    cad=cad+'<div class="FlamaSemiBold size24 espacioCaracteres "><span class="tituloArticulo'+habito+'">'+tituloArticulo+'</span></div>\
      <div class=" articulosAguaDiasRVM FlamaBasicItalic size14 espacioLineas"><p><span class="primerasPalabrasArticulo'+habito+'">'+primerasPalabras+'</span> <a target="_blank" href="'+link+'"><span id="sabermas" class="saberMas'+habito+'">... SABER MÁS</span></a></p> </div>\
    </div>\
    <div class="col-md-5 personaAguaDiasRVM"><img id="ponmeGrande" src="img/actividad'+habito+'_'+diaConsecutivo+'.png"></div>\
  </div>\
</section>';
 var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  $("#mainContent").html(cad);
  var ochenta = myHeight-100;
   var diaFont = myHeight*0.07143;
  var letrasRojas = diaFont/2;
  var size24 = letrasRojas*1.5;
  var tipH = myHeight*0.29;
  $("#ponmeGrande").css("height",ochenta+"px");  
  var octavo = myHeight*0.125;
  $("#habitoIcono").css("height",octavo+"px");   
  $("#tiptip").css("height",tipH+"px");   
  $("#diafont").css("font-size",diaFont+"px");   
  $(".size14").css("font-size",letrasRojas+"px");
  $(".size14").css("line-height",letrasRojas+"px");
  $(".size16").css("font-size",size24+"px");   
  $(".size24").css("font-size",size24+"px");  

var empiezo = "00";
var voyParaArriba=true;
 intervalo = setInterval(function() {
    if($("#sabermas").length>0)
    {
      $("#sabermas").css("color", "#"+empiezo+"F");
      if(voyParaArriba)
      {
        if(empiezo!="FF")
        {
          switch(empiezo)
          {
            case "00":empiezo="11";break;
            case "11":empiezo="22";break;
            case "22":empiezo="33";break;
            case "33":empiezo="44";break;
            case "44":empiezo="55";break;
            case "55":empiezo="66";break;
            case "66":empiezo="77";break;
            case "77":empiezo="88";break;
            case "88":empiezo="99";break;
            case "99":empiezo="AA";break;
            case "AA":empiezo="BB";break;
            case "BB":empiezo="CC";break;
            case "CC":empiezo="DD";break;
            case "DD":empiezo="EE";break;
            case "EE":empiezo="FF";break;
            case "FF":empiezo="00";break;          
          }  
        }
        else
        {
          voyParaArriba=false;
          empiezo="EE";
        }
      }
      else
      {
        if(empiezo!="00")
        {
          switch(empiezo)
          {
            case "00":empiezo="FF";break;
            case "11":empiezo="00";break;
            case "22":empiezo="11";break;
            case "33":empiezo="22";break;
            case "44":empiezo="33";break;
            case "55":empiezo="44";break;
            case "66":empiezo="55";break;
            case "77":empiezo="66";break;
            case "88":empiezo="77";break;
            case "99":empiezo="88";break;
            case "AA":empiezo="99";break;
            case "BB":empiezo="AA";break;
            case "CC":empiezo="BB";break;
            case "DD":empiezo="CC";break;
            case "EE":empiezo="DD";break;
            case "FF":empiezo="EE";break;          
          }  
        }
        else
        {
          voyParaArriba=true;
          empiezo="11";
        }
      }
    }
    else
    {
      clearInterval(intervalo);
    }
  },100);
  myMsgSpinner.dialog('close');
}
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
          $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==3)
        {
          myMsgSpinner.dialog('close');
          $("#messageToChangeMensaje").html("Tu compromiso que hiciste el día "+resp.fecha+" caduco por que pasaron más de 8 días sin realizar una actividad de un hábito. Por favor renueva tu compromiso porque Quiero ¡Vivir Sano!<br><br>");
          $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==2)
        {
          myMsgSpinner.dialog('close');
          ponCandadosSegunElNivel(resp.nivel);
          if(habito>0 && diaConsecutivo>0)
          {
            $("#messageToChangeMensaje").html("No tienes un compromiso activo. ¡Haz un compromiso!.<br><br>");
            $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");  
          }
        }
        if(resp.success==1)
        {
          var habitoActual = parseInt(resp.habito);
          var diaActual = parseInt(resp.dia);
          //
          var arrayButton = $(".comenzemosButton");
          if(arrayButton.length>0)
          {
            $(arrayButton[0]).attr("habito",habitoActual);
            $(arrayButton[0]).attr("dia",diaActual);
          }
          //
          var reiniciado = resp.reiniciado;
          if(reiniciado==1)
          {
            $("#messageToChangeMensaje").html("Fuiste reiniciado al día 1 del hábito en formacion, debido a que no se realizo la actividad en 2 días seguidos o en más de 2 días salteados en un periodo de 7 días.<br><br>");
            $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open"); 
            myMsgSpinner.dialog('close');
            if(habitoActual!=9)//terminado
            {
              reseteaConCandadosTodo();
              ponCandadosSegunElNivel(resp.nivel);
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
           // return;
          }


         if(habito>0 && diaConsecutivo>0)
          {
            if(habito>habitoActual ||(habito==habitoActual && diaConsecutivo>diaActual))
            {
              $("#messageToChangeMensaje").html("Aún no puedes acceder a esta actividad. El hábito que te toca es el número "+habitoActual+" en la actividad del día "+diaActual+".<br><br>");
              $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");  
            }
            else
            {
              var esDiaQueDebeDeContestar=0;
               // {
              var siPrima=0;

              var si='si="0"';
              if(habito==habitoActual && diaActual==diaConsecutivo)
              {
                si='si="1"';
                //siPrima=1;
                esDiaQueDebeDeContestar=1;
              }
              var habitoPrimo2=parseInt(habito);
              var diaPrimo2=parseInt(diaConsecutivo);
              if(habito==1 && diaConsecutivo==1)
              {

              }
              else
              {
                if(diaPrimo2>1)
                {
                  diaPrimo2--;
                }
                else
                {
                  if(habitoPrimo2>1)
                  {
                    habitoPrimo2--;
                    diaPrimo2=7;
                  }
                }
              }
              
              // }
              var param2 = {
                servicio : 'app',
                accion : 'cargaHabitoDiaConsecutivo',
                habito : habitoPrimo2,
                diaConsecutivo : diaPrimo2
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
                    // {
                    var habitoPrimo = parseInt(habito);
                    var diaPrimo = parseInt(diaConsecutivo);
                    var deboDeMostrarCustionario=true;
                    if(diaPrimo>1)
                    {
                      diaPrimo--;
                    }
                    else
                    {
                      if(habitoPrimo>1)
                      {
                        habitoPrimo--;
                        diaPrimo=7;
                      }
                      else
                      {
                        deboDeMostrarCustionario=false;
                      }
                    }
                    if(deboDeMostrarCustionario)
                    {
                      siPrima=resp2.si;
                      muestraCuestionario(siPrima,habitoPrimo,diaPrimo,resp2.maximo,resp.timestampDeInicio);  
                    }
                    else
                    {
                      ponDescripcion(resp2.tituloArticulo,resp2.link,resp2.kg,resp2.primerasPalabras,habito,diaConsecutivo);
                    }

return;
                    
                    // } hacer funcion ponDescripcion
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
                            fraseEnTurno="<span class='FlamaSemicondensedBold size14 colorCereza'>Bebe dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar.</span>";
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
                            fraseEnTurno="<span class='FlamaSemicondensedBold size14 colorCereza' style='width: 90%'>Bebe "+escribir+" dos horas después del desayuno y "+escribir+" dos horas después de la comida.</span><br>\
                            <span class='FlamaBasic size14'>Y no olvides:</span><br>\
                            Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar.";
                            existeTip=true;
                          break;
                          case 3:
                            fraseEnTurno="<span class='FlamaSemicondensedBold size14 colorCereza' style='width: 90%'>Bebe dos vasos de agua natural de 250 ml c/u media hora antes de la comida.</span><br><br>\
                              <span class='FlamaBasic size14'>Y no olvides:</span><br>\
                              1.- Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar. <br>\
                              2.- Beber los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.";
                            existeTip=true;
                          break;
                          case 4:
                          fraseEnTurno='<span class="FlamaSemicondensedBold size14 colorCereza" style="width: 95%">Bebe dos vasos de agua natural de 250 ml c/u 30 minutos antes de la cena.</span><br><br>\
                            <span class="FlamaBasic size14">Y no olvides:</span><br>\
                            1.- Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar. <br>\
                            2.- Beber los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.<br>\
                            3.- Beber dos vasos de agua natural de 250 ml c/u media hora antes de la comida.';
                            existeTip=false;
                          break;
                          case 5:
                          fraseEnTurno='<span class="FlamaSemicondensedBold size14 colorCereza" style="width: 95%">Bebe un vaso de agua natural de 250 ml dos horas antes de dormir.</span><br><br>\
                            <span class="FlamaBasic size14">Y no olvides:</span><br>\
                            1.- Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar. <br>\
                            2.- Beber los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.<br>\
                            3.- Beber dos vasos de agua natural de 250 ml c/u media hora antes de la comida.<br>\
                            4.- Beber dos vasos de agua natural de 250 ml c/u 30 minutos antes de la cena.';
                            existeTip=false;
                          break;
                          case 6:
                          fraseEnTurno='<span class="FlamaSemicondensedBold size14 colorCereza" style="width: 95%">Bebe Agua Natural mientras realizas ejercicio físico.</span><br><br>\
                          <span class="FlamaBasic size14">Y no olvides</span><br>\
                            1.- Beber dos vasos de agua natural de 250 ml c/u al levantarte y hasta 30 minutos antes de desayunar. <br>\
                            2.- Beber los vasos de agua natural indicados dos horas después del desayuno y dos horas después de la comida.<br>\
                            3.- Beber dos vasos de agua natural de 250 ml c/u media hora antes de la comida.<br>\
                            4.- Beber dos vasos de agua natural de 250 ml c/u 30 minutos antes de la cena.<br>\
                            5.- Beber dos vasos de agua natural de 250 ml c/u dos horas antes de dormir.';
                            existeTip=false;
                          break;
                          case 7:
                          fraseEnTurno='<span class="FlamaSemicondensedBold size14 colorCereza" style="width: 95%">No reemplaces el agua natural por refresco o jugo.</span><br><br>\
                            <span class="FlamaBasic size14">Y no olvides:</span><br>\
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

                    /*var cad = '<section class="content"><div style="color:#FFF;" class="row"><div class="col-md-8">';
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
                    */
                    var cad = '<section class="content ">\
                    <div class="row contenidoAguaDiasRVM">\
                      <div class="col-md-8 espacioColAguaDiasRVM">\
                        <div class="row">\
                          <div class="col-md-2" style="max-width: 100%; text-align: center;"><img src="img/IconoHabito'+habito+'.png" width="70"/></div>\
                          <div class="col-md-10">\
                            <div class="MonserratRegular size24">'+tituloGeneralHabito+'</div>\
                            <div class="FlamaSemiBold size16 colorAzul">'+fraseGeneralHabito+'</div>\
                          </div>\
                        </div>\
                        <div class="tituloDiaAguaDiasRVM FlamaUltralight size30 colorAzul">DÍA '+diaConsecutivo+'</div>\
                        <div style="width:85%"><span class="fraseHabito'+habito+'">'+fraseEnTurno+'</span></div>';
                        if(existeTip)
                          {
                            cad=cad+'<div class="tipsAguaDiasRVM"><img src="img/tip'+habito+'_'+diaConsecutivo+'.png" /></div>';
                          }

                      cad=cad+'<div class="FlamaSemiBold size24 espacioCaracteres "><span class="tituloArticulo'+habito+'">'+resp2.tituloArticulo+'</span></div>\
                        <div class=" articulosAguaDiasRVM FlamaBasicItalic size14 espacioLineas"><p><span class="primerasPalabrasArticulo'+habito+'">'+resp2.primerasPalabras+'</span> <a target="_blank" href="'+resp2.link+'"><span class="saberMas'+habito+'">... SABER MÁS</span></a></p> </div>\
                      </div>\
                      <div class="col-md-5 personaAguaDiasRVM"><img src="img/actividad'+habito+'_'+diaConsecutivo+'.png"></div>\
                    </div>\
                  </section>';


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
              ponCandadosSegunElNivel(resp.nivel);
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
            else
            {
              subeDeNivel(7);//
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
  var elemento =$('.habitoDia[habito="'+habito+'"][dia="'+dia+'"] i').first();
  if($(elemento).hasClass("fa-lock"))
  {
    $("#messageToChangeMensaje").html("Para realizar esta actividad tienes que realizar la anterior.");
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
    return;
  }
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
    var nivel = parseInt($(this).attr("nivel"));
  
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
          $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==2)
        {
          myMsgSpinner.dialog('close');
          $("#messageToChangeMensaje").html("Ya tienes un compromiso aceptado el día: "+resp.fecha+" ¡Continua!.<br><br>");
          $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==1)
        {
           // de aqui para abajo
          myMsgSpinner.dialog('close');
          //alert("¡Vamos al día 1!");
         // cargaHabitoDiaConsecutivo(1,1); 
          cuantosPuntosLlevo=0;
          preguntaActual=1;
          var habito = 1;
         var ventana_ancho = $(window).width();
        var ventana_alto = $(window).height();

        var widthSidebar = $(".sidebar").width();

        var medidasImagen = $("#imgEvalEstiloVidaRVM").width();

        var recalculandoW = ventana_ancho-widthSidebar;
        var recalculandoH = ventana_alto;

       // $("#imgEvalEstiloVidaRVM").css("width", recalculandoW);
        $("#imgEvalEstiloVidaRVM").css("height", recalculandoH);
        
        $(".contenedorImgEvalEV").css("left", widthSidebar);

        

        var cad='<section class="contenedorImgEvalEV">\
                  <div>\
                    <div class="posBotonEvalEV">\
                      <button type="button" habito="'+habito+'" id="realizaCuestionario" class="btn btn-block btn-success btn-lg">\
                         Realizar cuestionario\
                      </button>\
                     </div>\
                     <img id="imgEvalEstiloVidaRVM" src="img/cuestionario'+habito+'.jpg" width="'+recalculandoW+'" height="'+recalculandoH+'">\
                  </div>\
            </section>';
        $("#mainContent").html(cad); 


          //dia actual es 1
          habilitaHabito(1);
          ponIconoEnElHabitoDia(1,1,"fa-calendar-o");
          //subeDeNivel(nivel);//
        }
      }
    });
});
$(document).on("click",".compromiso", function () {
  var elemento =$(this).find("i").first();
  if($(elemento).hasClass("fa-lock"))
  {
    $("#messageToChangeMensaje").html("Para realizar esta actividad tienes que realizar la anterior.");
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
    return;
  }
  var nivel = parseInt($(this).attr("nivel"));
  anadeClassAlMainContent("compromisoBackground");
  var nombre = $("#nombre").html().trim();
   //nombre = nombre.replace(/\D/g,'');
  var cad = '<section class="row" style="position: fixed;">\
                  <div class="col-md-12">\
                    <div class="col-md-6 contenidoResize" style="text-align: left;">\
                      <img src="img/backgroundPasos.png" style="width: 204px;">\
                    </div>\
                    <div class="col-md-6">\
                    </div>\
                  </div>\
                   <div class="col-md-12">\
                    <div class="col-md-6 MonserratBold size26">\
                      MI COMPROMISO\
                    </div>\
                    <div class="col-md-6">\
                    </div>\
                  </div>\
                  <div class="col-md-12 row margenTop15">\
                    <div class="col-md-6">\
                      <img src="img/ManoCompromiso.png" style="width: 400px;">\
                    </div>\
                    <div class="col-md-6 FlamaSemicondensedBasic size20">\
                      <div>\
                        Me comprometo a realizar las actividades de cada semana, sin dejar de practicar las de la semana anterior; y así desarrollar un estilo de vida saludable porque yo Quiero ¡Vivir Sano!\
                      </div>\
                       <div class="FlamaSemicondensedBasic size22 margenTop5">'+nombre+'</div>\
                      <div class="margenTop5">\
                        <input class="btn" nivel="'+nivel+'" id="aceptarCompromiso" type="button" value="ACEPTO">\
                      </div>\
                    </div>\
                  </div>\
            </section>';
  $("#mainContent").html(cad); 
});

// {
  
$(document).on("click",".unirme", function () {
  var correo = $(this).attr("correo");
  var param = {
    servicio : 'app',
    accion : 'inscribirteAComunidad',
    correo : correo//correoJefe
  };
  $.ajax({
    url: api,
    data : param,
    dataType : "json",
    type : "post",
    async : true,
    beforeSend : function (){
     // myMsgSpinner = msgSpinner("Dibujando mapa...");
    },
    complete : function (){
    }, 
    success : function (resp){
      if(resp.success==3)
      {
        alert("Ya perteneces a esta comunidad");
      }
      if(resp.success==1)
      {
       // myMsgSpinner.dialog('close');
        alert("¡Te haz unido a esta comunidad!");
      
       // $("#messageToChangeMensaje").html("¡Te haz unido a esta comunidad!");
        //$("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
      }
      if(resp.success==2)
      {
        //myMsgSpinner.dialog('close');
        alert("¡Te haz unido a esta nueva comunidad! Ya no perteneces a la comunidad cuyo Promotor de salud es: "+resp.nombre);
        //$("#messageToChangeMensaje").html("¡Te haz unido a esta nueva comunidad! Ya no perteneces a la comunidad cuyo Promotor de salud es: "+resp.nombre);
        //$("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
      }
    }
  });
});
var markers = [];
function grabaPosicion(location)
{
  var param = {
    servicio : 'app',
    accion : 'saveGPSWEB',
    latitud : location.lat(),
    longitud : location.lng()
  };
  $.ajax({
    url: api,
    data : param,
    dataType : "json",
    type : "post",
    async : true,
    beforeSend : function (){
    //  myMsgSpinner = msgSpinner("Dibujando mapa...");
    },
    complete : function (){
    }, 
    success : function (resp){
      if(resp.success==1)
      {
      }
    }
  });
}
function placeMarker(location,map) {
  var image = {
    url: 'img/qvsIcon.png',
    scaledSize: new google.maps.Size(30, 30)
  };
  deleteMarkers();
    var marker = new google.maps.Marker({
        position: location, 
        map: map,
        icon : image
    });
    grabaPosicion(location);
    markers.push(marker);
}
function setMapOnAll(map) {
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(map);
  }
}

// Removes the markers from the map, but keeps them in the array.
function clearMarkers() {
  setMapOnAll(null);
}
// Deletes all markers in the array by removing references to them.
function deleteMarkers() {
  clearMarkers();
  markers = [];
}
function getGPSWeb(map)
{
  var param = {
    servicio : 'app',
    accion : 'getGPSWeb'
  };
  $.ajax({
    url: api,
    data : param,
    dataType : "json",
    type : "post",
    async : true,
    beforeSend : function (){
    //  myMsgSpinner = msgSpinner("Dibujando mapa...");
    },
    complete : function (){
    }, 
    success : function (resp){
      if(resp.success==1)
      {
        var image = {
          url: 'img/qvsIcon.png',
          scaledSize: new google.maps.Size(30, 30)
        };
        deleteMarkers();
        var location = new google.maps.LatLng(resp.latitud, resp.longitud);
          var marker = new google.maps.Marker({
              position: location, 
              map: map,
              icon : image
          });
          markers.push(marker);
      }
    }
  });
}
$(document).on("click",".posicionarMiComunidad", function () {
  var initialLocation;
   $("#mainContent").html('<div id="map"></div>'); 
//commit {
 var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  $("#map").css("height",myHeight+"px");
  $("#map").css("min-height",myHeight+"px");
//commit}


var siberia = new google.maps.LatLng(20.5460096, -89.8734487);
var newyork = new google.maps.LatLng(20.5460096, -89.8734487);
var browserSupportFlag =  new Boolean();

function initialize() {
  var myOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("map"), myOptions);
  google.maps.event.addListener(map, 'click', function(event) {
   placeMarker(event.latLng,map);
  });
getGPSWeb(map);
  // Try W3C Geolocation (Preferred)
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      map.setCenter(initialLocation);
//AQUI ME QUEDE

    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
  // Browser doesn't support Geolocation
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }

  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Tu navegador no soporta GPS, te pusimos en México.");
      initialLocation = siberia;
    }
    map.setCenter(initialLocation);
  }
 }
initialize();
});

// {

function displayRoute(origin, destination, service, display) {
  service.route({
    origin: origin,
    destination: destination,
    //waypoints: [{location: 'Cocklebiddy, WA'}, {location: 'Broken Hill, NSW'}],
    travelMode: google.maps.TravelMode.DRIVING,
    avoidTolls: true
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      display.setDirections(response);
    } else {
      alert('Could not display directions due to: ' + status);
    }
  });
}

function computeTotalDistance(result) {
  var total = 0;
  var myroute = result.routes[0];
  for (var i = 0; i < myroute.legs.length; i++) {
    total += myroute.legs[i].distance.value;
  }
  total = total / 1000;
  document.getElementById('total').innerHTML = total + ' km';
}
$(document).on("click",".borrarHorario", function () {
  var actividad = $(this).attr("actividad");
  var horario = $(this).attr("horario");
  var param = {
    servicio : 'app',
    accion : 'deleteHorarioWEB',
    horario: horario,
    descripcion : actividad
  };
  $.ajax({
    url: api,
    data : param,
    dataType : "json",
    type : "post",
    async : true,
    beforeSend : function (){
      myMsgSpinner = msgSpinner("Borrando horario...");
    },
    complete : function (){
    }, 
    success : function (resp){
      if(resp.success==1)
      {
        llenaTablaHorarios();
        myMsgSpinner.dialog('close');
      }
    }
  });
});
$(document).on("click",".anadirHorario", function () {
  var actividad = $("#actividadForm").val().trim();
  if(actividad=="")
  {
    $("#messageToChangeMensaje").html("Hola, primero tienes que escribir una actividad.");
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
    $("#actividadForm").css("background-color","#FF0");
    return;
  }
  var horario = $("#eligeDia").val()+" "+$("#horaInicio").val()+":"+$("#minutosInicio").val()+"-"+$("#horaFinal").val()+":"+$("#minutosFinal").val();
  var param = {
    servicio : 'app',
    accion : 'saveHorarioWEB',
    horario: horario,
    descripcion : actividad
  };
  $.ajax({
    url: api,
    data : param,
    dataType : "json",
    type : "post",
    async : true,
    beforeSend : function (){
      myMsgSpinner = msgSpinner("Añadiendo horario...");
    },
    complete : function (){
    }, 
    success : function (resp){
      if(resp.success==1)
      {
        myMsgSpinner.dialog('close');
        $('#tableHorarios > tbody:last-child').append('<tr><td>'+horario+'</td><td>'+actividad+'</td><td><span style="cursor:pointer;" actividad="'+actividad+'" horario="'+horario+'" class="label label-danger borrarHorario">Borrar</span></td></tr>');
      }
    }
  });
});  
$(document).on("click","#configurarMisHorarios", function () {
  var cad='<section class="content-header">\
      <h1>Horarios<small>Configura los horarios de tus actividades para que tus miembros puedan verlos</small>\
      </h1>\
    </section>\
    <section class="content">\
      <div class="row">\
        <div class="col-md-12">\
          <div class="box" style="margin-left: 20px;padding-left: 20px;margin-right: 20px;width: 95%;padding-right: 20px;">\
            <div class="box-header with-border">\
              <h3 class="box-title">Horarios de mi comunidad QVS</h3>\
            </div>\
            <div class="box-body table-responsive no-padding">\
            <br><br>\
  <label for="eligeDia">Elige día:</label>\
  <select id="eligeDia">\
      <option selected value="Domingo">Domingo</option>\
      <option value="Lunes">Lunes</option>\
      <option value="Martes">Martes</option>\
      <option value="Miercoles">Miercoles</option>\
      <option value="Jueves">Jueves</option>\
      <option value="Viernes">Viernes</option>\
      <option value="Sabado">Sabado</option>\
  </select>\
  <label>Hora de inicio:</label>\
  <select id="horaInicio">\
      <option value="0">0</option>\
      <option value="1">1</option>\
      <option value="2">2</option>\
      <option value="3">3</option>\
      <option value="4">4</option>\
      <option value="5">5</option>\
      <option value="6">6</option>\
      <option value="7">7</option>\
      <option value="8">8</option>\
      <option value="9">9</option>\
      <option value="10">10</option>\
      <option value="11">11</option>\
      <option value="12">12</option>\
      <option value="13">13</option>\
      <option value="14">14</option>\
      <option value="15">15</option>\
      <option value="16">16</option>\
      <option selected value="17">17</option>\
      <option value="18">18</option>\
      <option value="19">19</option>\
      <option value="20">20</option>\
      <option value="21">21</option>\
      <option value="22">22</option>\
      <option value="23">23</option>\
  </select>\
  <label>:</label>\
  <select id="minutosInicio">\
      <option selected value="00">00</option>\
      <option value="15">15</option>\
      <option value="30">30</option>\
      <option value="45">45</option>\
  </select>\
  <label>Hora de final:</label>\
    <select id="horaFinal">\
      <option value="0">0</option>\
      <option value="1">1</option>\
      <option value="2">2</option>\
      <option value="3">3</option>\
      <option value="4">4</option>\
      <option value="5">5</option>\
      <option value="6">6</option>\
      <option value="7">7</option>\
      <option value="8">8</option>\
      <option value="9">9</option>\
      <option value="10">10</option>\
      <option value="11">11</option>\
      <option value="12">12</option>\
      <option value="13">13</option>\
      <option value="14">14</option>\
      <option value="15">15</option>\
      <option value="16">16</option>\
      <option value="17">17</option>\
      <option selected value="18">18</option>\
      <option value="19">19</option>\
      <option value="20">20</option>\
      <option value="21">21</option>\
      <option value="22">22</option>\
      <option value="23">23</option>\
  </select>\
  <label>:</label>\
  <select id="minutosFinal">\
      <option selected value="00">00</option>\
      <option value="15">15</option>\
      <option value="30">30</option>\
      <option value="45">45</option>\
  </select>\
  <br><br>\
  <input class="form-control input-lg" id="actividadForm" type="text" placeholder="Escribe la descripción de tu actividad aqui..">\
  <br><br>\
  <a class="btn btn-app anadirHorario">\
        <i class="fa  fa-plus-square"></i>Añadir</a>\
  <br>\
  <br>\
<table class="table table-hover" width="100%" style="text-align: center;table-layout:fixed;" id="tableHorarios"><tbody id="llenameBody"></tbody></table>\
            </div>\
          </div>\
        </div>\
      </div>\
    </section>';
  $("#mainContent").html(cad);
  $("#mainContent").removeAttr('class');
  $("#mainContent").addClass("content-wrapper");
  llenaTablaHorarios();
});
function llenaTablaHorarios()
{
  $("#llenameBody").html('<tr><td>Horario</td><td>Actividad</td><td>Eliminar</td></tr>');
  var param = {
    servicio : 'app',
    accion : 'getHorariosWEB'
  };
  $.ajax({
    url: api,
    data : param,
    dataType : "json",
    type : "post",
    async : true,
    beforeSend : function (){
    //  myMsgSpinner = msgSpinner("Dibujando mapa...");
    },
    complete : function (){
    }, 
    success : function (resp){
      if(resp.success==1)
      {
        var i;
        for(i=0;i<resp.horarios.length;i++)
        {
          $('#tableHorarios > tbody:last-child').append('<tr><td>'+resp.horarios[i].horario+'</td><td>'+resp.horarios[i].descripcion+'</td><td><span style="cursor:pointer;" actividad="'+resp.horarios[i].descripcion+'" horario="'+resp.horarios[i].horario+'" class="label label-danger borrarHorario">Borrar</span></td></tr>');
        }
      }
    }
  });
}
//commit {
$(window).resize(function() {
    $("#msgSpinner").dialog("option", "position", {my: "center", at: "center", of: window});
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});
  
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});
});
//commit }
$(document).on("click",".comoLlegar", function () {
  //commit
  $("#map2").css("width","66%");

  var latitud = parseFloat($(this).attr("latitud"));
  var longitud = parseFloat($(this).attr("longitud"));
var miDestino = new google.maps.LatLng(latitud, longitud);
  
  
  var directionsService = new google.maps.DirectionsService;
  var directionsDisplay = new google.maps.DirectionsRenderer({
    draggable: true,
    map: window.map,
    panel: document.getElementById('right-panel')
  });

  directionsDisplay.addListener('directions_changed', function() {
    computeTotalDistance(directionsDisplay.getDirections());
  });
if(myPosicion!=null)
{
  displayRoute(myPosicion, miDestino, directionsService,
      directionsDisplay);
}
  
});
var myPosicion; 
var aver;
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

$(document).on("click",".unirmeComunidad", function () {
 $("#mainContent").html('<div id="map2"></div><div id="right-panel"><p>Distancia total: <span id="total"></span></p></div>'); 
// commit {
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  $("#map2").css("height",myHeight+"px");
  $("#map2").css("min-height",myHeight+"px");
  $("#map2").css("width",myWidth+"px");
 //commit  }
myPosicion=null;
  var myLatlng = new google.maps.LatLng(20.5460096, -89.8734487);
  var mapOptions = {
      zoom: 5,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  
  var siberia = new google.maps.LatLng(20.5460096, -89.8734487);
  var newyork = new google.maps.LatLng(20.5460096, -89.8734487);
  window.map = new google.maps.Map(document.getElementById("map2"), mapOptions);
  function initialize() {
  var myOptions = {
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  
  if(navigator.geolocation) {
    browserSupportFlag = true;
    navigator.geolocation.getCurrentPosition(function(position) {
      initialLocation = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      myPosicion = initialLocation;
      window.map.setCenter(initialLocation);
    }, function() {
      handleNoGeolocation(browserSupportFlag);
    });
  }
  else {
    browserSupportFlag = false;
    handleNoGeolocation(browserSupportFlag);
  }
  function handleNoGeolocation(errorFlag) {
    if (errorFlag == true) {
      alert("Geolocation service failed.");
      initialLocation = newyork;
    } else {
      alert("Tu navegador no soporta GPS, te pusimos en México.");
      initialLocation = siberia;
    }
    window.map.setCenter(initialLocation);
  }
 }
initialize();
 var param = {
      servicio : 'app',
      accion : 'getAllGPS'
    };
    $.ajax({
      url: api,
      data : param,
      dataType : "json",
      type : "post",
      async : true,
      beforeSend : function (){
        myMsgSpinner = msgSpinner("Dibujando mapa...");
      },
      complete : function (){
      }, 
      success : function (resp){
        if(resp.success==1)
        {
          myMsgSpinner.dialog('close');
          var i;
          //var image = 'img/qvsIcon.png';
          var image = {
            url: 'img/qvsIcon.png',
            scaledSize: new google.maps.Size(30, 30)
          };
          for(i=0;i<resp.gps.length;i++)
          {

             // for {
            var posicion = new google.maps.LatLng(resp.gps[i].latitud, resp.gps[i].longitud);
            var param = {
              servicio : 'app',
              accion : 'getDatosDeLaComunidad',
              correo : resp.gps[i].correo
            };
            $.ajax({
              url: api,
              data : param,
              dataType : "json",
              type : "post",
              async : false,
              beforeSend : function (){
                myMsgSpinner = msgSpinner("Dibujando mapa...");
              },
              complete : function (){
              }, 
              success : function (resp2){
                if(resp2.success==1)
                {
                  myMsgSpinner.dialog("close");
                  var contentString = '<div id="content"><div id="siteNotice"></div><h1 id="firstHeading" class="firstHeading">Comunidad QVS</h1><div id="bodyContent">\
                  <table style="width: 100%;text-align: center;"><thead><tr><th>Horario</th><th>Actividad</th></tr></thead><tbody>';
                  var j;
                  for(j=0;j<resp2.info[0].horarios.length;j++)
                  {
                    contentString=contentString+'<tr><td>'+resp2.info[0].horarios[j].horario+'</td><td>'+resp2.info[0].horarios[j].descripcion+'</td></tr>';
                  }
                  //id="imagenDe'+resp.gps[i].correo+'"
                  contentString=contentString+'</tbody></table>\
                  <p><img  src="data:image/jpg;base64,'+resp2.info[0].picture+'" width="40px" height="40px"/><b>Promotor de salud: '+resp.gps[i].nombre+'</b></p><p><button type="button" correo="'+resp.gps[i].correo+'" class="btn unirme btn-block btn-success">Unirme a esta comunidad</button>\
                  <br><button type="button" longitud="'+resp.gps[i].longitud+'" latitud="'+resp.gps[i].latitud+'" class="btn comoLlegar btn-block btn-info">Cómo llegar</button>\
                  <br><a class="btn btn-app" target="_blank" href="mailto:'+resp.gps[i].correo+'"><i class="fa fa-edit"></i>Correo</a>\
                  </p></div></div>';

                   var marker = new google.maps.Marker({
                    position: posicion,
                    map: window.map,//
                    icon : image
                  });
                     marker.info = new google.maps.InfoWindow({
                      content: contentString
                    });
                    google.maps.event.addListener(marker, 'click', function() {
                      var marker_map = this.getMap();
                      this.info.open(marker_map, this);
                    });
                }
              }
            });

          }
          
        }
      }
    }); 
});
// }



$(document).on("click","#miEsClinicos", function () {
   var elemento =$(this).find("i").first();
  if($(elemento).hasClass("fa-lock"))
  {
    $("#messageToChangeMensaje").html("Para realizar esta actividad tienes que realizar la anterior.");
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
    return;
  }
  var nivel = parseInt($(this).attr("nivel"));//
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
          $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==1)
        {
          subeDeNivel(nivel);//
          var gender = "misclinicos";//hombres background!
          var indicadorHDL = 45;
          if(resp.gender!="male")
          {
            gender = "misclinicos";//mujeres background!
            indicadorHDL = 55;
          }
          anadeClassAlMainContent(gender);
           
           var myWidth = 0, myHeight = 0;
            if( typeof( window.innerWidth ) == 'number' ) {
              //Non-IE
              myWidth = window.innerWidth;
              myHeight = window.innerHeight;
            } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
              //IE 6+ in 'standards compliant mode'
              myWidth = document.documentElement.clientWidth;
              myHeight = document.documentElement.clientHeight;
            } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
              //IE 4 compatible
              myWidth = document.body.clientWidth;
              myHeight = document.body.clientHeight;
            }

          var ldl = resp.ldl;
          var hdl = resp.hdl;
          var colesterol = resp.colesterol;
          var presion = resp.presion;
          var presionhg = resp.presionhg;
          var glucosa = resp.glucosa;
          var trigliceridos = resp.trigliceridos;
          var cad = '<section class="contenedorImgGenerales"  style="margin-right: -30px;">\
                  <div class="col-md-12">\
                    <div class="col-md-3" style="text-align: center;">\
                      <div>\
                          <img id="cuerpo" src="img/cuerpoDiagnostico.png" >\
                      </div>\
                      <div id="veinte" class="FlamaSemicondensedMedium size10" style="width: 95%; margin-top: 4%; background-color: #9e005d; padding: 10px;">\
                        <span id="textoSpan">¡Te invitamos a realizar ajustes en tu estilo de vida! Este curso te brinda principios y sugerencias prácticas diarias que marcarán una diferencia real en tu vida y te permitirán renovar el diseño de tu rutina diaria de forma saludable.</span>\
                      </div>\
                    </div>\
                    <div class="col-md-9" style="margin-top: 1%;">\
                      <div class="MonserratRegular size20 colorNegro"> DIAGNÓSTICO BASADO EN ESTUDIOS CLÍNICOS</div>';
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
          cad = cad + '<div class="col-md-12 fondoDiagnosticoOpcional" style="margin-top: 1%;">\
                        <div class="col-md-4" style="text-align: center; padding: 10px;">\
                          <span class="FlamaSemicondensedSemibold colorAzulOscuro cuarentaFont">'+nombreEnTurno+'</span><br>\
                          <span class="colorAzulOscuro veinteFont">Tu nivel de '+ nombreEnTurnoMinusculas +' total es</span><br>\
                          <span class="FlamaSemicondensedSemibold colorRojo cuarentaFont" style="color:#'+colorEnTurno+'">'+palabraEnTurno+'</span>\
                        </div>\
                        <div class="col-md" id="cuadro1" style="margin-top: 5px; margin-bottom: 5px;height: 90%;"><span>'+textoEnTurno+'</span></div>\
                      </div>';
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
          cad = cad + '<div class="col-md-12 fondoDiagnosticoOpcional" style=" margin-top: 1%;">\
                        <div class="col-md-4" style="text-align: center;padding: 10px;">\
                          <span class="FlamaSemicondensedSemibold colorAzulOscuro cuarentaFont">'+nombreEnTurno+'</span><br>\
                        <span class="colorAzulOscuro veinteFont">Tu nivel de '+nombreEnTurnoMinusculas+' es</span><br>\
                         <span class="FlamaSemicondensedSemibold colorRojo cuarentaFont" style="color:#'+colorEnTurno+'">'+palabraEnTurno+'</span>\
                        </div>\
                        <div class="col-md" id="cuadro2" style="margin-top: 5px; margin-bottom: 5px;height: 90%;"><span>'+textoEnTurno+'</span></div>\
                      </div>';
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
          cad = cad + '<div class="col-md-12 fondoDiagnosticoOpcional" style=" margin-top: 1%;">\
                        <div class="col-md-4" style="text-align: center; padding: 10px;">\
                          <span class="FlamaSemicondensedSemibold colorAzulOscuro cuarentaFont">'+nombreEnTurno+'</span><br>\
                        <span class="colorAzulOscuro veinteFont">Tu nivel de '+nombreEnTurnoMinusculas+' es</span><br>\
                         <span class="FlamaSemicondensedSemibold colorRojo cuarentaFont" style="color:#'+colorEnTurno+'">'+palabraEnTurno+'</span>\
                        </div>\
                        <div class="col-md" id="cuadro3" style="margin-top: 5px; margin-bottom: 5px;height: 90%;" ><span>'+textoEnTurno+'</span></div>\
                      </div>';
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
          cad = cad + '<div class="col-md-12 fondoDiagnosticoOpcional" style=" margin-top: 1%;">\
                        <div class="col-md-4" style="text-align: center; padding: 10px;">\
                          <span class="FlamaSemicondensedSemibold colorAzulOscuro cuarentaFont">'+nombreEnTurno+'</span><br>\
                          <span class="colorAzulOscuro veinteFont">Tu nivel de '+nombreEnTurnoMinusculas+' es</span><br>\
                         <span class="FlamaSemicondensedSemibold colorRojo size12 cuarentaFont" style="color:#'+colorEnTurno+'">'+palabraEnTurno+'</span>\
                        </div>\
                        <div class="col-md" id="cuadro4" style="margin-top: 5px; margin-bottom: 5px;height: 90%;"><span>'+textoEnTurno+'</span></div>\
                    </div>';
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
          cad = cad + '<div class="col-md-12 fondoDiagnosticoOpcional" style=" margin-top: 1%;">\
                        <div class="col-md-4" style="text-align: center; padding: 10px;">\
                          <span class="FlamaSemicondensedSemibold colorAzulOscuro size12 cuarentaFont">'+nombreEnTurno+'</span><br>\
                        <span class="colorAzulOscuro veinteFont">Tu nivel de '+nombreEnTurnoMinusculas+' es</span><br>\
                         <span class="FlamaSemicondensedSemibold colorRojo cuarentaFont" style="color:#'+colorEnTurno+'">'+palabraEnTurno+'</span>\
                        </div>\
                        <div class="col-md" id="cuadro5" style="margin-top: 5px; margin-bottom: 5px;height: 90%;"><span>'+textoEnTurno+'</span></div>\
                    </div>';
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
          cad = cad +'<div class="col-md-12 fondoDiagnosticoOpcional" style=" margin-top: 1%;">\
                        <div class="col-md-4" style="text-align: center; padding: 10px;">\
                        <span class="FlamaSemicondensedSemibold colorAzulOscuro cuarentaFont">'+nombreEnTurno+'</span><br>\
                        <span class="colorAzulOscuro veinteFont" >Tu '+nombreEnTurnoMinusculas+' es</span><br>\
                         <span class="FlamaSemicondensedSemibold colorRojoQuemado cuarentaFont" style="color:#'+colorEnTurno+'">'+palabraEnTurno+'</span>\
                        </div>\
                        <div class="col-md" id="cuadro6" style="margin-top: 5px; margin-bottom: 5px;height: 90%;"><span>'+textoEnTurno+'</span></div>\
                    </div>';
          cad=cad+'</div></div></div></section>';
          $("#mainContent").html(cad); 

          var ochenta = myHeight*0.72;
          var veinte = myHeight*0.24;
          $("#cuerpo").css("height",ochenta+"px");
          $("#veinte").css("height",veinte+"px");
          $('#veinte').textfill({maxFontPixels:-1});
          var seis = myHeight*0.14;
          $(".fondoDiagnosticoOpcional").css("height",seis+"px");

          var cuarentaFont = seis *0.2;
          var veinteFont = seis *0.15;
          $(".cuarentaFont").css("font-size",cuarentaFont+"px");
          $(".veinteFont").css("font-size",veinteFont+"px");
          $('#cuadro1').textfill({maxFontPixels:-1});
          $('#cuadro2').textfill({maxFontPixels:-1});
          $('#cuadro3').textfill({maxFontPixels:-1});
          $('#cuadro4').textfill({maxFontPixels:-1});
          $('#cuadro5').textfill({maxFontPixels:-1});
          $('#cuadro6').textfill({maxFontPixels:-1});
          var size20 = myHeight*0.0318979266348;
          $(".size20").css("font-size",size20+"px");
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
           // {
           var param = {
              servicio : 'app',
              accion : 'guardaResultadoEvaluacion',
              habito : habito,
              resultado : resultado3
            };
            $.ajax({
              url: api,
              data : param,
              dataType : "json",
              type : "post",
              async : true,
              beforeSend : function (){
           //     myMsgSpinner = msgSpinner("Espere un momento...");
              },
              complete : function (){
              }, 
              success : function (resp2){
                if(resp2.success==1)
                {
                }
              }
            });
            // }
          var textoResultado = "";
          var colorResultado = "";
          var parrafoResultado ="";
          

          if(resultado3<61)
          {
            textoResultado="MUY MALO"; //c1_fMM
            colorResultado="ff0000";
            parrafoResultado ="Estás en la zona de altísimo riesgo, es urgente que revises tu estilo de vida! Este curso te ayudará a hacer los cambios necesarios para lograr una vida saludable. Transforma tu realidad, ¡puedes lograrlo!";
            
          }
          else
          {
            if(resultado3<71)
            {
              textoResultado="MALO"; //c1_fMç
              colorResultado="ff5200";
              parrafoResultado ="Estás un poco alejado de una vida saludable. Revisa tu estilo de vida y has cambios que te acerquen a una vida más saludable. Lo importante es que transformes tu realidad. Puedes hacerlo, ¡tú eres protagonista de tu vida!";
              
            }
            else
            {
              if(resultado3<81)
              {
                textoResultado="BUENO"; //c1_fB
                colorResultado="ffff00";
                parrafoResultado ="¡Bien! Algunos aspectos de tu vida son saludables. ¡Felicitaciones! Puedes realizar unos pocos cambios que te acerquen aún más a una vida más saludable. Puedes hacerlo, ¡tú eres protagonista de tu vida!";
                
              }
              else
              {
                if(resultado3<91)
                {
                  textoResultado="MUY BUENO"; //c1_fMB
                  colorResultado="009600";
                  parrafoResultado ="¡Muy bien!, muchos aspectos de tu vida son saludables. ¡Felicitaciones! Puedes realizar nuevos cambios que te acerquen a una vida más saludable. ¡Puedes hacerlo!";
                  
                }
                else
                {
                  textoResultado="EXCELENTE"; //c1_fE
                  colorResultado="006400";
                  parrafoResultado ="¡Felicitaciones! casi todos los aspectos de tu vida son saludables. Solo unos pocos cambios y lograrás una vida aún más saludable. ";
                }
              }
            }
          }
          anadeClassAlMainContent("resultadosCuestionario1");
          var cad='<section class="contenedorImgGenerales">\
                  <div class="col-md-12 " >\
                    <div class="col-md-5 margenTop5" style="text-align: center;">\
                      <div>\
                          <img src="img/resultadoCuestionario.png" style="height: 550px;">\
                      </div>\
                    </div>\
                    <div class="col-md-7" style="text-align: center;">\
                      <div class=" colorAzulMarino">\
                          <span class="MonserratRegular size42 colorAzulMarino" style="font-weight: bold;">RESULTADOS</span><br>\
                          <span class="FlamaBook size26 colorAzulMarino">MI ESTILO DE VIDA<br>BEBER AGUA</span>\
                      </div>\
                        <div class="FlamaSemiBold size24 margenTop10">\
                          <span style="color:#'+colorResultado+';">'+textoResultado+'</span>\
                      </div>\
                      <div class="margenTop10 size14">\
                      <span class=" FlamaMedium colorAzulMarino">'+parrafoResultado+'</span><br>\
                      <div class="FlamaBook colorAzulMarino" style="margin-top: 20px;">Beber agua reduce las posibilidades de tener piedras en el riñón, infartos, padecer cáncer de colón y sufrir de enfermedades en las vías urinarias. Además aumenta el metabolismo basal y mejora la concentración cerebral.</div>\
                      </div>\
                  </div>\
                </div>\
          </section>';
          //var cad='<button type="button" habito="'+habito+'" class="btn miCompromiso btn-block btn-success btn-lg">Mi Compromiso</button><img id="imagenLlena" width="100%" height="100%" src="img/'+imagenACargar+'.jpg"/>';
        
          //var cad='<button type="button" habito="'+habito+'" class="btn miCompromiso btn-block btn-success btn-lg">Mi Compromiso</button><img id="imagenLlena" width="100%" height="100%" src="img/'+imagenACargar+'.jpg"/>';
          $("#mainContent").html(cad);

          myMsgSpinner.dialog('close');
          //$("#messageToChangeMensaje").html("Tu puntuación fue: "+resultado3+".<br><br>");
          //$("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==1)
        {
          myMsgSpinner.dialog('close');          
          var cad='<section class="content row" style="position:fixed;"><div class="col-md-12 margenTop10">';
          cad=cad+'<div class="FlamaSemicondensedSemibold size18 colorAzulMarino" style="margin:0 auto; width: 70%;">'+preguntaActual+'. '+resp.pregunta+'</div>\
                </div><div class="col-md-12 margenTop5" style="margin-top: 7%;"><div class="col-md-6"><img style="left:20%;width:80%;" src="img/c'+habito+'_'+preguntaActual+'.png"/></div>';
          cad=cad+'<div class="col-md-6"><div style="width: 50%;">';
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
          cad=cad+'<button style="margin-bottom: 20px;" type="button" puntos="'+puntosNo+'" habito="'+habito+'" class="siguientePregunta btn btn-block btn-success btn-lg">No / nunca</button>';
          cad=cad+'<button style="margin-bottom: 20px;" type="button" puntos="'+puntosRara+'" habito="'+habito+'" class="siguientePregunta btn btn-block btn-primary btn-lg">Rara vez</button>';
          cad=cad+'<button style="margin-bottom: 20px;" type="button" puntos="'+puntosAveces+'" habito="'+habito+'" class="siguientePregunta btn btn-block btn-info btn-lg">A veces</button>';
          cad=cad+'<button style="margin-bottom: 20px;" type="button" puntos="'+puntosFrecuentemente+'" habito="'+habito+'" class="siguientePregunta btn btn-block btn-danger btn-lg">Frecuentemente</button>';
          cad=cad+'<button style="margin-bottom: 20px;" type="button" puntos="'+puntosSi+'" habito="'+habito+'" class="siguientePregunta btn btn-block btn-warning btn-lg">Si / siempre</button>';
          cad = cad +'</div></div></div></section>';
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
  var elemento =$('.cuestionario[habito="'+habito+'"] i').first();
  if($(elemento).hasClass("fa-lock"))
  {
    //commit con replace
    $("#messageToChangeMensaje").html("Para realizar esta actividad tienes que realizar la anterior.");
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
    return;
  } 
  
  var ventana_ancho = $(window).width();
  var ventana_alto = $(window).height();

  var widthSidebar = $(".sidebar").width();

  var medidasImagen = $("#imgEvalEstiloVidaRVM").width();

  var recalculandoW = ventana_ancho-widthSidebar;
  var recalculandoH = ventana_alto;

 // $("#imgEvalEstiloVidaRVM").css("width", recalculandoW);
  $("#imgEvalEstiloVidaRVM").css("height", recalculandoH);
  
  $(".contenedorImgEvalEV").css("left", widthSidebar);

  

  var cad='<section class="contenedorImgEvalEV">\
            <div>\
              <div class="posBotonEvalEV">\
                <button type="button" habito="'+habito+'" id="realizaCuestionario" class="btn btn-block btn-success btn-lg">\
                   Realizar cuestionario\
                </button>\
               </div>\
               <img id="imgEvalEstiloVidaRVM" src="img/cuestionario'+habito+'.jpg" width="'+recalculandoW+'" height="'+recalculandoH+'">\
            </div>\
      </section>';
  var style='';
  $("#mainContent").html(cad); 
});
$(document).on("click","#miIMC", function () {
  var elemento =$(this).find("i").first();
  if($(elemento).hasClass("fa-lock"))
  {
    $("#messageToChangeMensaje").html("Para realizar esta actividad tienes que realizar la anterior.");
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
    return;
  }
  var nivel = parseInt($(this).attr("nivel"));//
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
          $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
        }
        if(resp.success==1)
        {
          myMsgSpinner.dialog('close');
        subeDeNivel(nivel);//
            var gender = "welcomeFemale";//hombres background!
            var cintura = resp.cintura;
            var cinturaRiesgo="";
            var cinturaColor="";
           


            var indicador1 = 90;
            var indicador2 = 102;
            var imageng="h";

            if(resp.gender!="male")
            {
              gender = "welcomeMale";//mujeres background!
              indicador1 = 80;
              indicador2 = 88;
              imageng="m";
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
            var cad = '<section class="content"><div style="color: #FFF !important;" class="row">\
            <div class="col-md-12" style="padding: 1% 8% 1% 8%; text-align: center;"><span class="perimetrodatos">¡Hola! tu DIÁGNOSTICO</span><span class="perimetro"> (Basado en los datos colocados en la inscripción se proporcionarán de manera personalizada los siguientes diagnósticos) <span></div><div class="col-md-9 marcoizq">';
            var palabra = "";
            var riesgos = "";
            var color = "";
            var enfermedades="";
           ////
 var enfermedadesAdicionales1="<ul>\
<li>Trastornos del sistema inmunológico (Las defensas de tu cuerpo)</li>\
<li>Pérdida de masa ósea</li>\
<li>Anemia por deficiencia de hierro</li>\
<li>Problemas cardíacos</li>\
<li>Mayor riesgo de sufrir infecciones</li>\
<li>Problemas de fertilidad</li>\
<li>Mayor riesgo de sufrir osteoporosis</li>\
<li>Desarrollar demencia</li></ul></div>";

var  enfermedadesAdicionales2="<div class=col-md-6><ul><li>Diabetes </li><li>Presión arterial alta (hipertensión)</li><li>Osteoartritis </li><li>Insuficiencia cardíaca </li><li>Algunos tipos de cáncer </li><li>Problemas para respirar durante el sueño </li><li>Ataques cardíacos debido a cardiopatía </li><li>Derrame cerebral</li><li>Cálculos biliares y problemas del hígado  </li><li>Problemas óseos y articulares</li><li>Disfunción de la vesícula</li><li>Estrés </li></ul></div>";

var enfermedadesAdicionales3=" <div class=col-md-6> <ul><li>Ansiedad </li><li>Depresión</li><li>Niveles altos de colesterol y triglicéridos en la sangre</li><li>Niveles bajos de HDL (Colesterol bueno)</li><li>Niveles altos de LDL (Colesterol malo)</li><li>Síndrome metabólico</li><li>Varices</li><li>Infartos al corazón</li><li>Gastritis</li><li>Reflujo gastroesofágico</li><li>Alteraciones menstruales en las mujeres</li><li>Infertilidad</li></ul></div></div>";
var enfermedadesAdicionales4="Diabetes, Presión arterial alta (hipertensión) , Osteoartritis , Insuficiencia cardíaca, Algunos tipos de cáncer, Problemas para respirar durante el sueño,  Ataques cardíacos debido a cardiopatía, Derrame cerebral, Cálculos biliares y problemas del hígado, Problemas óseos y articulares, Disfunción de la vesícula, Estrés, Ansiedad, Depresión, Niveles altos de colesterol y triglicéridos en la sangre, Niveles bajos de HDL (Colesterol bueno), Niveles altos de LDL (Colesterol malo), Síndrome metabólico, Varices, Infartos al corazón, Gastritis, Reflujo gastroesofágico, Alteraciones menstruales en las mujeres, Infertilidad </div>";
            imc = Math.round(imc * 100) / 100
            var imagen = "";
            if(imc<18.5)
            {
              palabra = "BAJO PESO";
              riesgos = "RIESGOS";
              color = "F00";
              imagen= imageng+"1"
              enfermedades= enfermedadesAdicionales1;
            }
            else
            {
              if(imc<25)
              {
                palabra = "PESO NORMAL";
                riesgos = "RIESGO BAJO";
                color = "00A65A";
                imagen= imageng+"2"
                enfermedades= "</div>";
              }
              else
              {
                if(imc<30)
                {
                  palabra = "SOBREPESO";
                  riesgos = "RIESGO MODERADO";
                  color = "FF0";
                  imagen= imageng+"3"
                  enfermedades= enfermedadesAdicionales2+enfermedadesAdicionales3;
                }
                else
                {
                  if(imc<35)
                  {
                    palabra = "OBESO";
                    riesgos = "RIESGO ALTO";
                    color = "FE9A2E";
                    imagen= imageng+"4"
                     enfermedades= enfermedadesAdicionales2+enfermedadesAdicionales3;
                  }
                  else
                  {
                    if(imc<40)
                    {
                      palabra = "OBESO SEVERO";
                      riesgos = "RIESGO MUY ALTO";
                      color = "F00";
                      imagen= imageng+"5"
                       enfermedades= enfermedadesAdicionales2+enfermedadesAdicionales3;
                    }
                    else
                    {
                      palabra = "OBESO MORBIDO";
                      riesgos = "RIESGO MUY ALTO";
                      color = "F00";
                      imagen= imageng+"6"
                       enfermedades= enfermedadesAdicionales2;
                    } 
                  }   
                }
                
              }
            }

            cad=cad+'<div class="col-md-4 tablilla" align="center">Tu IMC es: <br> <span style="font-size:.4em">(Índice de Masa Corporal)</span><br> <span style="color:#'+color+'">'+imc+'</span><br></div>\
            <div class="col-md-4 rango">De acuerdo a tu <span style="font-size:1.0em">IMC<span> <br>tu rango de peso es:<br> <span class="perimetrodatos" style="color:#'+color+'">'+palabra+'</span></div>\
            <div class="col-md-4"><img id="monito" class="monitos" src="../app/img/'+imagen+'.png"></div>\
            <div class="col-md-12" align="center">De acuerdo a esto tienes <span class="perimetrodatos" style="color:#'+color+'">'+riesgos+'</span> de sufrir alguna o más de una de las siguientes enfermedades:</div>\
            <div class="col-md-12 perimetrotexto" style="color:#'+color+'">';
       ////
  cad = cad + enfermedades;
  ////

cad = cad + '</div><div class="col-md-3 marcoder"><div><span class="perimetro" >PERIMETRO ABDOMINAL</span><br><span class="perimetrotexto" >Tu perímetro abdominal es:</span><br><span class="perimetrodatos" style="color:#'+color+';" > '+cintura+'</span><br>\
<span class="perimetrotexto" >De acuerdo a ello tienes un:<span><br><span class="perimetrodatos" style="color:#'+color+';">'+cinturaRiesgo+'</span><br><span class="perimetrotexto" >de padecer afecciones relacionadas con la obesidad como:';

cad = cad + enfermedadesAdicionales4;

            cad=cad+'</span></div></div></div></section>';
            $("#mainContent").html(cad);
            var empiezo = 0.1;
            var voyParaArriba = true;
             if(palabra!="PESO NORMAL")
             {
                intervalo = setInterval(function() {
                if($("#monito").length>0)
                {
                  $("#monito").css("opacity", empiezo);
                  if(voyParaArriba)
                  {
                    if(empiezo<1)
                    {
                      empiezo=empiezo+0.1;
                    }
                    else
                    {
                      voyParaArriba=false;
                      empiezo=0.9;
                    }
                  }
                  else
                  {
                    if(empiezo>0.09)
                    {
                      empiezo=empiezo-0.1;
                    }
                    else
                    {
                      voyParaArriba=true;
                      empiezo=0.1;
                    }
                  }
                }
                else
                {
                  clearInterval(intervalo);
                }
                
              },100);
             }
        }
      }
    });
});
var intervalo;
$(document).on("click",".borrarRegistro", function () {
  var time = $(this).attr("time");
  var param = {
      servicio : 'app',
      accion : 'borraIMCRegistro',
      time : time
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
          actualizaHistorial();
        }
      }
    });
});
function actualizaHistorial() {
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
            var cad = '<section class="content"><div style="color: #FFF !important;" class="row"><div class="col-md-12"><div class="box-header"><h3 class="box-title">Historial de mis registros</h3></div><div class="box-body table-responsive no-padding"><table class="table table-hover"><tbody><tr><th>Peso</th><th>Talla</th><th>Cintura</th><th>Presión arterial</th><th>Glucosa</th><th>Colesterol</th><th>Colesterol LDL</th><th>Colesterol HDL</th><th>Triglicéridos</th><th>Fecha de registro</th><th>Borrar</th></tr>';
            var i = 0;
            for(i=0;i<resp.datos.length;i++)
            {
              cad=cad+'<tr><td>'+resp.datos[i].kg+' kg</td><td>'+resp.datos[i].cm+' cm</td><td>'+resp.datos[i].cintura+' cm</td><td>'+resp.datos[i].presion+'/'+resp.datos[i].presionhg+' mmHg</td><td>'+resp.datos[i].glucosa+' mg/dl</td><td>'+resp.datos[i].colesterol+' mg/dl</td><td>'+resp.datos[i].ldl+' mg/dl</td><td>'+resp.datos[i].hdl+' mg/dl</td><td>'+resp.datos[i].trigliceridos+' mg/dl</td><td>'+timeConverter(parseInt(resp.datos[i].timestamp))+' </td><td><span time="'+resp.datos[i].timestamp+'" style="cursor:pointer;" class="borrarRegistro label label-danger">Borrar</span></td></tr>';
            }
            cad = cad + '</tbody></table></div></div></section>';
            $("#mainContent").html(cad);
          }
          else
          {
            $("#messageToChangeMensaje").html("Primero tienes que llenar tus datos de peso, talla y cintura.<br><br>");
            $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
          }
        }
      }
    });
}
$(document).on("click","#historialDeMisDatos", function () {
  actualizaHistorial();
});
// 2
$(document).on("click","#guardarMisDatos", function () {
  if(!validateText("peso")){return;}
  if(!validateText("talla")){return;}
  if(!validateText("cintura")){return;}
  var nivel =$(this).attr("nivel");
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
          subeDeNivel(nivel);
          //perdon por este hardcode.. ya es muy noche y me presionan mucho
          setTimeout(function () {
            myMsgSpinner.dialog('close');
            $("#miIMC").click(); },3000);
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
  var elemento =$(this).find("i").first();
  if($(elemento).hasClass("fa-lock"))
  {
    $("#messageToChangeMensaje").html("Para realizar esta actividad tienes que realizar la anterior.");
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
    return;
  }
    anadeClassAlMainContent("misDatos");
    var cad = '<section class="row" style="position:fixed;">\
                  <div class="col-md-12 ">\
                    <div class="col-md-3 contenidoResize" style="text-align: right;">\
                      <img src="img/backgroundPasos.png" style="width: 204px;">\
                    </div>\
                    <div class="col-md-9">\
                    </div>\
                  </div>\
                  <div class="col-md-12 margenTop5">\
                    <div class="col-md-1">\
                    </div>\
                    <div class="col-md-4">\
                    </div>\
                    <div class="col-md-7">\
                        <div class="MonserratRegular colorVioleta size20">MI INSCRIPCIÓN</div>\
                        <label>Por favor, proporciona la siguiente información</label><br>\
                        <div class="aumentame"  style="margin-left: 5%;">\
                            <label for="peso">Peso:</label>\
                              <input class="soloNumeros inputField" type="number" id="peso"/>kg\
                            <br>\
                            <label for="talla">Talla:</label>\
                              <input class="soloNumeros inputField" type="number" id="talla"/>cms\
                            <br>\
                            <label>(Recuerde ingresar la estatura de su cuerpo en centímetros. De este modo si mide 1.70 metros, escriba 170)</label>\
                            <br>\
                            <label for="cintura">Cintura:</label>\
                              <input class="soloNumeros inputField" type="number" id="cintura"/>cms (Ingrese su perímetro de Cintura)\
                            <br>\
                        </div>\
                        <label>Si lo conseguiste, proporciona la siguiente información OPCIONAL:</label>\
                        <div class="aumentame" style="margin-left: 5%;">\
                            <label for="presion">Presion arterial:</label>\
                              <input class="soloNumeros inputField" type="number" id="presion"/>/<input class="soloNumeros inputField" type="number" id="presionhg"/>mm/Hg\
                            <br>\
                            <label for="glucosa">Glucosa:</label>\
                              <input class="soloNumeros inputField" type="number" id="glucosa"/>mg/dl\
                            <br>\
                            <label for="colesterol">Colesterol total:</label>\
                              <input class="soloNumeros inputField" type="number" id="colesterol"/>mg/dl\
                            <br>\
                            <label for="ldl">Colesterol LDL: (malo)</label>\
                              <input class="soloNumeros inputField" type="number" id="ldl"/>mg/dl\
                            <br>\
                            <label for="hdl">Colesterol HDL: (bueno)</label>\
                              <input class="soloNumeros inputField" type="number" id="hdl"/>mg/dl\
                            <br>\
                            <label for="trigliceridos">Triglicéridos</label>\
                              <input class="soloNumeros inputField" type="number" id="trigliceridos"/>mg/dl<br>\
                        </div>\
                        <button type="button" nivel="'+$(this).attr("nivel")+'" class="btn btn-block btn-success btn-md" id="guardarMisDatos" style="width: 25%">Guardar</button>\
                    </div>\
                  </div>\
      </section>';
    $("#mainContent").html(cad);
    
 var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
   var font14 = myHeight* 0.0223285486443;
   var size20 =myHeight*0.0318979266348;

   $(".size20").css("font-size",size20+"px");
   $("label").css("font-size",font14+"px");
   $("input").css("font-size",font14+"px");
   $(".aumentame").css("font-size",font14+"px");
   $("button").css("font-size",font14+"px");
});     
$(document).on("click","#slideCaractarerizticas", function () {
  var elemento =$('#slideCaractarerizticas i').first();
  if($(elemento).hasClass("fa-lock"))
  {
    $("#messageToChangeMensaje").html("Para realizar esta actividad tienes que realizar la anterior.");
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
    return;
  }




  var ventana_ancho = $(window).width();
  var ventana_alto = $(window).height();

  var widthSidebar = $(".sidebar").width();


  var calculando = ventana_ancho - widthSidebar;


var cad = '<section class="content" style="position: fixed;">\
    <div id = "myCarousel" class = "carousel slide">\
     <ol class = "carousel-indicators" style="top: 2%;">\
        <li data-target = "#myCarousel" data-slide-to = "0" class = "active"></li>\
        <li data-target = "#myCarousel" data-slide-to = "1"></li>\
        <li data-target = "#myCarousel" data-slide-to = "2"></li>\
        <li data-target = "#myCarousel" data-slide-to = "3"></li>\
        <li data-target = "#myCarousel" data-slide-to = "4"></li>\
        <li data-target = "#myCarousel" data-slide-to = "5"></li>\
        <li data-target = "#myCarousel" data-slide-to = "6"></li>\
        <li data-target = "#myCarousel" data-slide-to = "7"></li>\
        <li data-target = "#myCarousel" data-slide-to = "8"></li>\
     </ol>\
      <div class = "carousel-inner" style="padding-bottom:0px;">\
        <div class = "item active" style="width:'+calculando+'px; height:'+ventana_alto+'px;">\
           <img src = "img/slider/0.jpg" style="width:100%; height:100%;">\
        </div>\
        <div class = "item" style="width:'+calculando+'px; height:'+ventana_alto+'px;">\
           <img class="imgCT" src = "img/slider/1.jpg" style="width:100%; height:100%;">\
        </div>\
        <div class = "item" style="width:'+calculando+'px; height:'+ventana_alto+'px;">\
           <img class="imgCT" src = "img/slider/2.jpg" style="width:100%; height:100%;">\
        </div>\
        <div class = "item" style="width:'+calculando+'px; height:'+ventana_alto+'px;">\
           <img class="imgCT" src = "img/slider/3.jpg" style="width:100%; height:100%;">\
        </div>\
        <div class = "item" style="width:'+calculando+'px; height:'+ventana_alto+'px;">\
           <img  class="imgCT" src = "img/slider/4.jpg" style="width:100%; height:100%;">\
        </div>\
        <div class = "item" style="width:'+calculando+'px; height:'+ventana_alto+'px;">\
           <img  class="imgCT" src = "img/slider/5.jpg" style="width:100%; height:100%;">\
        </div>\
        <div class = "item" style="width:'+calculando+'px; height:'+ventana_alto+'px;">\
           <img  class="imgCT" src = "img/slider/6.jpg" style="width:100%; height:100%;">\
        </div>\
        <div class = "item" style="width:'+calculando+'px; height:'+ventana_alto+'px;">\
           <img class="imgCT"  src = "img/slider/7.jpg" style="width:100%; height:100%;">\
        </div>\
        <div class = "item" style="width:'+calculando+'px; height:'+ventana_alto+'px;">\
           <img class="imgCT"  src = "img/slider/8.jpg" style="width:100%; height:100%;">\
        </div>\
     </div>\
   <a class = "carousel-control left" id="flechitaIzquierda" style="font-size: 120px; top: 25%; left: -50px;" href = "#myCarousel" data-slide = "prev">&lsaquo;</a>\
   <a class = "carousel-control right" id="flechitaDerecha"  style="font-size: 120px; top: 25%; right: -50px;" href = "#myCarousel" data-slide = "next">&rsaquo;</a>\
</div>\
</section>';
    $("#mainContent").html(cad);
  /*  $('#myCarousel').carousel({
      interval: 2000
    });*/
$('#myCarousel').carousel({
      interval: false
    });
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  var top = (myHeight/2)-(70);
  $("#flechitaIzquierda").css("top",top+"px");
  $("#flechitaDerecha").css("top",top+"px");
    subeDeNivel(2);//
});        
$(document).on("click",".comenzemosButton", function () {
	//
  var habito = parseInt($(this).attr("habito"));
  var dia = $(this).attr("dia");
  var elemento =$('.habitoDia[habito="'+habito+'"][dia="'+dia+'"] i').first();
  if(isNaN(habito))
  {
    $('.bienvenido')[0].click();
    return;
  }
  if($(elemento).hasClass("fa-lock"))
  {
    $("#messageToChangeMensaje").html("Para realizar esta actividad tienes que realizar la anterior.");
    $("#dialog_Mensaje").dialog("option", "position", {my: "center", at: "center", of: window});$("#dialog_Mensaje").dialog("open");
    return;
  }
  cargaHabitoDiaConsecutivo(habito,dia);
});

$(document).on("click",".bienvenido", function () {
var gender = $("#gender").html();
var nombre = $("#nombre").html().trim();

var male = "welcomeMale";
var female = "welcomeFemale";

var persona = male;

if (gender=="male"){

  anadeClassAlMainContent(female);
  

}else{

  anadeClassAlMainContent(male);
  persona = female;

}

 var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
     
var cad = '<section class="content">\
              <div class="row">\
                 <div class="col-md-3 personaBienvenida">\
                    <img id="laImagen" src="img/'+persona+'.png">\
                  </div>\
                  <div class="col-md-3">\
                  </div>\
                  <div style="margin-left: 5%;" id="special" class="col-md-6 FlamaBook  spaceTop">\
                      <div class=" size24">¡BIENVENIDA!</div>\
                        <div class="spaceTop size24">'+nombre+'</div>\
                        <div class="spaceTop ">\
                        nos complace darte la bienvenida al CURSO EN LÍNEA del Programa Ocho Hábitos\
                        Saludables de la Metodología Quiero ¡Vivir Sano!<br>\
                      </div>\
                      <div class="FlamaMedium spaceTop ">\
                      ¡Felicidades por preocuparte por tu salud y aceptar este desafío de incorporar\
                      nuevos y saludables hábitos que mejorarán tu calidad de vida! Estos hábitos\
                      que te proponemos practicar, tienen un efecto sobre tu Salud Integral.<br>\
                      </div>\
                      <div class="spaceTop contenidoResize">\
                        <img id="salud" src="img/saludIntegral.png"><br>\
                      </div>\
                        <div class="spaceTop ">\
                        El Curso En Línea de Ocho Hábitos Saludables de Quiero ¡Vivir Sano!, es una\
                        aventura de ocho semanas. Durante el curso realizarás tareas prácticas y tendrás\
                        acceso a contenidos con sustento científico.  Este contenido es actualizado y\
                        sumamente sencillo de practicar, permitiéndote mejorar tu Salud Integral.<br>\
                        </div>\
                        <div class="spaceTop ">\
                        ¡Comparte estos hábitos con tus amigos, familiares y vecinos e invítalos a\
                        ponerlos en práctica! Esto, garantizará una motivación a lo largo de las 8 semanas\
                         y la obtención de resultados más duraderos.<br>\
                        Nuevamente, ¡bienvenido!\
                        </div>\
                    </div>\
                    <div class="col-md-9">\
                  </div>\
              <div class="col-md-3 spaceTop" style="position:absolute;top:0px;right: -7%;">\
                <img class="logo" id="qvs" src="img/logoSmall.png"/>\
              </div>\
          </div>\
    </section>';
 var size24 = myHeight*0.0350877192982;
 var special = myHeight*0.0255183413078;
 var salud = myHeight*0.0890749601276;
 var logo = myHeight*0.237639553429;
    $("#mainContent").html(cad);
    myHeight=myHeight-100;
    $("#laImagen").css("height",myHeight+"px");
    $("#qvs").css("height",logo+"px");
    $("#salud").css("height",salud+"px");
     $("#special").css("font-size",special+"px");  

   $(".size24").css("font-size",size24+"px"); 
    subeDeNivel(1);//
}); 
//raul