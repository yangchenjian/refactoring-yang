
let mFilter = {
	

	formatPrice:price=>{
		return String(parseInt(Number(price)*100)).replace(/(\d{2})$/, '.$1')

		// if(price+'.0' != price){
		// 	return price
		// }else{
		// 	return price + '.00' 
		// }				
	

	}, //formatPrice
	formatBuyer:buyername=>{
		return buyername.replace(/.(?=.)/g, '*');
	}



}


export default mFilter