import MQTT from './mqtt';
import type {OnMessageCallback} from 'mqtt';
import {ref, onUnmounted} from 'vue';

export default function useMqtt() {
  const PublicMqtt = ref<MQTT | null>(null);
  // 长连接的列表
  const linkList = Array<string>();
  // 连接信息
  const LinkInfo = ref<Object>({
    url: '',
    username: '',
    password: ''
  })

  /**
   * 开始连接
   * @param Callback
   */
  const startMqtt = (Callback: OnMessageCallback) => {
    //创建连接
    PublicMqtt.value = new MQTT();
    // 连接信息
    PublicMqtt.value.url = LinkInfo.value['url'];
    PublicMqtt.value.username = LinkInfo.value['username'];
    PublicMqtt.value.password = LinkInfo.value['password'];
    //初始化mqtt
    PublicMqtt.value.init();

    //订阅主题
    linkList.forEach((topic) => {
      PublicMqtt.value?.unsubscribes(topic);
      PublicMqtt.value?.link(topic);
    });
    getMessage(Callback);
  };

  /**
   * 添加订阅
   * @param topic
   * @param url "url地址在把本地测试环境时使用<wx:>，在使用正式地址时使用<wxs:>"
   * @param username
   * @param password
   */
  const addLink = (topic: string,url:any,username:any,password:any) => {
    linkList.length = 0
    // 简单地去重
    if (!linkList.includes(topic)) {
      linkList.push(topic);
      PublicMqtt.value?.link(topic);
    }
    LinkInfo.value['url'] = url;
    LinkInfo.value['username'] = username;
    LinkInfo.value['password'] = password;
  };

  const Uint8ArrayToString = (fileData: Uint8Array) => {
    var dataString = '';
    for (var i = 0; i < fileData.length; i++) {
      dataString += String.fromCharCode(fileData[i]);
    }
    return decodeURIComponent(escape(dataString));
  };

  const getMessage = (Callback: Function) => {
    PublicMqtt.value?.get((t, m) => {
      Callback(t, Uint8ArrayToString(m));
    });
  };

  const unsubscribes = () => {
    linkList.forEach((topic) => {
      PublicMqtt.value?.unsubscribes(topic);
    });
    PublicMqtt.value?.over();
  };

  const overAll = () => {
    console.log('zx')
    PublicMqtt.value?.over();
  }
  
  const sendMsg = (topic:any,message:any) => {
	  PublicMqtt.value?.sendMessage(topic,message)
  }

  //页面销毁结束订阅
  onUnmounted(() => {
    unsubscribes();
  });

  return {startMqtt, addLink, unsubscribes,overAll,sendMsg};
}
