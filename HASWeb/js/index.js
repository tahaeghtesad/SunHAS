/**
 * Created by tahae on 7/7/2017.
 */

$('body').on('click','.roomBody .eachDevice',function(){
    var element = $(this);
    var clickedRoomName  = element.parents('.eachRoom').find('.roomName').html().trim();
    var i;
    if(element.find('.deviceName').html()==='Lights') {
        $.each(allRules, function (index, data) {
            console.log(JSON.stringify(data));
            $.ajax({
                url: '/api/actuator/' + data.data.actuatorId,
                method: 'GET',
                success: (actuator) => {
                    $.ajax({
                        url: '/api/location/' + actuator.location,
                        method: 'GET',
                        success: (location) => {
                            if (location.name === clickedRoomName) {
                                $.each(locationsNames, (i,d) => {
                                    if (d.name === clickedRoomName && d.isChecked === false) {
                                        let minute = data.repeatInterval.toString().split(' ')[0];
                                        let hour = data.repeatInterval.toString().split(' ')[1];
                                        let lampNumber = $("#" + data.data.actuatorId).parents('.withDetails').find('h2').html();
                                        element.find('.withDetails').find('.details').append(`<div class="turn">
                                            <img src="icons/remove.png" class="removeRule"/>
                                            <span style="display:none">${data.name}</span>
                                            <h3>Turn Light</h3>
                                            <input type="number" name="lamp10" class="digit number" value="${lampNumber}">
                                            <input type="number" name="time1" class="digit value" value="${data.data.value}">
                                            <h3>At</h3>
                                            <input type="number" name="hour" class="digit hour" value="${hour}">
                                            <input type="number" name="minute" class="digit minute" value="${minute}">
                                            </div>`
                                        );
                                        d.isChecked = true;
                                    }

                                });
                            }
                        }
                    });
                }
            });
        });
    }
    if(element.find('.withDetails').css('display')==='none'){
        $('.eachDevice .noDetails').show(200);
        $('.eachDevice .withDetails').hide(200);
        element.find('.withDetails').show(300);
        element.find('.noDetails').hide(300);
    }
});

$('body').on('click','.eachRoom .newLocationBtn',function(){
    $('.addLocation').show(200);
    $('.newLocationName').show(200);
    $('.closeNewLocation').show(200);
    $('.addLoc').hide(100);
    $('.newLocationBtn').hide(100);
});

$('body').on('click','.eachRoom .closeNewLocation',function(){
    $('.addLocation').hide(100);
    $('.newLocationName').hide(100);
    $('.closeNewLocation').hide(100);
    $('.addLoc').show(200);
    $('.newLocationBtn').show(200);
});
$('body').on('click','.eachRoom .addNewDeviceBtn',function(){
    locationSelect = {
        name: $(this).parents('.eachRoom').find('.roomName').text(),
        id: $(this).parents('.eachRoom').find('.roomHeader span').text()
    };
    $('#newLocation').text(locationSelect.name);
    $('.addNewDevice').slideDown(300);
});
$('body').on('click','.closeNewDevice',function(){
    $('.addNewDevice').slideUp(300);
});

function setClock() {
    $('#clock').text(moment().format('H:mm'));
}

setClock();
setInterval(setClock, 500);

function unAssignedDevices(){
    $.ajax({
        url: '/api/actuator',
        method: 'GET',
        success: (data) => {
            let cunt=0;
            $('.addNewDevice ul').empty();
            $.each(data, (i, d) => {

                if (!d.location) {
                    cunt++;
                    $('.addNewDevice ul').append(`<li class="newDeviceItem" id="${d._id}">${d.function_} - ${d._id.substr(0, 5)}</li>`);
                }
            });
            $('#unassignedDevices').text(cunt);
        }
    });
}
unAssignedDevices();
setInterval(unAssignedDevices, 5000);

function loadLocations(){
    $.ajax({
        url:'/api/location',
        method: 'GET',
        success: (data) => {
            $.get('js/hbs/location.hbs', function (template) {
                let compiledTemplate = Handlebars.compile(template);
                $('#locations').html(compiledTemplate({location: data}));
                $.get('js/hbs/newLocation.hbs',(newLocationTemplate) => {
                    $('#locations').append(newLocationTemplate);
                },'html');
            }, 'html');
        }
    });
}

$(document).ready(() => {
    loadLocations();
});

// setInterval(loadLocations,9999);

$('body').on('click', '#newLocationFormSubmit', (e) => {
    e.preventDefault();
    let name = $('input[name=location]').val();
    $.ajax({
        url: '/api/location',
        method: 'POST',
        data: {
            name: name
        },
        success: () => {
            loadLocations();
            $('.addNewDevice').slideUp(300);
        }
    });
});

let locationSelect;

$('body').on('click', '.newDeviceItem', function(e) {
    $.ajax({
        url: '/api/actuator/' + $(this).attr('id'),
        method: 'PUT',
        data: {
            location: locationSelect.id
        },
        success: loadLocations
    });
});
$('body').on('click', '.lampOff', function(e) {
    let id = $(this).siblings('span').html();
    $.ajax({
        url: '/api/action/' + id + '/'+50,
        method: 'GET',
        beforeSend:function(){
        },
        success:function(){
            $(this).attr('src','icons/lamp60.png');
            $(this).removeClass('lampOff');
            $(this).addClass('lamp60');
        }
    });
});
$('body').on('click', '.lamp60', function(e) {
    let id = $(this).siblings('span').html();
    $.ajax({
        url: '/api/action/' + id + '/'+100,
        method: 'GET',
        beforeSend:function(){
        },
        success:function(){
            $(this).attr('src','icons/lamp100.png');
            $(this).removeClass('lamp60');
            $(this).addClass('lamp100');
        }
    });
});
$('body').on('click', '.lamp100', function(e) {
    let id = $(this).siblings('span').html();
    $.ajax({
        url: '/api/action/' + id + '/'+0,
        method: 'GET',
        beforeSend:function(){
        },
        success:function(){
            $(this).attr('src','icons/lampOff.png');
            $(this).removeClass('lamp100');
            $(this).addClass('lampOff');
        }
    });
});

$(document).ready(function(){
    getAllRules();
    getAllLocations();
});
var locationsNames ;
function getAllLocations(){
    $.ajax({
        url : "api/location",
        method:"GET",
        beforeSend:function(){
        },
        success:function(allLocations){
            locationsNames = [];
            let x;
            for(x=0;x<allLocations.length;x++){
                let eachLocation = {};
                eachLocation.name = allLocations[x].name;
                eachLocation.isChecked = false;
                locationsNames.push(eachLocation);
            }
        }
    });
}
var allRules;
function getAllRules(){
    var i ;
    $.ajax({
        url: "api/rule",
        method: "GET",
        success: function(data){
            allRules=data;
            for(i = 0; i<allRules.length;i++){

            }
        }
    });
}
$('body').on('click','.newScheduleForm img',function(){
    var element = $(this);
    var parent =  element.parents('.newScheduleForm');
    var number = parent.find('.number').val();
    var optionId = element.parents('.withDetails').find(".lamp"+number).html();
    var value = parent.find('.value').val();
    var hour = parent.find('.hour').val();
    var minute = parent.find('.minute').val();

    addRule(optionId,hour,minute,value);
});

function addRule(optionId,hour,minute,value){

    let cron = minute + " " + hour + " * * *";
    let data = {
        cron: cron,
        actuator: optionId,
        value: value
    };

    $.ajax({
        url: '/api/rule',
        method: 'POST',
        data: data,
        success:function(data){
            window.alert(JSON.stringify(data) + " \ n Your new Rule just Added" );s
            document.location.reload();
        }
    });
}