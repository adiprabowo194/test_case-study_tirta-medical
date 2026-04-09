import amqp from 'amqplib';
import 'dotenv/config';

export const publishToQueue = async (queueName, data) => {
    let connection;
    try {
        // Jika .env belum terbaca, dia akan mencoba localhost
        const url = process.env.RABBITMQ_URL || 'amqp://localhost';
        connection = await amqp.connect(url);
        const channel = await connection.createChannel();

        await channel.assertQueue(queueName, { durable: true });
        channel.sendToQueue(queueName, Buffer.from(JSON.stringify(data)), {
            persistent: true
        });

        console.log(`[RabbitMQ] Message sent to ${queueName}`);

        // Tutup koneksi secara elegan
        setTimeout(() => {
            connection.close();
        }, 500);
    } catch (error) {
        console.error("RabbitMQ Connection Error:", error.message);
        // Jangan throw error agar API Utama tetap jalan meskipun RabbitMQ mati
    }
};