from argparse import ArgumentParser

from . import __version__

import uvicorn

__all__ = ["main"]


def main(args=None):
    parser = ArgumentParser()
    parser.add_argument("-v", "--version", action="version", version=__version__)
    args = parser.parse_args(args)

    uvicorn.run("xas_standards_api.app:app", port=5000, log_level="info", host='0.0.0.0')




# test with: python -m xas_standards_api
if __name__ == "__main__":
    main()
