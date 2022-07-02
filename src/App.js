import CreatePost from "./components/CreatePost";
import Votes from "./components/Votes";

function App() {
    return (
        <div className="App">
            <Votes votes={1000} />
        </div>
    );
}

export default App;
