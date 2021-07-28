import Navbar from "./components/Navbar/Navbar"
import Footer from "./components/Footer/Footer"
import Home from "./pages/Home/Home"
import Imformation from "./pages/Information/Information"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import "./App.css"
import "./Animations.css"
import { useEffect } from "react"

const App = () => {
  useEffect(() => {
    const elements = document.querySelectorAll(".animate")
    const scrollAnimation = () => {
      let topScreen = document.documentElement.scrollTop;
      elements.forEach((element, index) => {
        let top = element.offsetTop;
        if (top - 450 < topScreen) {
          if (element.classList.contains("animate-left"))
            element.classList.add("scale-in-hor-left");
          else {
            element.classList.add("scale-in-hor-right");
          }
        }
      })
    }
    window.addEventListener("scroll", scrollAnimation);
  }, []);

  return (
    <div className="DARK" id="">
      <Router>
        <div className="App">
          <Navbar />
          <div className="Content">
            <Switch>
              <Route path={["/character/:id", "/location/:id", "/episode/:id"]}>
                <Imformation />
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

