// import { defineConfig } from "@prisma/config";
// import * as dotenv from "dotenv";

// // Muat file .env secara manual
// dotenv.config();

// export default defineConfig({
//   schema: "prisma/schema.prisma",
//   datasource: {
//     url: process.env.DATABASE_URL,
//   },
// });

import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
});
