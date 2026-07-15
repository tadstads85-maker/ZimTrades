export default function Layout({ children }) {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, -apple-system' }}>
      <header style={{ padding: 16, borderBottom: '1px solid #eee' }}>
        <h2>ZimTrades</h2>
      </header>
      <section>{children}</section>
    </div>
  )
}
