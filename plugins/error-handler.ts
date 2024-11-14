export default defineNuxtPlugin((nuxtApp) => {
    // 自定义错误处理函数
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
      // 处理错误，例如报告到服务
      console.error('Error occurred:', error, info);
    };
  
    // 使用钩子监听 Vue 错误
    nuxtApp.hook('vue:error', (error, instance, info) => {
      // 处理错误，例如报告到服务
      console.error('Vue error occurred:', error, info);
    });
});
  