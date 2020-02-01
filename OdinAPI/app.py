from flask_api import FlaskAPI

app = FlaskAPI(__name__)

DEBUG = True
PORT = 8000

# requestHeader = {'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZSI6InNnaXAiLCJpYXQiOjE1ODA1ODc0MTcsImV4cCI6MTU4MDU4OTIxNywiaXNzIjoiV2F0dFRpbWUiLCJzdWIiOiJuaW5lY2F0cyJ9.LbpOFQcvji0Z2Kk70Vh-mFkhNPOOtVdG5cXsUSFX1y0dvbcdV7FYHc-YJdgkL6jUTbXR2tZJ6tfQ1RuCjFmdJ6QKvzOiolzqk5e9shQoDHrx5Hz5566oTanVOcaHq-OFDbbwizeEbFKJMw6gd3vLdfRlOA-vwXzwfPcxavsHcibtNjD6z5YwAo3abtFEq1FeYSa6eG6FT21f_VotN9VTmboDCAqcIpRuw02-0fymed-o27XjpV1Jl8aI0b5JbicyQp49QfMjNLdiF_xGDfLHTcyVOL4PO1QmlELEXjd_WZUCvG0fh0YZSn6J4x7YHiwSVfJ8E428xo2MLpnBEJ-ysQ'}
# f'https://sgipsignal.com/sgipmoer/?ba=SGIP_CAISO_PGE&starttime={start_time}&endtime={end_time}')


@app.route('/')
def example():
    return {'hello': 'world'}


if __name__ == '__main__':
    app.run(debug=DEBUG, port=PORT)
