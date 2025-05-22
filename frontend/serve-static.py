import http.server
import socketserver
import os
import webbrowser
from urllib.parse import quote

# Set the port
PORT = 8000

# Set directory to serve from
os.chdir("public")

# Define the handler
Handler = http.server.SimpleHTTPRequestHandler

# Create the server
with socketserver.TCPServer(("", PORT), Handler) as httpd:
    print(f"Serving at http://localhost:{PORT}")
    
    # Open the browser automatically
    webbrowser.open(f"http://localhost:{PORT}")
    
    # Keep the server running
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped by user")
