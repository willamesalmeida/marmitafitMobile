import React, { createContext, useState, useEffect, useContext } from "react";
import * as SecureStore from "../services/secureStore"

//cria o contexto 
const AuthContext = createContext({});


//chama o provider 
export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function LoadStorageData() {
      try {
        const storageToken = await SecureStore.getAccessToken()
         if(storageToken) {
        setUser({token: storageToken}) //Marca como logado temporatiamente
    }
      } catch (error) {
        console.error("Erro ao carregar dados do armazenamento", error)
      } finally {
        setLoading(false)
      }
    }

    LoadStorageData()
  }, [])

  const logout = async () => {
    await SecureStore.clearTokens()
    setUser(null)
  }

return (
<AuthContext.Provider value={{signed: !!user, user, setUser, loading, logout}}>
  {children}
</AuthContext.Provider>
)
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  return context
}
