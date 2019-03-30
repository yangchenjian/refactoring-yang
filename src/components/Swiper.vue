<template>
	<div class="swiper-container">
  	<div class="swiper-wrapper" >    
			<mt-swipe :auto="4000" class="swp-page"  >
				<mt-swipe-item v-for="item in bannerlists">
					<a class="js-no-follow" :href="item.clickUrl">
		        	<img class="goods-main-photo fadeIn" :src="item.imgUrl">
		       </a>
				</mt-swipe-item>
		  </mt-swipe>
    </div>
  </div>	 
</template>

<script type="text/javascript">
	/* ⚠️ 千万不能忘了 引入相关样式 */
	import '../../node_modules/mint-ui/lib/swipe/style.css'
	export default{
		name: 'Swiper',
		data(){
			return {

			}
		},//data
		props:{
			//  之前在父组件 与这里用的都是 bannerLists 但是出错了 遂改成 bannerlists
			bannerlists:{
				type: Array,
				required: true,
			},//bannerlists
		},//props
		methods:{

		},//methods
	}
</script>

<style type="text/css" scoped>
		.swp-page{
			height: 180px;
		}
</style>