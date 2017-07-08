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