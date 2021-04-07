//PIRAI Validation
const Joi = require('@hapi/joi');


const profundidadValidation = (data) => {
    const bodyFormat = Joi.object({
        Codigo: Joi.string()
            .required()
            .min(2)
            .max(10),
        Descripcion: Joi.string()
            .required()
            .min(3)
            .max(50),
        Orden: Joi.number()
            .integer()
            .required()
    });
    return bodyFormat.validate(data)
}




module.exports.profundidadValidation = profundidadValidation;