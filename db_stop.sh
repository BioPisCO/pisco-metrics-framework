#! /bin/bash

##Start mongod Processes
database_path="/usr/users/ga002/artazah/projects/data/db"

mongod --dbpath $database_path --shutdown
