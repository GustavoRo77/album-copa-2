import { ref } from 'vue'
import type { User } from '../types'

const STORAGE_KEY = 'album_copa_users'
const SESSION_KEY = 'album_copa_session'

function loadUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveUsers(users: User[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

function loadSession(): User | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const users = ref<User[]>(loadUsers())
const currentUser = ref<User | null>(loadSession())
const errorMessage = ref<string>('')

export function useAuth() {
  const login = (email: string, password: string): boolean => {
    errorMessage.value = ''

    if (!email || !password) {
      errorMessage.value = 'Preencha todos os campos'
      return false
    }

    const user = users.value.find(u => u.email === email && u.password === password)

    if (user) {
      currentUser.value = user
      localStorage.setItem(SESSION_KEY, JSON.stringify(user))
      return true
    } else {
      errorMessage.value = 'E-mail ou senha inválidos'
      return false
    }
  }

  const register = (name: string, email: string, password: string): boolean => {
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

    const userExists = users.value.some(u => u.email === email)
    if (userExists) {
      errorMessage.value = 'E-mail já cadastrado'
      return false
    }

    const newUser: User = {
      id: Date.now().toString(),
      name,
      email,
      password
    }

    users.value.push(newUser)
    saveUsers(users.value)
    currentUser.value = newUser
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser))
    return true
  }

  const resetPassword = (email: string): boolean => {
    errorMessage.value = ''

    if (!email) {
      errorMessage.value = 'Digite seu e-mail'
      return false
    }

    const user = users.value.find(u => u.email === email)

    if (user) {
      return true
    } else {
      errorMessage.value = 'E-mail não encontrado'
      return false
    }
  }

  const logout = () => {
    currentUser.value = null
    localStorage.removeItem(SESSION_KEY)
  }

  return {
    currentUser,
    users,
    errorMessage,
    login,
    register,
    resetPassword,
    logout
  }
}
