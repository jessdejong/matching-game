from flask import Flask, request, redirect
from db import fetch_urls, add_short_url_to_db, get_original_url, increment_visit_count
import hashlib
import base64

app = Flask(__name__)

@app.route('/api/urls')
def get_current_time():
    # Fetch the 10 most recently shortened URLs.
    shortened_urls = fetch_urls(10)

    return {'urls': list(shortened_urls)}


@app.route('/api/shorten', methods = ['POST'])
def shorten_url():
    url_bytes = request.form['url_to_shorten'].encode("utf-8")
    hash = request.form.get('custom_hash')
    # hash = request.form['custom_hash']

    if hash is None:
        hash = base64.urlsafe_b64encode(hashlib.sha256(url_bytes).digest())[:5].decode("ascii")

    add_short_url_to_db(url_bytes.decode("ascii"), hash)

    return redirect('/')


@app.route('/api/redirect', methods = ['GET'])
def visit():
    hash = request.args.get('hash')
    original_url = get_original_url(hash)
    # print(original_url)
    if (original_url is not None):
        increment_visit_count(original_url)
        return {'original_url': original_url}
    else:
        return {'original_url': ''}


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    # Flask's development server will automatically serve static files in
    # the "static" directory. See:
    # http://flask.pocoo.org/docs/1.0/quickstart/#static-files. Once deployed,
    # App Engine itself will serve those files as configured in app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)