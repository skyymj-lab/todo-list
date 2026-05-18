# 📝 Google Sheets 연동 투두 리스트

Google Sheets를 데이터베이스로 사용하는 투두 리스트 애플리케이션입니다.

## 🎯 주요 기능

- ✅ 할일 추가, 삭제, 완료 표시
- 📊 Google Sheets를 데이터베이스로 사용
- 🔄 자동 동기화 및 수동 동기화
- 📱 반응형 디자인 (모바일 지원)
- 🎨 현대적인 UI/UX
- 💾 로컬 저장소 백업

## 🚀 시작하기

### 1단계: Google Cloud 설정

1. [Google Cloud Console](https://console.cloud.google.com) 접속
2. 새 프로젝트 생성
3. Google Sheets API 활성화
   - 검색: "Google Sheets API"
   - "활성화" 클릭

### 2단계: API Key 생성

1. **사용자 인증 정보** 메뉴 접속
2. **+ 사용자 인증 정보 만들기** → **API 키**
3. 생성된 API 키 복사

### 3단계: Google Sheets 준비

1. [Google Sheets](https://sheets.google.com) 접속
2. 새 스프레드시트 생성
3. 첫 번째 행(헤더)에 다음 입력:
   ```
   ID | Task | Completed | Created | Updated
   ```
4. 스프레드시트 공유 설정
   - 공유 버튼 클릭
   - "링크를 가진 모든 사용자" 선택
   - 권한: "뷰어" 설정

### 4단계: 애플리케이션 설정

1. `index.html` 열기
2. 설정 섹션에서:
   - Google Sheets URL 입력
   - API Key 입력
   - "저장" 클릭

## 📋 사용 방법

### 기본 사용
```
1. 입력창에 할일 입력
2. "추가" 버튼 또는 Enter 키
3. 체크박스로 완료 표시
4. "삭제" 버튼으로 항목 삭제
```

### 필터링
```
- 모두: 모든 할일 표시
- 진행중: 미완료 항목만 표시
- 완료됨: 완료된 항목만 표시
```

### 동기화
```
- "🔄 동기화" 버튼: Google Sheets에서 최신 데이터 로드
- 자동 동기화: 새 항목 추가 시 자동 저장
```

## 🔧 Google Apps Script로 쓰기 기능 추가

Google Sheets의 읽기만으로는 제한적이므로, 쓰기 기능을 위해 Google Apps Script 사용:

### 설정 방법

1. Google Sheets 파일 열기
2. **확장** → **Apps Script** 클릭
3. `apps-script.gs` 파일의 코드 복사 및 붙여넣기
4. **배포** → **새 배포**
   - 타입: **웹 앱**
   - 실행 대상: **새 사용자로 실행**
   - 액세스: **모든 사용자**
5. 배포 URL 복사

### JavaScript에서 Apps Script 사용

```javascript
// script.js의 saveToGoogleSheet() 함수 수정:

async function saveToGoogleSheet() {
  const appsScriptUrl = 'YOUR_APPS_SCRIPT_DEPLOYMENT_URL';
  
  try {
    const response = await fetch(appsScriptUrl, {
      method: 'POST',
      payload: JSON.stringify({
        action: 'updateSheet',
        todos: todos
      })
    });
    
    const result = await response.json();
    if (result.success) {
      showNotification('✓ Google Sheets에 저장되었습니다', 'success');
    }
  } catch(error) {
    console.error('Error:', error);
  }
}
```

## 📁 파일 구조

```
front/
├── index.html           # HTML 파일
├── style.css            # CSS 스타일시트
├── script.js            # JavaScript 로직
├── apps-script.gs       # Google Apps Script (선택사항)
└── README.md            # 이 파일
```

## 🌐 GitHub Pages 배포

### 1단계: GitHub 저장소 생성

```bash
1. GitHub 접속 → 새 저장소 생성
2. 저장소 이름: username.github.io (또는 다른 이름)
3. Public으로 설정
4. Create repository
```

### 2단계: 로컬에서 업로드

```bash
# 로컬 git 초기화
git init

# GitHub 저장소 추가
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# front 폴더의 파일들을 root로 이동하거나
# 폴더 구조 유지

# 파일 추가
git add .

# 커밋
git commit -m "Initial commit: Add todo list app"

# 업로드
git branch -M main
git push -u origin main
```

### 3단계: GitHub Pages 활성화

1. GitHub 저장소 페이지 접속
2. Settings → Pages 메뉴
3. Source: main branch (또는 gh-pages)
4. Save

### 4단계: 접속

- `https://username.github.io` (저장소명이 username.github.io인 경우)
- `https://username.github.io/REPO_NAME` (다른 저장소명인 경우)

## 🔐 보안 주의사항

⚠️ **API Key 보안**

현재 코드는 클라이언트에서 API Key를 사용합니다. 이는 다음과 같은 위험이 있습니다:

- API Key가 공개 저장소에 노출될 수 있음
- 누구나 API Key를 사용하여 요청 가능

### 권장 방법: 백엔드 프록시

1. 간단한 백엔드 서버 구성 (Node.js, Python 등)
2. 클라이언트에서 백엔드로 요청
3. 백엔드에서 API Key를 안전하게 관리하여 Google Sheets API 호출

예:
```
클라이언트 → 백엔드 → Google Sheets API
```

## 🛠️ 기술 스택

- **프론트엔드**: HTML5, CSS3, Vanilla JavaScript
- **데이터베이스**: Google Sheets API
- **배포**: GitHub Pages
- **백엔드**: Google Apps Script (선택사항)

## 📱 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)

## 🐛 문제 해결

### API 오류 발생
```
- API Key 확인
- Sheets API 활성화 확인
- 스프레드시트 공유 설정 확인
```

### 데이터가 로드되지 않음
```
- 스프레드시트 ID 확인
- API Key 입력 확인
- 브라우저 콘솔에서 오류 메시지 확인
```

### CORS 오류
```
- Google Sheets API는 CORS를 지원합니다
- 브라우저 콘솔에서 정확한 오류 확인
- Google Apps Script 사용 검토
```

## 📝 라이선스

MIT License - 자유롭게 사용, 수정, 배포 가능

## 🤝 기여

버그 리포트 및 기능 제안은 GitHub Issues에 남겨주세요.

## 📞 지원

문제 발생 시:
1. 브라우저 콘솔 확인 (F12)
2. GitHub Issues 검색
3. 새로운 Issue 생성

---

**마지막 업데이트**: 2026년
**버전**: 1.0.0
