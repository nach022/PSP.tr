const dotenv = require('dotenv');

dotenv.config();
global.PORT = Number(process.env.PORT);
global.AUTH_URL = process.env.AUTH_URL;
global.DB_HOST = process.env.DB_HOST;
global.DB_NAME = process.env.DB_NAME;
global.DB_USER = process.env.DB_USER;
global.DB_PASSWORD = process.env.DB_PASSWORD;
global.DB_DIALECT = process.env.DB_DIALECT;
global.DB_POOL_MAX = Number(process.env.DB_POOL_MAX);
global.DB_POOL_MIN = Number(process.env.DB_POOL_MIN);
global.DB_POOL_ACQUIRE = Number(process.env.DB_POOL_ACQUIRE);
global.DB_POOL_IDLE = Number(process.env.DB_POOL_IDLE);
global.JWT_SECRET = process.env.JWT_SECRET;
global.HEADER_ROL = process.env.HEADER_ROL;
global.HEADER_TOKEN = process.env.HEADER_TOKEN;
global.JWT_EXPIRE = process.env.JWT_EXPIRE;
global.DB_EAM_HOST = process.env.DB_EAM_HOST;
global.DB_EAM_NAME = process.env.DB_EAM_NAME;
global.DB_EAM_USER = process.env.DB_EAM_USER;
global.DB_EAM_PASSWORD = process.env.DB_EAM_PASSWORD;
global.DB_EAM_DIALECT = process.env.DB_EAM_DIALECT;
global.SYSADMIN_ROL = process.env.SYSADMIN_ROL;
global.PSP_ADMIN_ROL = process.env.PSP_ADMIN_ROL;
global.PSP_NO_ROL = process.env.PSP_NO_ROL;
