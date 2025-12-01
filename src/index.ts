import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import router from './routes/index.routes';
import  './model/index.model'
import sequelize from './database/database';
import { config } from './model/index.model';
import { errorHandler } from './middleware/error.middleware';

const allowedOrigins = (process.env.ALLOWED_ORIGINS as string || "").split(",");

const app = express();
config(sequelize)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

sequelize.authenticate()
  .then(() => console.log("DB CONNECTED"))
  .catch(err => console.error("DB ERROR:", err));
// app.use(cors());
app.use(bodyParser.json());

app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (true) {
    console.log(`Request ${req.method} ${req.url} - ${new Date().toISOString()}`);
    console.log('Request Body:', req.body);
  }
  next();
});
app.use('/api', router);
app.use(errorHandler)
const PORT = process.env.PORT || 3000;

app.listen(PORT, async () => {
  try {
    console.log(`Server running on port ${PORT}`);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});
