// 在入口文件中，加载相关样式
import 'css/common.css'
import './index.css'

import Vue from 'vue'
import axios from 'axios'
// 把装存api的文件拿过来
import url from 'js/api.js'

// 把过滤器的文件拿来
import globalFilter from 'js/filter.js'

// 按需要加载的 InfiniteScroll 组件  
import { InfiniteScroll,Swipe, SwipeItem } from 'mint-ui';
Vue.use(InfiniteScroll);



Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
// Vue.use(Swipe);


// 把底部导航组件拿进首页的页面中去 webpack此时利用 components 又刷了一波存在感
// 之前用 BottomNav 但是 编译报错 就稍微改了一下
import Bottomnav from 'components/Bottomnav'
import Swiper from 'components/Swiper'

for(let key in globalFilter){
	Vue.filter(key,globalFilter[key])
}



// 加载完样式，要思考如何将旧代码与vue相融合 1- 要有挂载点 2- 要有数据 3- 如何渲染
// 先把vue实例化 vue实例挂载点 不能是body 或者 html
let app = new Vue({
	el: '#app',
	data: {
		lists: null,
		bannerLists: null,
		pageNum: 1,
		pageSize: 6,
		// 与  infinite-scroll-disabled="loading" 相对应
		isLoading: false, 
		// 是否把数据全部加载完成了
		allLoaded: false,
	},
	methods:{
		// 与 v-infinite-scroll 相呼应
			getHotlistData(){
				// 如果 allLoaded 为true 那么直接停止请求
				if(this.allLoaded) return
				// 请求锁 开
				this.isLoading =  true, 
				axios.get(url.hotlists,{
					// pageNum 应该是动态和接口交互的 所以不能写死
					pageNum: this.pageNum,
					pageSize: this.pageSize,
				})
				.then(res=>{
					if(res.status === 200 && res.statusText === 'OK'){
						let curLists = res.data.lists
						// 判断数据是不是已经都加载完成了 判断依据就是 看接口返回的数据条数
						if(curLists.length<this.pageSize){
							// 写到这儿的时候 就得想到 如果 this.allLoaded 为true 那么 getHotlistData 就不用再请求了 直接 return
							//  if(this.allLoaded) return 写在请求方法伊始
							this.allLoaded = true
						}
						// 如果有还能有数据 那就把数据拼起来
						if(this.lists){
							this.lists = this.lists.concat(curLists)
						}else{
							this.lists = curLists
						}
					}
				// 一次请求已经完成，页码要 +1
				this.pageNum++
				// 请求锁 关
				this.isLoading =  false
			})
			.catch(error=>{
				console.log(error)
			})
		}, //getHotlistData


		getIndexBanner(){
			axios.post(url.indexbanner).then(res=>{
				this.bannerLists = res.data.bannerList
			}).catch(error=>{
				console.log(error)
			})

		},//getIndexBanner

		

	},//methods
	created(){
		// 放置 异步请求  ⚠️ 忘了写this！
		this.getHotlistData()
		this.getIndexBanner()

	},//created
	components: {
    Bottomnav,
    Swiper,
  },
})