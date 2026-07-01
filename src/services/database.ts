// src/services/database.ts
import { CapacitorSQLite, SQLiteConnection, SQLiteDBConnection } from '@capacitor-community/sqlite';

const dbName = 'album_copa_db'
let db: SQLiteDBConnection | null = null
let initialized = false
const sqliteConnection = new SQLiteConnection(CapacitorSQLite)

// ============ FUNÇÕES INTERNAS ============

async function ensureDatabase() {
    if (initialized && db) {
        return
    }
   
    if (!db) {
        db = await sqliteConnection.createConnection(dbName, false, 'no-encryption', 1, false)
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

    // Inserir dados iniciais das figurinhas se não existirem
    const result = await db.query(`SELECT COUNT(*) as total FROM figurinhas`)
    const count = result?.values?.[0]?.total || 0
    
    if (count === 0) {
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

async function inserirFigurinhasIniciais() {
    if (!db) return

    const figurinhas = [
        // Grupo A - Brasil
        { id: 1, nome: 'Neymar Jr', selecao: 'Brasil', foto: 'https://images.hdqwalls.com/wallpapers/neymar-jr-fifa-world-cup-qatar-03.jpg', raridade: 'Brilhante', grupo: 'A' },
        { id: 2, nome: 'Vinicius Jr', selecao: 'Brasil', foto: 'https://th.bing.com/th/id/R.c25262870835a9c17483fe83813e1767?rik=z7l%2f7lsPeZIIwQ&pid=ImgRaw&r=0', raridade: 'Rara', grupo: 'A' },
        { id: 3, nome: 'Rodrygo', selecao: 'Brasil', foto: 'https://randomuser.me/api/portraits/men/3.jpg', raridade: 'Comum', grupo: 'A' },
        
        // Grupo A - Argentina
        { id: 4, nome: 'Lionel Messi', selecao: 'Argentina', foto: 'https://static.foxnews.com/foxnews.com/content/uploads/2022/12/lionel-messi1.jpg', raridade: 'Brilhante', grupo: 'A' },
        { id: 5, nome: 'Enzo Fernández', selecao: 'Argentina', foto: 'https://randomuser.me/api/portraits/men/5.jpg', raridade: 'Comum', grupo: 'A' },
        { id: 6, nome: 'Julián Álvarez', selecao: 'Argentina', foto: 'https://randomuser.me/api/portraits/men/6.jpg', raridade: 'Rara', grupo: 'A' },
        
        // Grupo B - França
        { id: 7, nome: 'Kylian Mbappé', selecao: 'França', foto: 'https://assets.goal.com/v3/assets/bltcc7a7ffd2fbf71f5/bltf952620424022964/639f4446b5425c668e5f7b82/GettyImages-1450088331.jpg', raridade: 'Brilhante', grupo: 'B' },
        { id: 8, nome: 'Antoine Griezmann', selecao: 'França', foto: 'https://randomuser.me/api/portraits/men/8.jpg', raridade: 'Rara', grupo: 'B' },
        { id: 9, nome: 'Ousmane Dembélé', selecao: 'França', foto: 'https://randomuser.me/api/portraits/men/9.jpg', raridade: 'Comum', grupo: 'B' },
        
        // Grupo B - Bélgica
        { id: 10, nome: 'Kevin De Bruyne', selecao: 'Bélgica', foto: 'https://randomuser.me/api/portraits/men/10.jpg', raridade: 'Rara', grupo: 'B' },
        { id: 11, nome: 'Romelu Lukaku', selecao: 'Bélgica', foto: 'https://randomuser.me/api/portraits/men/11.jpg', raridade: 'Comum', grupo: 'B' },
        { id: 12, nome: 'Harry Kane', selecao: 'Inglaterra', foto: 'https://randomuser.me/api/portraits/men/12.jpg', raridade: 'Rara', grupo: 'B' },
        
        // Grupo C - Inglaterra
        { id: 13, nome: 'Jude Bellingham', selecao: 'Inglaterra', foto: 'https://randomuser.me/api/portraits/men/13.jpg', raridade: 'Brilhante', grupo: 'C' },
        { id: 14, nome: 'Bukayo Saka', selecao: 'Inglaterra', foto: 'https://randomuser.me/api/portraits/men/14.jpg', raridade: 'Rara', grupo: 'C' },
        
        // Grupo C - Portugal
        { id: 15, nome: 'Cristiano Ronaldo', selecao: 'Portugal', foto: 'https://s2-monet.glbimg.com/sj2rub6OvBpKnCQG1ee3n_8jbKc=/0x0:3500x2335/1000x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_e7c91519bbbb4fadb4e509085746275d/internal_photos/bs/2025/V/p/rSTSLQT5AZw3nORUFKvQ/gettyimages-2247340680.jpg', raridade: 'Brilhante', grupo: 'C' },
        { id: 16, nome: 'Bruno Fernandes', selecao: 'Portugal', foto: 'https://randomuser.me/api/portraits/men/16.jpg', raridade: 'Comum', grupo: 'C' },
        { id: 17, nome: 'Rafael Leão', selecao: 'Portugal', foto: 'https://randomuser.me/api/portraits/men/17.jpg', raridade: 'Rara', grupo: 'C' },
        
        // Grupo C - Croácia
        { id: 18, nome: 'Luka Modric', selecao: 'Croácia', foto: 'https://randomuser.me/api/portraits/men/18.jpg', raridade: 'Brilhante', grupo: 'C' },
        
        // Grupo D - Polônia
        { id: 19, nome: 'Robert Lewandowski', selecao: 'Polônia', foto: 'https://randomuser.me/api/portraits/men/19.jpg', raridade: 'Brilhante', grupo: 'D' },
        
        // Grupo D - Alemanha
        { id: 20, nome: 'Jamal Musiala', selecao: 'Alemanha', foto: 'https://randomuser.me/api/portraits/men/20.jpg', raridade: 'Rara', grupo: 'D' },
        { id: 21, nome: 'Florian Wirtz', selecao: 'Alemanha', foto: 'https://randomuser.me/api/portraits/men/21.jpg', raridade: 'Rara', grupo: 'D' },
        
        // Grupo D - Espanha
        { id: 22, nome: 'Pedri', selecao: 'Espanha', foto: 'https://randomuser.me/api/portraits/men/22.jpg', raridade: 'Rara', grupo: 'D' },
        { id: 23, nome: 'Lamine Yamal', selecao: 'Espanha', foto: 'https://randomuser.me/api/portraits/men/23.jpg', raridade: 'Brilhante', grupo: 'D' },
        { id: 24, nome: 'Álvaro Morata', selecao: 'Espanha', foto: 'https://randomuser.me/api/portraits/men/24.jpg', raridade: 'Comum', grupo: 'D' }
    ]

    for (const fig of figurinhas) {
        await db.execute(
            `INSERT INTO figurinhas (id, nome, selecao, foto, raridade, grupo)
             VALUES (?, ?, ?, ?, ?, ?)`,
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

export async function listUsuarios() {
    await ensureDatabase()
    const result = await getDb().query(`SELECT * FROM usuarios`)
    return result.values || []
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

export async function deletarContato(id: number) {
    await ensureDatabase()
    const query = `DELETE FROM contato WHERE id = ?`
    return await getDb().run(query, [id])
}

// ============ FUNÇÕES DE FIGURINHAS ============

export async function listFigurinhas() {
    await ensureDatabase()
    const result = await getDb().query(`SELECT * FROM figurinhas ORDER BY id`)
    return result.values || []
}

export async function getFigurinhaById(id: number) {
    await ensureDatabase()
    const query = `SELECT * FROM figurinhas WHERE id = ?`
    const result = await getDb().query(query, [id])
    return result.values?.[0] || null
}

// ============ FUNÇÕES DE COLEÇÃO ============

export async function toggleFigurinhaColetada(usuarioId: number, figurinhaId: number) {
    await ensureDatabase()
    
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
        return newStatus === 1
    } else {
        await getDb().run(
            `INSERT INTO colecao (usuario_id, figurinha_id, coletada) VALUES (?, ?, 1)`,
            [usuarioId, figurinhaId]
        )
        return true
    }
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