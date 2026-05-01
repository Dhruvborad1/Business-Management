import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { Link } from 'react-router-dom'

const footerLinks = [
  { label: 'Dashboard', to: '/' },
  { label: 'Orders', to: '/orders' },
  { label: 'Inventory', to: '/inventory' },
  { label: 'Customers', to: '/customers' },
  { label: 'Reports', to: '/reports' },
  { label: 'Settings', to: '/settings' },
]

const contactItems = [
  { icon: FiPhone, text: '+91 98765 43210' },
  { icon: FiMail, text: 'info@riyafashion.com' },
  { icon: FiMapPin, text: 'Surat, Gujarat' },
]

function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white/85 px-4 py-6 shadow-[0_-10px_30px_rgba(15,23,42,0.06)] backdrop-blur md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-xl">
          <h2 className="text-xl font-bold tracking-tight text-slate-900">Riya Fashion</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Smart business management for challans, parties, inventory, and daily fashion operations.
          </p>
        </div>

        <nav className="flex flex-wrap gap-2" aria-label="Footer navigation">
          {footerLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-violet-100 hover:text-violet-700"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto mt-6 flex w-full max-w-7xl flex-col gap-4 border-t border-slate-200 pt-5 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-col gap-3 text-sm text-slate-600 sm:flex-row sm:flex-wrap sm:items-center">
          {contactItems.map((item) => {
            const Icon = item.icon

            return (
              <span key={item.text} className="inline-flex items-center gap-2">
                <Icon className="text-violet-600" size={16} />
                {item.text}
              </span>
            )
          })}
        </div>
        <p className="text-sm text-slate-500">© {new Date().getFullYear()} Riya Fashion. All rights reserved.</p>
      </div>
    </footer>
  )
}

export default Footer
