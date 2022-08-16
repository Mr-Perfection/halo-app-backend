# Create docker container
```
docker-compose up -d  
```

# Access to test docker container
```
docker exec -ti customer_db psql -U customer_db_user
```