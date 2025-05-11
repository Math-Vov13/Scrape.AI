# Scrape.AI

## Architecture Générale
Sources de données → Ingestion → Chat → Réponse

## Sources de données
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

## Ingestion
Récupération des données
Regroupe les sources sélectionnées (API et fichiers).

Extrait & Conserve les informations utiles.

## CHAT

1. Création du prompt
Construire un prompt à partir des données.

Optimisation contextuelle : résumé, source du fichier.

2. Envoi à un LLM
Envoi du prompt vers un modèle LLM pour l'exécuter en local.

Support du multilingue.
Garde le contexte de la conversation

## Réponse 

Affichage de la réponse
Affichage dans l'interface de la réponse


## Front-End

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

# Diagramme
![Scrape](https://github.com/user-attachments/assets/9e4be075-bbaa-446a-a05d-7bad0e09edbd)
