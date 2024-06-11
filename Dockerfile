FROM oven/bun:slim

# Declaring env
ENV NODE_ENV production

# Setting up the work directory
WORKDIR /app

# Copying all the files in our project
COPY . .

# Installing dependencies
RUN bun install

# Installing pm2 globally
RUN bun install pm2 -g

# Starting our application
CMD pm2 start process.yml && tail -f /dev/null

# Exposing server port
EXPOSE 5000
