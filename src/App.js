import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer/Footer"
import Home from "./pages/Home/Home"
import Imformation from "./pages/Information/Information"
import Graphics from "./pages/Graphics/Graphics"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import "./App.css"

const App = () => {

  return (
    <div className="DARK" id="">
      <Router>
        <div className="App">
          <Navbar />
          <div className="Content">
            <Switch>
              <Route exact path="/dashboard/">
                <Graphics />
              </Route>
              <Route path={["/character/", "/location/", "/episode/"]}>
                <Imformation />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </div>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;

