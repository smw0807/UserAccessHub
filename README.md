# UserAccessHub

UserAccessHub는 사용자 관리 및 인증을 위한 RESTful API와 GraphQL 기반의 애플리케이션입니다. 이 프로젝트는 JWT 기반 인증 시스템과 OAuth2 소셜 로그인 기능을 제공하며, Supabase 데이터베이스를 사용하여 사용자 데이터를 관리합니다. NestJS를 기반으로 구축되어 확장 가능하고, GraphQL을 통해 효율적인 데이터 요청 및 응답 구조를 지원합니다.

## 사용 기술

- NestJS: 안정적이고 확장 가능한 서버 사이드 프레임워크.
- GraphQL: 클라이언트가 필요한 데이터만 효율적으로 요청할 수 있도록 지원하는 API 쿼리 언어.
- Supabase Database: 실시간 기능을 제공하는 Postgres 기반의 데이터베이스 서비스.
- OAuth2: Google, Kakao에서 제공하는 소셜 로그인 기능.

## 주요 기능

## .env

```bash
PROJECT_NAME=UserAccessHub
APP_PORT=
BCRYPT_SALT=
JWT_SECRET=

# CORS
CORS_ORIGIN=
CORS_METHODS=GET,HEAD,PUT,PATCH,POST,DELETE
CORS_ALLOWED_HEADERS='Content-Type, Accept, Authorization'

# Google API
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

# Kakao API
KAKAO_API_URL=
KAKAO_REST_API_KEY=
KAKAO_REDIRECT_URI=

# Supabase
SUPABASE_URL
SUPABASE_API_KEY=

# Prisma
DATABASE_URL=
```

- 사용자 로그인 및 회원가입
- JWT 기반 인증 및 권한 부여
- 소셜 로그인(OAuth2) 지원
- 사용자 프로필 관리

# 참고 URL

- [NestJS](https://docs.nestjs.com/)
  - [GraphQL](https://docs.nestjs.com/graphql/quick-start)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [JWT](https://jwt.io/)
- [Google OAuth2](https://developers.google.com/identity/protocols/oauth2)
- [Kakao OAuth2](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api)
