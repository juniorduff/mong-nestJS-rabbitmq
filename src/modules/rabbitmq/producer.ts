import { connect } from 'amqp-connection-manager';

class Producer {
  public static async sendToRabbitMQ(queueName: string, message: string) {
    const connection = await connect('amqp://localhost:5672'); // Replace with your RabbitMQ connection string
    const channel = await connection.createChannel();
    await channel.assertQueue(queueName, { durable: true });
    await channel.sendToQueue(queueName, Buffer.from(message));
    console.log(`Message sent to queue "${queueName}": ${message}`);
    await channel.close();
    await connection.close();
  }
}
export { Producer };
