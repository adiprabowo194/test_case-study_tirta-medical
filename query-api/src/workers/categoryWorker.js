
import amqp from 'amqplib';
import { Category } from '../models/index.js';
export const startCategoryWorker = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = 'category_created';

        await channel.assertQueue(queueName, { durable: true });
        console.log(`[*] Waiting for category messages in ${queueName}`);

        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                const categoryData = JSON.parse(msg.content.toString());
                try {
                    // Simpan ke db_query (Table Categories)
                    await Category.create(categoryData);
                    channel.ack(msg);
                } catch (err) {
                    console.error("Failed to sync Category:", err.message);
                    channel.ack(msg);
                }
            }
        });
    } catch (error) {
        console.error("Category Worker Error:", error);
    }
};