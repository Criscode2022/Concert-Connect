export default function Slide05Retos() {
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
      <div style={{ position: "absolute", bottom: "-10vh", right: "-8vw", width: "35vw", height: "35vw", backgroundColor: "#5B2C6F", borderRadius: "50%", opacity: 0.05, zIndex: 0 }} />
      <div style={{ position: "absolute", top: "10vh", left: "-4vw", width: "18vw", height: "18vw", border: "1vw solid #E8634A", borderRadius: "50%", opacity: 0.12, zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", color: "#E8634A" }}>
            PORTAFOLIO
          </div>
          <div style={{ padding: "0.8vh 1.5vw", backgroundColor: "#5B2C6F", color: "#FFF8F0", borderRadius: "2vw", fontSize: "0.9vw", fontWeight: 600 }}>
            #problemas-resueltos
          </div>
        </div>

        <div style={{ display: "flex", height: "62vh", gap: "5vw", alignItems: "center" }}>
          <div style={{ flex: "0 0 30vw" }}>
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#E8634A", marginBottom: "2vh", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif" }}>
              BAJO EL CAPÓ
            </div>
            <h2 style={{ fontSize: "4.8vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", margin: "0 0 3vh 0", lineHeight: 1.05, letterSpacing: "-0.03em" }}>
              Retos técnicos resueltos
            </h2>
            <p style={{ fontSize: "1.4vw", fontWeight: 500, lineHeight: 1.6, margin: 0, opacity: 0.8 }}>
              Cada problema requirió investigar, iterar y tomar decisiones de diseño concretas.
            </p>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "2.2vh" }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw", padding: "2vh 2vw", borderRadius: "0.8vw", borderLeft: "4px solid #E8634A", backgroundColor: "rgba(232,99,74,0.06)" }}>
              <div style={{ width: "0.8vw", height: "0.8vw", backgroundColor: "#E8634A", borderRadius: "50%", marginTop: "0.6vh", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "1.3vw", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: "0.4vh" }}>WebSockets sobre proxy en monorepo pnpm</div>
                <div style={{ fontSize: "1.1vw", fontWeight: 500, opacity: 0.75 }}>Configuración de Socket.io con path correcto bajo prefijo de ruta</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw", padding: "2vh 2vw", borderRadius: "0.8vw", borderLeft: "4px solid #E8634A", backgroundColor: "rgba(232,99,74,0.06)" }}>
              <div style={{ width: "0.8vw", height: "0.8vw", backgroundColor: "#E8634A", borderRadius: "50%", marginTop: "0.6vh", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "1.3vw", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: "0.4vh" }}>Auth de invitado con UI progresiva</div>
                <div style={{ fontSize: "1.1vw", fontWeight: 500, opacity: 0.75 }}>Restricciones por rol sin romper el flujo de navegación</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw", padding: "2vh 2vw", borderRadius: "0.8vw", borderLeft: "4px solid #E8634A", backgroundColor: "rgba(232,99,74,0.06)" }}>
              <div style={{ width: "0.8vw", height: "0.8vw", backgroundColor: "#E8634A", borderRadius: "50%", marginTop: "0.6vh", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "1.3vw", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: "0.4vh" }}>FAB en layout de scroll nativo</div>
                <div style={{ fontSize: "1.1vw", fontWeight: 500, opacity: 0.75 }}>Botón fijo renderizado fuera del contenedor scrolleable via prop</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: "1.5vw", padding: "2vh 2vw", borderRadius: "0.8vw", borderLeft: "4px solid #E8634A", backgroundColor: "rgba(232,99,74,0.06)" }}>
              <div style={{ width: "0.8vw", height: "0.8vw", backgroundColor: "#E8634A", borderRadius: "50%", marginTop: "0.6vh", flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: "1.3vw", fontWeight: 700, fontFamily: "'DM Sans', sans-serif", marginBottom: "0.4vh" }}>Coordenadas sin geolocalización del dispositivo</div>
                <div style={{ fontSize: "1.1vw", fontWeight: 500, opacity: 0.75 }}>Datos estáticos de venue sin depender de la API del navegador</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "1vw", fontWeight: 600, opacity: 0.6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Portafolio de Programador
          </div>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#5B2C6F" }}>
            05
          </div>
        </div>

      </div>
    </div>
  );
}
