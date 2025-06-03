# 1단계: 빌드 단계
FROM node:22-alpine AS builder

WORKDIR /app

# 환경변수 설정
ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

ENV NODE_OPTIONS="--max-old-space-size=1024"

# package.json과 lock 파일 복사
COPY package*.json ./

# 의존성 설치
RUN npm install

# 전체 소스 복사 후 빌드
COPY . .

RUN npm run build

# 2단계: 실행 단계 (Nginx로 서빙)
FROM nginx:alpine

# React build 결과물을 Nginx의 기본 루트에 복사
COPY --from=builder /app/build /usr/share/nginx/html

# 커스텀 Nginx 설정 복사
#COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf

# 커스텀 nginx 설정 덮어쓰기 (Optional)
# COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]