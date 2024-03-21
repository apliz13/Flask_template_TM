#SkateFlow

## Author
ALizée Petrini, Collège du Sud.

## Description
The current directory is as a foundational Flask template connected to an SQLite database, serving as a starting point for a web application named SkateFlow. this app aim to create a training session planning maker for figure skating coaches and their students.
## How to run the project
1. Create a virtual environment
   * Windows users:
```bash
python -m venv <VIRTUAL-ENVIRONMENT-NAME>
```
   * MacOS users:
```bash
python3 -m venv <VIRTUAL-ENVIRONMENT-NAME>
```

3. Activate the virtual environment
  * Windows users:
```bash
<VIRTUAL-ENVIRONMENT-NAME\Scripts\activate
```
  * MacOS users:
```bash
source <VIRTUAL-ENVIRONMENT-NAME>/bin/activate
```

5. Install the dependencies that are in requirements.txt
```bash
pip install -r requirements.txt
```

7. Run the project
```bash
python -m flask run --debug
```
