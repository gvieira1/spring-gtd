#!/bin/bash

set -e

DUMP_SRC="./moodle_dump_db.sql"

if [ ! -f "$DUMP_SRC" ]; then
  echo " Dump SQL não encontrado em $DUMP_SRC"
  exit 1
fi

echo " Aguardando moodle-db iniciar..."
until docker exec moodle-db mysqladmin ping -pmoodle --silent; do
  sleep 2
done

echo " Importando dump no banco do Moodle..."
docker exec -i moodle-db mysql -umoodle -pmoodle moodle < "$DUMP_SRC"

echo " Dump importado com sucesso!"

