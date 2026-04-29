# Categorías de comandos SQL (DQL/DML/DDL/DCL/TCL)

> Los comandos SQL caen en 5 categorías. Saberlas demuestra que trabajaste con el lenguaje más allá del `SELECT`.

## DQL — Data Query Language

Leer datos. **Un comando:** `SELECT`.

```sql
SELECT name, email FROM users WHERE active = true;
```

## DML — Data Manipulation Language

Modificar datos. Opera sobre **filas**.

```sql
INSERT INTO users (name, email) VALUES ('Ana', 'a@x');
UPDATE users SET email = 'b@x' WHERE id = 1;
DELETE FROM users WHERE id = 1;
MERGE INTO users  USING source ON ...   -- upsert (Oracle, SQL Server, Postgres 15+)
```

> Postgres / MySQL modernos también ofrecen `INSERT ... ON CONFLICT` / `INSERT ... ON DUPLICATE KEY UPDATE` para upserts.

## DDL — Data Definition Language

Definir esquema. Opera sobre **objetos** (tablas, índices, vistas, schemas).

```sql
CREATE TABLE users (id BIGSERIAL PRIMARY KEY, email TEXT NOT NULL UNIQUE);
ALTER TABLE users ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
DROP TABLE users;
TRUNCATE TABLE users;          -- vacía la tabla, más rápido que DELETE, normalmente no rollbackeable
CREATE INDEX idx_users_email ON users(email);
CREATE VIEW active_users AS SELECT * FROM users WHERE active = true;
```

> DDL es generalmente **auto-commited** en MySQL/Oracle; en Postgres la mayoría del DDL es transaccional.

## DCL — Data Control Language

Permisos.

```sql
GRANT SELECT, INSERT ON users TO app_user;
REVOKE INSERT ON users FROM app_user;
```

## TCL — Transaction Control Language

Agrupar DML en unidades atómicas.

```sql
BEGIN;
UPDATE accounts SET balance = balance - 100 WHERE id = 1;
UPDATE accounts SET balance = balance + 100 WHERE id = 2;
COMMIT;                        -- o ROLLBACK ante falla

SAVEPOINT before_risky;
-- ...
ROLLBACK TO SAVEPOINT before_risky;
```

## Cheat sheet

| Categoría | Propósito | Ejemplos |
|---|---|---|
| DQL | Leer datos | `SELECT` |
| DML | Modificar filas | `INSERT`, `UPDATE`, `DELETE`, `MERGE` |
| DDL | Definir esquema | `CREATE`, `ALTER`, `DROP`, `TRUNCATE` |
| DCL | Permisos | `GRANT`, `REVOKE` |
| TCL | Transacciones | `BEGIN`, `COMMIT`, `ROLLBACK`, `SAVEPOINT` |

## Frase para entrevista

> "SQL splits into DQL (SELECT), DML (INSERT/UPDATE/DELETE/MERGE), DDL (CREATE/ALTER/DROP), DCL (GRANT/REVOKE), and TCL (BEGIN/COMMIT/ROLLBACK). The category matters because DDL is often auto-committed and can't be wrapped in a transaction the same way DML can."
