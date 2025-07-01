import { createStore } from "vuex"

const API_URL = "https://doveapi-3.onrender.com"

// Helper function to check if server is running
async function checkServerConnection() {
  try {
    const response = await fetch(`${API_URL}/users?_limit=1`)
    return response.ok
  } catch (error) {
    return false
  }
}

export default createStore({
  state: {
    user: null,
    loading: false,
    loadingMessage: "",
    toast: {
      show: false,
      message: "",
      type: "success",
      timeoutId: null,
    },
    sessions: [],
    codes: [],
    serverConnected: true,
  },

  mutations: {
    setUser(state, user) {
      state.user = user
    },
  
  updateUserGenerations(state, count) {
    if (state.user) {
      state.user.generationsLeft = count
    }
  },
  showToast(state, { message, type = 'success', duration = null }) {
    // Clear any existing toast
    if (state.toast.timeoutId) {
      clearTimeout(state.toast.timeoutId)
    }

    state.toast = {
      show: true,
      message,
      type
    }

    // Set different durations based on type (faster timers)
    const defaultDurations = {
      'success': 1500,  // 1.5 seconds (was 2)
      'info': 1200,     // 1.2 seconds (was 1.5)
      'warning': 2500,  // 2.5 seconds (was 3)
      'error': 3000     // 3 seconds (was 4)
    }

    const timeoutDuration = duration || defaultDurations[type] || 2000

    const timeoutId = setTimeout(() => {
      state.toast.show = false
      state.toast.timeoutId = null
    }, timeoutDuration)

    state.toast.timeoutId = timeoutId
  },

  hideToast(state) {
    if (state.toast.timeoutId) {
      clearTimeout(state.toast.timeoutId)
    }
    state.toast.show = false
    state.toast.timeoutId = null
  },
    setLoading(state, { loading, message = "" }) {
      state.loading = loading
      state.loadingMessage = message
    },
    updateUser(state, userData) {
      state.user = { ...state.user, ...userData }
    },
    updateUserGenerations(state, count) {
      if (state.user) {
        state.user.generationsLeft = count
      }
    },
    setCodes(state, codes) {
      state.codes = codes
    },
    addCode(state, code) {
      state.codes.push(code)
    },
    removeCode(state, codeId) {
      state.codes = state.codes.filter((code) => code.id !== codeId)
    },
    updateCode(state, updatedCode) {
      const index = state.codes.findIndex((code) => code.id === updatedCode.id)
      if (index !== -1) {
        state.codes.splice(index, 1, updatedCode)
      }
    },
    setServerConnection(state, connected) {
      state.serverConnected = connected
    },
  },

  actions: {
    // Check server connection
    async checkConnection({ commit }) {
      const connected = await checkServerConnection()
      commit("setServerConnection", connected)
      if (!connected) {
        commit("showToast", {
          message: "Cannot connect to server. Please make sure JSON server is running on port 3001.",
          type: "error",
        })
      }
      return connected
    },

    // Initialize auth state
    async initAuth({ commit, dispatch }) {
      try {
        // First check if server is running
        const serverRunning = await dispatch("checkConnection")
        if (!serverRunning) {
          console.warn("Server not running, skipping auth initialization")
          return
        }

        const savedUser = localStorage.getItem("dove_notion_user")
        if (savedUser) {
          const user = JSON.parse(savedUser)
          // Verify user still exists on server
          const response = await fetch(`${API_URL}/users/${user.id}`)
          if (response.ok) {
            const currentUser = await response.json()
            commit("setUser", currentUser)
            localStorage.setItem("dove_notion_user", JSON.stringify(currentUser))
          } else {
            localStorage.removeItem("dove_notion_user")
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error)
        localStorage.removeItem("dove_notion_user")
        commit("showToast", {
          message: "Failed to initialize authentication. Please check your connection.",
          type: "error",
        })
      }
    },

    // User Authentication Actions
    async login({ commit, dispatch }, { email, password }) {
      commit("setLoading", { loading: true, message: "Signing in..." })

      try {
        // Check server connection first
        const serverRunning = await dispatch("checkConnection")
        if (!serverRunning) {
          throw new Error("Cannot connect to server. Please make sure the server is running.")
        }

        const response = await fetch(`${API_URL}/users?email=${email}`)

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`)
        }

        const users = await response.json()
        const user = users.find((u) => u.email === email && u.password === password)

        if (user) {
          const updatedUser = {
            ...user,
            lastLoginAt: new Date().toISOString(),
          }

          await fetch(`${API_URL}/users/${user.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lastLoginAt: updatedUser.lastLoginAt }),
          })

          commit("setUser", updatedUser)
          localStorage.setItem("dove_notion_user", JSON.stringify(updatedUser))
          commit("showToast", { message: "Welcome back!", type: "success" })
          return { success: true, user: updatedUser }
        }

        throw new Error("Invalid email or password")
      } catch (error) {
        console.error("Login error:", error)
        let errorMessage = error.message

        if (error.message.includes("ERR_CONNECTION_REFUSED")) {
          errorMessage = "Cannot connect to server. Please make sure JSON server is running on port 3001."
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage = "Network error. Please check your connection and server status."
        }

        commit("showToast", {
          message: errorMessage,
          type: "error",
        })
        return { success: false, error: errorMessage }
      } finally {
        commit("setLoading", { loading: false })
      }
    },

    async signup({ commit, dispatch }, userData) {
      commit("setLoading", { loading: true, message: "Creating account..." })

      try {
        // Check server connection first
        const serverRunning = await dispatch("checkConnection")
        if (!serverRunning) {
          throw new Error("Cannot connect to server. Please make sure the server is running.")
        }

        // Check for existing email
        const emailCheck = await fetch(`${API_URL}/users?email=${userData.email}`)
        if (!emailCheck.ok) {
          throw new Error(`Server error: ${emailCheck.status}`)
        }

        const existingUsers = await emailCheck.json()

        if (existingUsers.length > 0) {
          throw new Error("Email already registered")
        }

        const newUser = {
          ...userData,
          id: Date.now().toString(),
          generationsLeft: 3,
          subscription: "free",
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
        }

        const createResponse = await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        })

        if (!createResponse.ok) throw new Error("Failed to create account")
        const user = await createResponse.json()

        // Create session
        await fetch(`${API_URL}/sessions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: Date.now().toString(),
            userId: user.id,
            createdAt: new Date().toISOString(),
          }),
        })

        commit("showToast", { message: "Account created successfully!", type: "success" })
        return { success: true, user }
      } catch (error) {
        console.error("Signup error:", error)
        let errorMessage = error.message

        if (error.message.includes("ERR_CONNECTION_REFUSED")) {
          errorMessage = "Cannot connect to server. Please make sure JSON server is running on port 3001."
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage = "Network error. Please check your connection and server status."
        }

        commit("showToast", { message: errorMessage, type: "error" })
        return { success: false, error: errorMessage }
      } finally {
        commit("setLoading", { loading: false })
      }
    },

    // User Profile Management
    async updateProfile({ commit, state }, updatedData) {
      if (!state.user) throw new Error("No user logged in")

      try {
        const response = await fetch(`${API_URL}/users/${state.user.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        })
        if (!response.ok) throw new Error("Failed to update profile")
        const updatedUser = await response.json()
        commit("updateUser", updatedUser)
        localStorage.setItem("dove_notion_user", JSON.stringify(updatedUser))
        commit("showToast", { message: "Profile updated successfully", type: "success" })
        return { success: true, user: updatedUser }
      } catch (error) {
        commit("showToast", { message: error.message, type: "error" })
        return { success: false, error: error.message }
      }
    },

    // QR Code Management
    async createCode({ commit, state }, codeData) {
      if (!state.user) throw new Error("No user logged in")

      try {
        const newCode = {
          ...codeData,
          id: Date.now().toString(),
          userId: state.user.id,
          createdAt: new Date().toISOString(),
        }
        const response = await fetch(`${API_URL}/codes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newCode),
        })
        if (!response.ok) throw new Error("Failed to create code")
        const code = await response.json()
        commit("addCode", code)
        commit("showToast", { message: "Code created successfully", type: "success" })
        return { success: true, code }
      } catch (error) {
        commit("showToast", { message: error.message, type: "error" })
        return { success: false, error: error.message }
      }
    },

    async getUserCodes({ commit, state }) {
      if (!state.user) throw new Error("No user logged in")

      try {
        const response = await fetch(`${API_URL}/codes?userId=${state.user.id}`)
        if (!response.ok) throw new Error("Failed to fetch codes")
        const codes = await response.json()
        commit("setCodes", codes)
        return { success: true, codes }
      } catch (error) {
        commit("showToast", { message: error.message, type: "error" })
        return { success: false, error: error.message }
      }
    },

    async updateCode({ commit }, { id, updates }) {
      try {
        const response = await fetch(`${API_URL}/codes/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updates),
        })
        if (!response.ok) throw new Error("Failed to update code")
        const updatedCode = await response.json()
        commit("updateCode", updatedCode)
        commit("showToast", { message: "Code updated successfully", type: "success" })
        return { success: true, code: updatedCode }
      } catch (error) {
        commit("showToast", { message: error.message, type: "error" })
        return { success: false, error: error.message }
      }
    },

    async deleteCode({ commit }, id) {
      try {
        const response = await fetch(`${API_URL}/codes/${id}`, {
          method: "DELETE",
        })
        if (!response.ok) throw new Error("Failed to delete code")
        commit("removeCode", id)
        commit("showToast", { message: "Code deleted successfully", type: "success" })
        return { success: true }
      } catch (error) {
        commit("showToast", { message: error.message, type: "error" })
        return { success: false, error: error.message }
      }
    },

    // Session Management
    async logout({ commit, state }) {
      if (state.user) {
        try {
          const sessions = await fetch(`${API_URL}/sessions?userId=${state.user.id}`)
          if (sessions.ok) {
            const userSessions = await sessions.json()
            // Delete all user sessions
            await Promise.all(
              userSessions.map((session) => fetch(`${API_URL}/sessions/${session.id}`, { method: "DELETE" })),
            )
          }

          commit("setUser", null)
          commit("setCodes", [])
          localStorage.removeItem("dove_notion_user")
          commit("showToast", { message: "Logged out successfully", type: "success" })
          return { success: true }
        } catch (error) {
          // Even if server request fails, still logout locally
          commit("setUser", null)
          commit("setCodes", [])
          localStorage.removeItem("dove_notion_user")
          commit("showToast", { message: "Logged out locally", type: "success" })
          return { success: true }
        }
      }
    },
  },
})
