/**
 * Created by tahae on 7/7/2017.
 */

$('body').on('click','.roomBody .eachDevice',function(){
    var element = $(this);
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
    console.log(JSON.stringify(locationSelect));
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

setInterval(loadLocations,9999);

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
            console.log('huh?');
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
            console.log('huh?');
            $(this).attr('src','icons/lamp100.png');
            $(this).removeClass('lamp60');
            $(this).addClass('lamp100');
        }
    });
});
$('body').on('click', '.lamp100', function(e) {
    let id = $(this).siblings('span').html();
    $.ajax({
        url: '/api/actuator/' + id + '/'+0,
        method: 'GET',
        beforeSend:function(){
        },
        success:function(){
            console.log('huh?');
            $(this).attr('src','icons/lampOff.png');
            $(this).removeClass('lamp100');
            $(this).addClass('lampOff');
        }
    });
});