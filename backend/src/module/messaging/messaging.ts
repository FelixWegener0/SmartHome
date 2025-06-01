import admin, {initializeApp} from 'firebase-admin'
import process from "node:process";
import {getMessaging} from "firebase-admin/lib/messaging";

export class FirebaseMessaging {

    private serviceAccount = require(__dirname + '/privateKey.json')
    private app: any;
    private appToken = process.env.APP_TOKEN || '';

    constructor() {
        admin.initializeApp({
            credential: admin.credential.cert(this.serviceAccount)
        });
        this.app = initializeApp();
    }

    public sendMessage(room: string, humid: number) {
        const message = {
          data: {
            room: room,
            humidity: `${humid}`,
          },
          token: this.appToken,
        };

        getMessaging().send(message)
            .then((response) => {
                console.log('Successfully sent message:', response);
            })
            .catch((error) => {
                console.log('Error sending message:', error);
            });
    }

}