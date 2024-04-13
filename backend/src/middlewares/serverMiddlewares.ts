import cors from 'cors';
import { Application } from 'express';

export default function serverMiddlewares(app: Application) {
  // Enable CORS
  app.use(cors());
}
