---
title: Testing · unitarios
---

# Testing · unitarios

No hay `*.spec.ts` de negocio. El “unitario” que sí se ejecuta es **compilar los tipos**.

## Health + Zod

El handler no devuelve un objeto suelto: pasa por el schema generado.

```ts
router.get("/healthz", (_req, res) => {
  const data = HealthCheckResponse.parse({ status: "ok" });
  res.json(data);
});
```

Si alguien cambia `HealthStatus` en OpenAPI y no regenera, o si el parse recibe otro shape, peta en runtime **y** el typecheck avisa al desalinearse los imports.

## JIT auth (contrato, no runner)

`requireAuth` está escrito para fallar cerrado:

```ts
if (!token) {
  return res.status(401).json({ error: "Unauthorized" });
}
```

Un test unitario futuro iría aquí (mock de `verifyNeonToken` + `db.insert`). Hoy se afirma con typecheck y uso real en Vercel.
