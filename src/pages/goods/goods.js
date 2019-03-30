

import './css/goods_common.css'
import './css/goods_custom.css'
import './css/goods.css'
import './css/goods_theme.css'
import './css/goods_mars.css'
import './css/goods_sku.css'
import './css/goods_transiton.css'



import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
// import mixin from 'js/mixin.js'
import url from 'js/api.js'
import globalFilter from 'js/filter.js'
for(let key in globalFilter){
	Vue.filter(key,globalFilter[key])
}

import { Swipe, SwipeItem } from 'mint-ui';
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
import Swiper from 'components/Swiper'


// 拿到url中的产品id
let{id} = qs.parse(location.search.substr(1))

// 就只有两项结构不怎么复杂所以直接用字符串就行，不用像底部导航那样使用对象
let goodsTab = ['商品详情','本店成交']


let goods = new Vue({
	el: '#goods',
	data:{
		goodsId: id,
		goodsInfo: null,
		goodsTab:goodsTab,
		tabIndex: 0,
		// 成交数据默认为空
		goodsDeal: null,
		// 弹窗类型默认为1
		skuType: 1,
		// 弹出层是否显示 默认不弹出
		showSku: false,
		skuNum: 1,
		// 已加入购物车 的 标识
		isAddCart: false,
		// 添加是否成功的信息
		showAddMsg: false,

	},
	methods:{
		// 小小的封装一下异步请求
		fetch(url,parm){
			if (parm) {
				return axios.post(url,parm).then(res=>{
					return res.data
				}).catch(error=>{
					console.log(error)
				})
			} else {
				return axios.get(url).then(res=>{
					return res.data
				}).catch(error=>{
					console.log(error)
				})
			}

		},

		// 这个id 要利用qs从url上面去获取
		getGoodsData(id){
			axios.post(url.goodsDetails,{id})
			.then(res=>{
				this.goodsInfo = res.data.data
			})
			.catch(error=>console.log(error))
		}, //getGoodsData
		changeTab(index){
			this.tabIndex = index	
			// ⚠️ 记住需求 是当用户要看「成交数据」的时候才触发相关请求，客户不看那就不触发
			if(this.tabIndex===1){
				this.getDealData()
			}
		},//changeTab
		getDealData(id){
			axios.post(url.goodsDeal,{id})
			.then(res=>{
				this.goodsDeal = res.data.data.list
			})
			.catch(err=>{console.log(err)})
		},//getDealData
		chooseSku(type){
			// 把页面上用户触发的类型数值数值传递给skuType 3种状态要更新到 this.skuType 才行
			this.skuType = type
			// 阴影层此时变成true 也就出来了
			this.showSku = true
		}, //chooseSKU
		// 很巧妙 一个方法解决了 加减两个需求
		changeNum(num){
			if(num<0 && this.skuNum===1) return
			this.skuNum += num
		},//changeNum
		
		// 通过接口异步请求才行 ⚠️别忘了传两个参数
		addCart(){

			fetch(url.addCart,{
				id,
				number: this.skuNum
			}).then(res=>{
				let status = res.status
				if(status===200){
					this.showSku = false
					this.showAddMsg = true
					this.isAddCart = true
					setTimeout(()=>{
						this.showAddMsg = false
					}, 1000)

				}
			})

			// axios.post(url.addCart,{id,number:this.skuNum})
			//  .then(res=>{
			//  	console.log(res.data.status)
			//  	if(res.data.status === 200){
			//  		this.showSku = false
			//  		this.showAddMsg = true
			//  		this.isAddCart = true
   //        // showAddMsg 的信息 过一秒自动隐藏
			//  		setTimeout( ()=>{
			//  			this.showAddMsg = false
			//  		},1000)

			//  	}
			//  })
			//  .catch(error=>{
			//  	console.log(error)
			//  })

		},//addCart


	},//methods
	watch:{
		// 伴随showSku的出现 body 要及时做出变化
		showSku(newVal,oldVal){
			document.body.style.overflow = newVal ? 'hidden': 'auto'
		  document.body.style.height = newVal?'100%': 'auto'
		},//showSku
		skuNum(val){
			if(val<=1) this.skuNum = 1
		},//skuNum
		 

	}, //watch
	created(){
		this.getGoodsData()
	},
	// mixins: [mixin]

})