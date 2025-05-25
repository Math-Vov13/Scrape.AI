from fastapi import APIRouter

router = APIRouter()

@router.get("/db")
async def get_ressources():
    return {
        "ressources": [
            {
                "name": "ScrapeAI",
                "description": "A tool for scraping data from websites.",
                "url": "/scrape"
            },
            {
                "name": "DataAnalyzer",
                "description": "A tool for analyzing scraped data.",
                "url": "/analyze"
            }
        ]
    }