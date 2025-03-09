class GroupService {
  static getGroupId(): string | null {
    return localStorage.getItem('groupId')
  }

  static setGroupId(groupId: string): void {
    localStorage.setItem('groupId', groupId)
  }

  static removeGroupId(): void {
    localStorage.removeItem('groupId')
  }
}

export default GroupService
