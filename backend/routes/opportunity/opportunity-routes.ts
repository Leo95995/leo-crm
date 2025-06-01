import * as express from "express";
import { OpportunityController } from "../../controllers/opportunity/opportunity-controller";

import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleConfig, RoleConfiguration } from "../../config/roles";
import { roleMiddleware } from "../../middlewares/roles/role-middleware";
const opportunityRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Opportunities
 *   description: Gestione delle opportunità e operazioni
 */
// ---------------- Opportunities ---------------------------
/**
 * @swagger
 * /opportunities/kpi-dashboard:
 *   get:
 *     summary: Recupera i KPI principali delle opportunità
 *     description: Restituisce una serie di metriche (KPI) utili per la dashboard, tra cui numero totale opportunità, opportunità aperte, vinte, attività pianificate e altro.
 *     tags:
 *      - Opportunities
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: KPI recuperati con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalOpportunities:
 *                   type: integer
 *                   description: Numero totale di opportunità nel sistema
 *                 opportunitiesOpen:
 *                   type: array
 *                   description: Opportunità attualmente aperte (stato "nuova" o "in corso"), senza le attività
 *                   items:
 *                     $ref: '#/components/schemas/Opportunity'
 *                 opportunitiesWon:
 *                   type: integer
 *                   description: Numero di opportunità vinte negli ultimi 30 giorni
 *                 activitiesPlanned:
 *                   type: integer
 *                   description: Numero di attività pianificate nei prossimi 7 giorni
 *                 latestOpportunities:
 *                   type: array
 *                   description: Ultime 10 opportunità create, ordinate per data di creazione decrescente
 *                   items:
 *                     $ref: '#/components/schemas/Opportunity'
 *                 activitiesCloseToEnd:
 *                   type: array
 *                   description: Le prime 5 attività più vicine alla scadenza
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       activities:
 *                         type: object
 *                         description: Informazioni sull'attività più prossima alla scadenza
 *       401:
 *         description: Non autorizzato, token JWT mancante o invalido
 *       500:
 *         description: Errore interno del server
 */
opportunityRouter.get("/kpi-dashboard", authMiddleware.check_jwt_protection,  OpportunityController.getDashBoardKPI);

/**
 * @swagger
 * /opportunities:
 *   get:
 *     summary: Ottieni tutte le opportunità (supporta paginazione, ricerca, filtro, ordinamento)
 *     description: Recupera una lista di opportunità, con possibilità di paginazione, ricerca testuale, filtro e ordinamento. Se si passa il parametro query `full=true` restituisce tutte le opportunità senza paginazione.
 *     tags:
 *       - Opportunities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: full
 *         schema:
 *           type: boolean
 *         required: false
 *         description: Se true, restituisce tutte le opportunità senza paginazione.
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         required: false
 *         description: Numero della pagina per la paginazione (usato se full non è true).
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Termine di ricerca per filtrare le opportunità.
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         required: false
 *         description: Campo su cui filtrare la ricerca (deve essere una chiave riconosciuta).
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         required: false
 *         description: Ordine di ordinamento (ASC per crescente, DESC per decrescente).
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *         required: false
 *         description: Campo su cui ordinare i risultati.
 *     responses:
 *       200:
 *         description: Lista di opportunità filtrate e paginate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 opportunities:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Opportunity'
 *                 total:
 *                   type: integer
 *                   description: Numero totale di opportunità corrispondenti al filtro
 *                 page:
 *                   type: integer
 *                   description: Pagina corrente restituita
 *       404:
 *         description: Lista opportunità vuota
 *       500:
 *         description: Errore interno del server
 */
opportunityRouter.get(
  "/",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.LOW)),
  OpportunityController.getAllOpportunities
);
/**
 * @swagger
 * /opportunities/{id}:
 *   get:
 *     summary: Ottieni un'opportunità per ID
 *     description: Recupera un'opportunità singola tramite il suo ID. La risposta viene sanificata in base al ruolo dell'utente.
 *     tags:
 *       - Opportunities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'opportunità da recuperare
 *     responses:
 *       200:
 *         description: Opportunità trovata e restituita
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Opportunity'
 *       404:
 *         description: Opportunità non trovata
 *       500:
 *         description: Errore interno del server
 */

opportunityRouter.get(
  "/:id",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.LOW)),
  OpportunityController.getOpportunity
);

/**
 * @swagger
 * /opportunities:
 *   post:
 *     summary: Crea una nuova opportunità
 *     description: Endpoint per creare una singola opportunità con i dati forniti nel body.
 *     tags:
 *       - Opportunities
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - value
 *               - stage
 *               - contact_id
 *               - user_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nuova opportunità"
 *               value:
 *                 type: number
 *                 example: 10000
 *               stage:
 *                 type: string
 *                 example: "In trattativa"
 *               contact_id:
 *                 type: string
 *                 example: "642d2f4e3a8b0c1234567890"
 *               user_id:
 *                 type: string
 *                 example: "642d2f4e3a8b0c0987654321"
 *               activities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["call", "meeting"]
 *     responses:
 *       201:
 *         description: Opportunità creata con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/Opportunity'
 *       400:
 *         description: Errore di validazione dei dati in input
 *       500:
 *         description: Errore interno del server
 */
opportunityRouter.post(
  "/",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.MIDDLE)),
  OpportunityController.createOpportunity
);

/**
 * @swagger
 * /opportunities/{id}:
 *   patch:
 *     summary: Modifica una singola opportunità
 *     description: Aggiorna i campi di un'opportunità esistente con i dati forniti nel body.
 *     tags:
 *       - Opportunities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dell'opportunità da modificare
 *         schema:
 *           type: string
 *           example: "642d2f4e3a8b0c1234567890"
 *     requestBody:
 *       description: Campi dell'opportunità da aggiornare (tutti opzionali)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Nuovo nome opportunità"
 *               value:
 *                 type: number
 *                 example: 12000
 *               stage:
 *                 type: string
 *                 example: "Chiuso vinto"
 *               contact_id:
 *                 type: string
 *                 example: "642d2f4e3a8b0c0987654321"
 *               user_id:
 *                 type: string
 *                 example: "642d2f4e3a8b0c0987654321"
 *               activities:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["email", "follow-up"]
 *     responses:
 *       200:
 *         description: Opportunità aggiornata con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Opportunity'
 *       404:
 *         description: Opportunità non trovata
 *       500:
 *         description: Errore interno del server
 */

opportunityRouter.patch(
  "/:id",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.HIGH)),
  OpportunityController.modifyOpportunity
);
// ---------------- DELETE TASKS ------------------------

/**
 * @swagger
 * /opportunities/{id}:
 *   delete:
 *     summary: Elimina una singola opportunità
 *     description: Rimuove l’opportunità identificata dall’ID fornito.
 *     tags:
 *       - Opportunities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dell’opportunità da eliminare
 *         schema:
 *           type: string
 *           example: "642d2f4e3a8b0c1234567890"
 *     responses:
 *       200:
 *         description: Opportunità eliminata con successo, restituisce l’oggetto eliminato
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Opportunity'
 *       404:
 *         description: Opportunità non trovata
 *       500:
 *         description: Errore interno del server
 */

opportunityRouter.delete(
  "/:id",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.FULL)),
  OpportunityController.deleteOpportunity
);

// -------------------------- ACTIVITIES --------------------------------

/**
 * @swagger
 * /opportunities/activity/{id}:
 *   post:
 *     summary: Aggiunge un’attività a un’opportunità esistente
 *     description: Inserisce una nuova attività nella lista `activities` dell’opportunità specificata tramite ID.
 *     tags:
 *       - Opportunities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dell’opportunità dove aggiungere l’attività
 *         schema:
 *           type: string
 *           example: "642d2f4e3a8b0c1234567890"
 *     requestBody:
 *       description: Dati dell’attività da aggiungere
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Incontro con cliente per definire scope"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "24/05/2025"  # Formato italiano che converti nel backend
 *               status:
 *                 type: string
 *                 enum: [pending, done, canceled]
 *                 example: "pending"
 *             required:
 *               - description
 *               - date
 *     responses:
 *       201:
 *         description: Attività aggiunta con successo, ritorna l’opportunità aggiornata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Opportunity'
 *       404:
 *         description: Opportunità non trovata o attività non valida
 *       500:
 *         description: Errore interno del server
 */

opportunityRouter.post(
  "/activity/:id",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.HIGH)),
  OpportunityController.addActivityToOpportunity
);

/**
 * @swagger
 * /opportunities/activity/{id}:
 *   patch:
 *     summary: Aggiorna un’attività esistente in un’opportunità
 *     description: Modifica i dettagli di una specifica attività all’interno di un’opportunità tramite ID opportunità e ID attività passato nell’header.
 *     tags:
 *       - Opportunities
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID dell’opportunità contenente l’attività da aggiornare
 *         schema:
 *           type: string
 *           example: "642d2f4e3a8b0c1234567890"
 *       - in: header
 *         name: activityid
 *         required: true
 *         description: ID dell’attività da modificare
 *         schema:
 *           type: string
 *           example: "643e5f9a6c1a2b3d4e5f6789"
 *     requestBody:
 *       description: Campi dell’attività da aggiornare (almeno uno)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Aggiornamento incontro con cliente"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "25/05/2025"
 *               status:
 *                 type: string
 *                 enum: [pending, done, canceled]
 *                 example: "done"
 *     responses:
 *       200:
 *         description: Attività aggiornata con successo, ritorna opportunità aggiornata
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 opportunityToChange:
 *                   $ref: '#/components/schemas/Opportunity'
 *                 value:
 *                   type: string
 *                   example: "Opportunità modificata con successo"
 *       404:
 *         description: Opportunità o attività non trovata
 *       500:
 *         description: Errore interno del server
 */

opportunityRouter.patch(
  "/activity/:id",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.HIGH)),
  OpportunityController.updateActivityFromOpportunity
);

/**
 * @swagger
 * /opportunities/activity/{id}:
 *   delete:
 *     tags:
 *        - Opportunities
 *     summary: Elimina un'attività da una opportunità
 *     description: Elimina un'attività specifica dall'elenco delle attività di una opportunità.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'opportunità da cui rimuovere l'attività
 *       - in: header
 *         name: activityid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID dell'attività da eliminare
 *     responses:
 *       200:
 *         description: Attività eliminata con successo, ritorna l'opportunità aggiornata
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Opportunity'
 *       404:
 *         description: Opportunità o attività non trovata
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: not found
 *       500:
 *         description: Errore interno del server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               example:
 *                 error: Internal Server Error
 */

opportunityRouter.delete(
  "/activity/:id",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.FULL)),
  OpportunityController.deleteActivityFromOpportunity
);



export default opportunityRouter;
