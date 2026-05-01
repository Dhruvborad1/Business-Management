import { FiMail, FiMapPin, FiPhone, FiFacebook, FiInstagram, FiTwitter, FiLinkedin, FiArrowRight } from 'react-icons/fi'

const footerSections = [
  {
    title: 'Quick Links',
    links: [
      { label: 'Dashboard', to: '/' },
      { label: 'Orders', to: '/orders' },
      { label: 'Inventory', to: '/inventory' },
      { label: 'Customers', to: '/customers' },
      { label: 'Reports', to: '/reports' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', to: '#' },
      { label: 'Contact Us', to: '#' },
      { label: 'FAQ', to: '#' },
      { label: 'Feedback', to: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '#' },
      { label: 'Terms & Conditions', to: '#' },
      { label: 'Cookie Policy', to: '#' },
    ],
  },
]

const socialLinks = [
  { icon: FiFacebook, label: 'Facebook', to: '#' },
  { icon: FiInstagram, label: 'Instagram', to: '#' },
  { icon: FiTwitter, label: 'Twitter', to: '#' },
  { icon: FiLinkedin, label: 'LinkedIn', to: '#' },
]

const contactInfo = [
  { icon: FiPhone, text: '+91 98765 43210' },
  { icon: FiMail, text: 'info@riyafashion.com' },
  { icon: FiMapPin, text: 'Surat, Gujarat' },
]

function WebMateFooter() {
  return (
    <footer className="mt-auto bg-black text-white">
      {/* Main Footer Content */}
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="mb-4 text-2xl font-bold tracking-wide">
              <span className="text-white">Riya</span>
              <span className="text-violet-500">Fashion</span>
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Smart business management for challans, parties, inventory, and daily fashion operations.
            </p>
            
            {/* Social Links with Animation */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.to}
                    aria-label={social.label}
                    className="group flex h-10 w-10 items-center justify-center rounded-full border border-slate-700 bg-transparent text-slate-400 transition-all duration-300 hover:scale-110 hover:border-violet-500 hover:bg-violet-600 hover:text-white"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Icon size={18} className="transition-transform duration-300 group-hover:scale-125" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Link Sections */}
          {footerSections.map((section, sectionIndex) => (
            <div key={section.title} className="animate-fadeInUp" style={{ animationDelay: `${sectionIndex * 100}ms` }}>
              <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-violet-400">
                {section.title}
              </h4>
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={link.label} className="animate-fadeInUp" style={{ animationDelay: `${(sectionIndex * 100) + (linkIndex * 50)}ms` }}>
                    <a
                      href={link.to}
                      className="group flex items-center gap-2 text-sm text-slate-400 transition-all duration-300 hover:translate-x-2 hover:text-violet-400"
                    >
                      <FiArrowRight className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 text-violet-500" size={14} />
                      <span className="group-hover:text-violet-400">{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info Bar */}
        <div className="mt-12 flex flex-col gap-6 border-t border-slate-800 pt-8 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <div 
                  key={info.text} 
                  className="flex items-center gap-2 animate-fadeInUp" 
                  style={{ animationDelay: `${300 + (index * 100)}ms` }}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-violet-500 transition-all duration-300 hover:bg-violet-600 hover:text-white">
                    <Icon size={16} />
                  </div>
                  <span className="text-sm text-slate-400">{info.text}</span>
                </div>
              )
            })}
          </div>
          
          {/* Newsletter */}
          <div className="flex items-center gap-2 animate-fadeInUp" style={{ animationDelay: `400ms` }}>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-56 rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 transition-all duration-300 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
            />
            <button className="group relative overflow-hidden rounded-lg bg-violet-600 px-5 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:bg-violet-700 hover:shadow-lg hover:shadow-violet-500/30">
              <span className="relative z-10">Subscribe</span>
              <div className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800 bg-slate-950 py-4">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 text-sm text-slate-500 md:flex-row md:px-8">
          <p>© {new Date().getFullYear()} <span className="text-white">Riya Fashion</span>. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a 
                key={item} 
                href="#" 
                className="text-slate-500 transition-all duration-300 hover:text-violet-400"
              >
                {item} Policy
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.5s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </footer>
  )
}

export default WebMateFooter