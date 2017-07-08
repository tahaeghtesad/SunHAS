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

$('body').on('click','.eachRoom .addLocation',function(){
    console.log($('.newLocationName').val());
    //  add she TODO vase khodet :D
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
    //  add she TODO vase khodet :D
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
            $('#unassignedDevices').text(data.length);
            $('.addNewDevice ul').empty();
            $.each(data, (i, d) => {
                if (!d.location)
                    $('.addNewDevice ul').append(`<li class="newDeviceItem" id="${d._id}">${d.function_} - ${d._id.substr(0,5)}</li>`);
            });
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
            console.log(data);
            $.get('js/hbs/location.hbs', function (template) {
                let compiledTemplate = Handlebars.compile(template);
                $('#locations').html(compiledTemplate({location: data}));
                console.log(data);
                console.log(data[1].agents[1].states[data[1].agents[1].states.length-1].value);
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

$('body').on('click', '#newLocationFormSubmit', (e) => {
    e.preventDefault();
    let name = $('input[name=location]').val();
    $.ajax({
        url: '/api/location',
        method: 'POST',
        data: {
            name: name
        },
        success: loadLocations
    });
});

let locationSelect;

$('body').on('click', '.newDeviceItem', function(e) {
    console.log('hi');
    $.ajax({
        url: '/api/actuator/' + $(this).attr('id'),
        method: 'PUT',
        data: {
            location: locationSelect.id
        },
        success: loadLocations
    });
});