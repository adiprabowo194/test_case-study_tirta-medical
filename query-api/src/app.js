import express from 'express';
import apiRoutes from './routes/api.js';

const app = express();


app.use(express.json());
app.use('/api', apiRoutes);

// Handler untuk rute yang tidak ditemukan 
app.use((req, res) => {
    res.status(404).json({
        message: "Endpoint not found"
    });
});

export default app;