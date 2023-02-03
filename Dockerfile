FROM node:14.4.0-buster

RUN apt-get -y update

COPY ./ /wishes

WORKDIR /wishes

RUN npm i -g @angular/cli @ionic/cli 

RUN npm install

RUN ionic build

CMD ["python3", "-m", "http.server", "--directory", "www", "80"]

