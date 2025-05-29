describe('템플릿 플로우 E2E', () => {
  it('홈 페이지 열고 키워드 입력 → 문구 생성', () => {
    // 1) localhost:3000 에 접속 (onBeforeLoad로 localStorage 세팅도 가능)
    cy.visit('http://localhost:3000', {
      onBeforeLoad(win) {
        // 이미 튜토리얼을 본 상태로 만들어서 모달이 뜨지 않게끔 할 수도 있고
        win.localStorage.setItem('seenTutorial', 'true');
      },
    });

    // 2) 혹은, 튜토리얼 모달 닫기 버튼을 클릭
    cy.get('button').contains('×').click();

    // 3) 키워드 입력
    cy.get('input[placeholder="예: 감성 카페, 프리미엄 향수"]')
      .type('아이스크림 라떼');

    // 4) 문구 생성 버튼 클릭
    cy.contains('✨ 이 조건으로 문구 생성하기').click();

    // 5) 결과 확인
    cy.contains('✨ 이런 문구는 어떠세요?').should('be.visible');
  });
});
