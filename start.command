docker build . --tag wishes
docker run --rm -d --name wishes -p 80:8100 wishes