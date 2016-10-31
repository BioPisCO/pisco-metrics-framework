#! /bin/bash

###Start mongod Processes
database_path="/usr/users/ga002/artazah/projects/data/db"

nohup mongod --dbpath $database_path > mongo_db_exc.log &
