FROM node:lts-alpine
WORKDIR /var/www/saso
COPY ./ ./
RUN npm install
RUN ls -l
CMD ["npm", "start"]