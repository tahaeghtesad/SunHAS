/**
 * Created by tahae on 6/30/2017.
 */
const models = require('./models');
module.exports = {
    isSensor: (Function) => {
        switch (Function){
            case models.Function.Temperature:
            case models.Function.Humidity:
            case models.Function.Door:
                return true;
            default:
                return false;
        }
    }
};