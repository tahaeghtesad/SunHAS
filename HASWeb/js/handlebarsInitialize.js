/**
 * Created by tahae on 7/7/2017.
 */
Handlebars.registerHelper('empty', (a, options) => {
    if (a.length === 0)
        return options.fn(this);
    else return options.inverse(this);
});

Handlebars.registerHelper('ifeq', (a, b, options) => {
    if (a === b) {
        return options.fn(this)
    }
    return options.inverse(this)
});

Handlebars.registerHelper('index', (array, index, property, options) => {
    return index === -1 ? array[array.length-1][property].toString().substr(0,4) : array[index][property].toString().substr(0,4);
});
Handlebars.registerHelper('index_of', function(array,context) {
    var i;
    for(i = 0 ; i < array.length; i++ ){
        if(array[i]===context) {
            return i;
        }
    }
    return null;
});
Handlebars.registerHelper('range', (object,index,value,options) => {
    index = index === -1 ? object.length-1 : index;
    if(object[index].value  < 33){

        return `<img src="icons/lampOff.png" class="lampOff"/>`;
    }
    else if(object[index].value < 66){
        return `<img src="icons/lamp60.png" class="lamp60"/>`;
    }
    else{
        return `<img src="icons/lamp100.png" class="lamp100"/>`;
    }
});