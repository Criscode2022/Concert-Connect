export default function Slide04Funcionalidades() {
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
      <div style={{ position: "absolute", top: "-5vh", left: "20vw", width: "40vw", height: "40vw", backgroundColor: "#E8634A", borderRadius: "50%", opacity: 0.05, zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "8vh", right: "8vw", width: "15vw", height: "15vw", border: "1.2vw solid #5B2C6F", transform: "rotate(45deg)", opacity: 0.07, zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", color: "#E8634A" }}>
            PORTAFOLIO
          </div>
          <div style={{ padding: "0.8vh 1.5vw", border: "2px solid #5B2C6F", color: "#5B2C6F", borderRadius: "2vw", fontSize: "0.9vw", fontWeight: 600 }}>
            #features
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "3vh" }}>
          <div>
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#E8634A", marginBottom: "1vh", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif" }}>
              LO QUE SE CONSTRUYÓ
            </div>
            <h2 style={{ fontSize: "4.5vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", margin: 0, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              Funcionalidades clave
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5vh 4vw" }}>
            <div style={{ display: "flex", gap: "1.8vw", alignItems: "flex-start", backgroundColor: "#FFF8F0", padding: "2.5vh 2vw", borderRadius: "1vw", boxShadow: "0.4vw 0.4vw 0px #E8634A", border: "2px solid #5B2C6F" }}>
              <div style={{ fontSize: "2.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#E8634A", lineHeight: 1 }}>01</div>
              <div>
                <div style={{ fontSize: "1.3vw", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: "0.5vh" }}>Mapa de eventos</div>
                <div style={{ fontSize: "1.1vw", fontWeight: 500, opacity: 0.75, lineHeight: 1.5 }}>Leaflet + clustering interactivo por ciudad</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.8vw", alignItems: "flex-start", backgroundColor: "#FFF8F0", padding: "2.5vh 2vw", borderRadius: "1vw", boxShadow: "0.4vw 0.4vw 0px #E8634A", border: "2px solid #5B2C6F" }}>
              <div style={{ fontSize: "2.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#E8634A", lineHeight: 1 }}>02</div>
              <div>
                <div style={{ fontSize: "1.3vw", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: "0.5vh" }}>Filtros en tiempo real</div>
                <div style={{ fontSize: "1.1vw", fontWeight: 500, opacity: 0.75, lineHeight: 1.5 }}>Por género musical, sin recarga de página</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.8vw", alignItems: "flex-start", backgroundColor: "#FFF8F0", padding: "2.5vh 2vw", borderRadius: "1vw", boxShadow: "0.4vw 0.4vw 0px #E8634A", border: "2px solid #5B2C6F" }}>
              <div style={{ fontSize: "2.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#E8634A", lineHeight: 1 }}>03</div>
              <div>
                <div style={{ fontSize: "1.3vw", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: "0.5vh" }}>Asistencia y conexiones</div>
                <div style={{ fontSize: "1.1vw", fontWeight: 500, opacity: 0.75, lineHeight: 1.5 }}>Sistema social entre usuarios por evento</div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "1.8vw", alignItems: "flex-start", backgroundColor: "#FFF8F0", padding: "2.5vh 2vw", borderRadius: "1vw", boxShadow: "0.4vw 0.4vw 0px #E8634A", border: "2px solid #5B2C6F" }}>
              <div style={{ fontSize: "2.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#E8634A", lineHeight: 1 }}>04</div>
              <div>
                <div style={{ fontSize: "1.3vw", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: "0.5vh" }}>UI mobile-first en español</div>
                <div style={{ fontSize: "1.1vw", fontWeight: 500, opacity: 0.75, lineHeight: 1.5 }}>Diseño accesible desde cualquier dispositivo</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "1vw", fontWeight: 600, opacity: 0.6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Portafolio de Programador
          </div>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#5B2C6F" }}>
            04
          </div>
        </div>

      </div>
    </div>
  );
}
