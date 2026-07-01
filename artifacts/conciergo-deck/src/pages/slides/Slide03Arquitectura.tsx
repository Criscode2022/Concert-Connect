export default function Slide03Arquitectura() {
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
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "60vw", height: "60vw", backgroundColor: "#E8634A", borderRadius: "50%", opacity: 0.08, zIndex: 0 }} />
      <div style={{ position: "absolute", top: "-8vh", right: "-5vw", width: "25vw", height: "25vw", backgroundColor: "#FFF8F0", borderRadius: "50%", opacity: 0.04, zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", color: "#E8634A" }}>
            PORTAFOLIO
          </div>
          <div style={{ padding: "0.8vh 1.5vw", border: "2px solid #E8634A", color: "#E8634A", borderRadius: "2vw", fontSize: "0.9vw", fontWeight: 600 }}>
            #arquitectura
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "3vh" }}>
          <div>
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#E8634A", marginBottom: "1vh", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif" }}>
              TECH STACK
            </div>
            <h2 style={{ fontSize: "4.5vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", margin: 0, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              Arquitectura
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5vw 3vw" }}>
            <div style={{ backgroundColor: "rgba(255,248,240,0.08)", border: "2px solid rgba(255,248,240,0.2)", borderRadius: "1vw", padding: "3vh 2.5vw", borderLeft: "4px solid #E8634A" }}>
              <div style={{ fontSize: "0.9vw", fontWeight: 700, color: "#E8634A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.2vh" }}>Frontend</div>
              <div style={{ fontSize: "1.8vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", marginBottom: "1vh" }}>React + Vite</div>
              <div style={{ fontSize: "1.2vw", fontWeight: 500, opacity: 0.75, lineHeight: 1.5 }}>TypeScript · Tailwind CSS · Wouter · monorepo pnpm</div>
            </div>
            <div style={{ backgroundColor: "rgba(255,248,240,0.08)", border: "2px solid rgba(255,248,240,0.2)", borderRadius: "1vw", padding: "3vh 2.5vw", borderLeft: "4px solid #E8634A" }}>
              <div style={{ fontSize: "0.9vw", fontWeight: 700, color: "#E8634A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.2vh" }}>Backend</div>
              <div style={{ fontSize: "1.8vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", marginBottom: "1vh" }}>Express + Socket.io</div>
              <div style={{ fontSize: "1.2vw", fontWeight: 500, opacity: 0.75, lineHeight: 1.5 }}>REST API · WebSockets · sesiones · proxy pnpm</div>
            </div>
            <div style={{ backgroundColor: "rgba(255,248,240,0.08)", border: "2px solid rgba(255,248,240,0.2)", borderRadius: "1vw", padding: "3vh 2.5vw", borderLeft: "4px solid #E8634A" }}>
              <div style={{ fontSize: "0.9vw", fontWeight: 700, color: "#E8634A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.2vh" }}>Base de datos</div>
              <div style={{ fontSize: "1.8vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", marginBottom: "1vh" }}>PostgreSQL</div>
              <div style={{ fontSize: "1.2vw", fontWeight: 500, opacity: 0.75, lineHeight: 1.5 }}>Drizzle ORM · migraciones tipadas · esquema relacional</div>
            </div>
            <div style={{ backgroundColor: "rgba(255,248,240,0.08)", border: "2px solid rgba(255,248,240,0.2)", borderRadius: "1vw", padding: "3vh 2.5vw", borderLeft: "4px solid #E8634A" }}>
              <div style={{ fontSize: "0.9vw", fontWeight: 700, color: "#E8634A", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "1.2vh" }}>Despliegue</div>
              <div style={{ fontSize: "1.8vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", marginBottom: "1vh" }}>Replit</div>
              <div style={{ fontSize: "1.2vw", fontWeight: 500, opacity: 0.75, lineHeight: 1.5 }}>Fullstack en un solo entorno · CI automático</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "1vw", fontWeight: 600, opacity: 0.5, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Portafolio de Programador
          </div>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#FFF8F0" }}>
            03
          </div>
        </div>

      </div>
    </div>
  );
}
