Create .env file:

DB_USER=your_user </br>
DB_HOST=localhost </br>
DB_DATABASE=generativeArtPlatform</br>
DB_PASSWORD=your_password</br>
DB_PORT=your_port</br>
OAUTH_CLIENT_ID=your_client_id</br>
OAUTH_CLIENT_SECRET=your_client_secret</br>

Create database called generativeArtPlatform</br>
Run the following command to create the tables:</br>
npx ts-node src/setupdatabase.ts</br>
Run the following command to start the server:</br>
npx ts-node src/app.ts</br>