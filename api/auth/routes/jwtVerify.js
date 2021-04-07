// middleware para verificar el token de autorización en el header de las requests.

const jwt = require("jsonwebtoken");
const { Op } = require('sequelize');

module.exports = function (req, res, next) {
  //si la request no tiene cabezal de autorización retorno 401.
  if (!req.headers.authorization){
    return res.status(401).send("Acceso denegado.");
  }
  else{
    //si el cabezal de autorización no tiene un token separado por espacio, retorno 401
    let token = req.headers.authorization.split(' ')[1];
    if(token === 'null'){
      return res.status(401).send("Acceso denegado.");
    }
    else{
      try{
        //verifico que el token sea un JWT válido y obtengo el payload contenido dentro del token
        let payload = jwt.verify(token, JWT_SECRET);
        //si la verificación retorna false, devuelvo 401.
        if(!payload){
          console.log("acceso denegado, token: ", token);
          return res.status(401).send("Acceso denegado.");
        }
        //si la verificación fue exitosa.
        else{ 
          // si no es un registro de nuevo usuario
          if (req.originalUrl !== '/api/user/register'){
            //Verifico que el rol del usuario, siga siendo el mismo que cuando ingresó.
            db.models['UserRol'].findAndCountAll({
              where: {
                  Legajo: payload._id,
                  RolId: payload.rol
              },
              include: [ 
                { model: db.models['Rol'] },
              ]  
            })
            .then(queryRes => {
              // si el usuario no tiene más ese rol, devuelvo 401.
              if (queryRes.count != payload.rol.length){
                res.status(401).send("Los roles del usuario fueron modificado.");
              }
              // si todo fue exitoso y el rol sigue estando asignado al usuario, me fijo que el rol tenga permisos para ese request
              else{
                var urlAux = "";
                try{
                  urlAux = req.baseUrl + req.route.path;
                  let indx = urlAux.lastIndexOf(':');
                  if(indx != -1){
                    urlAux = urlAux.substring(0, indx-1);
                  }
                }
                catch{
                  urlAux =  req.originalUrl;
                }
                

                db.models['RolRequest'].findAndCountAll({
                  where: {
                      Url: urlAux,
                      RolId: payload.rol,
                      Method: ['*', req.method]
                  }
                })
                .then(rolRes => {
                  if (rolRes.count < 1){
                    //console.log(req);
                    res.status(405).send("El rol del usuario no tiene permisos para hacer este request.");
                  }
                  //Si todo está bien, agrego los datos de usuario y rol al request y lo encamino al handler para seguir procesándolo.
                  else{
                    req.userid = payload._id;
                    req.rolid = payload.rol;
                    req.appid = queryRes.rows[0].Rol.AppId; 
                    req.areas = [];
                    db.models['RolGruposAccion'].findAll({
                      where: {
                        RolId: payload.rol
                      }
                    })
                    .then(areas =>{
                      areas.forEach(area => {
                        req.areas.push(area.ServicioEjecId);
                      });
                      next();
                    })
                    .catch(error => {
                      return next(error);
                    });
                    

                  }
                })
                .catch(error => {
                  return next(error);
                });              
              }
            })
            .catch(error => {
              return next(error);
            });

          }
          // Si es el registro de un nuevo usuario
          else{
            req.userid = payload._id;
            req.rolid = payload.rol;
            req.appid = payload.app; 
            req.areas = [];
            next();
          }

          
        }
      }
      catch (err) {
        console.log(err);
        res.status(401).send("Token vencido.");
      }
    }

  }
};
