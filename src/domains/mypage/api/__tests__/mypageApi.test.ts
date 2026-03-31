import { describe, it, expect, vi, beforeEach } from "vitest"

// api client 모킹
const { mockGet, mockPost } = vi.hoisted(() => ({
  mockGet: vi.fn(),
  mockPost: vi.fn(),
}))
vi.mock("@/lib/api/client", () => ({
  api: { get: mockGet, post: mockPost },
}))

import {
  getMypageInfo,
  updateUser,
  checkPassword,
  deleteUser,
  registerDibs,
  deleteDibs,
} from "../mypageApi"

beforeEach(() => {
  vi.clearAllMocks()
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// P2-1: 마이페이지 정보 조회
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("getMypageInfo (P2-1)", () => {
  it("GET /auth/users/mypage/list를 호출한다", async () => {
    const mockResponse = {
      coupon_count: 3,
      mileage_store_count: 1200,
      reservation_count: 2,
      new_alarm_date: "2026-03-31T00:00:00Z",
      new_notice_date: "2026-03-31T00:00:00Z",
    }
    mockGet.mockResolvedValueOnce(mockResponse)

    const result = await getMypageInfo()

    expect(mockGet).toHaveBeenCalledWith("/auth/users/mypage/list")
    expect(result).toEqual(mockResponse)
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// P2-2: 회원정보 변경
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("updateUser (P2-2)", () => {
  it("POST /auth/users/update에 변경할 필드를 전달한다", async () => {
    const mockResponse = {
      token: { access_token: "new-tok", secret: "new-sec" },
      user: { key: 1, nickname: "새닉네임" },
    }
    mockPost.mockResolvedValueOnce(mockResponse)

    const result = await updateUser({ nickname: "새닉네임" })

    expect(mockPost).toHaveBeenCalledWith("/auth/users/update", {
      nickname: "새닉네임",
    })
    expect(result.token.access_token).toBe("new-tok")
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// P2-3: 비밀번호 확인
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("checkPassword (P2-3)", () => {
  it("POST /auth/users/pw/check에 암호화된 비밀번호를 전달한다", async () => {
    mockPost.mockResolvedValueOnce({ isVerified: true })

    const result = await checkPassword({ enc_password: "encrypted-pw" })

    expect(mockPost).toHaveBeenCalledWith("/auth/users/pw/check", {
      enc_password: "encrypted-pw",
    })
    expect(result.isVerified).toBe(true)
  })

  it("비밀번호 불일치 시 isVerified가 false다", async () => {
    mockPost.mockResolvedValueOnce({ isVerified: false })

    const result = await checkPassword({ enc_password: "wrong-pw" })

    expect(result.isVerified).toBe(false)
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// P2-4: 회원 탈퇴
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("deleteUser (P2-4)", () => {
  it("POST /auth/users/delete에 탈퇴 사유를 전달한다", async () => {
    mockPost.mockResolvedValueOnce(undefined)

    await deleteUser({
      reason_type: "NOT_USED",
      reason_description: "사용하지 않아서",
    })

    expect(mockPost).toHaveBeenCalledWith("/auth/users/delete", {
      reason_type: "NOT_USED",
      reason_description: "사용하지 않아서",
    })
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// P2-5: 찜 등록
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("registerDibs (P2-5)", () => {
  it("POST /auth/dibs/register에 motel_key를 전달한다", async () => {
    const mockResponse = {
      storeKey: "123",
      isLikeBenefitActive: true,
      isFirstLikeToday: true,
    }
    mockPost.mockResolvedValueOnce(mockResponse)

    const result = await registerDibs({ motel_key: "123" })

    expect(mockPost).toHaveBeenCalledWith("/auth/dibs/register", {
      motel_key: "123",
    })
    expect(result.isFirstLikeToday).toBe(true)
  })
})

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// P2-6: 찜 삭제
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

describe("deleteDibs (P2-6)", () => {
  it("POST /auth/dibs/delete에 삭제 대상을 전달한다", async () => {
    mockPost.mockResolvedValueOnce(undefined)

    await deleteDibs({ type: "0", motel_keys: "123,456" })

    expect(mockPost).toHaveBeenCalledWith("/auth/dibs/delete", {
      type: "0",
      motel_keys: "123,456",
    })
  })
})
