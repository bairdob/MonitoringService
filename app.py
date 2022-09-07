from flask import Flask
from flask import redirect, render_template, url_for, request


app = Flask(__name__)

@app.route('/')
def index():
    return redirect(url_for('maps'))


@app.route('/maps', methods=['GET', 'POST'])
def maps() -> 'html': 
    return render_template('maps.html')

if __name__ == '__main__':
    app.run(debug=True)
