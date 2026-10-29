# Use the official Playwright image — it already ships with matching, pre-installed
# browser binaries (Chromium, Firefox, WebKit) and all their OS-level dependencies.
FROM mcr.microsoft.com/playwright:v1.48.0-jammy
WORKDIR /app
# Copy only the manifest files first. Docker caches this layer, so as long as your
# dependencies haven't changed, later builds skip straight past "npm ci" — much faster.
COPY package*.json ./
RUN npm ci
# Now copy the rest of the project (tests, config, source).
COPY . .
# Run the full suite when the container starts. This writes an HTML report to
# /app/playwright-report inside the container.
CMD ["npx", "playwright", "test"]