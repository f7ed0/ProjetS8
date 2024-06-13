# Projet S8 INSA

Sylvain SAUSSE - Tristan VERSEL - Ahmed DAOUD

## Introduction

Ceci est le dépot de projet du semestre 8 ICy de l'INSA Hauts-de-France.
Le sujet de ce projet était de produire une IA capable d'assister les utilisateur du site web de l'Universitée Polytechnique des Hauts-de-France lors de leur recherche d'information sur cette dernière.

Ce projet prends la forme d'une Proof of concept montrant la capacitée d'un système utilisant un modèle de texte génération pré entrainé et une gestion de contexte automatisée (générée a partir de document non préparé pour l'utilisation par une IA) à fournir des réponses cohérentes et exactes à l'utilisateur. Cela prends la forme d'une application web.

## Dépendances

### Hardware

- Une carte graphique compatible CUDA 12 ou plus avec au moins 10 Go de RAM
- 16 Go de RAM
- Processeur multicoeur
- 2 Go de stockage

### Front-End

- [Node.js](https://nodejs.org/en) (20.14)
- [Angular](https://angular.dev) (v17.3)
- [Material Angular](https://material.angular.io/) (v17.3)
- [Marked.js](https://marked.js.org/)

### Back-End

- [Python](https://www.python.org/) (3.11.7)

#### API

- [FastAPI](https://fastapi.tiangolo.com/)
- [Pydantic](https://docs.pydantic.dev/latest/)
- [MongoDB](https://www.mongodb.com/fr-fr)
- [pyMongo](https://pymongo.readthedocs.io/en/stable/)

#### IA

- [Hugging Face - Tansformers](https://huggingface.co/docs/transformers/index)
- [Langchain / Lanchain_community](https://www.langchain.com/)
- [ChromaDB](https://www.trychroma.com/) (version locale sous forme de fichiers & sqlite)
- [torch](https://pytorch.org/get-started/locally/)
- [pypdf](https://pypi.org/project/pypdf/)

## Execution

Pour rappel, ceci est une Proof of Concept et **n'est pas concue pour être utilisé en production**. Ces instructions d'execution ne sont là uniquement pour permettre aux gens de la tester.

- Installer les dépendances
- Lancer la base MongoDB
- lancer le back end : `python main.py`
- lancer le front end : `ng serve --host=0.0.0.0`

Si vous voulez alterer le conexte de l'IA :

- Rajoutez/Supprimez/Modifiez les fichier présent dans `docs`, `scrapped` et `tuned`
- Regénérer la base de donnée de contexte : `python IA/dbgenerator.py`