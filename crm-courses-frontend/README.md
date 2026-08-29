# crm-courses-frontend

Portal del curso de concientizacion en ciberseguridad, para los empleados
(trainees) de las empresas cliente. Es una app separada del `crm-frontend`,
pensada para vivir en su propio (sub)dominio, pero habla con el mismo
backend del CRM.

## Como se relaciona con `crm-updated`

- No trae su propio backend. Apunta al mismo Express/Mongoose que ya usa
  el CRM, via `VITE_API_URL`.
- Usa un login y un token JWT **distintos** a los del staff del CRM:
  `POST /api/course-auth/login` en vez de `/api/auth/login`. El token que
  devuelve trae `type: "trainee"` y solo sirve para las rutas bajo
  `/api/course-portal/*` (ver `verifyEmployeeToken` en el backend).
- El usuario/contrasena de cada trainee es el que ya se genera hoy en el
  CRM al crear un empleado (`courseAccount.username` / contrasena
  temporal mostrada una sola vez).

## Setup local

```bash
npm install
cp .env.example .env   # ajustar VITE_API_URL si el backend no esta en localhost:3000
npm run dev            # levanta en el puerto 5174
```

Corre en paralelo al `crm-frontend` (puerto 5173) sin chocar, siempre que
el backend tenga ambos orígenes en su allowlist de CORS
(`CRM_ORIGIN` y `COURSES_ORIGIN` en el `.env` del backend).

## Deploy (subdominio separado)

1. Backend: agregar la URL de produccion de esta app a `COURSES_ORIGIN`
   en el `.env` del backend (y el CRM a `CRM_ORIGIN`), luego redeploy.
2. Este proyecto: `npm run build`, subir `dist/` a donde vayas a alojarlo
   (Vercel, Netlify, S3+CloudFront, etc.), apuntando el dominio
   `courses.tudominio.com` (o el que elijas) ahi.
3. Variable de entorno en el hosting: `VITE_API_URL` con la URL publica
   del backend (ej. `https://api.tudominio.com/api`).

No se necesita ningun cambio de cookies/sesion entre dominios: el token
viaja por header `Authorization`, asi que el unico requisito real de
cross-origin es el CORS del paso 1.

## Contenido de los cursos (PDFs / videos)

Los PDFs y videos se administran desde el CRM (`crm-frontend`), no desde
esta app: un consultor sube el PDF/video por modulo usando los endpoints
`/api/courses/:businessId/courses/:courseId/modules/:moduleId/pdf` y
`.../video`, y luego asigna el curso a los empleados de una empresa con
`/api/employees/:companyId/assign-course`. Esta app solo consume ese
contenido ya cargado (URLs firmadas de S3 con 15 min de vigencia, se
regeneran cada vez que el trainee abre `/curso`).

## Estructura

```
src/
  app/
    context/AuthContext.tsx   # sesion del trainee (localStorage: courseToken)
    router/                   # rutas + guard de proteccion
    layouts/                  # AuthLayout (login) y PortalLayout (post-login)
  features/
    auth/LoginPage.tsx
    course/
      types/                 # tipos TS del curso/modulos
      services/courseService.ts   # fetch() planos + header Authorization inline
      pages/CoursePage.tsx
      components/ModuleCard.tsx, QuizModal.tsx
```
