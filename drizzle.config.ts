import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: './server/database/migrations',
  schema: './server/database/schema.ts',
  dialect: "sqlite",
  driver: "d1-http",
  dbCredentials: {
    accountId: 'ce458588ca183da79a4c175affb31be6',
    databaseId: 'c7ce592c-f814-43bf-a380-21b65bc5e84f',
    token: 'Zf_8vBMO6V02UrXruvFcIBti8_E1zpcO6gtouuoN',
  },
});

