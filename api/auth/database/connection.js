const sequelize = require("sequelize");

const MenuItemModel = require("../models/apps/MenuItem");

const AppModel = require("../models/auth/App");
const RolModel = require("../models/auth/Rol");
const RolMenuModel = require("../models/auth/RolMenu");
const RolRequestModel = require("../models/auth/RolRequest");
const UserModel = require("../models/auth/User");
const UserRolModel = require("../models/auth/UserRol");



const ServEjecModel = require("../models/psp/ServicioEjecutor");
const TareaModel = require("../models/psp/Tarea");
const TipoTareaModel = require("../models/psp/TipoTarea");
const RolGruposAccionModel = require("../models/psp/RolGruposAccion");
const ComentarioTareaModel = require("../models/psp/ComentarioTarea");
const EjecucionTareaModel = require("../models/psp/EjecucionTarea");
const EjecucionFuturaTareaModel = require("../models/psp/EjecucionFuturaTarea");


const db = new sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false,
  dialectOptions: {
    options: {
      trustServerCertificate: true,
      schema: "auth",
    },
  },
  pool: {
    max: DB_POOL_MAX,
    min: DB_POOL_MIN,
    acquire: DB_POOL_ACQUIRE,
    idle: DB_POOL_IDLE,
  },
});

db.authenticate()
  .then(() => {
    console.log("Conexion a BD, check!");
  })
  .catch((err) => {
    console.error("ERROR: No se pudo conectar a la BD.", err.message);
    db.close();
    return process.exit();
  });

// Modelos de Usuarios y roles
const MenuItem = MenuItemModel(db, sequelize);

const App = AppModel(db, sequelize);
const Rol = RolModel(db, sequelize);
const RolMenu = RolMenuModel(db, sequelize);
const RolRequest  = RolRequestModel(db, sequelize);
const User = UserModel(db, sequelize);
const UserRol = UserRolModel(db, sequelize);
const RolGruposAccion = RolGruposAccionModel(db, sequelize);





//Relaciones:

RolRequest.belongsTo(Rol);


// App (1)<-->(n) Rol
App.hasMany(Rol, {
  foreignKey: {
    name: "AppId",
  },
});
Rol.belongsTo(App);
// Fin Rel

User.belongsToMany(Rol, {
  foreignKey: {
    name: "Legajo",
  },
  otherKey: {
    name: "RolId",
  },
  through: {
    model: UserRol,
  },
});
Rol.belongsToMany(User, {
  foreignKey: {
    name: "RolId",
  },
  otherKey: {
    name: "Legajo",
  },
  through: {
    model: UserRol,
  },
});

Rol.hasMany(UserRol);
UserRol.belongsTo(Rol);
UserRol.belongsTo(User, { onDelete: "NO ACTION" });
User.hasMany(UserRol);

// Fin Rel



//MenuItem e hijos
MenuItem.belongsTo(MenuItem, { foreignKey: "Padre", as: 'Papa', onDelete: "NO ACTION" });
MenuItem.hasMany(MenuItem, { foreignKey: "Padre", as: 'Hijos' });
// Fin Rel

// Rol (n)<-->(n) MenuItems
Rol.belongsToMany(MenuItem, {
    foreignKey: {
      name: "RolId",
    },
    otherKey: {
      name: "ManuItemId",
    },
    through: {
      model: RolMenu,
    },
  });
  MenuItem.belongsToMany(Rol, {
    foreignKey: {
      name: "MenuItemId",
    },
    otherKey: {
      name: "RolId",
    },
    through: {
      model: RolMenu,
    },
  });
  // Fin Rel





//Modelos de Aplicación PSP
const Tarea = TareaModel(db, sequelize);
const TipoTarea = TipoTareaModel(db, sequelize);
const ServEjec = ServEjecModel(db, sequelize);
const ComentarioTarea = ComentarioTareaModel(db, sequelize);
const EjecucionTarea = EjecucionTareaModel(db, sequelize);
const EjecucionFuturaTarea = EjecucionFuturaTareaModel(db, sequelize);

//Relaciones
TipoTarea.belongsTo(ServEjec);
ServEjec.hasMany(TipoTarea, { onDelete: 'CASCADE', hooks:true});

Tarea.belongsTo(TipoTarea, { foreignKey: "TipoTareaId", as: 'Tipo' });
TipoTarea.hasMany(Tarea, { onDelete: 'CASCADE', hooks:true});


ComentarioTarea.belongsTo(Tarea);
Tarea.hasMany(ComentarioTarea);
ComentarioTarea.belongsTo(User);
User.hasMany(ComentarioTarea)


EjecucionTarea.belongsTo(Tarea);
Tarea.hasMany(EjecucionTarea);

EjecucionFuturaTarea.belongsTo(Tarea);
Tarea.hasMany(EjecucionFuturaTarea);



db.sync(/*{ force:true }*/)
//db.sync()
.then(() => {
    
    console.log("Modelos sincronizados, check!");

    /* Datos de prueba *//*
    App.create({ Nombre: 'PSP.tr', Descr:'Aplicación de gestión del Programa de Seguridad de Presas' })
    .then(app => {
        Rol.create({ AppId: app.Id, Nombre: 'sysadm', Descr:'Administrador total del sistema PSP.tr' })
        .then(rol => {
            User.create({ Legajo: 10041, Nombre:'Corrales, Ignacio Miguel' }).then(usr => {
                usr.addApp(app, {
                    through: {
                        RolId: rol.Id
                    }
                }).then(()=>{
                    MenuItem.create({AppId: app.Id, Label: 'ROOT', Tipo: 'N', Orden: 0 }).then((root)=>{
                        MenuItem.create({AppId: app.Id, Label: 'Inicio', Icono: 'home', Tipo: 'H', Route: '/home', Padre: root.Id, Orden:1}).then((home)=>{
                            MenuItem.create({AppId: app.Id, Label: 'Tareas', Icono: 'list_alt', Tipo: 'N', Route: '', Padre: root.Id, Orden:2}).then((tasks)=>{
                                MenuItem.create({AppId: app.Id, Label: 'Visión General', Icono: 'toc', Tipo: 'H', Route: '/tasks-overview', Padre: tasks.Id, Orden:1}).then(()=>{
                                    MenuItem.create({AppId: app.Id, Label: 'Diagrama de Planificación', Icono: 'line_style', Tipo: 'H', Route: '/gantt', Padre: tasks.Id, Orden:2}).then(()=>{
                                        MenuItem.create({AppId: app.Id, Label: 'Informes', Icono: 'description', Tipo: 'N', Route: '', Padre: root.Id, Orden:3}).then(()=>{
                                            MenuItem.create({AppId: app.Id, Label: 'Configuración', Icono: 'settings', Tipo: 'N', Route: '', Padre: root.Id, Orden:4}).then((conf)=>{
                                                MenuItem.create({AppId: app.Id, Label: 'Tareas', Icono: 'playlist_add', Tipo: 'H', Route: '/tasks-setting', Padre: conf.Id, Orden:1}).then(()=>{
                                                    MenuItem.create({AppId: app.Id, Label: 'Usuarios', Icono: 'people_alt', Tipo: 'H', Route: '/users-setting', Padre: conf.Id, Orden:2}).then(()=>{
                                                    }).then(()=> console.log("Datos de prueba cargados, check!"));
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    
        

    });


    *//** Fin Datos de Prueba */

})
.catch((error) => {
    console.error("ERROR: No se pudo sincronizar modelos.", error.message);
    db.close();
    return process.exit();
});

module.exports = db;
global.db = db;




