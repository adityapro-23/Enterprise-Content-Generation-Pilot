import os

class Settings:
    def __init__(self):
        # All os.getenv() calls are here in __init__, NOT at class-level.
        # This ensures they are evaluated AFTER load_dotenv() has run in main.py,
        # not at module import time when os.environ may still be empty.
        self.OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
        self.LANGCHAIN_TRACING_V2: str = os.getenv("LANGCHAIN_TRACING_V2", "true")
        self.LANGCHAIN_API_KEY: str = os.getenv("LANGCHAIN_API_KEY", "")
        self.LANGCHAIN_PROJECT: str = os.getenv("LANGCHAIN_PROJECT", "ECGP_Production")

        # Propagate into os.environ so downstream libraries (LangChain, OpenAI SDK)
        # that read from the environment directly also pick up the correct values.
        os.environ["OPENAI_API_KEY"] = self.OPENAI_API_KEY
        os.environ["LANGCHAIN_TRACING_V2"] = self.LANGCHAIN_TRACING_V2
        os.environ["LANGCHAIN_API_KEY"] = self.LANGCHAIN_API_KEY
        os.environ["LANGCHAIN_PROJECT"] = self.LANGCHAIN_PROJECT

settings = Settings()
