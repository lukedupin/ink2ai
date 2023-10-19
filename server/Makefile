
dev:
	python -m uvicorn fast_api:app --reload --reload-dir "." --reload-exclude ".env/*" --reload-delay 0.25 --host 0.0.0.0 --port 8081

run:
	python -m uvicorn fast_api:app --host 0.0.0.0 --port 8081

ssl:
	sudo python -m uvicorn fast_api:app --host 0.0.0.0 --port 8081 --ssl-keyfile /etc/letsencrypt/live/ink2ai.com/privkey.pem --ssl-certfile /etc/letsencrypt/live/ink2ai.com/fullchain.pem
