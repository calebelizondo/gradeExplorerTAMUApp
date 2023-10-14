#!/bin/sh

set -e

python manage.py wait_for_db
python manage.py collectstatic --noinput
python manage.py makemigratons
python manage.py migrate
python manage.py import_sections sections.csv
uwsgi --socket :9000 --workers 4 --master --enable-threads --module app.wsgi
