const fs = require('fs')
const dico = JSON.parse(fs.readFileSync('dictionary.json', 'utf8'))
const english_words = Object.keys(dico)

const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

function romencode(string, offset) {
    if (typeof string !== 'string') throw `String expected, ${typeof string} received.`

    return string
        .split('')
        .map(letter => {
            if (/[a-zA-Z]/.test(letter)) {
                let upperCaseLetter = letter === letter.toUpperCase()
                letter = alphabet[(alphabet.indexOf(letter.toLowerCase()) + offset) % alphabet.length]
                return upperCaseLetter ? letter.toUpperCase() : letter
            }
            return letter
        })
        .join('')
}

function romdecode(string, offset) {
    return romencode(string, Math.abs(offset - 26))
}

function romguess(string) {
    let guesses = []
    for(let i = 0; i <= 26; i++) {
        let arr = string.split(/[^a-zA-Z0-9]/)
            .map(word => romdecode(word, i))
            .map(word => {
                return english_words.indexOf(word.toUpperCase())
            })
            .map(dictionary_key => {
                return dictionary_key == -1 ? false : dictionary_key
            })
        guesses.push([i, arr])
    }
    guesses = guesses.filter(guess => {
        return guess[1].reduce((acc, word) => {
            return word ? acc + 1 : acc
        })
    })

    guesses.forEach(guess => {
        const words = guess[1].map(word_index => english_words[word_index] || '_____')
        console.log(`Translation for offset ${guess[0]} : ${words.join(' ')}`)
    })
}

romguess(process.argv[2])
