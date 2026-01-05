-- Script de teste para DBeaver
-- Execute este script para verificar as tabelas

-- 1. Listar todas as tabelas do schema public
SELECT
    table_name,
    table_type
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Ver estrutura da tabela users
SELECT
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- 3. Ver todos os usuários cadastrados
SELECT
    id,
    email,
    role,
    "createdAt",
    "updatedAt"
FROM users
ORDER BY "createdAt" DESC;

-- 4. Contar registros em cada tabela
SELECT 'users' as tabela, COUNT(*) as total FROM users
UNION ALL
SELECT 'characters' as tabela, COUNT(*) as total FROM characters
UNION ALL
SELECT 'items' as tabela, COUNT(*) as total FROM items
UNION ALL
SELECT 'parties' as tabela, COUNT(*) as total FROM parties
UNION ALL
SELECT 'character_parties' as tabela, COUNT(*) as total FROM character_parties;
