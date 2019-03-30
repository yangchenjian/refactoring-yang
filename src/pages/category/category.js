import 'css/common.css'
import './category.css'

import Vue from 'vue'
import axios from 'axios'
import url from 'js/api.js'
import globalFilter from 'js/filter.js'
import Bottomnav from 'components/Bottomnav'


// 来个过滤器 
for(let key in globalFilter){
	Vue.filter(key,globalFilter[key])
}


let category = new Vue({
	el: '#category',
	data:{
		topLists: null,
		// 开始的时候打算用id来进行识别 思考过后决定用下标来进行识别
		topIndex: 0,
		// 为什么 null的时候 前台会报错,改成{} 就不会呢
		// subListData: {} ,
		// rankListData: {},

		//  v-if="topIndex===0 && rankListData " 添加了 && rankListData 这个条件 就不用单独用{} 了
		subListData: null ,
		rankListData: null,
		
		rankDataLock: true,

	},//date
	methods:{
		getTopListData(){
			axios.get(url.categorylist)
			.then(
				res=>{
					this.topLists = res.data.categroyData
				})
			.catch(error=>console.log(error))
		},// getTopListData
		
		// 拿到一级栏目的id与下标
		getSubListData(id,index){
			this.topIndex = index
			// 如果index为0 那么就要获取 综合排行 的相关数据
			if(index===0 && this.rankDataLock){
				this.getRankData()
				this.rankDataLock = false
			}else {
				axios.post(url.subList,{
			   	// id:id
					id})
				.then(
					res=>{
						this.subListData = res.data.data
					})
				.catch(error=>console.log(error))
			   
			}
		},//getSubList
		getRankData(){
			 axios.get(url.rank)
				.then(
					res=>{
							this.rankListData = res.data.data	
					})
				.catch(error=>console.log(error))
		},
		toSearch(item){
		 	location.href = `search.html?keyword=${item.name}&id=${item.id}`
		},//toSearch

	},//methods
	components:{
		Bottomnav,

	},//components
	created(){
		this.getTopListData()
		// 先传两个参数进行初始化
		this.getSubListData(0,0)
	},//created
	
})
