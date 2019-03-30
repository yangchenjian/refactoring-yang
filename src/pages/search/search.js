import 'css/common.css'
import './search.css'


import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import mixin from 'js/mixin.js'
import Velocity from 'velocity-animate'
let {keyword,id} = qs.parse(location.search.substr(1))


import url from 'js/api.js'
// import globalFilter from 'js/filter.js'
// for(let key in globalFilter){
// 	Vue.filter(key,globalFilter[key])
// }

// import Bottomnav from 'components/Bottomnav'
// 通过url 拿到keyword和id

let search = new Vue({
	el: '#search',
	data(){
		return {
			goodData: null,
			keywordVal: keyword,
			isShow: false
		}
	},//data
	methods:{
		getData(){
			axios.post(url.goodList,{keyword,id})
			.then(res=>{
				let status = res.data.data.status
				let data = res.data.lists
				if(status===200){
					this.goodData = data
				}
			})
			.catch(error=>{
				console.log(error)
			})
		},//getData
		move(){
			this.isShow = scrollY > 100 ? true : false
		},//move
		toTop(){
			Velocity(document.body, 'scroll', {duration: 600, offset: 0})
			this.isShow = false
		},//toTop

	},//methods
	created(){
    this.getData()
	},
	mixins: [mixin],

})// root


