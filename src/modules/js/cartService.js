// 对购物车的常用操作进行封装，有了这个就不用关心url接口，与异步请求的问题了的问题了

import fetch from 'js/fetch.js'
import url from 'js/api.js'

class Cart{
	static add(id){
		return fetch(url.addCart,{
			id,
			number: 1
		})
	}//add
	
	static reduce(id){
		return fetch(url.cartReduce,{
			id,
			number: 1
		})
	}//reduce

	static remove(arr){
		let idx = []
		arr.forEach(good=>{
	  	idx.push(good.id)
		})

	}

} //Cart

export default Cart

