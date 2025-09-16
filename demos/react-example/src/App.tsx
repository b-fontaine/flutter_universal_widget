import './App.css';
import FlutterWidget from "react-lib";

const App = () => {
  return (
    <div className="content">
      <h1>Rsbuild with React</h1>
      <p>Start building amazing things with Rsbuild.</p>
        <FlutterWidget greeting="Hello from React!" />
    </div>
  );
};

export default App;
