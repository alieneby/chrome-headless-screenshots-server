FROM alpine:3.18

# Installs latest Chromium package.
RUN apk add --no-cache \
      chromium \
      nss \
      alsa-lib \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      nodejs \
      yarn

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD 1
ENV PUPPETEER_EXECUTABLE_PATH /usr/bin/chromium-browser
ENV LIBGL_ALWAYS_SOFTWARE 1

# Copy current directory to /usr/src/app
ADD . /usr/src/app

# Install dependencies
WORKDIR /usr/src/app
RUN yarn install

# Create output directory
RUN mkdir -p /usr/src/app/out

RUN chmod +x take-screenshot.sh
RUN chmod +x entrypoint.sh

ENV PATH="/usr/src/app:${PATH}"
EXPOSE 3000

CMD [ "node", "server.js" ]
#ENTRYPOINT ["entrypoint.sh"]
