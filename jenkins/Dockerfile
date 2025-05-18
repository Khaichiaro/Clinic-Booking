FROM jenkins/jenkins:lts

USER root

RUN apt-get update && apt-get install -y \
    docker.io \
    curl \
    gnupg \
    ca-certificates \
    lsb-release

# ติดตั้ง Docker Compose (v2 CLI แบบ plugin)
RUN mkdir -p /usr/local/lib/docker/cli-plugins && \
    curl -SL https://github.com/docker/compose/releases/download/v2.24.6/docker-compose-linux-x86_64 \
    -o /usr/local/lib/docker/cli-plugins/docker-compose && \
    chmod +x /usr/local/lib/docker/cli-plugins/docker-compose

# เพิ่ม jenkins user เข้ากลุ่ม docker เพื่อใช้ docker CLI
RUN usermod -aG docker jenkins

# # คัดลอก entrypoint script เข้าไป
# COPY entrypoint.sh /usr/local/bin/entrypoint.sh
# RUN chmod +x /usr/local/bin/entrypoint.sh

USER jenkins