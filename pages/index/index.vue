<template>
	<view class="content">
		<view class="content-mqtt">
			mqtt消息：{{mqttData}}
		</view>
		
		<input type="text" v-model="MsgData" style="border: 1px black solid;margin-bottom: 5px;" placeholder="输入"/>
		<button @click="handleSendMsg">点击发送</button>
	</view>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import useMqtt from '../../utils/mqtt/useMqtt';



const {startMqtt, addLink,sendMsg} = useMqtt();
const mqttData = ref();
const MsgData = ref();

onMounted(()=>{
	addLink(`topic`, 'url', 'username', 'password');
	startMqtt((_, message) => {
		let returnData = JSON.parse(message);
		mqttData.value =  returnData;
	});
})



// 发送消息
function handleSendMsg(){
	sendMsg(`topic`,JSON.stringify(MsgData.value))
}
	
</script>

<style>
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		margin-top: 5px;
		
		.content-mqtt {
			padding: 5px;
			border: 1px black solid;
			margin-bottom: 5px;
		}
	}
</style>
