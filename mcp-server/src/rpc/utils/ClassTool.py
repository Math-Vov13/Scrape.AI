import logging
import importlib.util
from pathlib import Path
from typing import Callable, Any
from rpc.schemas.tool_sc import ToolModule


class Tool_Object:

    def __init__(self, tool_path: Path):
        self.name = tool_path.stem  # sans extension
        self.path = tool_path

    def __str__(self):
        return f"Tool: {self.name} ({self.path})"

    def __extract_data_from_file(self) -> ToolModule:
        """Charge dynamiquement un module à partir d’un fichier .py"""
        try:
            if not self.path.exists():
                raise FileNotFoundError(f"Fichier introuvable : {self.path}")

            spec = importlib.util.spec_from_file_location(self.name, self.path)
            if spec is None or spec.loader is None:
                raise ImportError(f"Impossible de créer le spec pour {self.path}")

            module = importlib.util.module_from_spec(spec)
            spec.loader.exec_module(module)  # type: ignore
            return module

        except Exception as e:
            logging.exception(e)
            raise ImportError(f"Erreur lors de l'importation du tool '{self.name}': {e}")

    @property
    def get_schema(self) -> dict[str, Any]:
        tool_module = self.__extract_data_from_file()
        if not hasattr(tool_module, "schema"):
            raise AttributeError(f"Le module '{self.name}' ne contient pas d'attribut 'schema'")
        return tool_module.schema

    @property
    def get_function(self) -> Callable[[Any], Any]:
        tool_module = self.__extract_data_from_file()
        if not hasattr(tool_module, "tool"):
            raise AttributeError(f"Le module '{self.name}' ne contient pas de fonction 'tool'")
        return tool_module.tool
