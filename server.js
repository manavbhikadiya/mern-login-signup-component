const express = require("express");
const app = express();
const { router } = require("./routes/users");
const cors = require('cors');

const PORT = 8000 || process.env.PORT;

const corsOptions = {
  origin: '*',
  methods: ['OPTIONS', 'POST', 'GET'],
  allowedHeaders: 'Content-Type',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/users", router);

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
