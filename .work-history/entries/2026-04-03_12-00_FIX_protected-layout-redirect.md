# fix: protected layout redirect 에러 수정

redirect()를 useEffect + router.replace()로 변경. 로그아웃 시 'Rendered more hooks than during the previous render' 에러 해결.
