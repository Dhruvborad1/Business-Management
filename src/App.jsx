import { useEffect, useState } from 'react'
import Dashboard from './dashboard/components/Dashboard'
import Orders from './dashboard/components/Orders'
import Inventory from './dashboard/components/Inventory'
import Customers from './dashboard/components/Customers'
import Reports from './dashboard/components/Reports'
import Settings from './dashboard/components/Settings'
import DashboardHeader from './dashboard/components/DashboardHeader'
import Footer from './dashboard/components/WebMateFooter'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const [parties, setParties] = useState(() => {
    const savedParties = window.localStorage.getItem('riyafashion-parties')

    if (!savedParties) {
      return []
    }

    try {
      return JSON.parse(savedParties)
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem('riyafashion-parties', JSON.stringify(parties))
  }, [parties])

  const [challans, setChallans] = useState(() => {
    const savedChallans = window.localStorage.getItem('riyafashion-challans')

    if (!savedChallans) {
      return []
    }

    try {
      return JSON.parse(savedChallans)
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem('riyafashion-challans', JSON.stringify(challans))
  }, [challans])

  const [yourChalans, setYourChalans] = useState(() => {
    const savedYourChalans = window.localStorage.getItem('riyafashion-your-chalans')

    if (!savedYourChalans) {
      return []
    }

    try {
      return JSON.parse(savedYourChalans)
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem('riyafashion-your-chalans', JSON.stringify(yourChalans))
  }, [yourChalans])

  return (
    <BrowserRouter>
      <main className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-slate-50 to-blue-100">
        <div className="flex min-h-screen w-full flex-col">
          <DashboardHeader />
          <div className="flex w-full flex-1 flex-col px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
            <Routes>
              <Route path="/" element={<Dashboard parties={parties} challans={challans} setChallans={setChallans} />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/reports" element={<Reports parties={parties} setParties={setParties} challans={challans} setChallans={setChallans} yourChalans={yourChalans} setYourChalans={setYourChalans} />} />
              <Route path="/settings" element={<Settings parties={parties} setParties={setParties} challans={challans} setChallans={setChallans} yourChalans={yourChalans} setYourChalans={setYourChalans} />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </main>
    </BrowserRouter>
  )
}

export default App
