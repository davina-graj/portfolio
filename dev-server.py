"""
Local preview server for the portfolio.

GitHub Pages builds this site with Jekyll, which fills in `{{ site.baseurl }}`
and `{{ site.url }}` and strips the YAML front matter. Without Ruby installed
we can get the same result by doing those two substitutions as HTML is served,
so the files on disk stay exactly as GitHub Pages expects them.

Usage:
    python dev-server.py           # http://localhost:4000
    python dev-server.py 8080      # pick another port

Files are read per request, so editing HTML, CSS, JS or JSON and refreshing
the browser is enough to see the change.
"""

import http.server
import re
import socketserver
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DEFAULT_PORT = 4000

FRONT_MATTER = re.compile(r"\A---\s*\n.*?\n---\s*\n", re.DOTALL)
LIQUID_BASEURL = re.compile(r"\{\{\s*site\.baseurl\s*\}\}")
LIQUID_URL = re.compile(r"\{\{\s*site\.url\s*\}\}")


def render(html: str) -> str:
    """Approximate what Jekyll does, with the site served from the root."""
    html = FRONT_MATTER.sub("", html)
    html = LIQUID_BASEURL.sub("", html)
    html = LIQUID_URL.sub("", html)
    return html


class PreviewHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def do_GET(self):
        path = Path(self.translate_path(self.path))

        if path.is_dir():
            path = path / "index.html"

        if path.suffix.lower() in (".html", ".htm") and path.is_file():
            body = render(path.read_text(encoding="utf-8")).encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
            return

        super().do_GET()

    def end_headers(self):
        # Keep the browser from caching stale CSS/JSON between edits
        if "Cache-Control" not in self._headers_buffer_names():
            self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _headers_buffer_names(self):
        return [
            line.decode("latin-1").split(":")[0]
            for line in getattr(self, "_headers_buffer", [])
            if b":" in line
        ]

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s\n" % (fmt % args))


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_PORT
    socketserver.TCPServer.allow_reuse_address = True

    with socketserver.TCPServer(("127.0.0.1", port), PreviewHandler) as httpd:
        print(f"Portfolio preview running at http://localhost:{port}")
        print("Press Ctrl+C to stop.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nStopped.")


if __name__ == "__main__":
    main()
