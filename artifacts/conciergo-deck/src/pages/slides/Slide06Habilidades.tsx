export default function Slide06Habilidades() {
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
      <div style={{ position: "absolute", top: "-8vh", right: "10vw", width: "30vw", height: "30vw", backgroundColor: "#E8634A", borderRadius: "50%", opacity: 0.07, zIndex: 0 }} />
      <div style={{ position: "absolute", bottom: "-5vh", left: "-5vw", width: "25vw", height: "25vw", border: "1.2vw solid #5B2C6F", borderRadius: "50%", opacity: 0.06, zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.05em", color: "#E8634A" }}>
            PORTAFOLIO
          </div>
          <div style={{ padding: "0.8vh 1.5vw", border: "2px solid #5B2C6F", color: "#5B2C6F", borderRadius: "2vw", fontSize: "0.9vw", fontWeight: 600 }}>
            #skills
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4vh" }}>
          <div>
            <div style={{ fontSize: "1.5vw", fontWeight: 700, color: "#E8634A", marginBottom: "1vh", textTransform: "uppercase", letterSpacing: "0.1em", fontFamily: "'DM Sans', sans-serif" }}>
              DEMOSTRADAS EN ESTE PROYECTO
            </div>
            <h2 style={{ fontSize: "4.5vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", margin: 0, lineHeight: 1.1, letterSpacing: "-0.03em" }}>
              Habilidades
            </h2>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2.5vh" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
              <div style={{ fontSize: "1vw", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#E8634A", minWidth: "10vw" }}>Lenguajes</div>
              <div style={{ display: "flex", gap: "1vw", flexWrap: "wrap" }}>
                <div style={{ padding: "0.8vh 1.8vw", backgroundColor: "#5B2C6F", color: "#FFF8F0", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>TypeScript</div>
                <div style={{ padding: "0.8vh 1.8vw", backgroundColor: "#5B2C6F", color: "#FFF8F0", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>JavaScript</div>
                <div style={{ padding: "0.8vh 1.8vw", backgroundColor: "#5B2C6F", color: "#FFF8F0", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>SQL</div>
                <div style={{ padding: "0.8vh 1.8vw", backgroundColor: "#5B2C6F", color: "#FFF8F0", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>HTML · CSS</div>
              </div>
            </div>
            <div style={{ width: "100%", height: "1px", backgroundColor: "#5B2C6F", opacity: 0.12 }} />
            <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
              <div style={{ fontSize: "1vw", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#E8634A", minWidth: "10vw" }}>Frameworks</div>
              <div style={{ display: "flex", gap: "1vw", flexWrap: "wrap" }}>
                <div style={{ padding: "0.8vh 1.8vw", border: "2px solid #5B2C6F", color: "#5B2C6F", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>React</div>
                <div style={{ padding: "0.8vh 1.8vw", border: "2px solid #5B2C6F", color: "#5B2C6F", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Node.js</div>
                <div style={{ padding: "0.8vh 1.8vw", border: "2px solid #5B2C6F", color: "#5B2C6F", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Express</div>
                <div style={{ padding: "0.8vh 1.8vw", border: "2px solid #5B2C6F", color: "#5B2C6F", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Tailwind CSS</div>
                <div style={{ padding: "0.8vh 1.8vw", border: "2px solid #5B2C6F", color: "#5B2C6F", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Socket.io</div>
              </div>
            </div>
            <div style={{ width: "100%", height: "1px", backgroundColor: "#5B2C6F", opacity: 0.12 }} />
            <div style={{ display: "flex", alignItems: "center", gap: "2vw" }}>
              <div style={{ fontSize: "1vw", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#E8634A", minWidth: "10vw" }}>Conceptos</div>
              <div style={{ display: "flex", gap: "1vw", flexWrap: "wrap" }}>
                <div style={{ padding: "0.8vh 1.8vw", backgroundColor: "rgba(232,99,74,0.12)", border: "2px solid #E8634A", color: "#5B2C6F", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>REST APIs</div>
                <div style={{ padding: "0.8vh 1.8vw", backgroundColor: "rgba(232,99,74,0.12)", border: "2px solid #E8634A", color: "#5B2C6F", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>WebSockets</div>
                <div style={{ padding: "0.8vh 1.8vw", backgroundColor: "rgba(232,99,74,0.12)", border: "2px solid #E8634A", color: "#5B2C6F", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Arquitectura fullstack</div>
                <div style={{ padding: "0.8vh 1.8vw", backgroundColor: "rgba(232,99,74,0.12)", border: "2px solid #E8634A", color: "#5B2C6F", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Mobile-first</div>
                <div style={{ padding: "0.8vh 1.8vw", backgroundColor: "rgba(232,99,74,0.12)", border: "2px solid #E8634A", color: "#5B2C6F", borderRadius: "2vw", fontSize: "1.2vw", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>Git</div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ fontSize: "1vw", fontWeight: 600, opacity: 0.6, letterSpacing: "0.05em", textTransform: "uppercase" }}>
            Portafolio de Programador
          </div>
          <div style={{ fontSize: "1.2vw", fontWeight: 800, fontFamily: "'DM Sans', sans-serif", color: "#5B2C6F" }}>
            06
          </div>
        </div>

      </div>
    </div>
  );
}
