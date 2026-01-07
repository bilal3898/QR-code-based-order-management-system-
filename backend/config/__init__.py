"""
Config package.

This package re-exports the Config classes from the parent config.py module
so that Flask's `app.config.from_object("config.Config")` works correctly.
"""

import sys
import os
import importlib.util

# Get the parent directory (backend/)
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
config_py_path = os.path.join(parent_dir, "config.py")

# Load the parent config.py module
spec = importlib.util.spec_from_file_location("config_module", config_py_path)
_config = importlib.util.module_from_spec(spec)
sys.modules["config_module"] = _config
spec.loader.exec_module(_config)

# Re-export the Config classes
Config = _config.Config
DevelopmentConfig = _config.DevelopmentConfig
ProductionConfig = _config.ProductionConfig
TestingConfig = _config.TestingConfig

__all__ = ["Config", "DevelopmentConfig", "ProductionConfig", "TestingConfig"]
