# SQL command categories (DQL/DML/DDL/DCL/TCL)

> SQL commands fall into 5 categories. Knowing them shows you've worked with the language beyond `SELECT`.

## DQL — Data Query Language

Read data. **One command:** `SELECT`.

```sql
SELECT name, email FROM users WHERE active = true;
```

## DML — Data Manipulation Language

Modify data. Operates on **rows**.

```sql
INSERT INTO users (name, email) VALUES ('Ana', 'a@x');
UPDATE users SET email = 'b@x' WHERE id = 1;
DELETE FROM users WHERE id = 1;
MERGE INTO users  USING source ON ...   -- upsert (Oracle, SQL Server, Postgres 15+)
```

> Modern Postgres / MySQL also offer `INSERT ... ON CONFLICT` / `INSERT ... ON DUPLICATE KEY UPDATE` for upserts.

## DDL — Data Definition Language

Define schema. Operates on **objects** (tables, indexes, views, schemas).

```sql
CREATE TABLE users (id BIGSERIAL PRIMARY KEY, email TEXT NOT NULL UNIQUE);
ALTER TABLE users ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
DROP TABLE users;
TRUNCATE TABLE users;          -- empties table, faster than DELETE, usually non-rollbackable
CREATE INDEX idx_users_email ON users(email);
CREATE VIEW active_users AS SELECT * FROM users WHERE active = true;
```

> DDL is usually **auto-committed** in MySQL/Oracle; in Postgres most DDL is transactional.

## DCL — Data Control Language

Permissions.

```sql
GRANT SELECT, INSERT ON users TO app_user;
REVOKE INSERT ON users FROM app_user;
```

## TCL — Transaction Control Language

Group DML into atomic units.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;                        -- or ROLLBACK on failure

SAVEPOINT before_risky;
-- ...
ROLLBACK TO SAVEPOINT before_risky;
```

## Cheat sheet

| Category | Purpose | Examples |
|---|---|---|
| DQL | Read data | `SELECT` |
| DML | Modify rows | `INSERT`, `UPDATE`, `DELETE`, `MERGE` |
| DDL | Define schema | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| DCL | Permissions | `GRANT`, `REVOKE` |
| TCL | Transactions | `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT` |

## Interview line

> "SQL splits into DQL (SELECT), DML (INSERT/UPDATE/DELETE/MERGE), DDL (CREATE/ALTER/DROP), DCL (GRANT/REVOKE), and TCL (BEGIN/COMMIT/ROLLBACK). The category matters because DDL is often auto-committed and can't be wrapped in a transaction the same way DML can."
