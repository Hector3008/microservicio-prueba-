# microservicio-prueba

Microservicio en Express que **no se despliega por separado**: exporta un `Router` y lo ejecuta el gateway [Mi-Servidor](https://github.com/Hector3008/Mi-Servidor), que lo instala como dependencia y lo monta en una ruta.

```
este repo                          Mi-Servidor (gateway)
┌──────────────────────┐   npm i   ┌────────────────────────────────┐
│ src/router.js        │ ────────► │ import prueba from "prueba"    │
│ export default router│           │ gateway.use("/prueba", prueba) │
└──────────────────────┘           └────────────────────────────────┘
```

## Estructura

```
microservicio-prueba-/
├── src/
│   └── router.js     ← toda la lógica; exporta el Router
├── index.js          ← solo para probarlo suelto en local
└── package.json
```

- **`src/router.js`** es lo que usa el gateway.
- **`index.js`** crea una app de Express con `app.listen`. El gateway nunca lo carga; existe solo para desarrollar y probar este servicio de forma aislada.

## Rutas actuales

Dentro del router se escriben relativas al punto de montaje:

| Ruta en este repo (local) | Ruta en el gateway       |
|---------------------------|--------------------------|
| `GET /`                   | `GET /prueba`            |
| `GET /servidor`           | `GET /prueba/servidor`   |

Si el gateway define `BASE_PATH=/gateway`, quedan en `/gateway/prueba` y `/gateway/prueba/servidor`.

## Probarlo en local (aislado)

Requisitos: Node 22 o superior.

```bash
npm install
npm start
```

Abre `http://localhost:4001/`. El puerto se puede cambiar con la variable `PORT`.

## Reglas que no hay que romper

1. **`main` en `package.json` debe ser `src/router.js`.** Si apunta a un archivo que llama a `app.listen`, el gateway levantaría un segundo servidor al importarlo.
2. **`name` en `package.json` es el nombre del import.** Aquí es `prueba`, así que el gateway hace `import prueba from "prueba"`, aunque el repo se llame distinto. Si lo cambias, hay que actualizar el import en el gateway.
3. **Nada de `app.listen` dentro de `src/`.** Solo el gateway escucha en un puerto.
4. **Rutas relativas.** Dentro del router se escribe `/`, no `/prueba`. El prefijo lo pone el gateway.
5. **Middlewares propios dentro del router.** Si necesitas leer JSON, usa `router.use(express.json())` en `src/router.js`, para no afectar a los otros servicios del gateway.
6. **`export default router`.** El gateway importa el router por defecto.

## `package.json` mínimo

```json
{
  "name": "prueba",
  "type": "module",
  "main": "src/router.js",
  "dependencies": { "express": "^5.2.1" }
}
```

## Agregar una ruta nueva

Edita `src/router.js`:

```js
router.get("/saludo", (req, res) => res.json({ msg: "hola" }));
```

Pruébalo en local con `npm start` y abre `http://localhost:4001/saludo`.

## Publicar un cambio (llevarlo al gateway)

Subir cambios a este repo **no actualiza el gateway por sí solo**, porque el gateway guarda en su `package-lock.json` el commit exacto que instaló.

1. En este repo:

   ```bash
   git add .
   git commit -m "Describe el cambio"
   git push
   ```

2. En el repo del gateway:

   ```bash
   npm update prueba
   git add .
   git commit -m "Actualizar microservicio prueba"
   git push
   ```

3. Render redespliega el gateway con la versión nueva.

## Cómo lo instala el gateway

```bash
npm i github:Hector3008/microservicio-prueba-
```

Y lo registra en `src/services.js` del gateway:

```js
import prueba from "prueba";

export const services = [
  { name: "prueba", path: "/prueba", router: prueba },
];
```

Si este repo es privado, el despliegue en Render necesitará credenciales para descargarlo; lo más simple es mantenerlo público o configurar un token de lectura.

## Lista de comprobación antes de subir

- [ ] `main` es `src/router.js`
- [ ] `src/router.js` termina con `export default router`
- [ ] No hay `app.listen` en `src/`
- [ ] `npm start` responde en `http://localhost:4001/`
- [ ] Hice `git push`

## Problemas frecuentes

| Síntoma | Causa probable | Solución |
|---|---|---|
| Al arrancar el gateway aparece un mensaje de este servicio escuchando en un puerto | El gateway instaló una versión donde `main` apunta a `index.js` | Corregir `main`, hacer push, y `npm update prueba` en el gateway |
| El gateway sigue con el comportamiento viejo | El lockfile apunta al commit anterior | `npm update prueba` y subir `package-lock.json` |
| `does not provide an export named 'default'` | Falta `export default router` | Agregarlo en `src/router.js` |
| `Cannot find package 'prueba'` en el gateway | El `name` no coincide con el import | Revisar `name` en este `package.json` |