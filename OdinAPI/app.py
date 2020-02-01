from flask_api import FlaskAPI

app = FlaskAPI(__name__)

DEBUG = True
PORT = 8000

@app.route('/')
def example():
    return {'hello': 'world'}

if __name__ == '__main__':
    app.run(debug=DEBUG, port=PORT)