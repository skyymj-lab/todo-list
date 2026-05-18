# 📝 Google Sheets 연동 투두 리스트

Google Sheets를 데이터베이스로 사용하는 실시간 동기화 투두 리스트 애플리케이션입니다. 보안을 위해 API 정보를 소스 코드에 저장하지 않고, 웹 화면에서 직접 설정하여 안전하게 사용할 수 있습니다.

## 🎯 주요 기능

- ✅ **실시간 동기화**: Google Sheets API v4를 통한 데이터 읽기/쓰기
- ⚙️ **설정 팝업 UI**: 사이트 접속 시 API 정보를 입력받는 지능형 모달 제공
- 🔐 **보안 강화**: API 키 정보를 **sessionStorage**에 저장하여 탭 종료 시 즉시 파기
- 💡 **상세 도움말**: 설정 항목마다 포함된 도움말(?) 아이콘을 통해 발급 방법 안내
- 📱 **반응형 디자인**: 모바일과 데스크톱 모두에 최적화된 UI
- ⚡ **성능 최적화**: 배치 업데이트(Batch Write) 방식으로 동기화 속도 대폭 개선

## 🚀 시작하기

이 프로젝트는 별도의 서버 설치 없이 `index.html`을 실행하는 것만으로 바로 사용 가능합니다.

### 1단계: 사이트 접속 및 초기 설정
1. 배포된 URL 또는 `index.html`을 브라우저에서 엽니다.
2. 최초 접속 시 자동으로 **API 설정 팝업**이 나타납니다.
3. 다음 정보들을 입력하세요:
   - **Google Sheet ID**: 시트 URL의 `/d/`와 `/edit` 사이의 긴 문자열
   - **Google API Key**: Google Cloud Console에서 발급받은 API 키 (`AIza` 시작)
   - **Apps Script URL**: `apps-script.gs`를 웹 앱으로 배포하여 얻은 URL (`/exec` 끝)
4. **저장**을 누르면 즉시 구글 시트와의 동기화가 시작됩니다.

> 💡 **Tip**: 각 입력창 옆의 **?** 아이콘을 클릭하면 각 정보를 찾는 상세한 단계별 가이드를 볼 수 있습니다.

### 2단계: Google Sheets 준비
시트의 첫 번째 행(헤더)에 다음 항목들을 작성해 주세요:
`ID` | `Task` | `Completed` | `Created` | `Update`

## 🔐 보안 및 데이터 저장
- **API 정보**: 보안을 위해 사용자의 브라우저 **세션 저장소**에만 임시 저장됩니다. 탭을 닫으면 보안을 위해 설정 정보가 자동으로 삭제됩니다.
- **할 일 데이터**: 브라우저의 **로컬 저장소**에도 백업되어, 네트워크 연결이 끊겨도 데이터 손실을 방지합니다.

## 🛠️ 기술 스택
- **Frontend**: HTML5, Vanilla CSS, Vanilla JavaScript
- **Backend**: Google Apps Script
- **Database**: Google Sheets API v4
- **Deployment**: GitHub Pages

## 📝 라이선스
MIT License - 자유롭게 사용 및 수정이 가능합니다.
