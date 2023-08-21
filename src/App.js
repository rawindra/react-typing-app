import { useEffect, useState } from "react";

function App() {
  const [characters, setCharacters] = useState([]);
  const [inputCharacters, setInputCharacters] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [corrrectCharacterCount, setcorrrectCharacterCount] = useState(0);

  useEffect(() => {
    if (!characters.length) {
      async function getQuote() {
        const response = await fetch('http://api.quotable.io/random');
        const data = await response.json();
        const quote = data.content;
        splitCharactersFromQuote(quote);
      }
      getQuote();

      const identifier = setInterval(() => {
        setSeconds(seconds => seconds + 1);
      }, 1000);

      return () => {
        clearInterval(identifier);
    }

  }, [characters, seconds])

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
      setInputCharacters('');
      setSeconds(0);
      setcorrrectCharacterCount(0);
    }
    checkCharacter(event.target.value);
  }

  function checkCharacter(input) {

    let correctCount = 0;

    characters.forEach((el, i) => {

      if (input.length >= i + 1) {
        let matched = input[i] === el.name
        if (!matched) {
          el.correct = false
        } else {
          el.correct = true
          correctCount = correctCount + 1;
          setcorrrectCharacterCount(correctCount)
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

  function wordcountPerMinute() {
    return (corrrectCharacterCount / 5) / (seconds / 60)
  }

  return (
    <div>
      {characters.map((character, index) => (<span className={`quote ${generateClass(character)}`} key={index}>{character.name}</span>))}
      <div style={{ marginTop: '15px' }}>
        <textarea value={inputCharacters} onChange={handleChange}></textarea>
      </div>
      <p>seconds:</p>{seconds}
      <p>correctwc:</p> {corrrectCharacterCount}
      <p>wpm</p> {wordcountPerMinute()}
    </div >
  );
}

export default App;
