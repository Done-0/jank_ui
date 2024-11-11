export default defineNuxtPlugin((nuxtApp) => {
    // 自定义错误处理函数
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
      // 处理错误，例如报告到服务
      console.error('Error occurred:', error, info); // 输出错误信息
    };
  
    // 也可以使用钩子监听 Vue 错误
    nuxtApp.hook('vue:error', (error, instance, info) => {
      // 处理错误，例如报告到服务
      console.error('Vue error occurred:', error, info); // 输出错误信息
    });
  });
  