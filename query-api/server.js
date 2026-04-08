import 'dotenv/config';
import app from './src/app.js';
import { sequelize } from './src/models/index.js';

const PORT = process.env.PORT || 3001;

// Gunakan pengecekan apakah file ini dijalankan langsung atau di-import
const startServer = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection to MySQL has been established successfully.');

        // Tips: Matikan sync alter true saat testing jika tidak perlu
        if (process.env.NODE_ENV !== 'test') {
            await sequelize.sync({ alter: true });
            console.log('Database synced successfully');
        }

        app.listen(PORT, () => {
            console.log(`Query Search Api is running on port ${PORT}`);
        });
    } catch (err) {
        console.error('Unable to connect to the database:', err);
        process.exit(1);
    }
};

// Jalankan hanya jika tidak sedang dalam mode testing
if (process.env.NODE_ENV !== 'test') {
    startServer();
}

export { startServer };