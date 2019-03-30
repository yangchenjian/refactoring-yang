<template>
	 <div class="container " style="min-height: 597px;">
    <!--
      ⚠️ 
    	一旦有异步请求  v-if 就要在父级div对数据的来到与否进行判断
    	就不能忘记！ 
    -->
    <div class="block-list address-list section section-first js-no-webview-block"
    	 v-if="addressData&&addressData.length"
    	>
      <a class="block-item js-address-item address-item" 
      	 
      	 v-for="address in addressData"
      	 @click="toEdit(address)"
      	 :key="address.id"
      	 :class="{'address-item-default':address.isDefault}" 
      >
        <div class="address-title">{{address.name}} {{address.tel}}</div>
        <p>
        	{{address.provinceName}} 
        	{{address.cityName}} 
        	{{address.districtName}}
        	{{address.addressDetail}}
        </p>
      </a>
     
     <!--  <a class="block-item js-address-item address-item address-item-default" @click="toEdit">
        <div class="address-title">tony 13112345678</div>
        <p>北京市北京市东城区天安门</p>
      </a> -->
    </div>
    <!-- 如果数据没来 要做一个相应的处理 -->
    <div
        	 v-if="addressData&&!addressData.length"
    	>
    	<p>
    		暂时没有地址，请添加
    	</p>
    </div>
    <div class="block stick-bottom-row center">
     <!-- 因为路由要写两层，所以要想一个相对简单的写法 -->
<!--       <router-link class="btn btn-blue js-no-webview-block js-add-address-btn" to="/address/form">
 -->  


 <!-- /member.html#/address/form?type=add -->
      <router-link class="btn btn-blue js-no-webview-block js-add-address-btn" 
      	:to="{
      		name:'form',
      		query: {
      			type: 'add',
      		},
      	}"
      >
          
        新增地址
      </router-link>
    
    </div>
    <Bottomnav></Bottomnav>
  
  </div>

</template>
<script type="text/javascript">
	import Address from 'js/addressService.js'

	export default{
		name: 'all-address',
		data(){
			return {
				addressData: null,

			}
		}, //data
		methods:{
			// 通过  toEdit 方法 使用this.$router.push 实现编程式导航
			toEdit(addrInfo){
				this.$router.push({
					// path: '/address/form',
					name: 'form',
					query:{
						type: 'edit',
						// 通过 instance 把数据带给form
						instance: addrInfo,
					}
				})
			},//toEdit
		},//methods
		created(){
			Address.list().then(res =>{
				this.addressData = res.data.lists
			})
		},//created
   
	}
</script>

<style type="text/css" scoped>
	@import './css/address_base.css';
	@import './css/address.css';
</style>
