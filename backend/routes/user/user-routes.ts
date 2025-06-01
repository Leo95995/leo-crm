import * as express from "express";
import { UserController } from "../../controllers/user/user-controller";
import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roles/role-middleware";
import { roleConfig, RoleConfiguration } from "../../config/roles";
const userRouter = express.Router();
import rateLimit from "express-rate-limit";

const publicRoutesLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 5,
  message: "Troppe richieste da questo IP, riprova tra 5 minuti",
});

// USERS ROUTER

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestione degli utenti e operazioni
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *        - Users
 *     summary: Recupera la lista degli utenti
 *     description: Recupera tutti gli utenti. Supporta paginazione, ricerca, filtro, ordinamento e la possibilità di ottenere la lista completa senza paginazione.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: full
 *         schema:
 *           type: boolean
 *         description: Se true, ritorna tutta la lista utenti senza paginazione
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Numero di pagina per la paginazione (default 1)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Testo per ricerca nel campo indicato da filter
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Campo su cui filtrare la ricerca (es. "name", "email")
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Ordine di ordinamento (ascendente o discendente)
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *         description: Campo su cui applicare l'ordinamento
 *     responses:
 *       200:
 *         description: Lista utenti recuperata con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   description: Lista degli utenti (senza password)
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 total:
 *                   type: integer
 *                   description: Numero totale di utenti (utile per la paginazione)
 *                 page:
 *                   type: integer
 *                   description: Numero della pagina corrente (presente solo se usata la paginazione)
 *       404:
 *         description: Lista utenti vuota
 *       401:
 *         description: Non autorizzato, token JWT mancante o invalido
 *       500:
 *         description: Errore interno del server
 */
userRouter.get(
  "/",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.LOW)),
  UserController.getAllUsers
);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     tags:
 *        - Users
 *     summary: Recupera un singolo utente per ID
 *     description: Recupera i dettagli di un utente specifico tramite il suo ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID univoco dell'utente da recuperare
 *     responses:
 *       200:
 *         description: Utente trovato e dettagli restituiti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: 643c1234abcd5678ef901234
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 firstName:
 *                   type: string
 *                   example: Mario
 *                 lastName:
 *                   type: string
 *                   example: Rossi
 *                 role:
 *                   type: string
 *                   example: admin
 *                 username:
 *                   type: string
 *                   example: mariorossi
 *       404:
 *         description: Utente non trovato
 *       401:
 *         description: Non autorizzato, token JWT mancante o invalido
 *       500:
 *         description: Errore interno del server
 */

userRouter.get(
  "/uid/:id",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.LOW)),
  UserController.getUser
);
/**
 * @swagger
 * /users/verify:
 *   get:
 *     tags:
 *        - Users
 *     summary: Verifica la validità del token JWT
 *     description: Endpoint protetto che risponde con "ok" se il token JWT è valido e l’utente ha il ruolo minimo richiesto.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token valido
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: ok
 *       401:
 *         description: Non autorizzato, token JWT mancante o ruolo insufficiente
 *       500:
 *         description: Errore interno del server
 */

userRouter.get(
  "/verify",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.LOW)),
  UserController.verifyToken
);

/**
 * @swagger
 * /role:
 *   get:
 *     summary: Recupera i dati del ruolo dell'utente autenticato
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Ruolo utente trovato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: viewer
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["read", "write"]
 *       400:
 *         description: Ruolo utente non presente nella richiesta
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Ruolo utente non trovato nella richiesta
 *       404:
 *         description: Ruolo non riconosciuto
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Ruolo non riconosciuto
 *       500:
 *         description: Errore interno del server
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Problema nel recupero dei dati
 */

userRouter.get(
  "/role",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.LOW)),
  UserController.getUserRole
);

// ---------------- POST USERS --------------------------

/**
 * @swagger
 * /users/register:
 *   post:
 *     tags:
*       - Users 
 *     summary: Crea un nuovo utente
 *     description: Registra un nuovo utente con validazione dei campi e hashing della password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - username
 *               - password
 *               - firstName
 *               - lastName
 *               - termsCondition
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               username:
 *                 type: string
 *                 example: user123
 *               password:
 *                 type: string
 *                 example: StrongP@ssw0rd
 *               firstName:
 *                 type: string
 *                 example: Mario
 *               lastName:
 *                 type: string
 *                 example: Rossi
 *               termsCondition:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Utente creato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     termsCondition:
 *                       type: boolean
 *       401:
 *         description: Errore di validazione dei dati, ad esempio username già usato o campi mancanti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 password: { status: true, message: "Password non valida" }
 *                 username: { status: false }
 *                 email: { status: false }
 *                 termsCondition: { status: false }
 *                 globalError: "Username gia utilizzato"
 *       500:
 *         description: Errore interno del server
 */

userRouter.post(
  "/register",
  publicRoutesLimiter,
  UserController.createUser
);

/**
 * @swagger
 * /users/signin:
 *   post:
 *     tags:
*       - Users  
 *     summary: Effettua il login dell'utente
 *     description: Verifica username e password, restituisce token JWT e dati utente codificati in base64.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: user123
 *               password:
 *                 type: string
 *                 example: StrongP@ssw0rd
 *     responses:
 *       200:
 *         description: Login riuscito, token e dati utente restituiti
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userToRet:
 *                   type: string
 *                   description: Utente codificato in base64 (JSON)
 *                 token:
 *                   type: string
 *                   description: Token JWT per autenticazione
 *       401:
 *         description: Password errata
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Unauthorized
 *       404:
 *         description: Utente non trovato
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User not found
 *       500:
 *         description: Errore interno del server
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal server Error
 */
userRouter.post("/signin", publicRoutesLimiter, UserController.signin);

// userRouter.post("/sendMail", UserController.sendMailReset);
// ---------------- PATCH TASKS -------------------------
/**
 * @swagger
 * /users/promote/{id}:
 *   patch:
 *     tags:
 *      - Users 
 *     summary: Aggiorna il ruolo di un utente
 *     description: Modifica il ruolo di un utente specifico tramite il suo ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID univoco dell'utente da promuovere
 *     requestBody:
 *       description: Nuovo ruolo da assegnare all'utente
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       200:
 *         description: Ruolo utente aggiornato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User role updated
 *       404:
 *         description: Utente non trovato o dati mancanti
 *       401:
 *         description: Non autorizzato, token JWT mancante o ruolo insufficiente
 *       500:
 *         description: Errore interno del server
 */

userRouter.patch(
  "/promote/:id",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.FULL)),
  UserController.promoteUser
);

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     tags:
*       - Users 
 *     summary: Modifica i dati di un utente
 *     description: Permette di aggiornare email, firstName e lastName di un utente specifico.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dell'utente da modificare
 *         schema:
 *           type: string
 *           example: 647a9f8e4b2f1c0012345678
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: updated.email@example.com
 *               firstName:
 *                 type: string
 *                 example: Mario
 *               lastName:
 *                 type: string
 *                 example: Rossi
 *     responses:
 *       200:
 *         description: Utente aggiornato con successo, ritorna dati codificati in base64
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: eyJfaWQiOiI2NDdhOWY4ZTRiMmYxYzAwMTIzNDU2NzgiLCJlbWFpbCI6InVwZGF0ZWQuZW1haWxAZXhhbXBsZS5jb20iLCJmaXJzdE5hbWUiOiJNYXJpbyIsImxhc3ROYW1lIjoiUm9zc2kiLCJyb2xlIjoidmlld2VyIiwidXNlcm5hbWUiOiJ1c2VyMTIzIn0=
 *       404:
 *         description: Utente da aggiornare non trovato
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User to update not found
 *       500:
 *         description: Errore durante il processo di aggiornamento utente
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Error in the user updating process
 */

userRouter.patch(
  "/:id",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.HIGH)),
  UserController.modifyUser
);

// ---------------- DELETE TASKS ------------------------

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     tags:
*       - Users 
 *     summary: Elimina un utente
 *     description: Rimuove un utente dal database in base al suo ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dell'utente da eliminare
 *         schema:
 *           type: string
 *           example: 647a9f8e4b2f1c0012345678
 *     responses:
 *       200:
 *         description: Utente eliminato con successo, ritorna i dati dell'utente eliminato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 _id: 647a9f8e4b2f1c0012345678
 *                 username: user123
 *                 email: user@example.com
 *                 firstName: Mario
 *                 lastName: Rossi
 *                 role: viewer
 *       404:
 *         description: Utente non trovato
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: User not found
 *       500:
 *         description: Errore interno del server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 message: Internal Server Error
 */

userRouter.delete(
  "/:id",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.FULL)),
  UserController.deleteUser
);

// --------------- RESET PASSWORD -----------------------

/**
 * @swagger
 * /reset-link:
 *   post:
 *     tags:
*       - Users 
 *     summary: Invia link per reset della password
 *     description: Genera un token JWT per il reset password e invia una mail all'utente con il link per modificare la password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: user123
 *             required:
 *               - username
 *     responses:
 *       200:
 *         description: Link per reset password inviato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Password inviata con successo
 *       404:
 *         description: Utente non trovato
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Nessun utente trovato
 *       500:
 *         description: Errore interno del server
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal Server Error
 */

userRouter.post(
  "/reset-link",
  publicRoutesLimiter,
  UserController.sendMailReset
);

/**
 * @swagger
 * /check-token/{token}:
 *   get:
 *     tags:
*       - Users 
 *     summary: Verifica validità token reset password
 *     description: Controlla se il token JWT è valido e restituisce l'id dell'utente associato.
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Token JWT per reset password
 *     responses:
 *       200:
 *         description: Token valido, utente trovato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user_id:
 *                   type: string
 *                   example: 6426a7e1c2a3f6e3b8a12345
 *       404:
 *         description: Utente non trovato
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Nessun utente trovato con tale nome
 *       500:
 *         description: Token non valido o scaduto
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Attenzione stai utilizzando un link già utilizzato o scaduto
 */

userRouter.get(
  "/check-token/:token",
  publicRoutesLimiter,
  UserController.checkToken
);

/**
 * @swagger
 * /reset-password/{id}:
 *   patch:
 *     tags:
*       - Users 
 *     summary: Reset password utente
 *     description: Modifica la password di un utente identificato dall'id. Richiede una nuova password valida.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dell'utente
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               newPassword:
 *                 type: string
 *                 description: Nuova password
 *                 example: "NewPassword123!"
 *     responses:
 *       200:
 *         description: Password modificata con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Password modificata con successo
 *       404:
 *         description: Utente non trovato o errore nel reset
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Errore nel reset della password
 *       400:
 *         description: Password non valida (non rispetta i criteri)
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: La password non rispetta i criteri di sicurezza
 *       500:
 *         description: Errore interno del server
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Errore interno
 */
userRouter.patch(
  "/reset-password/:id",
  publicRoutesLimiter,
  UserController.resetPassword
);

export default userRouter;
