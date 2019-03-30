
let mFilter = {
	

	formatPrice:price=>{
		if(price+'.0' != price){
			return price
		}else{
			return price + '.00' 
		}				
	}, //formatPrice
	formatBuyer:buyername=>{
		return buyername.replace(/.(?=.)/g, '*');
	}



}


export default mFilter