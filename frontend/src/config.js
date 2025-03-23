// import { z } from "zod";

// // Schema per validare le variabili d'ambiente
// const envSchema = z.object({
//   apiUrl: z.string().url().default("http://localhost:30080"),
//   apiSecret: z.string().min(1).default("development"),
// });

// // Leggiamo le variabili d'ambiente
// const rawEnv = {
//   apiUrl: process.env.REACT_APP_API_URL,
//   apiSecret: process.env.REACT_APP_API_SECRET,
// };

// // Validiamo le variabili, se mancano usiamo i valori di default
// const config = envSchema.parse(rawEnv);

// // export default config;
