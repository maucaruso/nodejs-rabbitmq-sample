import { Channel, Connection, Message, connect } from "amqplib";

export default class RabbitmqServer {
  private conn: Connection;
  private channel: Channel;
  
  constructor(private uri: string) {}
  
  async start(): Promise<void> {
    this.conn = await connect(this.uri);
    this.channel = await this.conn.createChannel();
  }
  
  async publicInQueue(queue: string, message: string) {
    return this.channel.sendToQueue(queue, Buffer.from(message));
  }
  
  async consume(queue: string, callback: (message: Message) => void) {
    return this.channel.consume(queue, (message) => {
      callback(message);
      this.channel.ack(message);
    })
  }
}