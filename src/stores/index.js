import { createStore } from "vuex"

const API_URL = "https://683efaf01cd60dca33ddd10d.mockapi.io"

// Helper function to check if server is running
async function checkServerConnection() {
  try {
    const response = await fetch(`${API_URL}/books`)
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

  getters: {
    apiUrl: () => API_URL,
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
          message: "Cannot connect to MockAPI server. Please check your internet connection.",
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
          const response = await fetch(`${API_URL}/books/${user.id}`)
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

        const response = await fetch(`${API_URL}/books`)

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

          await fetch(`${API_URL}/books/${user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              ...user,
              lastLoginAt: updatedUser.lastLoginAt 
            }),
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
          errorMessage = "Cannot connect to MockAPI server. Please check your internet connection."
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage = "Network error. Please check your connection and MockAPI server status."
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
        const emailCheck = await fetch(`${API_URL}/books`)
        if (!emailCheck.ok) {
          throw new Error(`Server error: ${emailCheck.status}`)
        }

        const allUsers = await emailCheck.json()
        const existingUsers = allUsers.filter(user => user.email === userData.email)

        if (existingUsers.length > 0) {
          throw new Error("Email already registered")
        }

        const newUser = {
          ...userData,
          generationsLeft: 3,
          subscription: "free", 
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          lastPayment: Date.now(),
          lastPlanUpgrade: Date.now(),
          codes: [],
          subscriptions: [],
          sessions: []
        }

        const createResponse = await fetch(`${API_URL}/books`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newUser),
        })

        if (!createResponse.ok) {
          const errorText = await createResponse.text()
          console.error("Signup failed:", createResponse.status, errorText)
          throw new Error(`Failed to create account: ${createResponse.status} - ${errorText}`)
        }
        const user = await createResponse.json()

        commit("showToast", { message: "Account created successfully!", type: "success" })
        return { success: true, user }
      } catch (error) {
        console.error("Signup error:", error)
        let errorMessage = error.message

        if (error.message.includes("ERR_CONNECTION_REFUSED")) {
          errorMessage = "Cannot connect to MockAPI server. Please check your internet connection."
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage = "Network error. Please check your connection and MockAPI server status."
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
        const response = await fetch(`${API_URL}/books/${state.user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...state.user, ...updatedData }),
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
        
        // Add code to user's codes array
        const updatedCodes = [...(state.user.codes || []), newCode]
        
        const response = await fetch(`${API_URL}/books/${state.user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...state.user, codes: updatedCodes }),
        })
        if (!response.ok) throw new Error("Failed to create code")
        
        commit("addCode", newCode)
        commit("updateUser", { codes: updatedCodes })
        commit("showToast", { message: "Code created successfully", type: "success" })
        return { success: true, code: newCode }
      } catch (error) {
        commit("showToast", { message: error.message, type: "error" })
        return { success: false, error: error.message }
      }
    },

    async getUserCodes({ commit, state }) {
      if (!state.user) throw new Error("No user logged in")

      try {
        // Get codes from user's codes array
        const codes = state.user.codes || []
        commit("setCodes", codes)
        return { success: true, codes }
      } catch (error) {
        commit("showToast", { message: error.message, type: "error" })
        return { success: false, error: error.message }
      }
    },

    async updateCode({ commit, state }, { id, updates }) {
      if (!state.user) throw new Error("No user logged in")

      try {
        // Update code in user's codes array
        const updatedCodes = state.user.codes.map(code => 
          code.id === id ? { ...code, ...updates } : code
        )
        
        const response = await fetch(`${API_URL}/books/${state.user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...state.user, codes: updatedCodes }),
        })
        if (!response.ok) throw new Error("Failed to update code")
        
        const updatedCode = updatedCodes.find(code => code.id === id)
        commit("updateCode", updatedCode)
        commit("updateUser", { codes: updatedCodes })
        commit("showToast", { message: "Code updated successfully", type: "success" })
        return { success: true, code: updatedCode }
      } catch (error) {
        commit("showToast", { message: error.message, type: "error" })
        return { success: false, error: error.message }
      }
    },

    async deleteCode({ commit, state }, id) {
      if (!state.user) throw new Error("No user logged in")

      try {
        // Remove code from user's codes array
        const updatedCodes = state.user.codes.filter(code => code.id !== id)
        
        const response = await fetch(`${API_URL}/books/${state.user.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...state.user, codes: updatedCodes }),
        })
        if (!response.ok) throw new Error("Failed to delete code")
        
        commit("removeCode", id)
        commit("updateUser", { codes: updatedCodes })
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
          // Update user's last logout time
          await fetch(`${API_URL}/books/${state.user.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              ...state.user,
              lastLogoutAt: new Date().toISOString() 
            }),
          })

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
