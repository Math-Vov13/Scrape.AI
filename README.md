# Scrape.AI

## Architecture Générale
Sources de données → Ingestion → Chat → Réponse

## Récupérer les données
### Sources API (temps réel)
Google Calendar : récupération des événements, réunions, disponibilités.

Notion : accès aux bases de données, pages, notes et tâches.

Slack : messages, fichiers, canaux et utilisateurs.

Mail (SMTP) : analyse des emails, pièces jointes.

### Sources Locales (temps réel ou chargement manuel)
.pdf : extraction de texte via OCR.

.docx / .doc : lecture du texte.

.txt : lecture du texte.

.xlsx : lecture des feuilles, cellules et formules.

## Chat
1. Récupération des données
Regroupe les sources sélectionnées (API et fichiers).

Extrait les informations utiles.

2. Création du prompt
Construire un prompt à partir des données.

Optimisation contextuelle : résumé, source du fichier.

3. Envoi à un LLM
Envoi du prompt vers un modèle LLM pour l'exécuter en local.

Support du multilingue.

4. Affichage de la réponse
Affichage dans l'interface de la réponse

Garde le contexte de la conversation

## Front-end


## BDD

## Partie Admin
Ajouter un fichier

Historique des conversations

Journal complet des interactions par utilisateur.

Export possible des prompts.

Logs d’accès et de synchronisation
Suivi des connexions, erreurs API.

## Lancement
Prérequis :

Python

Accès aux APIs 

LLM ?? (choisir entre LLaMa, Mistral AI ou autre)
