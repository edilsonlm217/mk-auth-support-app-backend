import { Router } from 'express';

import CTOController from './app/controllers/CTOController';
import ClientController from './app/controllers/ClientController';
import SearchController from './app/controllers/SearchController';
import RequestController from './app/controllers/RequestController';
import InvoiceController from './app/controllers/InvoiceController';
import MessageController from './app/controllers/MessageController';
import HistoryController from './app/controllers/HistoryController';
import SessionController from './app/controllers/SessionController';
import EmployeeController from './app/controllers/EmployeeController';
import ProviderController from './app/controllers/ProviderController';
import NotificationController from './app/controllers/NotificationController';
import OverdueRequestController from './app/controllers/OverdueRequestController';
import UserConnectionsController from './app/controllers/UserConnectionsController';
import AppStructureController from './app/controllers/AppStructureController';

import authMiddleware from './app/middlewares/auth';
import permissionMiddleware from './app/middlewares/permission';
import { ConnectionResolver } from './app/middlewares/connectionResolver';

const routes = new Router();

routes.post('/new_provider', ProviderController.create);

routes.use(ConnectionResolver);

routes.post('/sessions', SessionController.store);

routes.get('/app/structure', AppStructureController.index);

routes.use(authMiddleware);

routes.post('/requests', RequestController.index);
routes.get('/request/:id/:request_type', RequestController.show);

routes.get('/client/:id', ClientController.show);

routes.get('/cto/:latitude/:longitude', CTOController.index);
routes.get('/cto', CTOController.show);

routes.get('/employees', EmployeeController.index);
routes.get('/employee/:id', EmployeeController.show);

routes.get('/search', SearchController.index);

routes.get('/connections/:id', UserConnectionsController.show);

routes.get('/invoices/:client_id', InvoiceController.show);

routes.get('/notification/:employee_id', NotificationController.show);
routes.put('/notification', NotificationController.update);

routes.get('/messages', MessageController.show);

routes.get('/requests/history', HistoryController.show);
routes.get('/requests/overdue', OverdueRequestController.index);

routes.use(permissionMiddleware);

routes.post('/request/:id', RequestController.update);
routes.post('/messages', MessageController.store);
routes.post('/client/:id', ClientController.update);

export default routes;
