var api = "http://quierovivirsano.org/app/qvs.php";
$(document).on("click", "#guardarCambios", function (){
    var correo = $("#referrer_id").val();
    var valor = $("#esPromotor").val();
    var param = {
        servicio : 'login',
        accion : 'guardarCambios',
        correo : correo,
        valor : valor
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
                alert("Cambios guardados, fue enviado un correo a: "+correo+" para notificarlo.");
            }
            if(resp.success==2)
            {
                alert("Sin cambios desde la ultima vez.");
            }
        }
    });
});
function changeCorreo(correo)
{
    var param = {
        servicio : 'login',
        accion : 'checarSiEsPromotor',
        correo:correo
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
                $("#esPromotor").val(resp.esPromotor);
            }
        }
    });
}
   
$(document).ready(function() {  
    var param = {
        servicio : 'login',
        accion : 'dameUsuarios'
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
                var arregloDePromotores=new Array();
                for(i=0;i<resp.promotores.length;i++)
                {
                    arregloDePromotores.push({label:resp.promotores[i].nombre+" "+resp.promotores[i].correo, name:resp.promotores[i].correo});
                }
                $("#nombre").autocomplete({ 
                   source: arregloDePromotores,
                      select: function(event, ui) {
                        $("#nombre").val(ui.item.label);  // ui.item.value contains the id of the selected label
                        $("#referrer_id").val(ui.item.name);  // ui.item.value contains the id of the selected label
                        changeCorreo(ui.item.name);
                    }
                });
            }
        }
    });
});