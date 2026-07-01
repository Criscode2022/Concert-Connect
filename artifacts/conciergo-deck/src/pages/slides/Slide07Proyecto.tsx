export default function Slide07Proyecto() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        backgroundColor: "#5B2C6F",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "8vh 8vw",
        boxSizing: "border-box",
        color: "#FFF8F0",
      }}
    >
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "65vw", height: "65vw", backgroundColor: "#E8634A", borderRadius: "50%", opacity: 0.08, zIndex: 0 }} />
      <div style={{ position: "absolute", top: "-10vh", left: "-8vw", width: "30vw", height: "30vw", backgroundColor: "#FFF8F0", borderRadius: "50%", opacity: 0.03, zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", color: "#E8634A" }}>
            PORTAFOLIO
          </div>
        </div>

        <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "3vh" }}>
          <div style={{ fontSize: "1.4vw", fontWeight: 700, color: "#E8634A", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif" }}>
            CÓDIGO FUENTE DISPONIBLE
          </div>
          <h2 style={{ fontSize: "6.5vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", margin: 0, lineHeight: 1.05, letterSpacing: "-0.03em" }}>
            Ver el proyecto
          </h2>
          <p style={{ fontSize: "1.8vw", fontWeight: 500, lineHeight: 1.5, margin: 0, maxWidth: "50vw", opacity: 0.85 }}>
            El repositorio incluye toda la arquitectura, decisiones de diseño y documentación técnica del proyecto.
          </p>
          <div style={{ marginTop: "2vh", display: "inline-flex", alignItems: "center", gap: "1.5vw", backgroundColor: "rgba(255,248,240,0.1)", padding: "2.5vh 4vw", borderRadius: "1vw", border: "2px solid rgba(255,248,240,0.3)", boxShadow: "0.5vw 0.5vw 0px #E8634A" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "0.5vh" }}>
              <div style={{ fontSize: "1vw", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em", color: "#E8634A" }}>GitHub</div>
              <div style={{ fontSize: "2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.01em" }}>
                <a href="https://github.com/tu-usuario/conciergo" target="_blank" rel="noopener noreferrer" style={{ color: "#FFF8F0", textDecoration: "underline", textDecorationColor: "#E8634A" }}>
                  github.com/tu-usuario/conciergo
                </a>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "1vw", fontWeight: 600, opacity: 0.5, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Portafolio de Programador
          </div>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#FFF8F0" }}>
            07
          </div>
        </div>

      </div>
    </div>
  );
}
