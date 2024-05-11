FROM python:3.11.4

WORKDIR /app

COPY requirements.txt .

RUN pip install -r requirements.txt

COPY . .

EXPOSE 8080

CMD ["python", "-m", "flask", "run" , "--host=0.0.0.0", "--port=5000"]
