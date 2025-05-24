from dataclasses import dataclass

@dataclass(frozen=True)
class Config:
    """
    Configuration class for the application.
    This class is immutable and contains all necessary configuration parameters.
    """
    # General settings
    app_name: str = "My Application"
    version: str = "1.0.0"

    # Enterprise settings
    enterprise_name: str = "My Enterprise"
    enterprise_description: str = "This is a sample enterprise description."
    enterprise_logo: str = "https://example.com/logo.png"
    enterprise_website: str = "https://example.com"
    
    # Database settings
    db_host: str = "localhost"
    db_port: int = 5432
    db_user: str = "user"
    db_password: str = "password"
    
    # Logging settings
    log_level: str = "INFO"
    
    # Mistral
    mistral_api_url: str = "https://api.mistral.ai/v1/chat/completions"

config = Config()