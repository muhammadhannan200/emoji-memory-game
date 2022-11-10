let flip=document.querySelector('#start')
let boardContainer=document.querySelector('.board-container')
let board=document.querySelector('.board');
let win=document.querySelector('.win');
let moves=document.querySelector('.moves');
let timer=document.querySelector('.timer');

const state = {
    gameStarted: false,
    flippedCards: 0,
    totalFlips: 0,
    totalTime: 0,
    loop: null
}

//pick random funciton
const pickRandom = (array, items) => {
    const clonedArray = [...array]
    const randomPicks = []

    for (let index = 0; index < items; index++) {
        const randomIndex = Math.floor(Math.random() * clonedArray.length)
        
        randomPicks.push(clonedArray[randomIndex])
        clonedArray.splice(randomIndex, 1)
    }

    return randomPicks
}

//shuffle function
const shuffle = array => {
    const clonedArray = [...array]

    for (let index = clonedArray.length - 1; index > 0; index--) {
        const randomIndex = Math.floor(Math.random() * (index + 1))
        const original = clonedArray[index]

        clonedArray[index] = clonedArray[randomIndex]
        clonedArray[randomIndex] = original
    }

    return clonedArray
}


//  generatGame
const generateGame = () => {

    const dimensions = board.getAttribute('data-dimension')

    if (dimensions%2!==0) {
        throw new Error("The dimension of the board must be an even number.")
    }

    const emojis = ['🌚','😂','😱','❤️','😍','🙈','😭','😈']
    const picks = pickRandom(emojis, (dimensions * dimensions) / 2) 
    const items = shuffle([...picks, ...picks])
    const cards = `
        <div class="board" style="grid-template-columns: repeat(${dimensions}, auto)">
            ${items.map(item => `
                <div class="card">
                    <div class="card-front"></div>
                    <div class="card-back">${item}</div>
                </div>
            `).join('')}
       </div>
    `
    
    const parser = new DOMParser().parseFromString(cards, 'text/html')

    board.replaceWith(parser.querySelector('.board'))
}

const startGame = () => {
    state.gameStarted = true;
    flip.classList.add("disabled")

    state.loop = setInterval(() => {
        state.totalTime++

        moves.innerText = `moves : ${state.totalFlips} `
        timer.innerText = `time: ${state.totalTime} sec`
    }, 1000)
}

const flipBackCards = () => {   
    document.querySelectorAll('.card:not(.matched)').forEach(card => {
        card.classList.remove('flipped')
    })

    state.flippedCards = 0
}

const flipCard = card => {
    state.flippedCards++
    state.totalFlips++
    flipBackCards

    if (!state.gameStarted) {
        startGame()
    }

    if (state.flippedCards <= 2) {
        card.classList.add('flipped')
    }

    if (state.flippedCards === 2) {
        const flippedCards = document.querySelectorAll('.flipped:not(.matched)')
      


        if (flippedCards[0].innerText === flippedCards[1].innerText) {
            flippedCards[0].classList.add('matched')
            flippedCards[1].classList.add('matched')
        }

        setTimeout(() => {
            flipBackCards()
        }, 1000)
    }
    // If there are no more cards that we can flip, we won the game
if (!document.querySelectorAll('.card:not(.flipped)').length) {
    setTimeout(() => {
        boardContainer.classList.add('flipped')
        win.innerHTML = `
            <span class="win-text">
                You won!<br />
                with <span class="highlight">${state.totalFlips}</span> moves<br />
                under <span class="highlight">${state.totalTime}</span> seconds
            </span>
        `

        clearInterval(state.loop)
    }, 1000)
}
}








    //events
    const attachEventListeners = () => {
        document.addEventListener('click', event => {
            //which event clicked   
            const eventTarget = event.target
            //get the father
            const eventParent = eventTarget.parentElement
            //if i clicked on card and  parrent doesn't flip>>event flip function (to flip hid card)
            if (eventTarget.className.includes('card') && !eventParent.className.includes('flipped')) {
                flipCard(eventParent)


            } //if the button clicked and the button doesnt disabled yet (dosen't clicked yet) > start the game
            else if (eventTarget.nodeName === 'BUTTON' && !eventTarget.className.includes('disabled')) {
                startGame()
            }
        })
    }







generateGame()
attachEventListeners()







