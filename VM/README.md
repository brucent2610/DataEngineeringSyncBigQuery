1. Backup json file by Query
```
mongoexport --uri="mongodb://ecommerce:admin@localhost:27017" -d ecommerce --collection products --query='{"_id": {"$lte":{"$oid": "649942c8e9c823ca18daca14"}}}' --pretty --out output.json
```

2. Create VM
```

```