# Fullstack Todo App

_Japanese version below / 日本語は下記_

## Quick overview

A todo list migrated from a **frontend-only** prototype to a **fullstack** setup: **React (Vite)** talks to a **REST API** on **Express**, with **user-scoped persistence** in **PostgreSQL** (Neon) via **Prisma**, and **stateless authentication** using **JWT** (Bearer). UI strings are Japanese; API and identifiers follow English conventions.

---

## Live demo

| Surface             | URL                                                                            |
| ------------------- | ------------------------------------------------------------------------------ |
| Frontend (Vercel)   | [todo-app-charlene.vercel.app](https://todo-app-charlene.vercel.app/)          |
| API health (Render) | [todo-app-ywmi.onrender.com/health](https://todo-app-ywmi.onrender.com/health) |

---

## Tech stack

| Layer   | Technology                               |
| ------- | ---------------------------------------- |
| Client  | React 19, TypeScript, Vite, React Router |
| API     | Node.js, Express, TypeScript             |
| Data    | PostgreSQL (Neon), Prisma ORM            |
| Auth    | JWT (HS256), bcrypt password hashing     |
| Hosting | Vercel (client), Render (API), Neon (DB) |

---

## Architecture

```text
Browser  ──HTTPS──►  Vercel (static SPA + client routing)
       ──REST + JWT──►  Render (Express)
                              │
                              └── Prisma ──►  Neon (PostgreSQL)
```

- **client/** — SPA build, `VITE_API_URL` points at the API.
- **server/** — Express app, Prisma client, `/auth` and `/todos` routes.

---

## Features

- Register, login, logout
- CRUD todos with **per-user isolation** on the server
- Bulk delete (selected / all)
- Loading and error handling in the client

---

## API overview

| Method   | Path             | Auth                                           |
| -------- | ---------------- | ---------------------------------------------- |
| `GET`    | `/health`        | —                                              |
| `POST`   | `/auth/register` | —                                              |
| `POST`   | `/auth/login`    | —                                              |
| `GET`    | `/auth/me`       | Bearer JWT                                     |
| `GET`    | `/todos`         | Bearer JWT                                     |
| `POST`   | `/todos`         | Bearer JWT — body `{ "title" }`                |
| `PATCH`  | `/todos/:id`     | Bearer JWT — body `{ "title"?, "completed"? }` |
| `DELETE` | `/todos/:id`     | Bearer JWT                                     |

JWT payload: `{ userId, email }`. Todo queries are scoped by `userId` from the token, not from the request body.

---

## Setup (local)

**Requirements:** Node.js (LTS), Yarn v1, a Postgres URL (e.g. Neon).

1. **Install** — `yarn install` at the repo root.
2. **Server** — Copy `server/.env.example` → `server/.env`. Set `DATABASE_URL`, `JWT_SECRET`, `CLIENT_ORIGIN` (e.g. `http://localhost:18080`), optional `PORT`.
3. **Migrations** — `yarn db:migrate:deploy` (or `yarn db:migrate` while iterating on schema).
4. **Client** — Copy `client/.env.example` → `client/.env`. Set `VITE_API_URL` (e.g. `http://localhost:3001`, no trailing slash).
5. **Run** — `yarn dev` starts API + Vite, or use `yarn dev:server` and `yarn dev:client` in two terminals. App: port **18080** (see `client/vite.config.ts`). Register at `/register`, then use `/`.

**Checks:** `yarn lint`, `yarn build`.

---

## Deployment

| Target     | Notes                                                                                                                                                                                                                         |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Neon**   | Connection string → Render `DATABASE_URL`.                                                                                                                                                                                    |
| **Render** | Web service, repo **root**. Build: `yarn install && yarn db:migrate:deploy && yarn workspace server build`. Start: `yarn workspace server start`. Set `JWT_SECRET`, `CLIENT_ORIGIN` (exact Vercel origin, no trailing slash). |
| **Vercel** | Root **`client`**. Set `VITE_API_URL` to the public API URL (HTTPS). SPA fallbacks: `client/vercel.json`. Rebuild after changing `VITE_*` env vars.                                                                           |

---

## Key learnings

- Splitting **client** and **server** early keeps ownership clear and matches how teams ship browser + API products.
- **Prisma migrations** in the repo plus `migrate deploy` in CI/build close the gap between “works on my machine” and production schema.
- **CORS** and **env per environment** (local vs Vercel vs Render) are where fullstack bugs show up first; fixing them is part of shipping.
- **JWT in `Authorization`** keeps the API stateless; the tradeoff is short-lived access tokens and client-side storage choices—documented consciously for this scope.

---

## Technical decisions

- **Yarn workspaces** — one install, shared lockfile; targeted `nohoist` for Vite to avoid duplicate toolchain types in the client build.
- **Prisma** — type-safe queries, migrations versioned with the API.
- **REST + JWT** — small surface area: register/login/me + todos CRUD behind one middleware pattern.
- **Client data loading** — hooks and `fetch` only; no global store for a single list.
- **Monorepo layout** — `client/` and `server/` as deploy roots without extra orchestration.

---

## License

Private / personal portfolio

---

# 日本語版

## 概要

当初の **フロントのみ** の TODO を、**フルスタック** に拡張したポートフォリオ用アプリです。**React（Vite）** が **Express** の **REST API** と通信し、**JWT（Bearer）** で認証、**PostgreSQL（Neon）** と **Prisma** により **ユーザー単位** でタスクを永続化します。画面文言は日本語、API・識別子は英語ベースです。

## ライブデモ

| 種別                 | URL                                                                            |
| -------------------- | ------------------------------------------------------------------------------ |
| フロント（Vercel）   | [todo-app-charlene.vercel.app](https://todo-app-charlene.vercel.app/)          |
| API ヘルス（Render） | [todo-app-ywmi.onrender.com/health](https://todo-app-ywmi.onrender.com/health) |

## 技術スタック

| レイヤー     | 技術                                              |
| ------------ | ------------------------------------------------- |
| クライアント | React 19、TypeScript、Vite、React Router          |
| API          | Node.js、Express、TypeScript                      |
| データ       | PostgreSQL（Neon）、Prisma ORM                    |
| 認証         | JWT（HS256）、bcrypt                              |
| ホスティング | Vercel（クライアント）、Render（API）、Neon（DB） |

## アーキテクチャ

```text
ブラウザ ──HTTPS──► Vercel（静的 SPA + クライアントルーティング）
      ──REST + JWT──► Render（Express）
                           │
                           └── Prisma ──► Neon（PostgreSQL）
```

- **client/** — SPA。`VITE_API_URL` で API のベース URL を指定。
- **server/** — Express。Prisma 経由で DB。`/auth` と `/todos`。

## 機能

- 新規登録・ログイン・ログアウト
- TODO の CRUD（サーバー側でユーザー単位に分離）
- 選択削除・全削除
- 読み込み・エラー表示

## API 概要

（英語版の表と同じエンドポイント。JWT のペイロードは `{ userId, email }`、TODO はトークンの `userId` でスコープ。）

| メソッド | パス             | 認証                                           |
| -------- | ---------------- | ---------------------------------------------- |
| `GET`    | `/health`        | 不要                                           |
| `POST`   | `/auth/register` | 不要                                           |
| `POST`   | `/auth/login`    | 不要                                           |
| `GET`    | `/auth/me`       | Bearer JWT                                     |
| `GET`    | `/todos`         | Bearer JWT                                     |
| `POST`   | `/todos`         | Bearer JWT — 本文 `{ "title" }`                |
| `PATCH`  | `/todos/:id`     | Bearer JWT — 本文 `{ "title"?, "completed"? }` |
| `DELETE` | `/todos/:id`     | Bearer JWT                                     |

## セットアップ（ローカル）

**前提:** Node.js（LTS）、Yarn v1、Postgres の接続文字列（例: Neon）。

1. リポジトリルートで `yarn install`
2. `server/.env.example` を `server/.env` にコピーし、`DATABASE_URL`・`JWT_SECRET`・`CLIENT_ORIGIN`（例: `http://localhost:18080`）・任意で `PORT` を設定
3. `yarn db:migrate:deploy`（スキーマ変更中は `yarn db:migrate` でも可）
4. `client/.env.example` を `client/.env` にコピーし、`VITE_API_URL` を設定（末尾スラッシュなし）
5. `yarn dev` で API と Vite を同時起動（または `yarn dev:server` と `yarn dev:client`）。アプリは **18080** 番ポート。`/register` で登録後、`/` で利用

**確認:** `yarn lint` / `yarn build`

## デプロイ

| 対象       | 内容                                                                                                                                                                                                                                            |
| ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Neon**   | 接続文字列を Render の `DATABASE_URL` に                                                                                                                                                                                                        |
| **Render** | Web サービス、リポジトリ**ルート**。ビルド: `yarn install && yarn db:migrate:deploy && yarn workspace server build`。起動: `yarn workspace server start`。`JWT_SECRET` と Vercel オリジンに合わせた `CLIENT_ORIGIN`（末尾スラッシュなし）を設定 |
| **Vercel** | ルート **`client`**。`VITE_API_URL` に公開 API の HTTPS URL。`client/vercel.json` で SPA 用リライト。`VITE_*` 変更後は再ビルド                                                                                                                  |

## 学び（要点）

- **クライアントとサーバーの分離** が責務とデプロイ単位を揃え、実務に近い形になる。
- **マイグレーションをリポジトリで管理**し、本番で `migrate deploy` することでスキーマの再現性が上がる。
- **環境ごとの CORS と env** がフルスタックで最初に詰まりやすいポイントである。
- **JWT + Bearer** で API をステートレスに保つ一方、トークン寿命と保存場所はスコープに応じて選ぶ必要がある。

## 技術的な判断

- **Yarn workspaces** — 単一ロックファイル。Vite 周りは `nohoist` で型の二重化を回避。
- **Prisma** — 型安全なクエリと、マイグレーションをコードベースと一体管理。
- **REST + JWT** — 認証と TODO の API 面を小さく保つ。
- **クライアント** — 単一リストのためフックと `fetch` に集約（グローバルストアは未使用）。
- **モノレポ** — `client/` と `server/` をそのまま Vercel / Render のルートに対応。

## ライセンス

個人ポートフォリオ用。
