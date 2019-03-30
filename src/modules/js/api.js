// 测试环境与生产环境之间的切换 一个测试用的host 一个生产用的，产品在mock数据下都没问题的话，通过手动注释host 来完成环境的切换
// let host = 'http://mock.eolinker.com/WRiiiWx935d408ca499edf80cafc0228ec55654762caa7c?uri='
// let host = ''
let host = 'http://rap2api.taobao.org/app/mock/149241'
// 存放所有请求的api 这儿声明的名字 与 export default module的name  应该一样
let url = {
	hotlists: '/index/hotlists',
	indexbanner: '/index/banner',
	categorylist: '/category/topList',
	subList: '/category/subList',
	rank: '/category/rank',
	goodList: '/search/list', //商品列表
	goodsDetails: '/goods/details/',
	goodsDeal: '/goods/deal/',
	cartList: '/cart/list',
	addCart: '/cart/add', // 增加购物车中商品数量 每次增加1
	cartReduce: '/cart/reduce', // 减少购物车中商品数量 每次减少1
	cartRemove: '/cart/remove', //  删除一个
	cartMremove: '/cart/mremove', //购物车 多个删除
	addressLists: '/address/list',
	addressAdd: '/address/add',
	addressRemove: '/address/remove',
	addressUpdate: '/address/update',
	addressSetDefault: '/address/setDefault',

 
}
// 给每一个端口都加上host  自己将let item  写成了 item
for (let item in url) {
	if (url.hasOwnProperty(item)) {
		url[item] = host + url[item]
	}	
}


// 1.02.28
export default url 