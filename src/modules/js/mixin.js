let mixin = {
	filters:{
		formatPrice(price){
			if(price+'.0' != price){
				return price
			}else{
				return price + '.00' 
			}				
		},//formatPrice
	}
}


export default mixin