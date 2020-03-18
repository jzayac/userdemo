include docker/pgdb/.env

test:
	@echo ":::running test"
	echo $(POSTGRES_USER)

run-clear-expired-token:
	@echo ":::cleaning expired token from db"
	docker container exec -i $$(docker-compose ps -q user) node console.js remove-old-token;

run-backup-db:
	@echo ":::backup db"
	docker container exec -i $$(docker-compose ps -q pgdb) pg_dumpall -c -U postgres > dump_`date +%d-%m-%Y"_"%H_%M_%S`.sql

run-init-db:
	@echo ":::init db"
	cat ./docker/pgdb/dump.sql | docker container exec -i $$(docker-compose ps -q pgdb) psql -U $(POSTGRES_USER)

run-cron-command-remove-expired-token:
	@echo ":::backup db"
	docker container exec -i $$(docker-compose ps -q user) node console.js remove-old-token

