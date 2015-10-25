# Footballer

---

#### Copy Production Db to Local Db

###### Get Data from Remote
Remote database is called "footballer".
`mongodump --db footballer`

###### Copy Remote dump to Local
From within app root:
`scp -r root@middlelogic.com:/root/dump /Users/timcooper/middlelogic/apps/footballer`

###### Restore on Local
From within dump folder (local db is called "meteor"):
`mongorestore --port 3001 --drop -d meteor footballer`

---

#### Copy Local Db to Production

###### Get Data from Local
Local database is called "meteor".
`mongodump --port 3001 --db meteor`

###### Copy Local dump to Remote Db
From within app root:
`scp -r /Users/timcooper/middlelogic/apps/footballer/dump root@middlelogic.com:/root/`

###### Restore on Local
From within dump folder (remote db is called "footballer"):
`mongorestore --drop -d footballer meteor`

---

#### Revert Code Changes to Commit
```
git revert --no-commit 0564c4..HEAD
git commit
```
