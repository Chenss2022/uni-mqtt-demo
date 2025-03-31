import type {MqttClient, OnMessageCallback} from 'mqtt/types/lib/client';
// @ts-ignore
import * as mqtt from 'mqtt/dist/mqtt.min.js';

// import {getAppEnvConfig} from '/@/utils/env';

// import {useMessage} from '/@/hooks/web/useMessage';

// const {createMessage} = useMessage();

// const {VITE_GLOB_API_MQTT_URL, VITE_GLOB_USERNAME, VITE_GLOB_PASSWORD} = getAppEnvConfig();

function getUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

class MQTT {
  type: string;
  url: string;
  client!: MqttClient;
  username: string;
  password: string;

  constructor() {
    this.type = getUUID();
    this.url = '';
    this.username = '';
    this.password = '';
  }

  //初始化mqtt
  init() {
    const options = {
      clean: true,
      clientId: this.type,
      username: this.username,
      password: this.password,
      connectTimeout: 3000,
      qos: 1,
    };

    this.client = mqtt.connect(this.url, options);

    this.client.on('error', (err: any) => {
      console.log(this.url + '异常中断');
      console.log('错误' + err);
      // createMessage.error('异常中断' + err);
    });

    this.client.on('reconnect', (_) => {
      console.log(this.url + '重新连接');
      //createMessage.warn('重新连接');
    });
  }

  //取消订阅
  unsubscribes(topic: string) {
    this.client.unsubscribe(topic, (error: Error) => {
      if (!error) {
        console.log(topic + '取消订阅成功');
        //createMessage.success('取消订阅成功');
        this.client.on('close', (_) => {
          console.log(topic, '断开连接');
        });
      } else {
        console.log(topic + '取消订阅失败');
        //createMessage.error('取消订阅失败');
      }
    });
  }

  //连接
  link(topic: string) {
    this.client.on('connect', () => {
      this.client.subscribe(topic, (error: any) => {
        if (!error) {
          console.log(topic + '订阅成功');
          //createMessage.success('订阅成功');
        } else {
          console.log(topic + '订阅失败');
          //createMessage.error('订阅失败');
        }
      });
    });
  }

  //收到的消息
  get(callback: OnMessageCallback) {
    this.client.on('message', callback);
  }
  
   // 发送消息
    sendMessage(topic: string, message: string) {
      this.client.publish(topic, message, (error: Error | null) => {
        if (error) {
          console.log(`消息发送失败: ${error.message}`);
        } else {
          console.log(`消息已发送至 topic: ${topic}`);
        }
      });
    }

  //结束链接
  over() {
    this.client.end();
  }
}

export default MQTT;
