import * as express from "express";
import { ContactController } from "../../controllers/contact/contact-controller";

import { authMiddleware } from "../../middlewares/authMiddleware";
import { roleMiddleware } from "../../middlewares/roles/role-middleware";
import { roleConfig, RoleConfiguration } from "../../config/roles";
const contactRouter = express.Router();

/**
 * @swagger
 * tags:
 *   name: Contacts
 *   description: Gestione dei contatti e operazioni
 */

/**
 * @swagger
 * /contacts:
 *   get:
 *     summary: Ottieni tutti i contatti con paginazione, ricerca, filtro e ordinamento opzionali
 *     description: >
 *       Restituisce una lista di contatti.
 *       - Se il parametro di query `full=true` è impostato, restituisce tutti i contatti con i dati utente popolati.
 *       - Altrimenti supporta paginazione (`page`), ricerca (`search`), filtro (`filter`), ordinamento (`order` e `field`).
 *       Richiede autenticazione JWT e ruolo LOW.
 *     tags:
 *       - Contacts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: full
 *         schema:
 *           type: boolean
 *         description: Se true, restituisce tutti i contatti con i dati utente popolati
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
 *         description: Stringa di ricerca per filtrare i contatti
 *       - in: query
 *         name: filter
 *         schema:
 *           type: string
 *         description: Campo su cui applicare il filtro (mappato internamente)
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *         description: Ordine di ordinamento
 *       - in: query
 *         name: field
 *         schema:
 *           type: string
 *         description: Campo su cui ordinare (mappato internamente)
 *     responses:
 *       200:
 *         description: Lista di contatti (eventualmente paginata) con conteggio totale
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     contacts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Contact'
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                 - type: object
 *                   properties:
 *                     contacts:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Nessun contatto trovato
 *       500:
 *         description: Errore interno del server
 */

contactRouter.get(
  "/",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.LOW)),
  ContactController.getAllContacts
);

/**
 * @swagger
 * /contacts/{id}:
 *   get:
 *     summary: Ottieni un contatto per ID
 *     tags:
 *       - Contacts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del contatto da ottenere
 *     responses:
 *       200:
 *         description: Contatto trovato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contatto non trovato
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Contact not found
 *       500:
 *         description: Errore interno del server
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Internal server error
 */

contactRouter.get(
  "/:id",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.LOW)),
  ContactController.getContact
);
// ---------------- POST CONTACTS --------------------------

/**
 * @swagger
 * /contacts:
 *   post:
 *     summary: Crea un nuovo contatto
 *     tags:
 *       - Contacts
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
 *               - email
 *               - phone
 *               - user_id
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mario Rossi
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mario.rossi@example.com
 *               phone:
 *                 type: string
 *                 example: +391234567890
 *               user_id:
 *                 type: string
 *                 example: 6423ab98765fghij54321abc
 *     responses:
 *       201:
 *         description: Contatto creato con successo
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 contact:
 *                   $ref: '#/components/schemas/Contact'
 *       400:
 *         description: Errore di validazione (dati mancanti o errati)
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: errore
 *       401:
 *         description: Non autorizzato (token JWT mancante o non valido)
 *       403:
 *         description: Accesso negato per ruolo non autorizzato
 *       500:
 *         description: Errore interno del server
 */

contactRouter.post(
  "/",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.MIDDLE)),
  ContactController.createContact
);
// ---------------- PATCH CONTACTS -------------------------

/**
 * @swagger
 * /contacts/{id}:
 *   patch:
 *     summary: Modifica un contatto esistente
 *     tags:
 *       - Contacts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del contatto da modificare
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mario Rossi
 *               email:
 *                 type: string
 *                 format: email
 *                 example: mario.rossi@example.com
 *               phone:
 *                 type: string
 *                 example: +391234567890
 *               user_id:
 *                 type: string
 *                 example: 6423ab98765fghij54321abc
 *     responses:
 *       200:
 *         description: Contatto modificato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contatto non trovato
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Contact not found
 *       401:
 *         description: Non autorizzato (token JWT mancante o non valido)
 *       403:
 *         description: Accesso negato per ruolo non autorizzato
 *       500:
 *         description: Errore interno del server
 */

contactRouter.patch(
  "/:id",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.HIGH)),
  ContactController.modifyContact
);
// ---------------- DELETE TASKS ------------------------

/**
 * @swagger
 * /contacts/{id}:
 *   delete:
 *     summary: Elimina un contatto esistente
 *     tags:
 *       - Contacts
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del contatto da eliminare
 *     responses:
 *       200:
 *         description: Contatto eliminato con successo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 *       404:
 *         description: Contatto non trovato
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *               example: Contact not found
 *       401:
 *         description: Non autorizzato (token JWT mancante o non valido)
 *       403:
 *         description: Accesso negato per ruolo non autorizzato
 *       500:
 *         description: Errore interno del server
 */

contactRouter.delete(
  "/:id",
  authMiddleware.check_jwt_protection,
  roleMiddleware.checkRole(roleConfig(RoleConfiguration.FULL)),
  ContactController.deleteContact
);

export default contactRouter;
