import React, {useState} from "react";
import logo from './logo.svg';
import './App.css';

function App() {

  const [greeting, setGreeting] = useState(null);

  const getGreeting = async () => {
    {/* Your code goes here*/}
  }

  return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button onClick={getGreeting}>greeting</button>
          <h2>{greeting}</h2>
          <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
  );
}

export default App;