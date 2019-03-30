// 做这个文件的目的  把 axios 与 api.js 结合一下 方便使用，这样用axios请求的时候就方便了
// 所有接口通过自己写的方法走出去
import axios from 'axios'

function fetch(url,data) {
	return new Promise((resolve,reject)=>{
		// 优化一波 请求方式
		let promise = !!data ? axios.post(url,data) : axios.get(url)
		// axios.post(url,data).then(resp=>{
			 promise.then(resp=>{
			// 拿到回文的状态码 
			// ⚠️ 当时没有仔细观察数据格式 人家的data是2层 开始时就写了一层
			let status = resp.data.data.status
			if(status===200){
				resolve(resp)
			}
			if(status===300){
				console.log('现在状态是300，看看那儿不对')
				resolve(resp)
			}
			reject(resp)
		}).catch(error=>{
			reject(error)
		})
	})
}
// 把做的方法放出去
export default fetch





