# Create a base stage
FROM node:12.18.3 AS base
# ARG SSH_PRIVATE_KEY
ENV NODE_ENV development
WORKDIR /

RUN mkdir /root/.ssh/ 
# RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa 
COPY ./id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa 
RUN touch /root/.ssh/known_hosts 
RUN ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts
RUN cat /root/.ssh/id_rsa

# Create app directory
WORKDIR /opt/app

# Build & Testing
FROM base AS build 
# Copy package.json and package-lock.json
COPY package.json package-lock.json* ./
# Install dependencies
RUN npm cache clean --force && rm -rf node_modules
RUN npm install --only-production && npm cache clean --force
# Copy source code to image
COPY . ./
# Run build & test
RUN npm run build

#ARG FIREBASE_FILE_NAME

# Release
FROM node:12.18.3 as release

WORKDIR /

# RUN apk update && apk upgrade && \
#     apk add --no-cache bash git openssh
RUN mkdir /root/.ssh/
# RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa
COPY --from=build /root/.ssh/id_rsa /root/.ssh/id_rsa
RUN chmod 600 /root/.ssh/id_rsa
RUN touch /root/.ssh/known_hosts && ssh-keyscan bitbucket.org >> /root/.ssh/known_hosts
# Create app directory
WORKDIR /opt
# Copy package.json and package-lock.json
COPY --from=build /opt/app/package.json /opt/app/package-lock.json* /opt/app/${FIREBASE_FILE_NAME} ./
# Install app dependencies
RUN npm install --only-production
WORKDIR /opt/app
COPY --from=build /opt/app/dist ./
# Clear SSH Key
RUN rm /root/.ssh/id_rsa

CMD ["npx", "node", "apps/api/index.js"]
