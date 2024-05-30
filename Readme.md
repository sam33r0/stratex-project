# Stratex Assignment
# Video Link= https://drive.google.com/file/d/1C5kDWWjP3lCcGmyJKZBjCve-r8gspM0d/view

# First Clone the repository and then enter command
# npm i

# start a postgreSQL server and create a database with name stratex 

# update ./src/db/dbConfig.js file with host and other details.

# Create a .env file with your usernama, password and secret

example .env is
POSTGRES_USERNAME= postgres
POSTGRES_PASSWORD= 12345678
CORS_ORIGIN= *
PORT= 8000
ACCESS_TOKEN_SECRET=5ZBihyuiktgyVSNdWMuZkZNfUVfEcqmHSeLyER0x7oD8sEgJKot
ACCESS_TOKEN_EXPIRY= 1d
REFRESH_TOKEN_SECRET=B9SbpWI700hfjyfdpm7oJhEhtMERTdVPEOkwfKNWl0V9xdt4sIO
REFRESH_TOKEN_EXPIRY= 10d

# run the server with dev or start command {npm run dev or npm run start}