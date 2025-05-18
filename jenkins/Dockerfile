FROM jenkins/jenkins:lts

USER root

# ติดตั้ง Docker
RUN apt-get update && apt-get install -y docker.io curl gnupg

# ติดตั้ง Node.js (v18)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - && \
    apt-get install -y nodejs

# ติดตั้ง Docker Compose (v1.29.2 ตัวเสถียร)
RUN curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" \
    -o /usr/local/bin/docker-compose && \
    chmod +x /usr/local/bin/docker-compose

# ให้ Jenkins ใช้ Docker ได้
RUN usermod -aG docker jenkins

USER jenkins