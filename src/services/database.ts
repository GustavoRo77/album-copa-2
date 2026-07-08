// src/services/database.ts
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const dbName = 'album_copa_db'
let db: SQLiteDBConnection | null = null
let initialized = false
let initializationPromise: Promise<void> | null = null
const sqliteConnection = new SQLiteConnection(CapacitorSQLite)

async function ensureDatabase() {
    if (initialized && db) {
        return
    }

    if (initializationPromise) {
        await initializationPromise
        return
    }

    initializationPromise = initializeDatabase()

    try {
        await initializationPromise
    } finally {
        initializationPromise = null
    }
}

async function initializeDatabase() {
    if (initialized && db) {
        return
    }
   
    if (!db) {
        try {
            db = await sqliteConnection.createConnection(dbName, false, 'no-encryption', 1, false)
        } catch (error) {
            db = await sqliteConnection.retrieveConnection(dbName, false)
        }
    }

    await db.open()
    
    // Tabela de usuários
    await db.execute(`
        CREATE TABLE IF NOT EXISTS usuarios (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE,
            senha TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
    `)
    
    // Tabela de figurinhas
    await db.execute(`
        CREATE TABLE IF NOT EXISTS figurinhas (
            id INTEGER PRIMARY KEY,
            nome TEXT NOT NULL,
            selecao TEXT NOT NULL,
            foto TEXT NOT NULL,
            raridade TEXT NOT NULL,
            grupo TEXT NOT NULL
        );
    `)

    // Tabela de coleção do usuário
    await db.execute(`
        CREATE TABLE IF NOT EXISTS colecao (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            usuario_id INTEGER NOT NULL,
            figurinha_id INTEGER NOT NULL,
            coletada INTEGER DEFAULT 0,
            FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (figurinha_id) REFERENCES figurinhas(id) ON DELETE CASCADE,
            UNIQUE(usuario_id, figurinha_id)
        );
    `)

    // Tabela de contatos
    await db.execute(`
        CREATE TABLE IF NOT EXISTS contato (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            email TEXT NOT NULL,
            telefone TEXT NOT NULL
        );
    `)

    // Tabela de conquistas
    await db.execute(`
        CREATE TABLE IF NOT EXISTS achievements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT NOT NULL,
            icone TEXT NOT NULL,
            tipo TEXT NOT NULL DEFAULT 'total',
            alvo TEXT,
            valor INTEGER NOT NULL DEFAULT 0,
            desbloqueada INTEGER NOT NULL DEFAULT 0,
            data_desbloqueio DATETIME
        );
    `);

    await garantirColunasAchievements()

    // Tabela de conquistas do usuário
    await db.execute(`
        CREATE TABLE IF NOT EXISTS user_achievements (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            achievement_id INTEGER NOT NULL,
            data_desbloqueio DATETIME,
            FOREIGN KEY (user_id) REFERENCES usuarios(id) ON DELETE CASCADE,
            FOREIGN KEY (achievement_id) REFERENCES achievements(id) ON DELETE CASCADE,
            UNIQUE(user_id, achievement_id)
        );
    `);

    // Inserir conquistas padrão
    const achievementsResult = await db.query(`SELECT COUNT(*) as total FROM achievements`)
    const achievementsCount = achievementsResult?.values?.[0]?.total || 0
    
    if (achievementsCount === 0) {
        await inserirConquistasPadrao()
    }

    await garantirConquistasObrigatorias()

    // Inserir dados iniciais das figurinhas
    const result = await db.query(`SELECT COUNT(*) as total FROM figurinhas`)
    const count = result?.values?.[0]?.total || 0
    
    if (count < 24) {
        await inserirFigurinhasIniciais()
    }

    initialized = true
    console.log('✅ Banco de dados inicializado com sucesso!')
}

function getDb() {
    if (!db) {
        throw new Error('Banco de dados ainda não inicializado')
    }
    return db
}

// ============ INSERIR CONQUISTAS PADRÃO ============
async function inserirConquistasPadrao() {
    if (!db) return

    const achievements = [
        { nome: 'Primeira Figurinha', descricao: 'Colete sua primeira figurinha', icone: '🌟' },
        { nome: 'Iniciante', descricao: 'Colete 10 figurinhas', icone: '🎯' },
        { nome: 'Colecionador', descricao: 'Colete 25 figurinhas', icone: '📚' },
        { nome: 'Álbum em Construção', descricao: 'Colete 50 figurinhas', icone: '🏗️' },
        { nome: 'Caçador de Raras', descricao: 'Colete 5 figurinhas raras', icone: '🔍' },
        { nome: 'Especialista em Raras', descricao: 'Colete 15 figurinhas raras', icone: '🏆' },
        { nome: 'Brilho Inicial', descricao: 'Colete 3 figurinhas brilhantes', icone: '✨' },
        { nome: 'Mestre das Brilhantes', descricao: 'Colete 10 figurinhas brilhantes', icone: '💎' },
        { nome: 'Álbum Quase Completo', descricao: 'Complete 80% do álbum', icone: '📖' },
        { nome: 'Campeão da Copa', descricao: 'Complete 100% do álbum', icone: '🏆' }
    ]

    for (const ach of achievements) {
        const meta = getAchievementMeta(ach.nome)
        await db.run(
            `INSERT INTO achievements (nome, descricao, icone, tipo, alvo, valor) VALUES (?, ?, ?, ?, ?, ?)`,
            [ach.nome, ach.descricao, ach.icone, meta.tipo, meta.alvo, meta.valor]
        )
    }
    console.log('✅ Conquistas padrão inseridas!')
}

function getAchievementMeta(nome: string) {
    const nomeNormalizado = normalizarNomeConquista(nome)
    const meta: Record<string, { tipo: string; alvo: string | null; valor: number }> = {
        'Primeira Figurinha': { tipo: 'total', alvo: null, valor: 1 },
        'Iniciante': { tipo: 'total', alvo: null, valor: 10 },
        'Colecionador': { tipo: 'total', alvo: null, valor: 25 },
        'Álbum em Construção': { tipo: 'total', alvo: null, valor: 50 },
        'Caçador de Raras': { tipo: 'raras', alvo: null, valor: 5 },
        'Especialista em Raras': { tipo: 'raras', alvo: null, valor: 15 },
        'Brilho Inicial': { tipo: 'brilhantes', alvo: null, valor: 3 },
        'Mestre das Brilhantes': { tipo: 'brilhantes', alvo: null, valor: 10 },
        'Álbum Quase Completo': { tipo: 'percentual', alvo: null, valor: 80 },
        'Campeão da Copa': { tipo: 'percentual', alvo: null, valor: 100 },
        'Grupo A Completo': { tipo: 'grupo', alvo: 'A', valor: 100 },
        'Grupo B Completo': { tipo: 'grupo', alvo: 'B', valor: 100 },
        'Grupo C Completo': { tipo: 'grupo', alvo: 'C', valor: 100 },
        'Grupo D Completo': { tipo: 'grupo', alvo: 'D', valor: 100 }
    }

    return meta[nomeNormalizado] || { tipo: 'total', alvo: null, valor: 0 }
}

function normalizarNomeConquista(nome: string) {
    const nomes: Record<string, string> = {
        'Ãlbum em ConstruÃ§Ã£o': 'Álbum em Construção',
        'CaÃ§ador de Raras': 'Caçador de Raras',
        'Ãlbum Quase Completo': 'Álbum Quase Completo',
        'CampeÃ£o da Copa': 'Campeão da Copa'
    }

    return nomes[nome] || nome
}

async function garantirColunasAchievements() {
    if (!db) return

    const result = await db.query(`PRAGMA table_info(achievements)`)
    const columns = new Set((result.values || []).map((column: any) => column.name))
    const migrations = [
        { name: 'tipo', sql: `ALTER TABLE achievements ADD COLUMN tipo TEXT NOT NULL DEFAULT 'total'` },
        { name: 'alvo', sql: `ALTER TABLE achievements ADD COLUMN alvo TEXT` },
        { name: 'valor', sql: `ALTER TABLE achievements ADD COLUMN valor INTEGER NOT NULL DEFAULT 0` },
        { name: 'desbloqueada', sql: `ALTER TABLE achievements ADD COLUMN desbloqueada INTEGER NOT NULL DEFAULT 0` },
        { name: 'data_desbloqueio', sql: `ALTER TABLE achievements ADD COLUMN data_desbloqueio DATETIME` }
    ]

    for (const migration of migrations) {
        if (!columns.has(migration.name)) {
            await db.execute(migration.sql)
        }
    }

    const existing = await db.query(`SELECT id, nome FROM achievements`)
    const nomesExistentes = new Set((existing.values || []).map((achievement: any) => normalizarNomeConquista(achievement.nome)))

    for (const achievement of existing.values || []) {
        const meta = getAchievementMeta(achievement.nome)
        if (meta.valor > 0) {
            await db.run(
                `UPDATE achievements SET tipo = ?, alvo = ?, valor = ? WHERE id = ?`,
                [meta.tipo, meta.alvo, meta.valor, achievement.id]
            )
        }
    }
    const conquistasPorGrupo = [
        { nome: 'Grupo A Completo', descricao: 'Colete todas as figurinhas do Grupo A', icone: '🏟️' },
        { nome: 'Grupo B Completo', descricao: 'Colete todas as figurinhas do Grupo B', icone: '🏟️' },
        { nome: 'Grupo C Completo', descricao: 'Colete todas as figurinhas do Grupo C', icone: '🏟️' },
        { nome: 'Grupo D Completo', descricao: 'Colete todas as figurinhas do Grupo D', icone: '🏟️' }
    ]

    for (const ach of conquistasPorGrupo) {
        if (!nomesExistentes.has(ach.nome)) {
            const meta = getAchievementMeta(ach.nome)
            await db.run(
                `INSERT INTO achievements (nome, descricao, icone, tipo, alvo, valor) VALUES (?, ?, ?, ?, ?, ?)`,
                [ach.nome, ach.descricao, ach.icone, meta.tipo, meta.alvo, meta.valor]
            )
        }
    }
}

async function garantirConquistasObrigatorias() {
    if (!db) return

    const result = await db.query(`SELECT id, nome FROM achievements`)
    const conquistasExistentes = new Map(
        (result.values || []).map((achievement: any) => [normalizarNomeConquista(achievement.nome), achievement.id])
    )
    const conquistas = [
        { nome: 'Primeira Figurinha', descricao: 'Colete sua primeira figurinha', icone: 'star' },
        { nome: 'Iniciante', descricao: 'Colete 10 figurinhas', icone: 'flag' },
        { nome: 'Colecionador', descricao: 'Colete 25 figurinhas', icone: 'albums' },
        { nome: 'Álbum em Construção', descricao: 'Colete 50 figurinhas', icone: 'construct' },
        { nome: 'Caçador de Raras', descricao: 'Colete 5 figurinhas raras', icone: 'search' },
        { nome: 'Especialista em Raras', descricao: 'Colete 15 figurinhas raras', icone: 'ribbon' },
        { nome: 'Brilho Inicial', descricao: 'Colete 3 figurinhas brilhantes', icone: 'sparkles' },
        { nome: 'Mestre das Brilhantes', descricao: 'Colete 10 figurinhas brilhantes', icone: 'diamond' },
        { nome: 'Álbum Quase Completo', descricao: 'Complete 80% do álbum', icone: 'book' },
        { nome: 'Campeão da Copa', descricao: 'Complete 100% do álbum', icone: 'trophy' },
        { nome: 'Grupo A Completo', descricao: 'Colete todas as figurinhas do Grupo A', icone: 'podium' },
        { nome: 'Grupo B Completo', descricao: 'Colete todas as figurinhas do Grupo B', icone: 'podium' },
        { nome: 'Grupo C Completo', descricao: 'Colete todas as figurinhas do Grupo C', icone: 'podium' },
        { nome: 'Grupo D Completo', descricao: 'Colete todas as figurinhas do Grupo D', icone: 'podium' }
    ]

    for (const achievement of conquistas) {
        const meta = getAchievementMeta(achievement.nome)
        const achievementId = conquistasExistentes.get(normalizarNomeConquista(achievement.nome))

        if (achievementId) {
            await db.run(
                `UPDATE achievements SET nome = ?, descricao = ?, icone = ?, tipo = ?, alvo = ?, valor = ? WHERE id = ?`,
                [normalizarNomeConquista(achievement.nome), achievement.descricao, achievement.icone, meta.tipo, meta.alvo, meta.valor, achievementId]
            )
            continue
        }

        await db.run(
            `INSERT INTO achievements (nome, descricao, icone, tipo, alvo, valor) VALUES (?, ?, ?, ?, ?, ?)`,
            [normalizarNomeConquista(achievement.nome), achievement.descricao, achievement.icone, meta.tipo, meta.alvo, meta.valor]
        )
    }
}

// ============ INSERIR FIGURINHAS ============
async function inserirFigurinhasIniciais() {
    if (!db) return

    const figurinhas = [
        // Grupo A - Brasil
        { id: 1, nome: 'Neymar Jr', selecao: 'Brasil', foto: 'https://images.hdqwalls.com/wallpapers/neymar-jr-fifa-world-cup-qatar-03.jpg', raridade: 'Brilhante', grupo: 'A' },
        { id: 2, nome: 'Vinicius Jr', selecao: 'Brasil', foto: 'https://th.bing.com/th/id/R.c25262870835a9c17483fe83813e1767?rik=z7l%2f7lsPeZIIwQ&pid=ImgRaw&r=0', raridade: 'Rara', grupo: 'A' },
        { id: 3, nome: 'Rodrygo', selecao: 'Brasil', foto: 'https://conteudo.imguol.com.br/c/esporte/43/2024/09/06/rodrygo-comemora-gol-em-brasil-x-equador-duelo-das-eliminatorias-1725675832843_v2_1x1.jpg', raridade: 'Comum', grupo: 'A' },
        { id: 4, nome: 'Lionel Messi', selecao: 'Argentina', foto: 'https://static.foxnews.com/foxnews.com/content/uploads/2022/12/lionel-messi1.jpg', raridade: 'Brilhante', grupo: 'A' },
        { id: 5, nome: 'Enzo Fernández', selecao: 'Argentina', foto: 'https://s2-ge.glbimg.com/InfNVoN3hGLdtEdNZOeOF0vsmWQ=/0x0:3866x2713/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2022/z/o/nVpAqkRHaYaA35owidlw/enzofernandez.jpg', raridade: 'Comum', grupo: 'A' },
        { id: 6, nome: 'Julián Álvarez', selecao: 'Argentina', foto: 'https://s2-oglobo.glbimg.com/Xk8SIafslRmvjNH4eBnkkPzpH4E=/1200x/smart/filters:cover():strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2026/g/a/Z2QenXS4eImFKCEiKHvg/113606570-atletico-madrids-argentine-forward-19-julian-alvarez-reacts-during-the-uefa-champions-le.jpg', raridade: 'Rara', grupo: 'A' },
        { id: 7, nome: 'Kylian Mbappé', selecao: 'França', foto: 'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/bltf952620424022964/639f4446b5425c668e5f7b82/GettyImages-1450088331.jpg', raridade: 'Brilhante', grupo: 'B' },
        { id: 8, nome: 'Antoine Griezmann', selecao: 'França', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIz3q3wnVBegjjr85Eu6zIDAwNqFFPY7syXAklOpCDwBeSpE9VPe8MZ-tt&s=10', raridade: 'Rara', grupo: 'B' },
        { id: 9, nome: 'Ousmane Dembélé', selecao: 'França', foto: 'https://s2-oglobo.glbimg.com/sMe8FP0ubzQwq6oixdszMuXYPEc=/0x0:2484x1656/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2025/A/T/GRY3cZTlW4HGnASV3WSw/112448127-paris-saint-germains-french-forward-ousmane-dembele-kisses-the-ballon-dor-award-duri.jpg', raridade: 'Comum', grupo: 'B' },
        { id: 10, nome: 'Kevin De Bruyne', selecao: 'Bélgica', foto: 'https://www.mancity.com/meta/media/dbjdl5hs/kdb-applause.jpg', raridade: 'Rara', grupo: 'B' },
        { id: 11, nome: 'Romelu Lukaku', selecao: 'Bélgica', foto: 'https://assets.goal.com/images/v3/blt15bcc33d1853cdc8/GettyImages-1497868809.jpg?auto=webp&format=pjpg&width=3840&quality=60', raridade: 'Comum', grupo: 'B' },
        { id: 12, nome: 'Harry Kane', selecao: 'Inglaterra', foto: 'https://s2-ge.glbimg.com/2FoPVwkNSR2RRA88e50r0OmKgDo=/0x0:2380x1586/984x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_bc8228b6673f488aa253bbcb03c80ec5/internal_photos/bs/2025/n/C/XfPN4gQwycJfiN8EVDdg/gettyimages-2247009837.jpg', raridade: 'Rara', grupo: 'B' },
        { id: 13, nome: 'Jude Bellingham', selecao: 'Inglaterra', foto: 'https://a.espncdn.com/photo/2023/1009/r1236154_1296x729_16-9.jpg', raridade: 'Brilhante', grupo: 'C' },
        { id: 14, nome: 'Bukayo Saka', selecao: 'Inglaterra', foto: 'https://www.arsenal.com/sites/default/files/styles/desktop_16x9/public/images/SAKA_Headshot_web_mxqw4vma.png?h=ad73a5fe&auto=webp&itok=_LFLVd4i', raridade: 'Rara', grupo: 'C' },
        { id: 15, nome: 'Cristiano Ronaldo', selecao: 'Portugal', foto: 'https://s2-monet.glbimg.com/sj2rub6OvBpKnCQG1ee3n_8jbKc=/0x0:3500x2335/1000x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_e7c91519bbbb4fadb4e509085746275d/internal_photos/bs/2025/V/p/rSTSLQT5AZw3nORUFKvQ/gettyimages-2247340680.jpg', raridade: 'Brilhante', grupo: 'C' },
        { id: 16, nome: 'Bruno Fernandes', selecao: 'Portugal', foto: 'https://www.365scores.com/pt-br/news/magazine/wp-content/uploads/2026/02/bruno-fernandes-scaled-e1770553394652-1024x577.jpg', raridade: 'Comum', grupo: 'C' },
        { id: 17, nome: 'Rafael Leão', selecao: 'Portugal', foto: 'https://assets.goal.com/images/v3/getty-2264203473/crop/MM5DKMBQGQ5DEOBRGU5G433XMU5DAORSGYYQ====/GettyImages-2264203473.jpg?auto=webp&format=pjpg&width=3840&quality=60', raridade: 'Rara', grupo: 'C' },
        { id: 18, nome: 'Luka Modric', selecao: 'Croácia', foto: 'https://s.yimg.com/ny/api/res/1.2/hsOn3w_sOihtXokKoImKsQ--/YXBwaWQ9aGlnaGxhbmRlcjt3PTY0MDtoPTQyNztjZj13ZWJw/https://media.zenfs.com/en/madrid_voice_articles_898/e65c96727a368756a5b328093f6e0f32', raridade: 'Brilhante', grupo: 'C' },
        { id: 19, nome: 'Robert Lewandowski', selecao: 'Polônia', foto: 'https://maquinadoesporte.com.br/wp-content/uploads/2025/11/Lewandowski-Barcelona.jpg', raridade: 'Brilhante', grupo: 'D' },
        { id: 20, nome: 'Jamal Musiala', selecao: 'Alemanha', foto: 'https://assets.dfb.de/uploads/000/327/837/custom_style_1_musiala.jpg?1765476781', raridade: 'Rara', grupo: 'D' },
        { id: 21, nome: 'Florian Wirtz', selecao: 'Alemanha', foto: 'https://www.newsday.com/_next/image?url=https%3A%2F%2Fcdn.newsday.com%2Fimage-service%2Fversion%2Fc%3AYzI5ZTY5N2MtNTBmMS00%3AMzU2NTFlZDYtOTYwZi00%2Fcopy-of-britain-premier-league-soccer.jpeg%3Ff%3DLandscape%2B16%253A9%26w%3D770%26q%3D1&w=1920&q=80', raridade: 'Rara', grupo: 'D' },
        { id: 22, nome: 'Pedri', selecao: 'Espanha', foto: 'https://assets.goal.com/images/v3/getty-2243475324/crop/MM5DIMBQGA5DEMRVGA5G433XMU5DKMJRHIYTSMQ=/GettyImages-2243475324.jpg?auto=webp&format=pjpg&width=3840&quality=60', raridade: 'Rara', grupo: 'D' },
        { id: 23, nome: 'Lamine Yamal', selecao: 'Espanha', foto: 'https://s2-oglobo.glbimg.com/72UMNjineKVB2nmbuQdXFLfUP9k=/0x0:3800x2534/888x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_da025474c0c44edd99332dddb09cabe8/internal_photos/bs/2026/4/2/pTfzr6TiALBuSxosefqQ/113430101-barcelonas-spanish-forward-10-lamine-yamal-reacts-during-the-spanish-league-football-mat.jpg', raridade: 'Brilhante', grupo: 'D' },
        { id: 24, nome: 'Álvaro Morata', selecao: 'Espanha', foto: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQx77ynD1ALG8ps66Mo9bixKrARcJ1PpBnt0CDgvuY1w7pzhIY6HpsOkR7z&s=10', raridade: 'Comum', grupo: 'D' }
    ]

    for (const fig of figurinhas) {
        await db.run(
            `INSERT INTO figurinhas (id, nome, selecao, foto, raridade, grupo)
             VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET
                nome = excluded.nome,
                selecao = excluded.selecao,
                foto = excluded.foto,
                raridade = excluded.raridade,
                grupo = excluded.grupo`,
            [fig.id, fig.nome, fig.selecao, fig.foto, fig.raridade, fig.grupo]
        )
    }
    console.log('✅ Dados iniciais das figurinhas inseridos!')
}

// ============ FUNÇÕES EXPORTADAS ============

export async function initDatabase() {
    try {
        await ensureDatabase()
    } catch (error) {
        console.error('❌ Erro ao iniciar DB:', error)
        throw error
    }
}

// ============ FUNÇÕES DE USUÁRIO ============

export async function addUsuario(nome: string, email: string, senha: string) {
    await ensureDatabase()
    const query = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`
    await getDb().run(query, [nome, email, senha])
}

export async function findUsuarioByEmail(email: string) {
    await ensureDatabase()
    const query = `SELECT * FROM usuarios WHERE email = ?`
    const result = await getDb().query(query, [email])
    return result.values?.[0] || null
}

export async function realizarLogin(email: string, senha: string) {
    await ensureDatabase()
    const query = `SELECT * FROM usuarios WHERE email = ? AND senha = ?`
    const result = await getDb().query(query, [email, senha])
    return result.values?.[0] || null
}

export async function listUsuarios() {
    await ensureDatabase()
    const result = await getDb().query(`SELECT * FROM usuarios`)
    return result.values || []
}

export async function deleteUsuarioById(id: number) {
    await ensureDatabase()
    const query = `DELETE FROM usuarios WHERE id = ?`
    return await getDb().run(query, [id])
}

export async function updateUsuario(id: number, nome: string, email: string, senha: string) {
    await ensureDatabase()
    const query = `UPDATE usuarios SET nome = ?, email = ?, senha = ? WHERE id = ?`
    await getDb().run(query, [nome, email, senha, id])
}

// ============ FUNÇÕES DE CONTATO ============

export async function addContato(nome: string, email: string, telefone: string) {
    await ensureDatabase()
    const query = `INSERT INTO contato (nome, email, telefone) VALUES (?, ?, ?)`
    await getDb().run(query, [nome, email, telefone])
}

export async function listContatos() {
    await ensureDatabase()
    const result = await getDb().query(`SELECT * FROM contato ORDER BY nome`)
    return result.values || []
}

export async function deletarContato(id: number) {
    await ensureDatabase()
    const query = `DELETE FROM contato WHERE id = ?`
    return await getDb().run(query, [id])
}

export async function findContatoById(id: number) {
    await ensureDatabase()
    const query = `SELECT * FROM contato WHERE id = ?`
    const result = await getDb().query(query, [id])
    return result.values?.[0] || null
}

export async function updateContato(id: number, nome: string, email: string, telefone: string) {
    await ensureDatabase()
    const query = `UPDATE contato SET nome = ?, email = ?, telefone = ? WHERE id = ?`
    await getDb().run(query, [nome, email, telefone, id])
}

// ============ FUNÇÕES DE COLEÇÃO ============

export async function toggleFigurinhaColetada(usuarioId: number, figurinhaId: number) {
    await ensureDatabase()
    let foiColetada = false
    
    const checkResult = await getDb().query(
        `SELECT * FROM colecao WHERE usuario_id = ? AND figurinha_id = ?`,
        [usuarioId, figurinhaId]
    )
    
    if (checkResult.values && checkResult.values.length > 0) {
        const currentStatus = checkResult.values[0].coletada
        const newStatus = currentStatus === 1 ? 0 : 1
        await getDb().run(
            `UPDATE colecao SET coletada = ? WHERE usuario_id = ? AND figurinha_id = ?`,
            [newStatus, usuarioId, figurinhaId]
        )
        foiColetada = newStatus === 1
    } else {
        await getDb().run(
            `INSERT INTO colecao (usuario_id, figurinha_id, coletada) VALUES (?, ?, 1)`,
            [usuarioId, figurinhaId]
        )
        foiColetada = true
    }

    await verificarEAtualizarAchievements(usuarioId)
    return foiColetada
}

export async function getColecaoDoUsuario(usuarioId: number) {
    await ensureDatabase()
    const query = `
        SELECT f.*, COALESCE(c.coletada, 0) as coletada
        FROM figurinhas f
        LEFT JOIN colecao c ON c.figurinha_id = f.id AND c.usuario_id = ?
        ORDER BY f.id
    `
    const result = await getDb().query(query, [usuarioId])
    return result.values || []
}

export async function getFigurinhasColetadas(usuarioId: number) {
    await ensureDatabase()
    const query = `
        SELECT f.*, c.coletada
        FROM figurinhas f
        INNER JOIN colecao c ON c.figurinha_id = f.id AND c.usuario_id = ?
        WHERE c.coletada = 1
        ORDER BY f.id
    `
    const result = await getDb().query(query, [usuarioId])
    return result.values || []
}

export async function getFigurinhasPendentes(usuarioId: number) {
    await ensureDatabase()
    const query = `
        SELECT f.*, COALESCE(c.coletada, 0) as coletada
        FROM figurinhas f
        LEFT JOIN colecao c ON c.figurinha_id = f.id AND c.usuario_id = ?
        WHERE c.coletada IS NULL OR c.coletada = 0
        ORDER BY f.id
    `
    const result = await getDb().query(query, [usuarioId])
    return result.values || []
}

export async function buscarFigurinhas(usuarioId: number, termo: string) {
    await ensureDatabase()
    const query = `
        SELECT f.*, COALESCE(c.coletada, 0) as coletada
        FROM figurinhas f
        LEFT JOIN colecao c ON c.figurinha_id = f.id AND c.usuario_id = ?
        WHERE f.nome LIKE ? OR f.selecao LIKE ?
        ORDER BY f.id
    `
    const result = await getDb().query(query, [usuarioId, `%${termo}%`, `%${termo}%`])
    return result.values || []
}

export async function getEstatisticas(usuarioId: number) {
    await ensureDatabase()
    const query = `
        SELECT 
            COUNT(f.id) as total,
            SUM(CASE WHEN c.coletada = 1 THEN 1 ELSE 0 END) as coletadas
        FROM figurinhas f
        LEFT JOIN colecao c ON c.figurinha_id = f.id AND c.usuario_id = ?
    `
    const result = await getDb().query(query, [usuarioId])
    const stats = result.values?.[0] || { total: 0, coletadas: 0 }
    return {
        total: stats.total || 0,
        coletadas: stats.coletadas || 0,
        porcentagem: stats.total > 0 ? Math.round((stats.coletadas / stats.total) * 100) : 0
    }
}

// ============ FUNÇÕES DE CONQUISTAS ============

export async function getStatsUsuario(usuarioId: number) {
    await ensureDatabase()
    const query = `
        SELECT 
            COUNT(f.id) as total_figurinhas,
            SUM(CASE WHEN c.coletada = 1 THEN 1 ELSE 0 END) as coletadas,
            SUM(CASE WHEN c.coletada = 1 AND f.raridade = 'Rara' THEN 1 ELSE 0 END) as raras_coletadas,
            SUM(CASE WHEN c.coletada = 1 AND f.raridade = 'Brilhante' THEN 1 ELSE 0 END) as brilhantes_coletadas
        FROM figurinhas f
        LEFT JOIN colecao c ON c.figurinha_id = f.id AND c.usuario_id = ?
    `
    const result = await getDb().query(query, [usuarioId])
    const stats = result.values?.[0] || { 
        total_figurinhas: 0, 
        coletadas: 0, 
        raras_coletadas: 0, 
        brilhantes_coletadas: 0 
    }
    
    const total = stats.total_figurinhas || 0
    const coletadas = stats.coletadas || 0
    const percentual = total > 0 ? Math.round((coletadas / total) * 100) : 0
    
    return {
        total,
        coletadas,
        raras: stats.raras_coletadas || 0,
        brilhantes: stats.brilhantes_coletadas || 0,
        percentual
    }
}

export async function getAchievements(usuarioId: number) {
    await ensureDatabase()
    const query = `
        SELECT a.id, a.nome, a.descricao, a.icone, a.tipo, a.alvo, a.valor,
               CASE WHEN ua.id IS NOT NULL THEN 1 ELSE 0 END as desbloqueada,
               ua.data_desbloqueio
        FROM achievements a
        LEFT JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ?
        ORDER BY a.id
    `
    const result = await getDb().query(query, [usuarioId])
    return result.values || []
}

export async function getAchievementsDesbloqueadas(usuarioId: number) {
    await ensureDatabase()
    const query = `
        SELECT a.id, a.nome, a.descricao, a.icone, a.tipo, a.alvo, a.valor, ua.data_desbloqueio
        FROM achievements a
        INNER JOIN user_achievements ua ON ua.achievement_id = a.id AND ua.user_id = ?
        ORDER BY ua.data_desbloqueio DESC
    `
    const result = await getDb().query(query, [usuarioId])
    return result.values || []
}

export async function verificarEAtualizarAchievements(usuarioId: number) {
    await ensureDatabase()

    const stats = await getStatsUsuario(usuarioId)
    const achievements = await getDb().query(`SELECT * FROM achievements`)
    let novasDesbloqueadas = 0

    for (const achievement of achievements.values || []) {
        const meta = achievement.tipo && Number(achievement.valor) > 0
            ? achievement
            : getAchievementMeta(achievement.nome)
        const desbloqueada = await conquistaFoiAlcancada(usuarioId, meta, stats)

        if (!desbloqueada) {
            continue
        }

        const checkResult = await getDb().query(
            `SELECT id FROM user_achievements WHERE user_id = ? AND achievement_id = ?`,
            [usuarioId, achievement.id]
        )

        if (!checkResult.values || checkResult.values.length === 0) {
            await getDb().run(
                `INSERT INTO user_achievements (user_id, achievement_id, data_desbloqueio)
                 VALUES (?, ?, CURRENT_TIMESTAMP)`,
                [usuarioId, achievement.id]
            )
            novasDesbloqueadas++
        }
    }

    return {
        achievements: await getAchievements(usuarioId),
        novasDesbloqueadas
    }
}

async function conquistaFoiAlcancada(usuarioId: number, achievement: any, stats: any) {
    const valor = Number(achievement.valor || 0)

    if (achievement.tipo === 'total') {
        return stats.coletadas >= valor
    }

    if (achievement.tipo === 'raras') {
        return stats.raras >= valor
    }

    if (achievement.tipo === 'brilhantes') {
        return stats.brilhantes >= valor
    }

    if (achievement.tipo === 'percentual') {
        return stats.percentual >= valor
    }

    if (achievement.tipo === 'grupo' && achievement.alvo) {
        const result = await getDb().query(
            `SELECT
                COUNT(f.id) as total,
                SUM(CASE WHEN c.coletada = 1 THEN 1 ELSE 0 END) as coletadas
             FROM figurinhas f
             LEFT JOIN colecao c ON c.figurinha_id = f.id AND c.usuario_id = ?
             WHERE f.grupo = ?`,
            [usuarioId, achievement.alvo]
        )
        const grupo = result.values?.[0] || { total: 0, coletadas: 0 }
        return Number(grupo.total || 0) > 0 && Number(grupo.total || 0) === Number(grupo.coletadas || 0)
    }

    return false
}
