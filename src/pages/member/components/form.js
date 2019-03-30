
// this.$route && this.$router 这两个是不一样的玩意儿~ 
// this.$route => 拿到路由的信息
import Address from 'js/addressService.js'

export default {
	data(){
		return{
			name: '',
			tel: '',
			provinceValue: -1,
			cityValue: -1,
			districtValue: -1,
			addressDetail: '',
			id: '',
			type: '',
			instance: '',
			// 「拿router传值的 方法一」
			// 拿到传过来的类型
			// type: this.$route.query.type,
		 // 拿到传过来的实例
		  // instance: this.$route.query.instance,

		  // 一共是省市区3个级别 4个直辖市 拿到数据做html渲染~
		  addressData: require('js/address.json'),
		  cityList: null,
		  districtList: null,
		}
	}, //data
	methods:{
		add(){
			// 数据校验暂时不完善
			let {name,tel,provinceValue,cityValue,districtValue,addressDetail} = this
			let data = {name,tel,provinceValue,cityValue,districtValue,addressDetail}
			// 路由的类型可不能忘啊 type
			if(this.type === 'add'){
				Address.add(data).then(res=>{
					// 添加成功后跳转到地址列表页  用的是 go 的回跳
					// 也可以用router的push方法
					this.$router.go(-1)
				})
			}
			if(this.type === 'edit'){
				// 别忘了 增加id
				data.id = this.id
				Address.update(data).then(res=>{
					// 添加成功后跳转到地址列表页  用的是 go 的回跳
					// 也可以用push方法
					this.$router.go(-1)
				})
			}
		},//add
		remove(){
			// 在做这个功能时接口报错，发现是接口的status的类型弄错了应该是 number 判断用的是3个等号所以类型也要注意到
			if(window.confirm('您确认删除该地址吗？')){
				Address.remove(this.id).then(res=>{

					this.$router.go(-1)
				})
			}

		},//remove

		setDefault(){
			Address.setDefault(this.id).then(res=>{
					this.$router.go(-1)
			})
		},//setDefault

	}, //methods
	created(){
		// 「拿router传值的 方法二」
		let query = this.$route.query
		this.type = query.type
		this.instance = query.instance
		// 对省市区进行还原
		if(this.type==='edit'){
			let list = this.instance
			this.id = list.id
			this.name = list.name
			this.tel = list.tel
			this.addressDetail = list.addressDetail
			// ⚠️ 之前错误的写成了 provinceValue 对传来的数据键值一定要认真观察 用 console.table() 打印清楚
			this.provinceValue= list.provinceVal
		}
	},//created

	// 省市区联动 用watch
	watch:{
		provinceValue(val){
			if(val === -1) return 
			let list = this.addressData.list
			let index = list.findIndex(item=>{
				return item.value === val
			})
			this.cityList = list[index].children
			this.cityValue = -1
			this.districtValue = -1

// 编辑状态对 城市进行还原
			if(this.type === 'edit'){
				this.cityValue = parseInt(this.instance.cityValue)
			}
		},//provinceValue
		cityValue(val){
			if(val === -1)return 
			let list = this.cityList
			let index = list.findIndex(item=>{
				return item.value === val
			})
			this.districtList = list[index].children
			this.districtValue = -1

				if(this.type === 'edit'){
				this.districtValue = parseInt(this.instance.districtValue)
			}


		},//provinceValue



	}




}