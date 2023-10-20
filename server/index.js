const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const router = require('./routers/router');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');

require('dotenv').config();
const app = express();

const allowedOrigins = ['http://localhost:4000', 'http://localhost:3000'];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(cookieParser());

// app.use(cors());
const PORT = 5000;

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'My API',
            version: '1.0.0',
        },
    },
    // Path to the API docs
    apis: ['./routers/*.js'], // Path to your routes files
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(bodyParser.json());

connectDB();

app.use('/', router)

app.listen(PORT, () => {
    console.log(`Server running at port:${PORT}`);
});
