// 📋 투두 리스트 설정 파일
// ⚠️ config.local.js에서 실제 설정값을 로드합니다 (Git 제외)

let CONFIG = {
    googleSheetId: '',
    googleApiKey: '',
    appsScriptUrl: '',
    autoSync: true,
    syncInterval: 0
};

// 로컬 설정 파일에서 실제값 로드
if (typeof CONFIG_LOCAL !== 'undefined') {
    CONFIG = { ...CONFIG, ...CONFIG_LOCAL };
    console.log('✓ 로컬 설정 로드 완료');
} else {
    console.warn('⚠️ config.local.js 파일이 필요합니다. 설정 방법은 README.md를 참고하세요.');
}
