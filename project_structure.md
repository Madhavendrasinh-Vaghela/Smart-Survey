# Project Structure

```text
smart-survey
├── docker
├── frontend
│   ├── admin-dashboard
│   │   ├── public
│   │   │   └── vite.svg
│   │   ├── src
│   │   │   ├── api
│   │   │   │   └── client.ts
│   │   │   ├── assets
│   │   │   │   └── react.svg
│   │   │   ├── components
│   │   │   │   ├── SentimentChart.tsx
│   │   │   │   └── SurveyPanel.tsx
│   │   │   ├── context
│   │   │   ├── layouts
│   │   │   │   └── AdminLayout.tsx
│   │   │   ├── pages
│   │   │   │   ├── AnalysisPage.tsx
│   │   │   │   ├── CreateSurveyPage.tsx
│   │   │   │   ├── LoginPage.tsx
│   │   │   │   ├── RegisterPage.tsx
│   │   │   │   ├── SurveyDetailPage.tsx
│   │   │   │   └── SurveysPage.tsx
│   │   │   ├── App.tsx
│   │   │   ├── index.css
│   │   │   └── main.tsx
│   │   ├── .gitignore
│   │   ├── README.md
│   │   ├── eslint.config.js
│   │   ├── index.html
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── tailwind.config.js
│   │   ├── tsconfig.app.json
│   │   ├── tsconfig.json
│   │   ├── tsconfig.node.json
│   │   └── vite.config.ts
│   ├── package-lock.json
│   └── package.json
├── services
│   ├── ai-analysis-service
│   │   ├── prisma
│   │   │   ├── migrations
│   │   │   │   ├── 20260126114216_init_analysis
│   │   │   │   │   └── migration.sql
│   │   │   │   └── migration_lock.toml
│   │   │   └── schema.prisma
│   │   ├── src
│   │   │   ├── analysis
│   │   │   │   ├── analysis.controller.ts
│   │   │   │   ├── analysis.module.ts
│   │   │   │   ├── analysis.service.ts
│   │   │   │   └── response.schema.ts
│   │   │   ├── prisma
│   │   │   │   ├── prisma.module.ts
│   │   │   │   └── prisma.service.ts
│   │   │   ├── rabbitmq
│   │   │   │   ├── rabbitmq.consumer.ts
│   │   │   │   └── rabbitmq.module.ts
│   │   │   ├── app.controller.spec.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts
│   │   ├── test
│   │   │   ├── app.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   ├── .env
│   │   ├── .gitignore
│   │   ├── .prettierrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── nest-cli.json
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── tsconfig.build.json
│   │   └── tsconfig.json
│   ├── ai-ml-service
│   │   └── main.py
│   ├── api-gateway
│   │   ├── src
│   │   │   ├── analysis
│   │   │   │   ├── analysis.controller.ts
│   │   │   │   └── analysis.module.ts
│   │   │   ├── auth
│   │   │   │   ├── strategy
│   │   │   │   │   └── jwt.strategy.ts
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── jwt-auth.guard.ts
│   │   │   ├── survey
│   │   │   │   ├── survey.controller.ts
│   │   │   │   ├── survey.module.ts
│   │   │   │   └── survey.service.ts
│   │   │   ├── app.controller.spec.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts
│   │   ├── test
│   │   │   ├── app.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   ├── .env
│   │   ├── .gitignore
│   │   ├── .prettierrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── nest-cli.json
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── tsconfig.build.json
│   │   └── tsconfig.json
│   ├── auth-service
│   │   ├── prisma
│   │   │   ├── migrations
│   │   │   │   ├── 20260122090105_init
│   │   │   │   │   └── migration.sql
│   │   │   │   └── migration_lock.toml
│   │   │   └── schema.prisma
│   │   ├── src
│   │   │   ├── auth
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.module.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── prisma
│   │   │   │   ├── prisma.module.ts
│   │   │   │   └── prisma.service.ts
│   │   │   ├── app.controller.spec.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts
│   │   ├── test
│   │   │   ├── app.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   ├── .env
│   │   ├── .gitignore
│   │   ├── .prettierrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── nest-cli.json
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── tsconfig.build.json
│   │   └── tsconfig.json
│   ├── response-service
│   │   ├── src
│   │   │   ├── rabbitmq
│   │   │   │   ├── rabbitmq.module.ts
│   │   │   │   └── rabbitmq.service.ts
│   │   │   ├── response
│   │   │   │   ├── response.controller.ts
│   │   │   │   ├── response.module.ts
│   │   │   │   ├── response.schema.ts
│   │   │   │   └── response.service.ts
│   │   │   ├── app.controller.spec.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts
│   │   ├── test
│   │   │   ├── app.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   ├── .env
│   │   ├── .gitignore
│   │   ├── .prettierrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── nest-cli.json
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── tsconfig.build.json
│   │   └── tsconfig.json
│   ├── survey-service
│   │   ├── src
│   │   │   ├── survey
│   │   │   │   ├── survey.controller.ts
│   │   │   │   ├── survey.module.ts
│   │   │   │   ├── survey.schema.ts
│   │   │   │   └── survey.service.ts
│   │   │   ├── app.controller.spec.ts
│   │   │   ├── app.controller.ts
│   │   │   ├── app.module.ts
│   │   │   ├── app.service.ts
│   │   │   └── main.ts
│   │   ├── test
│   │   │   ├── app.e2e-spec.ts
│   │   │   └── jest-e2e.json
│   │   ├── .env
│   │   ├── .gitignore
│   │   ├── .prettierrc
│   │   ├── README.md
│   │   ├── eslint.config.mjs
│   │   ├── nest-cli.json
│   │   ├── package-lock.json
│   │   ├── package.json
│   │   ├── tsconfig.build.json
│   │   └── tsconfig.json
│   ├── package-lock.json
│   └── package.json
├── .env
├── .gitignore
└── docker-compose.yml
```
