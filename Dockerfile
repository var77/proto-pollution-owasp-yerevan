FROM node
COPY . .
RUN apt-get update && apt-get install iputils-ping -y && yarn
CMD ["node", "index.js"]
