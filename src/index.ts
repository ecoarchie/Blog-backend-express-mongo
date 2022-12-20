import { app, port } from './app.config';
import { runDb } from './repositories/db';

const startApp = async () => {
  await runDb();
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  });
};

startApp();
