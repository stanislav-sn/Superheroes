import app from './app.js';
import { config } from './config/index.js';

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Server is running at \x1b[4m\x1b[34mhttp://localhost:${PORT}\x1b[0m`);
});
