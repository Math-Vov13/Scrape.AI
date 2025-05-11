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
MongoDB

### Collections principales :
users : informations utilisateurs (authentification, préférences, droits).

files : métadonnées des fichiers ajoutés (nom, type, chemin, date d'ajout).

messages : historique des conversations (prompts, réponses).

logs : journal des interactions, synchronisations, erreurs API.

### Fonctionnalités :

Sauvegardes régulières.

Requêtes flexibles pour audit, export ou visualisation.

Export en JSON

## API
### Fonctions
#### Chat
Le chat interroge l’API → l’API consulte la BDD → envoie les données au LLM → retourne la réponse.
#### Admin
L’admin utilise l’API pour :

Ajouter/supprimer des fichiers.

Consulter l’historique complet.

Exporter des conversations.

Accéder aux logs et synchronisations.

### Comportement
L’API interroge régulièrement les services cloud tiers pour synchroniser les données récentes.

L’accès à l’API est restreint au chat et à l’admin uniquement.

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
![Scrape](https://github.com/user-attachments/assets/b73140d2-ece6-46b8-a5fe-e8d65740bb54)
