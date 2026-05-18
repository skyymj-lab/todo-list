# 🔑 Google Sheets & API 설정 완벽 가이드

## 1️⃣ Google Cloud Console 설정

### Step 1: 프로젝트 생성

```
1. https://console.cloud.google.com 접속
2. 좌상단 "Google Cloud" 로고 옆 프로젝트 선택 버튼 클릭
3. "새 프로젝트" 클릭
4. 프로젝트 이름 입력
   예: "Todo List App"
5. 만들기 클릭
6. 잠시 기다린 후 프로젝트 선택
```

### Step 2: Google Sheets API 활성화

```
1. 위상단 검색창에 "Google Sheets API" 입력
2. "Google Sheets API" 클릭
3. "활성화" 버튼 클릭
4. 활성화 완료 확인
```

### Step 3: OAuth 동의 화면 구성

```
1. 좌측 메뉴 → "APIs & Services"
2. "OAuth 동의 화면" 클릭
3. User Type 선택: "External" 선택
4. "만들기" 클릭
5. 양식 작성:
   - App name: "Todo List"
   - User support email: 자신의 이메일
   - Developer contact: 자신의 이메일
6. "저장 및 계속" 클릭
7. Scopes 단계는 기본값으로 진행
8. "저장 및 계속" 클릭
9. 검토 후 "대시보드로 돌아가기"
```

## 2️⃣ API Key 생성

### 방법 1: 제한 없이 생성

```
1. Google Cloud Console에서
2. 좌측 메뉴 → "Credentials" (사용자 인증 정보)
3. "+ Create Credentials" 클릭
4. "API Key" 선택
5. API Key 복사

⚠️ 주의: 이 키는 공개되지 않도록 주의!
```

### 방법 2: 제한을 포함하여 생성 (더 안전)

```
1. API Key 생성 (위와 동일)
2. 생성된 키 클릭
3. "Application restrictions" 설정
   - HTTP referrers (웹사이트) 선택
   - 허용된 리퍼러 추가:
     * https://YOUR_USERNAME.github.io
     * https://YOUR_USERNAME.github.io/REPO_NAME
     * http://localhost:8000 (로컬 테스트용)
4. "API restrictions" 설정
   - "Restrict key" 선택
   - Google Sheets API만 선택
5. 저장
```

### 생성된 API Key 예시

```
AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 2️⃣ OAuth Client ID 생성 (Apps Script 쓰기 필요 시)

```
1. Google Cloud Console
2. "Credentials" 메뉴
3. "+ Create Credentials" → "OAuth client ID"
4. Application type: "Desktop application"
5. Name 입력: "Todo App"
6. 만들기
7. JSON 파일 다운로드 (선택사항)
```

## 3️⃣ Google Sheets 생성 및 공유

### Step 1: 스프레드시트 생성

```
1. https://sheets.google.com 접속
2. 새 스프레드시트 생성
3. 이름: "Todo List" (또는 원하는 이름)
4. 공유 버튼 → "링크를 가진 모든 사용자"
   - 역할: "뷰어" 선택
   - 공유 링크 복사
```

### Step 2: 열 구조 설정

첫 번째 행에 다음 헤더를 입력:

| 열 | 이름 | 타입 |
|-----|-------|------|
| A | ID | 텍스트 |
| B | Task | 텍스트 |
| C | Completed | 체크박스 |
| D | Created | 날짜 |
| E | Updated | 날짜 |

예시:
```
ID              | Task        | Completed | Created            | Updated
todo_1234_abc   | 할일 1      | FALSE     | 2024-01-01T...     | 2024-01-01T...
```

### Step 3: Sheet ID 찾기

URL: `https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit`

예:
```
https://docs.google.com/spreadsheets/d/1a2b3c4d5e6f7g8h9i0j/edit

Sheet ID: 1a2b3c4d5e6f7g8h9i0j
```

## 4️⃣ 애플리케이션에서 설정

### 웹 앱에서 Google Sheets 연동

```html
<!-- index.html의 설정 섹션에 입력 -->

Google Sheets URL:
https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit

Google API Key:
AIzaSyDxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## 5️⃣ Google Apps Script 배포 (쓰기 기능)

### Step 1: Apps Script 작성

```
1. Google Sheets 파일 열기
2. "확장" 메뉴 → "Apps Script"
3. apps-script.gs의 코드 복사
4. 붙여넣기
5. 저장
```

### Step 2: Apps Script 배포

```
1. "배포" 버튼 클릭
2. "새 배포" 클릭
3. 유형 선택: "웹 앱"
4. 설정:
   - 실행 대상: "새 사용자로 실행"
   - 액세스: "모든 사용자"
5. "배포" 버튼
6. 인증 요청 시 계정 선택
7. 배포 URL 복사 (중요!)

배포 URL 예:
https://script.google.com/macros/d/1a2b3c4d5e6f7g8h9/usercontent
```

### Step 3: JavaScript에서 사용

```javascript
const APPS_SCRIPT_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usercontent';

async function callAppsScript(action, data) {
  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      payload: JSON.stringify({
        action: action,
        ...data
      })
    });
    
    return await response.json();
  } catch(error) {
    console.error('Error:', error);
  }
}
```

## 📊 API 쿼리 예시

### Google Sheets API를 직접 호출

```javascript
// 데이터 읽기
const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/Sheet1?key=${API_KEY}`;

fetch(url)
  .then(response => response.json())
  .then(data => {
    console.log(data.values);
  })
  .catch(error => console.error('Error:', error));
```

## 🔒 보안 검토 체크리스트

- [ ] API Key가 저장소에 커밋되지 않음
- [ ] API Key가 제한 설정됨 (리퍼러, API)
- [ ] Google Sheets가 "뷰어" 권한으로만 공유됨
- [ ] GitHub Pages HTTPS 사용
- [ ] 민감한 정보는 환경 변수로 관리

## 🐛 문제 해결

### 1. "Access Denied" 오류

**원인**: Google Sheets API가 활성화되지 않음

```
해결:
1. Google Cloud Console 접속
2. "Google Sheets API" 검색
3. "활성화" 클릭
```

### 2. "Invalid API Key" 오류

**원인**: API Key가 잘못되었거나 활성화되지 않음

```
해결:
1. API Key 복사 재확인
2. 아래 URL 직접 테스트:
   https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}/values?key={API_KEY}
3. JSON 응답이 나오면 정상
```

### 3. CORS 오류

**원인**: 브라우저에서 다른 도메인 요청 차단

```
해결:
1. Google Sheets API는 CORS를 지원합니다
2. 브라우저 콘솔(F12)에서 정확한 오류 확인
3. API Key 제한 설정 확인
```

### 4. "Sheet not found" 오류

**원인**: Sheet ID 또는 시트 이름 오류

```
해결:
1. URL에서 Sheet ID 확인
2. 시트 이름이 "Sheet1"인지 확인
3. API 응답 확인:
   https://sheets.googleapis.com/v4/spreadsheets/{SHEET_ID}?key={API_KEY}
```

## 📚 추가 도움말

### Google API 쿼터 확인

```
1. Google Cloud Console
2. "Quotas" 메뉴
3. "Google Sheets API" 검색
4. 일일 쿼터 및 사용량 확인
   - 기본: 하루 1,000,000 읽기 요청 제한
```

### API 사용량 모니터링

```
1. Google Cloud Console
2. "APIs & Services" → "Library"
3. "Google Sheets API" 클릭
4. "Metrics" 탭
5. 요청 수 및 오류율 확인
```

## 🎯 권장 설정 요약

```
Google Cloud Console:
✅ Google Sheets API 활성화
✅ OAuth 동의 화면 구성
✅ API Key 생성 및 제한 설정

Google Sheets:
✅ 새 스프레드시트 생성
✅ 헤더 행 설정
✅ "뷰어" 권한으로 공유
✅ Sheet ID 저장

Web App:
✅ API Key 설정 저장
✅ .env 파일로 관리
✅ localStorage에는 저장 제한
```

---

**문제 발생 시**: 브라우저 콘솔(F12) → Console 탭에서 오류 메시지 확인하고 위 "문제 해결" 섹션 참조
