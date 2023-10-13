
dev:
	python -m uvicorn main:app --reload --reload-dir "." --reload-exclude ".env/*" --reload-delay 0.25 --host 0.0.0.0 --port 8080

run:
	python -m uvicorn main:app --host 0.0.0.0 --port 8080

ssl:
	sudo python -m uvicorn main:app --host 147.182.249.129 --port 8080 --ssl-keyfile /etc/letsencrypt/live/landscape.chat/privkey.pem --ssl-certfile /etc/letsencrypt/live/landscape.chat/fullchain.pem
