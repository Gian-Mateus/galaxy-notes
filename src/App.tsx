import { Sidebar } from "./components/sidebar/sidebar"
import { Home } from "./pages/home"

function App() {

  return (
    <main>
      <Sidebar />
      <div className="container">
        <Home />
      </div>
    </main>
  )
}

export default App
