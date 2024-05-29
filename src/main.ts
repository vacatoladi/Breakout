import { Actor, CollisionType, Color, Engine, Font, FontUnit, Label, Loader, Sound, Vector, vec } from "excalibur"
import { delay } from "excalibur/build/dist/Util/Util"

const game = new Engine({
    width: 800, height: 600

})

const barra = new Actor({
    x: 150, y: game.drawHeight - 40,
    width: 150, height: 20,
    color: Color.Chartreuse,
    name: "barraJogador"
})

barra.body.collisionType = CollisionType.Fixed

game.input.pointers.primary.on("move", (event) => {
    barra.pos.x = event.worldPos.x
})



const bolinha = new Actor({
    x: 100, y: 300,
    radius: 10,
    color: Color.Red
})


bolinha.body.collisionType = CollisionType.Passive

const velocidadeBolinha = vec(500, 500)

let cores = [
    Color.Black,
    Color.Red,
    Color.Green,
    Color.Orange,
    Color.Violet
]

let numeroCor = cores.length


bolinha.on("postupdate", () => {
    if (bolinha.pos.x < bolinha.width / 2) {
        bolinha.vel.x = velocidadeBolinha.x
    }

    if (bolinha.pos.x + bolinha.width / 2 > game.drawWidth) {
        bolinha.vel.x = -(velocidadeBolinha.x)
    }

    if (bolinha.pos.y < bolinha.height / 2) {
        bolinha.vel.y = velocidadeBolinha.y
    }

    if (bolinha.pos.y + bolinha.height / 2 > game.drawHeight) {
        sound3.play(1)
    }



})




const padding = 20

const xoffset = 65
const yoffset = 20

const colunas = 5
const linhas = 3

const corBloco = [Color.Red, Color.Orange, Color.Yellow]

const larguraBloco = (game.drawWidth / colunas) - padding - (padding / colunas)
const alturaBloco = 30

const listaBlocos: Actor[] = []

let i = 0
let j = 0

for (let j = 0; j < linhas; j++) {
    for (let i = 0; i < colunas; i++) {
        listaBlocos.push(
            new Actor({
                x: xoffset + i * (larguraBloco + padding) + padding,
                y: yoffset + j * (alturaBloco + padding) + padding,
                width: larguraBloco,
                height: alturaBloco,
                color: corBloco[j]
            })
        )
    }
}

const gerarblocos = () => {

    listaBlocos.forEach(bloco => {
        bloco.body.collisionType = CollisionType.Active

        game.add(bloco)

    })

    bolinha.kill()

    bolinha.pos = vec(100, 300)

    velocidadeBolinha.x += 200
    velocidadeBolinha.y += 200

    bolinha.vel = vec(0, 0)

    setTimeout(() => {
        bolinha.vel = velocidadeBolinha
    }, 1500)



    game.add(bolinha)
}



let colidindo: boolean = false

let pontos = 0

const sound = new Sound('./src/som/toque.wav')

const sound2 = new Sound('./src/som/toque2.wav')

const sound3 = new Sound('./src/som/robloxmorte.mp3')

const loader = new Loader([sound, sound2, sound3])

let pontidus = 0
let round = 0

bolinha.on("collisionstart", (event) => {
    if (listaBlocos.includes(event.other)) {
        event.other.kill(),
            sound2.play(1)
        pontos++
        textoPontos.text = `${pontos} Pontos`

        if (pontos == pontidus + 15) {
            round++
            textoRound.text = `Round: ${round + 1}`
            alert(`Você venceu o ${round} round! parabéns`)
            gerarblocos()
            pontidus += 15
        }

    } else {
        sound.play(1)
    }
    let interseccao = event.contact.mtv.normalize()

    if (!colidindo) {
        colidindo = true

        if (Math.abs(interseccao.x) > Math.abs(interseccao.y)) {
            bolinha.vel.x = bolinha.vel.x * -1
        } else {
            bolinha.vel.y = bolinha.vel.y * -1
        }
    }
    numeroCor--

    bolinha.color = cores[numeroCor]
    if (numeroCor == 0) {
        numeroCor = 5
    }
})

bolinha.on("collisionstart", () => {
    colidindo = false
})

bolinha.on("exitviewport", () => {
    alert(`Você perdeu com uma pontuação de ${pontos} tente novamente`)
    window.location.reload()
})



const textoPontos = new Label({
    text: `${pontos} Pontos`,
    font: new Font({
        size: 30,
        color: Color.White,
        strokeColor: Color.Black,
        unit: FontUnit.Px
    }),
    pos: vec(620, 500)
})
const textoRound = new Label({
    text: `Round: ${round + 1}`,
    font: new Font({
        size: 30,
        color: Color.White,
        strokeColor: Color.Black,
        unit: FontUnit.Px
    }),
    pos: vec(30, 500)
})
game.add(textoRound)
game.add(textoPontos)


gerarblocos()

game.add(barra)

game.start(loader)