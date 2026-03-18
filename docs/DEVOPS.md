## 🐋 $\textsf{\color{salmon}How to run app in Docker container}$

Build image, volumes and container from docker-compose.yml of current path and start all (Whenever code-changes are registered, a new image will be built, otherwise the old last image will be restored.):


```sh
docker compose up --build
```


<br>

To remove all of it again:

```sh
docker compose down -v --rmi all
```

