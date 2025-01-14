FROM ubuntu:24.04

ENV DEBIAN_FRONTEND=noninteractive
ENV TZ=America/Sao_Paulo

RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
RUN apt-get update && apt-get install -y python3.12-full supervisor gnupg curl ca-certificates nano
ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

RUN apt-get -y autoremove \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

RUN rm -rf /var/www/html/*
COPY --chown=www-data:www-data . /var/www/html
WORKDIR /var/www/html
RUN pip install -r requirements.txt

RUN mkdir -p /etc/supervisor/conf.d
COPY files/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

EXPOSE 8000/tcp

CMD ["/usr/bin/supervisord"]