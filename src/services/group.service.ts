enum StorageKey {
  GroupId = 'groupId',
  UserId = 'userId'
}

class StorageService {
  static getItem(key: StorageKey): string | null {
    return localStorage.getItem(key)
  }

  static setItem(key: StorageKey, value: string): void {
    localStorage.setItem(key, value)
  }

  static removeItem(key: StorageKey): void {
    localStorage.removeItem(key)
  }
}

export { StorageKey, StorageService }
