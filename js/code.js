window.onload = ()=>{
	create()
}
async function create(){
	let data = await apiAsync()
	buildExt(data)
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
var coinList = new Map()
function ajax(url){
	return new Promise((resolve, reject)=>{
		var request = new XMLHttpRequest()
		request.onload = ()=>{
			if(request.status == 200){
				resolve(request.responseText)
			}else{
				reject(request.statusText)
			}
		}
		request.onerror = ()=>{
		  reject(request.statusText)
		}
		request.open("GET", url, true)
		request.send()
	})
}
async function apiAsync(){
	try{
		let apiResponse = await ajax('https://api.coinmarketcap.com/v1/ticker/?limit=15')
		return build(apiResponse)
	}catch(e){
		console.log(e)
	}
}
class Coin{
	constructor(name, price, proc_1h, proc_24h, proc_7d, symbol){
		this.name 		= name
		this.priceUsd 	= price
		this.proc_1h 	= proc_1h
		this.proc_24h 	= proc_24h
		this.proc_7d	= proc_7d
		this.symbol 	= symbol
	}
	get info(){
		return this.contact()
	}
	contact(){
		return this.symbol+' $'+this.formatUSD()
	}
	formatUSD(){
		let x = parseFloat(this.priceUsd)	//1033,34
		if(x>=1000){
			let temp = Math.floor(x/1000) 	//1033,34/1000 -> 1
			let frac = x-Math.floor(x)		//1033,34 - 1033 -> 0,34
			x = x-(temp*1000)-frac			//1033,34 - 1000 - 0,34 -> 33
			
			if(x<100)
				x = '0'+x
			
			let newFrac = frac*10 				//0,95 -> 9,5
			let oldFrac = Math.floor(frac*10) 	//0,95 -> 9,5 -> 9
			if(newFrac%oldFrac)
				frac = parseInt(frac*100)
			else
				frac = parseInt(frac*10)+'0'
			
			x = temp+' '+x+','+frac
		}else{
			let temp = Math.floor(x)
			let frac = Math.round(x*100)-(temp*100)
			x = temp+','+frac
		}
		return x
	}
}
function build(data){
	let cryptoData = JSON.parse(data)
	let dataRet = []
	for(let i of cryptoData){
		coinList.set(i['name'], new Coin(i['name'], i['price_usd'], i['percent_change_1h'], i['percent_change_24h'], i['percent_change_7d'], i['symbol']))
	}
	for(let key of coinList.keys()){
		dataRet.push(coinList.get(key).info)
	}
	return dataRet
}