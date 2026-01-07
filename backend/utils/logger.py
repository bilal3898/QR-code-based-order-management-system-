import logging
import os

def setup_logger(name: str, level: str = "INFO") -> logging.Logger:
    """
    Creates and configures a logger with the given name and level.

    :param name: Name of the logger (e.g., module name)
    :param level: Logging level ("DEBUG", "INFO", "WARNING", "ERROR", "CRITICAL")
    :return: Configured logger instance
    """
    logger = logging.getLogger(name)

    if logger.handlers:
        return logger  # Avoid duplicate handlers

    log_level = getattr(logging, level.upper(), logging.INFO)
    logger.setLevel(log_level)

    formatter = logging.Formatter(
        '[%(asctime)s] [%(levelname)s] %(name)s: %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )

    # === Console Handler ===
    console_handler = logging.StreamHandler()
    console_handler.setFormatter(formatter)
    logger.addHandler(console_handler)

    # === File Handlers Directory ===
    log_directory = "logs"
    if not os.path.exists(log_directory):
        os.makedirs(log_directory)

    # === General App Log Handler ===
    file_handler = logging.FileHandler(os.path.join(log_directory, "app.log"))
    file_handler.setFormatter(formatter)
    file_handler.setLevel(logging.DEBUG)  # Log everything to app.log
    logger.addHandler(file_handler)

    # === Error Log Handler ===
    error_handler = logging.FileHandler(os.path.join(log_directory, "error.log"))
    error_handler.setFormatter(formatter)
    error_handler.setLevel(logging.ERROR)  # Only log ERROR and above
    logger.addHandler(error_handler)

    return logger


# === Example Usage ===
if __name__ == "__main__":
    logger = setup_logger(__name__)

    logger.debug("This is a debug message")
    logger.info("App started successfully")
    logger.warning("This is a warning")
    logger.error("An error occurred!")
    logger.critical("Critical issue!")
