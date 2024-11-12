export const AUTH_CONSTANTS = {
    VERIFICATION_CODE_LENGTH: 4,
    PASSWORD_MIN_LENGTH: 6,
    PASSWORD_MAX_LENGTH: 20,
    ERROR_MESSAGES: {
      EMAIL_REQUIRED: '邮箱是必填项',
      EMAIL_INVALID: '请输入有效的邮箱地址',
      PASSWORD_LENGTH: '密码长度必须在6-20个字符之间',
      VERIFICATION_CODE_LENGTH: '验证码必须是4位',
      LOGIN_FAILED: '登录失败',
      CAPTCHA_FAILED: '获取验证码失败'
    }
  } as const