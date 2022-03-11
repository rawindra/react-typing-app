import { useEffect, useState } from "react";

function App() {
  const [characters, setCharacters] = useState([]);
  const [inputCharacters, setInputCharacters] = useState('');

  useEffect(() => {
    if (!characters.length) {
      async function getQuote() {
        const response = await fetch('http://api.quotable.io/random');
        const data = await response.json();
        const quote = data.content;
        splitCharactersFromQuote(quote);
      }
      getQuote();
    }

  }, [characters])

  function splitCharactersFromQuote(quote) {
    const splitedCharacters = quote.split('');
    splitedCharacters.forEach(element => {
      setCharacters(characters => [...characters, { name: element, correct: null }]);
    });
  }

  function handleChange(event) {
    setInputCharacters(event.target.value)
    if (inputCharacters && inputCharacters.length === characters.length) {
      setCharacters([]);
      setInputCharacters('')
    }
    checkCharacter(event.target.value);
  }

  function checkCharacter(input) {
    characters.forEach((el, i) => {

      if (input.length >= i + 1) {
        let matched = input[i] === el.name
        console.log(matched)
        if (!matched) {
          el.correct = false
        } else {
          el.correct = true
        }
      } else {
        el.correct = null
      }
    })
  }

  function generateClass(character) {

    if (inputCharacters) {
      if (character.correct != null) {
        if (character.correct) {
          return 'green'
        } else {
          return 'red'
        }
      }
    }
  }


  return (
    <div>
      {characters.map((character, index) => (<span className={`quote ${generateClass(character)}`} key={index}>{character.name}</span>))}
      <div style={{ marginTop: '15px' }}>
        <textarea value={inputCharacters} onChange={handleChange}></textarea>
      </div>
    </div >
  );
}

export default App;
