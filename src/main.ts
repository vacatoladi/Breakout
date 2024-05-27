import { Actor, CollisionType, Color, Engine, Text, vec } from "excalibur"

const game = new Engine({
	width: 800, height: 600

})

const barra = new Actor({
    x: 150, y: game.drawHeight - 40,
	width: 200, height: 20,
	color: Color.Chartreuse,
	name: "barraGogador"
})

barra.body.collisionType = CollisionType.Fixed

game.input.pointers.primary.on("move", (event) =>{
	barra.pos.x = event.worldPos.x
})

const bolinha = new Actor({
	x: 100, y: 300,
	radius: 10,
	color: Color.Red
})

bolinha.body.collisionType = CollisionType.Passive

const velocidadeBolinha = vec(1000, 1000)

setTimeout(() => {
	bolinha.vel = velocidadeBolinha
}, 1000)

bolinha.on("postupdate", () => {
	if(bolinha.pos.x < bolinha.width / 2){
		bolinha.vel.x = velocidadeBolinha.x
	}

	if(bolinha.pos.x + bolinha.width / 2 > game.drawWidth){
		bolinha.vel.x = -(velocidadeBolinha.x)
	}

	if(bolinha.pos.y < bolinha.height / 2){
		bolinha.vel.y = velocidadeBolinha.y
	}

	// if(bolinha.pos.y + bolinha.height / 2 > game.drawHeight){
	// 	bolinha.vel.y = -velocidadeBolinha.y
	// }

})

game.add(bolinha)

const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [Color.Red, Color.Orange, Color.Yellow]

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
const alturaBloco = 30

const listaBlocos: Actor[] = []


for(let j = 0; j < linhas; j++){
	for(let i = 0; i < colunas; i++){
		listaBlocos.push(
			new Actor({
				x: xoffset + i * (larguraBloco + padding) + padding,
				y: yoffset + j * (alturaBloco + padding) + padding,
				width:larguraBloco,
				height:alturaBloco,
				color: corBloco[j]
			})
		)
	}
}

let colidindo: boolean = false

bolinha.on("collisionstart", (event) => {
	if (listaBlocos.includes(event.other)) {
		event.other.kill()
	}
	let interseccao = event.contact.mtv.normalize()

	if(!colidindo) {
		colidindo = true

		if ( Math.abs(interseccao.x) > Math.abs(interseccao.y)){
			bolinha.vel.x = bolinha.vel.x * -1
		} else {
			bolinha.vel.y = bolinha.vel.y * -1
		}
	}
})	

bolinha.on("collisionstart", () => {
	colidindo = false
})

bolinha.on("exitviewport", () => {
	// alert("Você foi morrido")
	window.location.reload()

})

let pontos = 0

const textoPontos = new Text({
	text: "Hello World"
})

const objetoTexto = new Actor({
	x: game.drawWidth - 80,
	y: game.drawHeight - 15
})

objetoTexto.graphics.use(textoPontos)

game.add(objetoTexto)

listaBlocos.forEach( bloco => {
	bloco.body.collisionType = CollisionType.Active

	game.add(bloco)

})


game.add(barra)

game.start()