# -*- coding: utf-8 -*-
# Hello World Tool

from random import randint

schema = """
"""

def tool(enterprise_name: str, enterprise_description: str) -> str:
    """
    This is a tool that returns a Hello World message.
    """
    return f"This enterprise is called {enterprise_name} and its description is: {enterprise_description}. This enterprise has [{randint(100, 100000)}] employees. And a rating of [{randint(1, 5)}] stars."