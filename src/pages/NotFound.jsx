export default function NotFound() {
  // Make look better (add logo and personalise message)
  return (
    <div style={{ height: '80vh', display: 'flex', justifyContent: 'center', alignContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h2>
        <img src="/img/icon_black.png" alt="Logo" style={{ width: '200px', height: '200px', marginBottom: '20px', color: "fff" }} />
        Uh oh! The page you are looking for doesn't exist.
      </h2>
    </div>
  )
}