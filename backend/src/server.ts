import dotenv from 'dotenv';
import { logInDev } from '@utils/log-utils';
import app from './app';

// Determine the environment
const environment = process.env.NODE_ENV || 'development';

// Load the corresponding .env file
dotenv.config({ path: `.env.${environment}` });

logInDev('Logging current environment: ', process.env.NODE_ENV);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  logInDev(`Server is running on port ${PORT}`);
});
