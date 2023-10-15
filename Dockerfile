FROM python:3.9-alpine3.13
LABEL maintainer="thebatt.com"

ENV PYTHONBUFFERED 1

#copy requirements and source code to image
COPY ./requirements.txt /requirements.txt
COPY ./app /app
COPY ./scripts /scripts

#go into source code and set 
WORKDIR /app 
EXPOSE 8000

#runs several commands that install dependencies and makes user
RUN python -m venv /py && \ 
    /py/bin/pip install --upgrade pip && \
    apk add --update --no-cache postgresql-client && \ 
    apk add --update --no-cache --virtual .tmp-deps \
        build-base postgresql-dev musl-dev linux-headers && \
    /py/bin/pip install -r /requirements.txt && \
    apk del .tmp-deps && \
    adduser --disabled-password --no-create-home app && \
    mkdir -p /vol/web/static && \
    mkdir -p /vol/web/media && \
    chown -R app:app /vol && \
    chmod -R 755 /vol && \
    chmod -R +x /scripts \
    chmod -R 777 /app/core/migrations

ENV PATH="/scripts:/py/bin:$PATH"

#switches to user intended for application user
USER app

CMD ["run.sh"]

