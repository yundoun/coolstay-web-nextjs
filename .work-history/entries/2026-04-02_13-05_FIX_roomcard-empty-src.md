## FIX: RoomCard 빈 imageUrl src 에러 수정

### 문제
- RoomCard에서 `room.imageUrl`이 빈 문자열 또는 undefined일 때 `Image src=""` 에러
- "Image is missing required src property" 콘솔 에러

### 수정
- imageUrl이 falsy일 때 "No Image" placeholder 표시
