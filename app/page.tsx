const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export default function Home() {
  return (
    <main className="wrap hero">
      <img className="tower" src={`${base}/tower.png`} alt="" />
      <h1>Belltower</h1>
      <p className="lead">Dining, classes, parking and the rest of UC Riverside, in one app.</p>
      <p>
        <a href={`${base}/privacy-policy/`}>Privacy Policy</a>
      </p>
      <footer>Unofficial. Not affiliated with UC Riverside.</footer>
    </main>
  );
}
