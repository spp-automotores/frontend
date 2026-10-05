# SPP Automotores — sitio web

Sitio de la agencia SPP Automotores: catálogo de autos, una página por auto, consultas por WhatsApp,
«Vendé tu auto» y un panel privado para cargar y dar de baja autos.

## Correr el sitio en una computadora

Hace falta Node.js 20.9 o más nuevo.

```bash
npm install
cp .env.example .env.local   # y completar los valores
npm run dev                  # abre el sitio en http://localhost:3000
```

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` | Sitio en modo desarrollo, se actualiza al guardar |
| `npm run build` | Arma la versión final y revisa los tipos |
| `npm run start` | Sirve la versión final armada con `build` |
| `npm run lint` | Revisa el código en busca de errores comunes |
