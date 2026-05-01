function PagePlaceholder({ title, description }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-slate-600">{description}</p>
    </section>
  )
}

export default PagePlaceholder
