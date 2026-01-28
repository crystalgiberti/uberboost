import { createServer } from "./index.js";

const port = process.env.PORT || 8080;

const app = createServer();

app.listen(port, () => {
  console.log(`Uber Boost server running on port ${port}`);
});
