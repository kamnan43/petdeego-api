import { config } from '../config';
import line from '@line/bot-sdk'

export function getXLineHeader() {
    return {
        'X-LINE-ChannelId': config.linepay.channelId,
        'X-LINE-ChannelSecret': config.linepay.channelSecret,
        'Content-Type': 'application/json',
    }
}

export function pushMessage(userId, message){
    // create LINE SDK client
    const client = new line.Client(config.line);
    return client.pushMessage(userId, message);
}