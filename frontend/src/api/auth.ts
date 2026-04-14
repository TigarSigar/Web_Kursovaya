import { mockDb } from '@/mock/database'
import type { UserAccount } from '@/types/entities'

export const authApi = {
  listDemoAccounts: (): Promise<UserAccount[]> => mockDb.getAccounts(),
}
