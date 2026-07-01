export default function Slide01ConcierGo() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#FFF8F0",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "8vh 8vw",
        boxSizing: "border-box",
        color: "#5B2C6F",
      }}
    >
      <div style={{ position: "absolute", top: "-10vh", right: "-5vw", width: "40vw", height: "40vw", backgroundColor: "#E8634A", borderRadius: "50%", opacity: 0.1, zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-15vh", left: "-10vw", width: "50vw", height: "50vw", backgroundColor: "#5B2C6F", borderRadius: "50%", opacity: 0.05, zIndex: 0 }} />
      <div style={{ position: "absolute", top: "20vh", right: "15vw", width: "10vw", height: "10vw", border: "1vw solid #E8634A", borderRadius: "2vw", transform: "rotate(15deg)", opacity: 0.8, zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", color: "#E8634A" }}>
            PORTAFOLIO
          </div>
          <div style={{ display: "flex", gap: "1vw" }}>
            <div style={{ padding: "0.8vh 1.5vw", backgroundColor: "#5B2C6F", color: "#FFF8F0", borderRadius: "2vw", fontSize: "0.9vw", fontWeight: 600 }}>
              #fullstack
            </div>
            <div style={{ padding: "0.8vh 1.5vw", border: "2px solid #5B2C6F", color: "#5B2C6F", borderRadius: "2vw", fontSize: "0.9vw", fontWeight: 600 }}>
              2026
            </div>
          </div>
        </div>

        <div style={{ maxWidth: "65vw" }}>
          <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#E8634A", marginBottom: "2vh", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif" }}>
            PROYECTO FULLSTACK
          </div>
          <h1 style={{ fontSize: "9vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", margin: "0 0 3vh 0", lineHeight: 1.0, letterSpacing: "-0.03em" }}>
            ConcierGo
          </h1>
          <p style={{ fontSize: "1.8vw", fontWeight: 500, lineHeight: 1.5, margin: 0, maxWidth: "48vw", opacity: 0.8 }}>
            App web mobile-first en español que conecta asistentes a conciertos en tiempo real.
          </p>

          <div style={{ marginTop: "4vh", display: "inline-flex", alignItems: "center", gap: "1.5vw", backgroundColor: "#FFF8F0", padding: "1.5vh 2.5vw", borderRadius: "1vw", boxShadow: "0.5vw 0.5vw 0px #E8634A", border: "2px solid #5B2C6F" }}>
            <div style={{ width: "1vw", height: "1vw", backgroundColor: "#E8634A", borderRadius: "50%" }} />
            <div style={{ fontSize: "1.1vw", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>Stack:</div>
            <div style={{ fontSize: "1.3vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#E8634A" }}>React · TypeScript · Node.js · PostgreSQL</div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "1vw", fontWeight: 600, opacity: 0.6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Portafolio de Programador
          </div>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#5B2C6F" }}>
            01
          </div>
        </div>

      </div>
    </div>
  );
}
