//on ready hardcode
var api ="http://quierovivirsano.org/app/qvs.php"
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
            var cad = '<section class="content"><div style="color: #FFF !important;" class="row"><div class="col-md-9">';
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
                color = "0F0";
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
           
            cad = cad + '</div><div class="col-md-3">';

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
            var cad = '<section class="content"><div style="color: #FFF !important;" class="row"><div class="col-md-12"><div class="box-header"><h3 class="box-title">Historial de mis registros</h3></div><div class="box-body table-responsive no-padding"><table class="table table-hover"><tbody><tr><th>Peso</th><th>Talla</th><th>Cintura</th><th>Presión arterial</th><th>Glucosa</th><th>Colesterol</th><th>Triglicéridos</th><th>Fecha de registro</th></tr>';
            var i = 0;
            for(i=0;i<resp.datos.length;i++)
            {
              cad=cad+'<tr><td>'+resp.datos[i].kg+' kg</td><td>'+resp.datos[i].cm+' cm</td><td>'+resp.datos[i].cintura+' cm</td><td>'+resp.datos[i].presion+' mmHg</td><td>'+resp.datos[i].glucosa+' mg/dl</td><td>'+resp.datos[i].colesterol+' mg/dl</td><td>'+resp.datos[i].trigliceridos+' mg/dl</td><td>'+timeConverter(parseInt(resp.datos[i].timestamp))+' </td></tr>';
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
      trigliceridos : $("#trigliceridos").val().trim()
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




            
            if( imcAnim !== "" ) {
                animRoulette( boxCircle, imcAnim );
                centros.eq(0).fadeOut(1900);
                centros.eq(1).addClass( imcAnim ).fadeIn( 2500 );
            }
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
    <label for="peso">Peso</label>\
    <input class="soloNumeros" type="number" id="peso"/>kg\
    <br>\
    <label for="talla">Talla</label>\
    <input class="soloNumeros" type="number" id="talla"/>cms\
    <br>\
    <label>(Recuerde ingresar la estatura de su cuerpo en centímetros. De este modo si mide 1.70 metros, escriba 170)</label>\
    <br>\
    <label for="cintura">Cintura</label>\
    <input class="soloNumeros" type="number" id="cintura"/>cms (Ingrese su perímetro de Cintura)\
    <br>\
    <label>Si lo conseguiste, proporciona la siguiente información OPCIONAL:</label>\
    <br>\
    <label for="presion">Presion arterial:</label>\
    <input class="soloNumeros" type="number" id="presion"/>mm/Hg\
    <br>\
    <label for="glucosa">Glucosa</label>\
    <input class="soloNumeros" type="number" id="glucosa"/>mg/dl\
    <br>\
    <label for="colesterol">Colesterol total:</label>\
    <input class="soloNumeros" type="number" id="colesterol"/>mg/dl\
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