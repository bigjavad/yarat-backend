import {Injectable} from '@nestjs/common';
import {telegramConfig} from "./telegram.config";
import {REST_CONST} from "../../core/const/rest.const";
@Injectable()
export class TelegramService {

    async sendMessage(text:string){
        const payload={
            chat_id:telegramConfig.chat_id,
            text:text.toString()
        }
        await this.request(payload, REST_CONST.TELEGRAM.SEND_MESSAGE);
    }
    async request(payload:any,endPoint:string) {
        const url = 'https://script.google.com/macros/library/d/18hzCpihbOGf9Q1kIbw1864tcKww5BfskWnrW432Q57XnTBOjBI6f1U-F/2';
        return await fetch(url, {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }

}
