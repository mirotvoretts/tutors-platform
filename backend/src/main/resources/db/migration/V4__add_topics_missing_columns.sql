-- =============================================
-- СТОПРО — V4: Добавление недостающих колонок в topics
-- (приведение схемы в соответствие с сущностью Topic)
-- =============================================

ALTER TABLE topics
    ADD COLUMN IF NOT EXISTS description  TEXT,
    ADD COLUMN IF NOT EXISTS order_index   INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_active     BOOLEAN NOT NULL DEFAULT TRUE;
