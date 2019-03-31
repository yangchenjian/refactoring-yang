import './css/cart.css'
import './css/cart_base.css'
import './css/cart_trade.css'


import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
import Velocity from 'velocity-animate';
import url from 'js/api.js'

// 自己做的两个小封装
import fetch from 'js/fetch.js'
import Cart from 'js/cartService.js'




// 引入过滤器文件
import globalFilter from 'js/filter.js'
for(let key in globalFilter){
	Vue.filter(key,globalFilter[key])
}

let {id} = qs.parse(location.search.substr(1))


let cart = new Vue({
	el: '#cart',
	data:{
		cartLists : null,
		// 价格初始化就是个 0 ,在计算属性中进行计算
		total: 0,
		editingShop: null,
		editingShopIdx : -1,
		removePopUp: false,
		removeData: null,
		removePopMsg: '',
	},//data
	methods:{
		getCartData(){
			axios.get(url.cartList)
			  .then(res=>{
			  	// 0- ⚠️先赋值然后在添加的属性vue是不负责跟踪变化的 为了解决这个问题，需要对数据进行初始化的处理
			  	//1-   先拿到原始数据，然后在赋值
			  	//2- 「对原始数据进行操作」  给每一件商品都添加一个 checked 属性 
			  	// 3- 给店铺的选择也像商品一样 处理一波
			  	let datas = res.data.data.cartList
			  	datas.forEach(shop=>{
			  		// 开始时所有的商店都是被选中（true）的状态
			  		shop.checked = true
			  		// 给所有的店铺添加editing属性以及editingMsg的文字说明
			  		// 开始时 都是不可以编辑的,同时显示的都是 「编辑」字样
			  		shop.editing = false
			  		shop.editingMsg = '编辑'
			  		// 是否删除选中的商品 全给false 让用户自己选择看看删哪个
			  		shop.removeChecked = false
			  		shop.goodList.forEach(good=>{
			  			good.checked = true
			  			good.removeChecked = false
			  		})
			  	})
			  	// 最后把处理过的数据送进data中的cartLists里面去
			  	this.cartLists = datas
			})
			  .catch(err=>{
			  	console.log(err)
			  })
		},//getCartData
		// ⚠️ 写的时候 忘了写 good 这个参数
		// 要多一个shop的参数 把店铺的信息用参数放进方法里面
		chooseGood(shop,good){
			let attr = this.editingShop?'removeChecked' :'checked'
			good[attr] = !good[attr]
			// 利用现成的every方法
			shop[attr] = shop.goodList.every(
				good=>{
					return good[attr]  
			  }
			)
		},//chooseGood
		selectShop(shop){
			let attr = this.editingShop?'removeChecked' :'checked'
			// 选项取反
			shop[attr] = !shop[attr]
			// 遍历每一件商品 如果 shop.checked 为false 那么该店铺下的每一件商品都是false
			// 如果 shop.checked为true 那么 每一件商品都是 true
			// 接着完善 全选 的功能
			shop.goodList.forEach(good=>{
				good[attr] = shop[attr]
			})
		},//selectShop
		selectAll(){
			// 对计算属性allSelected做一个取反
			// ⚠️ 因为没有对 allSelected 的set值做处理 所以输出出来的 都是true
			// ⚠️ 必须要对 allSelected 的set值做处理 
			// 做完 全选 就要做 价格 的实时计算啦
			let attr =  this.editingShop?'allRemoveSelected':'allSelected'
			this[attr] = !this[attr]
		},//selectAll
		// 编辑店铺的方法
		editShop(shop,shopIdx){
			// 对商铺的编辑状态进行相互切换 默认是false
			shop.editing = !shop.editing
			// 做一个三目 以shop.editing的布尔值为中心在编辑状态的同时对文字进行动态变化
			shop.editingMsg = shop.editing?'完成':'编辑'
			// 依托商铺的下标对编辑状态进行判断，目的是对其他店铺进行「不可编辑」的处理 整个逻辑流程自己要清晰
			this.cartLists.forEach((shopItem,idx)=>{
				if(shopIdx !== idx){
					// 其他店铺的状态都是 不可编辑状态
					shopItem.editing = false
					shopItem.editingMsg = shop.editing ? '' : '编辑'
				}
			})
			// 对全局的editingShop 与 editingShopIdx 进行赋值处理
			this.editingShop = shop.editing ? shop : null
			this.editingShopIdx = shop.editing ? shopIdx : -1
		}, //editShop
		// 减少商品 要进行异步数据请求 更新到数据库中
		// ⚠️ 先异步请求 更改数据库中的数据，数据库中的数据更改成功了，本地数据进行相应的变化就可以
		reduce(good){
			if(good.number === 1) return 
			Cart.reduce(good.id).then(res=>{
				good.number--
			})

			// axios.post(url.cartReduce,{
			// 	id: good.id,
			// 	number: 1

			// }).then(res=>{
			// 	good.number--
			// })
		},//reduce
		
		//增加商品 要进行异步数据请求 也更新到数据库中
		// ⚠️ 先异步请求 更改数据库中的数据，数据库中的数据更改成功了，本地数据进行相应的变化就可以
		add(good){
			// axios.post(url.addCart,{
			// 	id: good.id,
			// 	number: 1
			// }).then(res=>{
			// 	good.number++
			// })
			Cart.add(good.id).then(res=>{
				good.number++
			})

		},//add
		// 删除商品 不仅要数据库的信息得到更新，同时也要有相应的弹窗让用户用来确认
		remove(shop,shopIndex,good,goodIndex){
			// console.log('该商品要被删除了')
			// 激活这个方法 那么弹窗就先出来吧
			this.removePopUp = true
			// 因为removeConfirm 接收不到要删除的商品与店铺的信息，所以把信息先存到 removeData 里面去
			this.removeData = {shop,shopIndex,good,goodIndex}
			this.removePopMsg = '您确认删除该商品吗？'

		},//remove
		// ⚠️ 计算属性 removeLists 依托于 removeList
		removeList(){
			// 激活弹窗
			this.removePopUp = true
			// removeLists 在计算属性中实时计算长度
			this.removePopMsg = `确定要将所选中的${this.removeLists.length}个商品删除吗？`
		},//removeList
		

		// 通过异步请求 把这个商品删掉~
		removeConfirm(){ 
			// 进入删除单个商品逻辑 依托弹窗信息判断 传单个商品id
			if(this.removePopMsg === '您确认删除该商品吗？'){
					// 因为在 remove 方法中已经把数据送进 removeData 里面去了 所以 这个方法就可以用了 先来个对象的解构赋值
				let {shop,shopIndex,good,goodIndex} = this.removeData
				// 传个商品id 异步告诉数据库 把相应的商品信息删除掉
				axios.post(url.cartRemove,{
					id: good.id,
					// 数据库操作完成后
				}).then(res=>{
					// 依托 goodIndex商品下标 就要对本地的数据「前端显示这块儿」操作一波啦
					shop.goodList.splice(goodIndex,1)
					// 当店铺没有商品的时候，利用 shopIndex 让店铺也要消失掉 
					if(!shop.goodList.length){
						this.cartLists.splice(shopIndex,1)
						// 将无效店铺删除掉之后，要将剩下的店铺切换到正常状态 专门写一个方法用来处理其他店铺的变化，
						// 搞定这个就要想想 批量删除具体怎么搞了
						this.removeShop()
					}
					// 弹层收起来吧
					this.removePopUp = false
				})
			}
			// 进入删除多个的逻辑 传一个数组 数组中都是商品id
			// 分两种情况 一种是将其中一个店铺的商品全部删除了，另一种情况是，只删除了该店铺的其中一部分商品
			// 前一种情况记得通过 shopIndex 把空店铺也删除一下
			else{
				let ids = []
				// 通过遍历 拿到计算属性removeLists 中的商品,将商品id传进去
				this.removeLists.forEach(good=>{
					ids.push(good.id)
				})
				axios.post(url.cartMremove,{
					ids
				})
				// 接着分两种情况进行处理
				.then(res=>{
					let arr = []
					//遍历要编辑店铺的这个商品列表 => this.editingShop.goodList
					// 通过 removeLists 看看要删除的商品 在不在 this.editingShop.goodList 里面
					// 如果不在 送进幸存商品的数组中
					// 接着把新数组给到这个 this.editingShop.goodList 里面
					// 如果没有幸存商品 那就删除该店铺
					this.editingShop.goodList.forEach(good=>{
						let index = this.removeLists.findIndex(item=>{
							// 之前这儿少写了一个等于号
							return item.id ===  good.id
						})
						if(index === -1){
							arr.push(good)
						}
					})
					// ⚠️ 如果群删了一波还有商品 那把剩的商品送进 goodList 里面去
					// 如果 店铺下面已经没有商品了，那还是老规矩 通过 removeShop 方法 依托 editingShopIdx 把店铺也删除掉
					// 顺道还原其他的店铺与商品
					if(arr.length){
						this.editingShop.goodList = arr
					}else{
						this.removeShop(this.editingShopIdx)
					}
					// 关弹窗
					this.removePopUp = false
				})
			}
		},//removeConfirm
		removeCancel(){
			this.removePopUp = false

		},//removeCancel
		removeOverlay(){
			this.removePopUp = false
		},
		// ⚠️ removeShop方法是给removeConfirm 这个方法中使用的补充方法 
		// 将无效店铺删除掉之后，要将剩下的店铺切换到正常状态 
		// 在做多个删除中 将这个方法进行了拓展 除了恢复其他店铺功能 通过cartLists依托shopIndex 也有了删除功能
		removeShop(shopIndex){
			this.cartLists.splice(shopIndex, 1)
			// 还原初始值让商品，店铺进入开始刚进页面时的正常状态 =>商品，店铺都要进行还原,不然其他店铺与商品都还是 「不正常的状态」
			// 先把根 data中的 editingShop 与 editingShopIdx 都恢复
			this.editingShop = null
			this.editingShopIdx = -1
			// ⚠️ 接着 重新遍历数据 重新赋予店铺正常的状态与文字
			this.cartLists.forEach(shop=>{
        shop.editing = false
        shop.editingMsg = '编辑'
			})

		},// removeShop
		// 滑动删除的 start 与 end 方法
		start(e,good){
			//通过原生api 记录开始的位置
			good.startX = e.changedTouches[0].clientX
		}, //start
		end(e,shop,shopIdx,good,goodIdx){
			// 通过good本身添加的属性拿到开始的位置记录 记录结束的位置
			let endX = e.changedTouches[0].clientX
			let left = '0'
			// console.log(endX,good.startX)
			// 做一个距离上面的判断 开始减去结束 实际上是往左滑动 100的时候
			if(good.startX - endX>100){
				left = '-60px'
        shop.editingMsg = ''
			}
			// 做一个反向处理 往右面滑动的时候还原商品状态
			if(endX - good.startX>100){
				left = '0px'
        shop.editingMsg = '编辑'
			}

			// 用vue的方法 拿到dom节点 返回的是一个数组  $refs 不是响应式的
			// this.$refs[`goods-${shopIdx}-${goodIdx}`]
			// 使用Velocity动画第一个参数是节点，第二个参数是对象 用于动画的配置 
			Velocity(this.$refs[`goods-${shopIdx}-${goodIdx}`],{
				// 对象的简洁写法
				left
			})
		},//end 到这儿就要想一下 fetch的封装与server层的封装

	},//methods
	computed:{
		// 全选 这个功能 用计算属性来做。 要用到 get set 所以用对象的形式写
		allSelected:{
			get(){
				// 先判断有没有数据 没数据就给个false
				if(this.cartLists&&this.cartLists.length){
					// 判断cartLists中的所有店铺有没有被选中 并且判断其中的所有店铺的checked的值是不是为true
					return this.cartLists.every(shop=>{
						return shop.checked
					})
				}
				return false
			},
			set(newValue){
				// 遍历数据顶层的shop 把newValue的值赋值给 shop.checked
				// 同时遍历goodList 每一个商品的 good.checked 也都要弄上新值
				this.cartLists.forEach(shop=>{
					shop.checked = newValue
					shop.goodList.forEach(good=>{
						good.checked = newValue
					})
				})
			},
		},//allSelect
		// ⚠️ 选中商品的价格计算 不用set 只需要用get 所以直接用方法写就可以了
		selectedLists(){
			// 如果 cartLists 的长度为空的时候 咱就不算了,返回一个空数组
			// 如果 cartLists 存在并且长度不为空的时候 在继续计算
			// 因为接口数据的原因遍历两层
			if(this.cartLists&&this.cartLists.length){
				// 给个空数组很重要
				let arr = []
				let total = 0
				this.cartLists.forEach(shop=>{
					shop.goodList.forEach(good=>{
						// 判断商品有没有被选中,选中的商品送进新的数组，并且计算选中商品的总价（单价*数量）
						if(good.checked){
							arr.push(good)
						  total += good.price*good.number
						}
						
					})
				})
				// 数算出来了 就赋值吧
				this.total = total
				// 把选中的商品列表弹出来
				return arr
			}else{
				return []
			}	
		},//selectedList
		removeLists(){
			// 如果店铺在编辑状态，并且该店铺店铺下的商品有被选择，那么就push到数组中去
			// 如果没有就给个空数组
			if(this.editingShop){
				let arr = []
				this.editingShop.goodList.forEach(good=>{
					// 如果商品已经被选中 把商品push到临时空数组里面去 否则给个空数组
					if(good.removeChecked){
						arr.push(good)
					}
				})
				return arr
			}
			return []
		},//removeLists

		allRemoveSelected:{
			get(){
				if (this.editingShop) {
					return this.editingShop.removeChecked
				}else{
					return false
				}

			},
			set(newValue){
				if (this.editingShop) {
				 this.editingShop.removeChecked = newValue
				 this.editingShop.goodList.forEach(good=>{
				 	good.removeChecked = newValue
				 })
				}
			}
		}

	},//computed
	watch:{
		removePopUp(newVal,oldVal){
			document.body.style.overflow = newVal ? 'hidden': 'auto'
      document.body.style.height = newVal?'100%': 'auto'  
		}
	},//watch
	created(){
		this.getCartData()
	}// created
})
