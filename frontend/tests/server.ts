import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import ENDPOINTS from '@constants/apiEndpoints';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

const clientIdServer = setupServer(
  http.get(`${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`, () =>
    HttpResponse.json({
      clientId: 'testingClientId123',
    })
  )
);

export default clientIdServer;
