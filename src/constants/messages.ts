export const snackMessages = {
    create: {
      success: (entity: string) => `${entity}이(가) 성공적으로 추가되었습니다.`,
      error: (entity: string) => `${entity} 추가에 실패했습니다.`,
    },
    edit: {
      success: (entity: string) => `${entity}이(가) 성공적으로 수정되었습니다.`,
      error: (entity: string) => `${entity} 수정에 실패했습니다.`,
    },
    delete: {
      success: (entity: string) => `${entity}이(가) 성공적으로 삭제되었습니다.`,
      error: (entity: string) => `${entity} 삭제에 실패했습니다.`,
    },
    get : {
      success: (entity: string) => `${entity}을(를) 성공적으로 불러왔습니다.`,
      error: (entity: string) => `${entity}을(를) 불러오는데 실패했습니다.`,
    }
  };