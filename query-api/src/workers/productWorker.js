
import amqp from 'amqplib';
import { Product } from '../models/index.js';
export const startProductWorker = async () => {
    try {
        const connection = await amqp.connect(process.env.RABBITMQ_URL || 'amqp://localhost');
        const channel = await connection.createChannel();
        const queueName = 'product_created';

        await channel.assertQueue(queueName, { durable: true });
        console.log(`[*] Waiting for product messages in ${queueName}`);

        channel.consume(queueName, async (msg) => {
            if (msg !== null) {
                const productData = JSON.parse(msg.content.toString());
                try {
                    // Simpan ke db_query (Table Product)
                    await Product.create(productData);
                    channel.ack(msg);
                } catch (err) {
                    console.error("Failed to sync Product:", err.message);
                    channel.ack(msg);
                }
            }
        });
    } catch (error) {
        console.error("Product Worker Error:", error);
    }
};