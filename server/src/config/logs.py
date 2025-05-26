import logging

def setup_logging():
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s",
        filename="logs/app.log",  # Recommandé : stocker dans un dossier `logs/`
        filemode="a"
    )