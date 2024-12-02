export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
      console.error('Error occurred:', error, info);
    };
  
    // 使用钩子监听 Vue 错误
    nuxtApp.hook('vue:error', (error, instance, info) => {
      console.error('Vue error occurred:', error, info);
    });
});
  