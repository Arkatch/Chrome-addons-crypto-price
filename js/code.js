window.onload = ()=>{
	fetch('https://api.coinmarketcap.com/v1/ticker/?limit=15')
    .then(resp => resp.json())
	.then(resp => build(resp))
	.then(resp => buildExt(resp))
	.then(()=>{
		fetch('https://api.coinmarketcap.com/v1/ticker/dogecoin/')
		.then(resp => resp.json())
		.then(resp => build(resp))
		.then(resp => buildExt(resp))
	})
}
function buildExt(data){
	let main = htmlElem('div', [['id', 'main']])
	for(let i of data){
		let tmp = htmlElem('div', [['class', 'item']])
		let txt = document.createTextNode(i)
		tmp.appendChild(txt)
		main.appendChild(tmp)
		tmp.appendChild(htmlElem('hr'))
	}
	document.body.appendChild(main)
}
function htmlElem(tag, attribute = []){
	let x = document.createElement(tag)
	for(let i of attribute){
		x.setAttribute(i[0], i[1])
	}
	return x
}
function build(data){
	let dataRet = []
	for(let i of data){	
		dataRet.push(i['symbol']+' '+usdFormat(i['price_usd']))
	}
	return dataRet
}
function usdFormat(price){
	let priceFinal = '$'
	let tab = price.split('.')
	let tmp1 = tab[0].split('')
	let tmp2 = tab[1].split('')
	
	let len1 = tmp1.length
	let len2 = tmp2.length
	
	if(len1 > 3){
		tmp1.splice(len1-3, 0, ' ')	
	}
	if(len2 > 2){
		tmp2.splice(3, len2);
	}
	priceFinal += tmp1.join('')+'.'+tmp2.join('')
	return priceFinal
}