import { config } from '../config';

export function getXLineHeader() {
    return {
        'X-LINE-ChannelId': config.linepay.channelId,
        'X-LINE-ChannelSecret': config.linepay.channelSecret,
        'Content-Type': 'application/json',
    }
}