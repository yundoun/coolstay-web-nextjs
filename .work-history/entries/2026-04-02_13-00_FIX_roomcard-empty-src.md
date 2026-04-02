## FIX: RoomCard 빈 imageUrl 에러 수정

### 문제
- room.imageUrl이 빈 문자열이거나 undefined일 때 Next.js Image에 빈 src 전달
- "An empty string was passed to the src attribute" + "Image is missing required src property" 에러

### 수정
- room.imageUrl이 falsy일 때 Moon 아이콘 fallback 표시
