import { tokenClean } from './model/tokenClean';
import { initRoutes, server } from './routes/api.router';
import { connectToDatabase } from './services/database.service';
import { initConsul } from './util/consul';

const init = async () => {
  server.start();
  await connectToDatabase();
  await initConsul();
  await initRoutes();
  tokenClean();
  console.log('Gateway da API iniciado em %s', server.info.uri);
};

init();