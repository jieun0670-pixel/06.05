# 숫자 기억 대결

2명이 번갈아 10개의 숫자를 잠깐 보고, 더 많이 맞춘 사람이 이기는 웹 게임입니다.

## 실행

`index.html`을 브라우저에서 열면 바로 실행됩니다.

## 게임 규칙

- 플레이어 2명의 이름을 입력합니다.
- 각 플레이어에게 10개의 두 자리 숫자가 5초 동안 보입니다.
- 숫자가 사라지면 기억나는 숫자를 입력합니다.
- 순서는 상관없고, 중복 숫자는 실제 나온 개수만큼만 인정됩니다.
- 더 많이 맞춘 사람의 이름이 “축하합니다” 메시지와 함께 메인 화면에 표시됩니다.

## Firebase Realtime Database 설정

`src/firebase.js`의 `firebaseConfig` 값 중 `apiKey`, `messagingSenderId`, `appId`를 Firebase 웹 앱 설정에서 복사해 넣으면 승자 기록이 Realtime Database의 `numberMemoryWinners` 경로에 저장됩니다.

Firebase 콘솔의 Realtime Database 규칙 탭에는 `database.rules.json` 내용을 붙여 넣으면 됩니다. 이 규칙은 승자 기록 생성만 허용하고, 읽기/수정/삭제는 막습니다.

Firebase Realtime Database 주소:

`https://console.firebase.google.com/project/project-3314422616667103627/database/project-3314422616667103627-default-rtdb/data?hl=ko`

## Vercel 배포

이 폴더를 GitHub에 올린 뒤 Vercel에서 새 프로젝트로 연결하면 됩니다.

- Framework Preset: `Other`
- Build Command: 비워두기
- Output Directory: `.`
