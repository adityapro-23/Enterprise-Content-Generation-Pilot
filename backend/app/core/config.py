import os

class Settings:
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    LANGCHAIN_TRACING_V2: str = os.getenv("LANGCHAIN_TRACING_V2", "true")
    LANGCHAIN_API_KEY: str = os.getenv("LANGCHAIN_API_KEY", "")
    LANGCHAIN_PROJECT: str = os.getenv("LANGCHAIN_PROJECT", "ECGP_Production")

    def __init__(self):
        # Ensure environment variables are loaded for LangGraph and OpenAI
        os.environ["OPENAI_API_KEY"] = self.OPENAI_API_KEY
        os.environ["LANGCHAIN_TRACING_V2"] = self.LANGCHAIN_TRACING_V2
        os.environ["LANGCHAIN_API_KEY"] = self.LANGCHAIN_API_KEY
        os.environ["LANGCHAIN_PROJECT"] = self.LANGCHAIN_PROJECT

settings = Settings()
