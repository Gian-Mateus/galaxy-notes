import { Sidebar } from "./components/sidebar/sidebar"
import { Home } from "./pages/home"
import './app.css'

function App() {

  return (
    <main>
      <Sidebar />
      <div className="container">
        <h1>Hello Palolla!</h1>
        <Home />
      </div>
    </main>
  )
}

export default App
