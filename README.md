# vehicules app

1. install docker
2. run command: git clone https://github.com/OmarJouied/vehicules.git
3. run command: cd vehicules
4. run command: sudo docker build -t vehicules .
5. run command: sudo docker network create net-app
6. run command: sudo docker pull mongo
7. run command: sudo docker run -d --network net-app --name mongodb mongo
8. run command: sudo docker run -d --name vehicules --network net-app -e MONGODB_URI="mongodb://mongodb:27017/vehicules" -e NEXTAUTH_SECRET="jUwxPq2cYA9EuLxFGHjdXylWhKwPt51Eif6wb8KA/Po=" -e NEXTAUTH_URL="http://192.168.2.151:3000" -p 3000:3000 vehicules
