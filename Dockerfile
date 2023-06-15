FROM alpine:3.18

# Installs latest Chromium package.
RUN apk add --no-cache \
      dbus \
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

# Create dbus directory
RUN mkdir -p /var/run/dbus

RUN chmod +x take-screenshot.sh
RUN chmod +x entrypoint.sh
RUN chmod +x start.sh

ENV PATH="/usr/src/app:${PATH}"
ENV DBUS_SESSION_BUS_ADDRESS=/dev/null

# Create a non-root user
RUN adduser -D myuser && echo "myuser ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers

# Change ownership of the necessary directories and files
RUN chown -R myuser:myuser /usr/src/app /var/run/dbus

# Switch to the non-root user
USER myuser

EXPOSE 3000
CMD [ "./start.sh" ]
#CMD [ "node", "server.js" ]
#ENTRYPOINT ["entrypoint.sh"]
