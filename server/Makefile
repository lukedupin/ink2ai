
dev:
	python -m uvicorn main:app --reload --reload-dir "." --reload-exclude ".env/*" --reload-delay 0.25 --host 0.0.0.0 --port 8081

run:
	python -m uvicorn main:app --host 0.0.0.0 --port 8081

ssl:
	sudo python -m uvicorn main:app --host 0.0.0.0 --port 8081 --ssl-keyfile /etc/letsencrypt/live/ink2ai.lukedupin.com/privkey.pem --ssl-certfile /etc/letsencrypt/live/ink2ai.lukedupin.com/fullchain.pem
