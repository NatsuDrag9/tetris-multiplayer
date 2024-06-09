import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import ENDPOINTS from '@constants/apiEndpoints';

const API_BASE_URL = import.meta.env.VITE_BASE_URL;

export const successfulClientIdServer = setupServer(
  http.get(`${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`, () =>
    HttpResponse.json({
      clientId: 'testingClientId123',
    })
  )
);

// Server for API response with non-200 status
export const errorClientIdServer = setupServer(
  http.get(
    `${API_BASE_URL}/${ENDPOINTS.CLIENT_ID}`,
    () => new HttpResponse('Internal Server Error', { status: 500 })
  )
);
