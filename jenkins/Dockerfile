FROM jenkins/jenkins:lts

USER root

RUN apt-get update && apt-get install -y \
    docker.io \
    curl \
    gnupg \
    ca-certificates \
    lsb-release

# สร้างโฟลเดอร์ก่อนติดตั้ง docker compose
RUN mkdir -p /usr/local/lib/docker/cli-plugins && \
    curl -SL https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-linux-x86_64 \
    -o /usr/local/lib/docker/cli-plugins/docker-compose && \
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# ให้ Jenkins ใช้ docker ได้
RUN usermod -aG docker jenkins

USER jenkins
