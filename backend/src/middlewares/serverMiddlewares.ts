import cors from 'cors';
import { Application } from 'express';

export default function serverMiddlewares(app: Application) {
  // Enable CORS
  app.use(cors());

  // Alternatively, use this
  // app.use(function (req, res, next) {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   // res.header('Access-Control-Allow-Methods', 'GET, PUT, POST');
  //   res.header(
  //     'Access-Control-Allow-Headers',
  //     'Origin, X-Requested-With, Content-Type, Accept'
  //   );
  //   next();
  // });
}
