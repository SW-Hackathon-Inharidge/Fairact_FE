export const emailTemplate = `
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <title>전자 서명 초대</title>
  <style>
    .container {
      max-width: 600px;
      margin: auto;
      padding: 40px 30px;
      font-family: 'Pretendard', sans-serif;
      background-color: #ffffff;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    }

    .title {
      color: #1D4ED8;
      font-size: 24px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 30px;
    }

    .content {
      font-size: 16px;
      color: #333333;
      line-height: 1.5;
      margin-bottom: 30px;
    }

    .button {
      display: block;
      width: fit-content;
      margin: auto;
      padding: 12px 24px;
      background-color: #1D4ED8;
      color: #ffffff;
      font-weight: bold;
      text-decoration: none;
      border-radius: 8px;
      font-size: 16px;
    }

    .footer {
      margin-top: 40px;
      text-align: center;
      font-size: 12px;
      color: #999999;
    }
  </style>
</head>
<body style="background-color: #f5f5f5;">
  <div class="container">
    <h2 class="title">전자 서명 초대</h2>
    <p class="content">
      안녕하세요,<br /><br />
      귀하는 <strong>전자 서명</strong>을 요청받았습니다.<br />
      아래 버튼을 클릭하여 서명에 참여해 주세요.
    </p>

    <a href="{{inviteUrl}}" class="button">서명하러 가기</a>

    <p class="footer">
      본 메일은 발신 전용입니다. 문의사항은 서비스 내 고객센터를 이용해주세요.
    </p>
  </div>
</body>
</html>
`;
