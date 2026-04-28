import type { HttpClient } from "@/lib/ports/HttpClient"
import type { AuthRepository } from "../ports/AuthRepository"
import type {
  SessionResponse,
  LoginRequest,
  SnsLoginRequest,
  CodeSendRequest,
  CodeSendResponse,
  CodeCheckRequest,
  CodeCheckResponse,
  AuthMethodResponse,
  RegisterRequest,
  SnsRegisterRequest,
  PwFindRequest,
  PwFindResponse,
  IdFindRequest,
} from "../types"

export class ApiAuthRepository implements AuthRepository {
  constructor(private http: HttpClient) {}

  loginWithEmail(body: LoginRequest) {
    return this.http.post<SessionResponse>("/auth/sessions/users", body)
  }

  loginWithSns(body: SnsLoginRequest) {
    return this.http.post<SessionResponse>("/auth/sessions/users/sns", body)
  }

  sendAuthCode(body: CodeSendRequest) {
    return this.http.post<CodeSendResponse>("/auth/code/send", body)
  }

  checkAuthCode(body: CodeCheckRequest) {
    return this.http.post<CodeCheckResponse>("/auth/code/check", body)
  }

  getAuthMethods(email: string) {
    return this.http.get<AuthMethodResponse>("/auth/code/list", { email })
  }

  registerWithEmail(body: RegisterRequest) {
    return this.http.post<SessionResponse>("/auth/users/register", body)
  }

  registerWithSns(body: SnsRegisterRequest) {
    return this.http.post<SessionResponse>("/auth/users/sns/register", body)
  }

  findPassword(body: PwFindRequest) {
    return this.http.post<PwFindResponse>("/auth/users/pw/find", body)
  }

  findUserId(body: IdFindRequest) {
    return this.http.post<unknown>("/auth/users/id/find", body)
  }
}
