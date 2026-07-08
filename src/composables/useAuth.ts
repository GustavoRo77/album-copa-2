// src/composables/useAuth.ts
import { ref } from 'vue'
import { 
    addUsuario, 
    realizarLogin, 
    findUsuarioByEmail,
    listUsuarios 
} from '../services/database'

const currentUser = ref<any>(null)
const errorMessage = ref<string>('')
const usuarios = ref<any[]>([])

export function useAuth() {
    const login = async (email: string, password: string): Promise<boolean> => {
        errorMessage.value = ''

        if (!email || !password) {
            errorMessage.value = 'Preencha todos os campos'
            return false
        }

        try {
            const user = await realizarLogin(email, password)
            
            if (user) {
                // GARANTIR QUE O ID SEJA NÚMERO
                currentUser.value = {
                    ...user,
                    id: Number(user.id)
                }
                console.log('👤 Usuário logado:', currentUser.value)
                return true
            } else {
                errorMessage.value = 'E-mail ou senha inválidos'
                return false
            }
        } catch (error) {
            console.error('Erro no login:', error)
            errorMessage.value = 'Erro ao realizar login'
            return false
        }
    }

    const register = async (name: string, email: string, password: string): Promise<boolean> => {
        errorMessage.value = ''

        if (!name || !email || !password) {
            errorMessage.value = 'Preencha todos os campos'
            return false
        }

        if (password.length < 6) {
            errorMessage.value = 'A senha deve ter pelo menos 6 caracteres'
            return false
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            errorMessage.value = 'E-mail inválido'
            return false
        }

        try {
            const userExists = await findUsuarioByEmail(email)
            
            if (userExists) {
                errorMessage.value = 'E-mail já cadastrado'
                return false
            }

            await addUsuario(name, email, password)
            
            const user = await realizarLogin(email, password)
            if (user) {
                currentUser.value = {
                    ...user,
                    id: Number(user.id)
                }
            }
            
            return true
        } catch (error) {
            console.error('Erro no cadastro:', error)
            errorMessage.value = 'Erro ao realizar cadastro'
            return false
        }
    }

    const resetPassword = async (email: string): Promise<boolean> => {
        errorMessage.value = ''

        if (!email) {
            errorMessage.value = 'Digite seu e-mail'
            return false
        }

        try {
            const user = await findUsuarioByEmail(email)
            
            if (user) {
                console.log(`📧 E-mail de recuperação enviado para ${email}`)
                return true
            } else {
                errorMessage.value = 'E-mail não encontrado'
                return false
            }
        } catch (error) {
            console.error('Erro na recuperação:', error)
            errorMessage.value = 'Erro ao enviar e-mail'
            return false
        }
    }

    const logout = () => {
        currentUser.value = null
    }

    const carregarUsuarios = async () => {
        try {
            usuarios.value = await listUsuarios()
        } catch (error) {
            console.error('Erro ao carregar usuários:', error)
        }
    }

    return {
        currentUser,
        errorMessage,
        usuarios,
        login,
        register,
        resetPassword,
        logout,
        carregarUsuarios
    }
}