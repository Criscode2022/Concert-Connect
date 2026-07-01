export default function Slide02Problema() {
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
        justifyContent: "space-between",
        padding: "8vh 8vw",
        boxSizing: "border-box",
        color: "#5B2C6F",
      }}
    >
      <div style={{ position: "absolute", top: "40vh", right: "-10vw", width: "30vw", height: "30vw", backgroundColor: "#E8634A", borderRadius: "50%", opacity: 0.08, zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "5vh", left: "-5vw", width: "20vw", height: "20vw", border: "1vw solid #5B2C6F", borderRadius: "50%", opacity: 0.08, zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", color: "#E8634A" }}>
            PORTAFOLIO
          </div>
          <div style={{ padding: "0.8vh 1.5vw", backgroundColor: "#5B2C6F", color: "#FFF8F0", borderRadius: "2vw", fontSize: "0.9vw", fontWeight: 600 }}>
            #contexto
          </div>
        </div>

        <div style={{ display: "flex", height: "62vh", gap: "5vw", alignItems: "center" }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#E8634A", marginBottom: "2vh", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif" }}>
              EL RETO
            </div>
            <h2 style={{ fontSize: "4.8vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", margin: "0 0 3vh 0", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              El problema técnico
            </h2>
            <p style={{ fontSize: "1.5vw", fontWeight: 500, lineHeight: 1.6, margin: 0, opacity: 0.8 }}>
              Construir una experiencia social en tiempo real sobre eventos dinámicos con múltiples capas de estado.
            </p>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2.5vh" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2vw", backgroundColor: "#FFF8F0", padding: "2.5vh 2vw", borderRadius: "1vw", boxShadow: "0.4vw 0.4vw 0px #E8634A", border: "2px solid #5B2C6F" }}>
              <div style={{ fontSize: "2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#E8634A", minWidth: "3vw" }}>01</div>
              <div style={{ fontSize: "1.4vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Datos de eventos con geolocalización</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "2vw", backgroundColor: "#FFF8F0", padding: "2.5vh 2vw", borderRadius: "1vw", boxShadow: "0.4vw 0.4vw 0px #E8634A", border: "2px solid #5B2C6F" }}>
              <div style={{ fontSize: "2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#E8634A", minWidth: "3vw" }}>02</div>
              <div style={{ fontSize: "1.4vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Presencia en tiempo real vía WebSockets</div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "2vw", backgroundColor: "#FFF8F0", padding: "2.5vh 2vw", borderRadius: "1vw", boxShadow: "0.4vw 0.4vw 0px #E8634A", border: "2px solid #5B2C6F" }}>
              <div style={{ fontSize: "2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#E8634A", minWidth: "3vw" }}>03</div>
              <div style={{ fontSize: "1.4vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Auth con roles: guest vs. usuario registrado</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "1vw", fontWeight: 600, opacity: 0.6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Portafolio de Programador
          </div>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#5B2C6F" }}>
            02
          </div>
        </div>

      </div>
    </div>
  );
}
