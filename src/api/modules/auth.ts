import request from '@/api/interceptors/request'
import type { LoginRequest, LoginResponse } from '@/types/auth'

export const authApi = {
  login: (data: LoginRequest) => 
    request.post<LoginResponse>('/auth/login', data),
    
  logout: () => 
    request.post('/auth/logout'),
    
  getUserInfo: () => 
    request.get('/auth/user-info')
}