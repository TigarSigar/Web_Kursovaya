import { toDemoAccounts } from '@/api/backend'
import { clientsApi } from '@/api/clients'
import type { UserAccount } from '@/types/entities'

export const authApi = {
  listDemoAccounts: async (): Promise<UserAccount[]> => {
    const clients = await clientsApi.list()
    return toDemoAccounts(clients)
  },
}
