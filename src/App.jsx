import './App.css'
import Pages from "@/pages/index.jsx"
import { Toaster } from "@/components/ui/toaster"
import PayPalScriptProvider from "@/components/paymentProviders/PayPalScriptProvider"

function App() {
  return (
    <PayPalScriptProvider>
      <Pages />
      <Toaster />
    </PayPalScriptProvider>
  )
}

export default App 