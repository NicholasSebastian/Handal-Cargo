import { FC } from 'react';
import { withDatabase } from "./data/useDatabase";

const App: FC = () => {
  // TODO: useAuth

  return (
    <div className="App">
      <header className="App-header">
        <p>
          Nicholas Sebastian Hendrata.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer">
          Learn React
        </a>
      </header>
    </div>
  );
}

export default withDatabase(App);
