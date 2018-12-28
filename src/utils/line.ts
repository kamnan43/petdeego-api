import * as lineSDK from '@line/bot-sdk';
import { config } from '../config';

export function getXLineHeader() {
    return {
        'X-LINE-ChannelId': config.linepay.channelId,
        'X-LINE-ChannelSecret': config.linepay.channelSecret,
        'Content-Type': 'application/json',
    }
}

export function replyMessage(replyToken, msg) {
  const lineConfig = config.line;
  const lineClient = new lineSDK.Client(lineConfig);
  return lineClient.replyMessage(replyToken, msg);
}

export function pushMessage(to, msg) {
  const lineConfig = config.line;
  const lineClient = new lineSDK.Client(lineConfig);
  return lineClient.pushMessage(to, msg);
}
