import { Container } from 'react-bootstrap';
import './App.css';
import Todos from './components/Todos';

function App(): JSX.Element {
  return (
    <div className="App">
      <Container className="mt-5">
        <Todos></Todos>
      </Container>
    </div>
  );
}

export default App;
