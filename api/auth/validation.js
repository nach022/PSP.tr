//Validation
const Joi = require('@hapi/joi');


const loginValidation = (data) => {
    const bodyFormat = Joi.object({
        UserId: Joi.string().required(),
        Password: Joi.string().required(),
        AppId: Joi.number().integer().required()
    });
    return bodyFormat.validate(data)
}


const registerValidation = (data) => {
    const bodyFormat = Joi.object({
        Nombre: Joi.string()
                .required()
                .min(5)
                .max(50)
    });
    return bodyFormat.validate(data)
}


const servicioEjecutorValidation = (data) => {
    const bodyFormat = Joi.object({
        Nombre: Joi.string()
            .required()
            .min(3)
            .max(50)
    });
    return bodyFormat.validate(data)
}


const tipoTareaValidation = (data) => {
    const bodyFormat = Joi.object({
        Nombre: Joi.string()
            .required()
            .min(5)
            .max(100),
        Responsable: Joi.number()
            .integer()
            .required()
    });
    return bodyFormat.validate(data)
}

const tareaValidation = (data) => {
    const bodyFormat = Joi.object({
        PPM: Joi.string()
            .required()
            .min(3)
            .max(20),
        Descr: Joi.string()
            .required()
            .min(5)
            .max(80),
        Frecuencia: Joi.number()
            .integer()
            .allow(null),
        Periodo: Joi.string()
            .allow(null)
            .max(1)
            .valid('D', 'W', 'M', 'Y'),
        TipoTareaId: Joi.number()
            .integer()
            .required(),
        Equipo: Joi.string()
            .required()
            .min(5)
            .max(80)

    });
    return bodyFormat.validate(data)
}

const usuarioValidation = (data) => {
    const bodyFormat = Joi.object({
        Id: Joi.number()
            .integer()
            .required(),
        Nombre: Joi.string()
            .required()
            .min(5)
            .max(50),
        Roles: Joi.array(),
        RolesList: Joi.string()
            .allow(null)
    });
    return bodyFormat.validate(data)
}




module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;
module.exports.servicioEjecutorValidation = servicioEjecutorValidation;
module.exports.tipoTareaValidation = tipoTareaValidation;
module.exports.tareaValidation = tareaValidation;
module.exports.usuarioValidation = usuarioValidation;