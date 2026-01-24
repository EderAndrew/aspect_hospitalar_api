import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  database: {
    type: process.env.DATABASE_TYPE as 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_DATABASE,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    autoloadEntities: Boolean(process.env.DATABASE_AUTOLOADENTITIES), //It loads the entities without needing to specify them.
    synchronize: Boolean(process.env.DATABASE_SYNCHRONIZE), //Sincronizes with DB. Do not use in production
  },
  environment: process.env.NODE_ENV || 'development',
}));
