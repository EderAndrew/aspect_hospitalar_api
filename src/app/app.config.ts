import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  database: {
    type: process.env.DATABASE_TYPE as 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    database: process.env.DATABASE_DATABASE,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    autoloadEntities: Boolean(process.env.DATABASE_AUTOLOAD_ENTITIES), // Loads entities from forFeature() modules
    synchronize: Boolean(process.env.DATABASE_SYNCRONIZE), // Syncs schema with DB. Do not use in production
  },
  environment: process.env.NODE_ENV || 'development',
}));
