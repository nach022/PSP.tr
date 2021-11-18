const sequelize = require("sequelize");

const MenuItemModel = require("../models/apps/MenuItem");

// AUTH
const AppModel = require("../models/auth/App");
const RolModel = require("../models/auth/Rol");
const RolMenuModel = require("../models/auth/RolMenu");
const RolRequestModel = require("../models/auth/RolRequest");
const UserModel = require("../models/auth/User");
const UserRolModel = require("../models/auth/UserRol");


// PSP
const ServEjecModel = require("../models/psp/ServicioEjecutor");
const TareaModel = require("../models/psp/Tarea");
const TipoTareaModel = require("../models/psp/TipoTarea");
const RolGruposAccionModel = require("../models/psp/RolGruposAccion");
const ComentarioTareaModel = require("../models/psp/ComentarioTarea");
const EjecucionTareaModel = require("../models/psp/EjecucionTarea");
const EjecucionFuturaTareaModel = require("../models/psp/EjecucionFuturaTarea");
const ComentarioOTModel = require('../models/psp/ComentarioOT');


// PIRAI
const ProfundidadModel = require("../models/pirai/Profundidad");
const FamiliaVariablesModel = require("../models/pirai/FamiliaVariables");
const VariableModel = require("../models/pirai/Variable");
const ProfundidadVariableModel = require("../models/pirai/ProfundidadVariable");
const TecnicaVariableModel = require("../models/pirai/TecnicaVariable");
const ItemListaVariableModel = require("../models/pirai/ItemListaVariable");
const UbicacionModel = require("../models/pirai/Ubicacion");

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
const ComentarioOT = ComentarioOTModel(db, sequelize);

//Relaciones
TipoTarea.belongsTo(ServEjec);
ServEjec.hasMany(TipoTarea, { onDelete: 'CASCADE', hooks:true});

Tarea.belongsTo(TipoTarea, { foreignKey: "TipoTareaId", as: 'Tipo' });
TipoTarea.hasMany(Tarea, { onDelete: 'CASCADE', hooks:true});


ComentarioTarea.belongsTo(Tarea);
Tarea.hasMany(ComentarioTarea);
ComentarioTarea.belongsTo(User);
User.hasMany(ComentarioTarea);

ComentarioOT.belongsTo(EjecucionTarea);
EjecucionTarea.hasMany(ComentarioOT);


EjecucionTarea.belongsTo(Tarea);
Tarea.hasMany(EjecucionTarea);

EjecucionFuturaTarea.belongsTo(Tarea);
Tarea.hasMany(EjecucionFuturaTarea);



//Modelos de Aplicación Piraí
const Profundidad = ProfundidadModel(db, sequelize);
const FamiliaVariables = FamiliaVariablesModel(db, sequelize);
const Variable = VariableModel(db, sequelize);
const ProfundidadVariable = ProfundidadVariableModel(db, sequelize);
const TecnicaVariable = TecnicaVariableModel(db, sequelize);
const ItemListaVariable = ItemListaVariableModel(db, sequelize);
const Ubicacion = UbicacionModel(db, sequelize);


Variable.belongsTo(FamiliaVariables);
FamiliaVariables.hasMany(Variable);

Variable.hasMany(ProfundidadVariable);
ProfundidadVariable.belongsTo(Variable);
ProfundidadVariable.belongsTo(Profundidad);
Profundidad.hasMany(ProfundidadVariable);

Variable.hasMany(TecnicaVariable);
TecnicaVariable.belongsTo(Variable);

Variable.hasMany(ItemListaVariable, {
  foreignKey: "VariableCodigo"
});
ItemListaVariable.belongsTo(Variable);





db.sync(/*{ force:true }*/)
//db.sync()
.then(() => {
    console.log("Modelos sincronizados, check!");
})
.catch((error) => {
    console.error("ERROR: No se pudo sincronizar modelos.", error.message);
    db.close();
    return process.exit();
});

module.exports = db;
global.db = db;




