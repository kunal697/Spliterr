import { ExpenseProvider } from "./contexts/ExpenseContext"
import  HomePage  from "./pages/HomePage"
import "./index.css"
import { Toaster } from "react-hot-toast"

function App() {
  return (
    <ExpenseProvider>
      <div className="App">
        <Toaster position="top-right" />
        <HomePage />
      </div>
    </ExpenseProvider>
  )
}

export default App
