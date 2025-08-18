import express from 'express';
import morgan from 'morgan';
import path from 'path';
import router from './routes';

export const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use(express.static(path.join(__dirname, '..', 'public')));

import ejs from 'ejs';
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejs.renderFile);

app.use(router);

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err?.status || 500).json({ error: 'Internal Server Error' });
});
