# 🔐 EduWay Authentication System Documentation

## نظرة عامة (Overview)

نظام الـ Authentication في EduWay بيعتمد على **Supabase Auth** مع **Next.js App Router** و بيدعم طريقتين للتسجيل:

1. **Email/Password** — تسجيل تقليدي بالإيميل والباسورد
2. **OAuth (Social Login)** — تسجيل عن طريق Google أو غيره باستخدام **PKCE Flow**

---

## 📁 File Structure (هيكل الملفات)

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          ← Browser Supabase Client (PKCE)
│   │   └── server.ts          ← Server Supabase Client (Cookies)
│   └── axios/
│       └── apiClient.ts       ← Axios wrapper للـ API calls
│
├── features/(auth)/
│   ├── signup/
│   │   ├── components/SignupForm.tsx   ← فورم التسجيل
│   │   ├── schema/schema.ts           ← Zod validation
│   │   ├── hooks/useSignup.ts         ← React Query mutation
│   │   ├── service/signup.ts          ← API call service
│   │   ├── types/index.ts             ← AuthRole type
│   │   └── data/AuthInputConfig.ts    ← Input fields config
│   │
│   ├── login/
│   │   ├── components/LoginForm.tsx   ← فورم اللوجن
│   │   ├── schema/loginSchema.ts      ← Zod validation
│   │   ├── hooks/useLogin.ts          ← React Query mutation
│   │   ├── services/login.ts          ← API call service
│   │   └── data/login-inputs.ts       ← Input fields config
│   │
│   ├── choose-role/
│   │   ├── components/
│   │   │   ├── ChooseRoleForm.tsx      ← اختيار الدور (student/teacher)
│   │   │   └── ChooseRoleCard.tsx      ← كارد كل دور
│   │   ├── hooks/useRole.ts           ← React Query mutation
│   │   └── services/assignRole.ts     ← API call service
│   │
│   ├── shared/
│   │   ├── components/
│   │   │   ├── AuthTabs.tsx           ← Login/Signup tabs
│   │   │   ├── SocialLogin.tsx        ← OAuth buttons
│   │   │   ├── SocialIcons.tsx        ← SVG icons
│   │   │   └── AuthHeader.tsx         ← Auth page header
│   │   └── types/AuthInputs.ts       ← AuthInputConfig & AuthResponse types
│   │
│   └── onboarding/                    ← Multi-step teacher onboarding
│       ├── step-one/
│       ├── step-two/
│       └── step-three/
│
├── app/api/(auth)/
│   ├── signup/route.ts        ← POST /api/signup
│   ├── login/route.ts         ← POST /api/login
│   ├── callback/route.ts      ← GET  /api/callback (OAuth)
│   └── choose-role/route.ts   ← POST /api/choose-role
│
└── services/auth/
    ├── getProfile.ts              ← جلب بيانات الـ profile
    └── getAuthRedirectRoute.ts    ← تحديد الصفحة اللي المستخدم هيروحلها
```

---

## 🔄 Auth Flows (مسارات الـ Authentication)

### 1️⃣ Email/Password Signup Flow

```mermaid
sequenceDiagram
    actor User
    participant SignupForm as SignupForm<br/>(Client Component)
    participant useSignup as useSignup Hook<br/>(React Query)
    participant signupService as signupService<br/>(Axios)
    participant API as POST /api/signup<br/>(Next.js API Route)
    participant Zod as Zod Schema<br/>(Server Validation)
    participant Supabase as Supabase Auth
    participant DB as profiles table
    participant Redirect as getAuthRedirectRoute

    User->>SignupForm: يملأ الفورم ويضغط Submit
    SignupForm->>SignupForm: Zod Client Validation
    alt ❌ Validation Failed
        SignupForm-->>User: يعرض errors تحت كل input
    end
    SignupForm->>useSignup: mutateAsync(data)
    useSignup->>signupService: POST request
    signupService->>API: POST /api/signup {firstName, lastName, email, password}
    API->>Zod: safeParse(body)
    alt ❌ Invalid Data
        Zod-->>API: errors
        API-->>signupService: 400 "Invalid signup data"
    end
    API->>Supabase: signUp({email, password, data: {first_name, last_name}})
    alt ❌ Signup Error
        Supabase-->>API: error
        API-->>signupService: 400 "Failed to create account"
    end
    alt ⚠️ Email Already Exists
        Supabase-->>API: user with empty identities[]
        API-->>signupService: 409 "An account with this email already exists"
    end
    Supabase-->>API: ✅ user created
    API->>DB: getProfileService(user.id)
    DB-->>API: {role, status}
    API->>Redirect: getAuthRedirectRoute(role, status)
    Redirect-->>API: nextRoute
    API-->>signupService: 201 {success: true, nextRoute}
    signupService-->>useSignup: response
    useSignup-->>SignupForm: response
    SignupForm-->>User: ✅ toast.success + router.push(nextRoute)
```

### 2️⃣ Email/Password Login Flow

```mermaid
sequenceDiagram
    actor User
    participant LoginForm as LoginForm<br/>(Client Component)
    participant useLogin as useLogin Hook<br/>(React Query)
    participant loginService as loginService<br/>(Axios)
    participant API as POST /api/login<br/>(Next.js API Route)
    participant Zod as Zod Schema<br/>(Server Validation)
    participant Supabase as Supabase Auth
    participant DB as profiles table
    participant Redirect as getAuthRedirectRoute

    User->>LoginForm: يملأ الفورم ويضغط Sign In
    LoginForm->>LoginForm: Zod Client Validation
    alt ❌ Validation Failed
        LoginForm-->>User: يعرض errors تحت كل input
    end
    LoginForm->>useLogin: mutateAsync(data)
    useLogin->>loginService: POST request
    loginService->>API: POST /api/login {email, password}
    API->>Zod: safeParse(body)
    alt ❌ Invalid Data
        API-->>loginService: 400 "Invalid login data"
    end
    API->>Supabase: signInWithPassword({email, password})
    alt ❌ Invalid Credentials
        Supabase-->>API: error
        API-->>loginService: 401 "Invalid credentials"
    end
    Supabase-->>API: ✅ session + user
    API->>DB: getProfileService(user.id)
    DB-->>API: {role, status}
    API->>Redirect: getAuthRedirectRoute(role, status)
    Redirect-->>API: nextRoute
    API-->>loginService: 200 {success: true, nextRoute}
    loginService-->>useLogin: response
    useLogin-->>LoginForm: response
    LoginForm-->>User: ✅ toast.success + router.push(nextRoute)
```

### 3️⃣ OAuth (Google) Login Flow — PKCE

```mermaid
sequenceDiagram
    actor User
    participant SocialLogin as SocialLogin<br/>(Client Component)
    participant BrowserClient as supabaseClient<br/>(Browser - PKCE)
    participant Google as Google OAuth<br/>(Provider)
    participant Callback as GET /api/callback<br/>(Next.js API Route)
    participant ServerClient as Supabase Server Client
    participant DB as profiles table
    participant Redirect as getAuthRedirectRoute

    User->>SocialLogin: يضغط على زرار Google
    SocialLogin->>BrowserClient: signInWithOAuth({provider: "google"})
    BrowserClient->>Google: 🔀 Redirect to Google consent screen
    Google-->>User: اختيار الحساب والموافقة
    Google->>Callback: 🔀 Redirect to /api/callback?code=XXXXX
    
    Note over Callback: 🔑 الفرق بين PKCE و Implicit:<br/>PKCE: /callback?code=... (آمن)<br/>Implicit: /callback#access_token=... (أقل أمان)

    Callback->>ServerClient: exchangeCodeForSession(code)
    alt ❌ Exchange Error
        ServerClient-->>Callback: error
        Callback-->>User: 🔀 Redirect /login?error=oauth_exchange
    end
    ServerClient-->>Callback: ✅ session created
    Callback->>ServerClient: getUser()
    ServerClient-->>Callback: user object
    Callback->>DB: SELECT role, status FROM profiles WHERE id = user.id
    alt 🆕 New User (No Profile)
        DB-->>Callback: null
        Callback-->>User: 🔀 Redirect /choose-role
    end
    DB-->>Callback: {role, status}
    Callback->>Redirect: getAuthRedirectRoute(role, status)
    Redirect-->>Callback: nextRoute
    Callback-->>User: 🔀 Redirect to nextRoute
```

### 4️⃣ Choose Role Flow (OAuth Users)

```mermaid
sequenceDiagram
    actor User
    participant ChooseRoleForm as ChooseRoleForm<br/>(Client Component)
    participant useRole as useRole Hook<br/>(React Query)
    participant assignRole as assignRole Service<br/>(Axios)
    participant API as POST /api/choose-role<br/>(Next.js API Route)
    participant Supabase as Supabase Server Client
    participant DB as profiles table

    User->>ChooseRoleForm: يختار student أو teacher
    User->>ChooseRoleForm: يضغط Continue
    ChooseRoleForm->>useRole: mutateAsync(selectedRole)
    useRole->>assignRole: POST request
    assignRole->>API: POST /api/choose-role {role: "student" | "teacher"}
    API->>API: Validate role
    alt ❌ Invalid Role
        API-->>assignRole: 400 "A valid role is required"
    end
    API->>Supabase: getUser()
    alt ❌ Unauthorized
        API-->>assignRole: 401 "Unauthorized"
    end
    API->>API: Determine status (teacher → "onboarding", student → "approved")
    API->>DB: UPDATE profiles SET role, status WHERE id = user.id AND role IS NULL
    alt ⚠️ Role Already Assigned
        DB-->>API: null (no rows updated)
        API-->>assignRole: 409 "Role already assigned"
    end
    DB-->>API: ✅ updated
    API-->>assignRole: 200 {nextRoute}
    Note over API: teacher → /onboarding<br/>student → /
    assignRole-->>useRole: response
    useRole-->>ChooseRoleForm: response
    ChooseRoleForm-->>User: router.push(nextRoute)
```

---

## 🗺️ Redirect Logic (خريطة التوجيه)

بعد أي عملية auth (signup, login, أو OAuth), الـ backend بيحدد الصفحة اللي المستخدم هيروح عليها بناءً على الـ **role** و **status**:

```mermaid
flowchart TD
    A[Auth Success] --> B{Has role?}
    B -- No --> C["/choose-role"]
    B -- Yes --> D{What role?}
    
    D -- student --> E["/  (Home)"]
    
    D -- teacher --> F{What status?}
    F -- onboarding --> G["/onboarding"]
    F -- waiting --> H["/waiting"]
    F -- approved --> I["/dashboard"]
    F -- rejected --> J["/rejected"]

    style A fill:#4f46e5,color:#fff
    style C fill:#f59e0b,color:#000
    style E fill:#10b981,color:#fff
    style G fill:#f59e0b,color:#000
    style H fill:#6366f1,color:#fff
    style I fill:#10b981,color:#fff
    style J fill:#ef4444,color:#fff
```

| Role | Status | Route | الوصف |
|------|--------|-------|-------|
| `null` | `null` | `/choose-role` | المستخدم لسه ما اختارش دوره |
| `student` | `approved` | `/` | الطالب بيروح على الصفحة الرئيسية |
| `teacher` | `onboarding` | `/onboarding` | المعلم لسه بيكمل بياناته |
| `teacher` | `waiting` | `/waiting` | المعلم مستني الموافقة |
| `teacher` | `approved` | `/dashboard` | المعلم تمت الموافقة عليه |
| `teacher` | `rejected` | `/rejected` | المعلم تم رفضه |

---

## 🧩 Layer-by-Layer Code Explanation (شرح الكود طبقة بطبقة)

### Layer 1: Supabase Clients (طبقة الاتصال بـ Supabase)

الأبلكيشن عنده **client اتنين** مختلفين لـ Supabase:

#### 🌐 Browser Client — [`client.ts`](file:///d:/coding/Next%20Js/my-app/src/lib/supabase/client.ts)

```typescript
export const supabaseClient = createBrowserClient(supabase_url, supabase_publishable_key, {
    auth: {
        flowType: "pkce"  // ← مهم! بيخلي OAuth يستخدم PKCE بدل Implicit
    }
})
```

**ليه PKCE مش Implicit؟**
- **Implicit Flow**: الـ access token بييجي في الـ URL كـ hash → `#access_token=...` (مكشوف في البراوزر)
- **PKCE Flow**: بييجي code مؤقت → `?code=...` والسيرفر هو اللي بيحوله لـ session (أأمن بكتير)

#### 🖥️ Server Client — [`server.ts`](file:///d:/coding/Next%20Js/my-app/src/lib/supabase/server.ts)

```typescript
export async function createSupabaseServerClient() {
    const cookieStore = await cookies();
    return createServerClient(url, key, {
        cookies: {
            getAll() { return cookieStore.getAll(); },
            setAll(cookiesToSet) {
                cookiesToSet.forEach(({ name, value, options }) => {
                    cookieStore.set(name, value, options);
                });
            },
        },
    });
}
```

**ليه بيحتاج cookies؟** لأن السيرفر مش بيعرف مين الـ user إلا من الـ cookies اللي فيها الـ session.

---

### Layer 2: Zod Validation Schemas (طبقة التحقق)

#### Signup Schema — [`schema.ts`](file:///d:/coding/Next%20Js/my-app/src/features/(auth)/signup/schema/schema.ts)

```typescript
export const signupSchema = z.object({
    firstName: z.string().min(3).max(25),
    lastName:  z.string().min(3).max(25),
    email:     z.email({ pattern: /regex/ }),
    password:  z.string().min(8).max(18)
                .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/),
    confirmPassword: z.string().min(1),
}).refine((val) => val.password === val.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],  // ← الإيرور بيظهر تحت confirmPassword
});
```

> [!NOTE]
> الـ Validation بيحصل **مرتين**: مرة على الـ Client (react-hook-form + zodResolver) ومرة على الـ Server (safeParse في الـ API route). الـ Double validation ده best practice عشان حتى لو حد بعت request من Postman مثلاً، البيانات هتتفلتر.

#### Login Schema — [`loginSchema.ts`](file:///d:/coding/Next%20Js/my-app/src/features/(auth)/login/schema/loginSchema.ts)

```typescript
export const loginSchema = z.object({
    email:    z.email({ pattern: /regex/ }),
    password: z.string().min(8).max(18).regex(/strong_password_regex/),
});
```

---

### Layer 3: Services (طبقة الـ API Calls)

كل feature عندها service file بتستخدم الـ `apiClient` (Axios wrapper):

```typescript
// signup service
export const signupService = async (data: signupSchemaType): Promise<AuthResponse> => {
    return await apiClient.post<AuthResponse>("/signup", data)
}

// login service
export const loginService = async (data: LoginSchemaType): Promise<AuthResponse> => {
    return await apiClient.post<AuthResponse>("/login", data)
}

// assign role service (OAuth)
export const assignRole = async (role: AuthRole): Promise<AuthResponse> => {
    return await apiClient.post<AuthResponse>("/choose-role", { role })
}
```

الـ `apiClient` هو class wrapper حوالين Axios بيعمل extract للـ `res.data` تلقائياً:
```typescript
class ApiClient {
    async post<T>(url: string, data?: unknown): Promise<T> {
        const res = await axiosInstance.post<T>(url, data);
        return res.data;  // ← بيرجع الداتا مباشرة مش الـ response كله
    }
}
```

---

### Layer 4: React Query Hooks (طبقة إدارة الحالة)

كل feature بتستخدم `useMutation` من React Query:

```typescript
// useSignup
export const useSignup = () => {
    return useMutation({ mutationFn: signupService })
}

// useLogin
export const useLogin = () => {
    return useMutation({ mutationFn: loginService })
}

// useRole
export const useRole = () => {
    return useMutation({ mutationFn: assignRole })
}
```

**ليه React Query؟**
- `isPending` → بيعرف الـ form يعمل loading state
- `mutateAsync` → بيرجع Promise فتقدر تعمل `try/catch`
- Automatic error handling و caching

---

### Layer 5: Form Components (طبقة الـ UI)

#### SignupForm — [`SignupForm.tsx`](file:///d:/coding/Next%20Js/my-app/src/features/(auth)/signup/components/SignupForm.tsx)

```typescript
const { register, handleSubmit, formState: { errors } } = useForm<signupSchemaType>({
    resolver: zodResolver(signupSchema),  // ← ربط Zod بالفورم
});
const { mutateAsync, isPending } = useSignup()

const onSubmit = async (data: signupSchemaType) => {
    try {
        const response = await mutateAsync(data)
        toast.success("Account created successfully")
        setTimeout(() => {
            router.push(response.nextRoute)  // ← بيوجه المستخدم للصفحة الصح
        }, 400)
    } catch (err) {
        // Error handling مع Axios error parsing
    }
};
```

#### SocialLogin — [`SocialLogin.tsx`](file:///d:/coding/Next%20Js/my-app/src/features/(auth)/shared/components/SocialLogin.tsx)

```typescript
async function handleOAuth(provider: Provider) {
    const { error } = await supabaseClient.auth.signInWithOAuth({
        provider,
        options: {
            // بعد ما Google يخلص، بيرجع المستخدم على /api/callback
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/callback`,
        }
    })
}
```

> [!IMPORTANT]
> الـ `SocialLogin` component بيستخدم الـ **Browser Client** مباشرة (مش API route) لأن الـ OAuth redirect لازم يحصل من البراوزر. بس الـ token exchange بيحصل على السيرفر في `/api/callback`.

---

### Layer 6: API Routes (طبقة السيرفر)

#### POST `/api/signup` — [`route.ts`](file:///d:/coding/Next%20Js/my-app/src/app/api/(auth)/signup/route.ts)

1. **Validate** بـ Zod (server-side)
2. **SignUp** مع Supabase → `supabase.auth.signUp()`
3. **Check** لو الإيميل مسجل قبل كده (identities check)
4. **Get Profile** → جلب الـ role و status
5. **Redirect** → تحديد الصفحة التالية

```typescript
// ✨ Supabase quirk: email already registered
if (data.user.identities?.length === 0) {
    return NextResponse.json(
        { message: "An account with this email already exists" },
        { status: 409 }
    );
}
```

> [!WARNING]
> Supabase مش بيرجع error لما الإيميل يكون متسجل قبل كده! بدل كده بيرجع user عادي بس الـ `identities` array بيكون فاضي. لازم تشيك عليه manually.

#### GET `/api/callback` — [`route.ts`](file:///d:/coding/Next%20Js/my-app/src/app/api/(auth)/callback/route.ts)

ده الـ route اللي Google بيرجع عليه بعد الـ OAuth:

1. **Extract code** من الـ URL query params
2. **Exchange** الـ code لـ session → `exchangeCodeForSession(code)`
3. **Get user** من الـ session الجديد
4. **Check profile** → لو مفيش profile → `/choose-role`
5. **Redirect** بناءً على role و status

#### POST `/api/choose-role` — [`route.ts`](file:///d:/coding/Next%20Js/my-app/src/app/api/(auth)/choose-role/route.ts)

```typescript
// بيحدد الـ status الأولي بناءً على الـ role
const status = role === "teacher" ? "onboarding" : "approved";

// بيعمل update بس لو الـ role لسه null (ما اتختارش قبل كده)
const { data } = await supabase
    .from("profiles")
    .update({ role, status })
    .eq("id", user.id)
    .is("role", null)     // ← حماية من تغيير الـ role مرتين
    .select("id")
    .maybeSingle();
```

---

### Layer 7: Shared Services (خدمات مشتركة)

#### getAuthRedirectRoute — [`getAuthRedirectRoute.ts`](file:///d:/coding/Next%20Js/my-app/src/services/auth/getAuthRedirectRoute.ts)

الفانكشن دي بتاخد `role` و `status` وبترجع الـ route المناسب:

```typescript
export function getAuthRedirectRouteService(role: string, status: string): string {
    if (!role || !status) return "/choose-role";
    if (role === "student") return "/";
    if (role === "teacher") {
        switch (status) {
            case "onboarding": return "/onboarding";
            case "waiting":    return "/waiting";
            case "approved":   return "/dashboard";
            case "rejected":   return "/rejected";
        }
    }
    return "/";
}
```

---

## 🏗️ Architecture Overview (الهيكل العام)

```mermaid
graph TB
    subgraph Client["🌐 Client (Browser)"]
        UI["UI Components<br/>SignupForm / LoginForm / ChooseRoleForm"]
        Hooks["React Query Hooks<br/>useSignup / useLogin / useRole"]
        Services["Service Layer<br/>signupService / loginService / assignRole"]
        BrowserSupabase["Supabase Browser Client<br/>(PKCE OAuth)"]
        AxiosClient["ApiClient<br/>(Axios Wrapper)"]
    end

    subgraph Server["🖥️ Server (Next.js API Routes)"]
        SignupRoute["POST /api/signup"]
        LoginRoute["POST /api/login"]
        CallbackRoute["GET /api/callback"]
        ChooseRoleRoute["POST /api/choose-role"]
        ServerSupabase["Supabase Server Client<br/>(Cookie-based)"]
        ZodValidation["Zod Validation<br/>(Server-side)"]
        RedirectService["getAuthRedirectRoute()"]
        ProfileService["getProfileService()"]
    end

    subgraph External["☁️ External Services"]
        SupabaseAuth["Supabase Auth"]
        SupabaseDB["Supabase Database<br/>(profiles table)"]
        GoogleOAuth["Google OAuth Provider"]
    end

    UI --> Hooks
    Hooks --> Services
    Services --> AxiosClient
    AxiosClient --> SignupRoute
    AxiosClient --> LoginRoute
    AxiosClient --> ChooseRoleRoute

    UI --> BrowserSupabase
    BrowserSupabase --> GoogleOAuth
    GoogleOAuth -->|"?code=..."| CallbackRoute

    SignupRoute --> ZodValidation
    LoginRoute --> ZodValidation
    SignupRoute --> ServerSupabase
    LoginRoute --> ServerSupabase
    CallbackRoute --> ServerSupabase
    ChooseRoleRoute --> ServerSupabase

    ServerSupabase --> SupabaseAuth
    ServerSupabase --> SupabaseDB

    SignupRoute --> ProfileService
    LoginRoute --> ProfileService
    ProfileService --> SupabaseDB

    SignupRoute --> RedirectService
    LoginRoute --> RedirectService
    CallbackRoute --> RedirectService

    style Client fill:#1e293b,color:#e2e8f0
    style Server fill:#0f172a,color:#e2e8f0
    style External fill:#312e81,color:#e2e8f0
```

---

## 🔑 Shared Types (الأنواع المشتركة)

```typescript
// الـ response اللي كل auth endpoint بيرجعه
interface AuthResponse {
    nextRoute: string;
    success: boolean;
}

// الأدوار المتاحة
type AuthRole = "student" | "teacher";

// Config لكل input field
interface AuthInputConfig<T extends string = string> {
    name: T;
    type: string;
    placeholder?: string;
    icon: LucideIcon;
    id?: string;
    halfWidth?: boolean;
}
```

---

## 📋 Summary Table (جدول ملخص)

| Feature | Client Component | Hook | Service | API Route | Schema |
|---------|-----------------|------|---------|-----------|--------|
| **Signup** | `SignupForm.tsx` | `useSignup` | `signupService` | `POST /api/signup` | `signupSchema` |
| **Login** | `LoginForm.tsx` | `useLogin` | `loginService` | `POST /api/login` | `loginSchema` |
| **OAuth** | `SocialLogin.tsx` | — | — | `GET /api/callback` | — |
| **Choose Role** | `ChooseRoleForm.tsx` | `useRole` | `assignRole` | `POST /api/choose-role` | — |

> [!TIP]
> **Pattern واضح**: كل feature بتتبع نفس الـ structure:
> `Component → Hook (React Query) → Service (Axios) → API Route → Supabase`
> وده بيخلي الكود consistent و سهل يتوسع.



## 🧭 الحالة الأولى: تسجيل بالإيميل والباسورد (Email/Password)

```
/signup → /choose-role → (حسب الدور)
```

**بالتفصيل:**

| الخطوة | الصفحة | ايه اللي بيحصل | بناءً على ايه بيعمل Redirect |
|--------|--------|---------------|------------------------------|
| 1 | `/signup` | المستخدم بيملأ الفورم (اسم، إيميل، باسورد) | بعد نجاح الـ API call، السيرفر بيرجع `nextRoute` |
| 2 | ايه الـ `nextRoute`؟ | السيرفر بيجيب الـ **profile** من الداتابيز وبيبص على الـ `role` و `status` | ← `getAuthRedirectRoute(role, status)` |

**السيناريوهات اللي ممكن تحصل بعد الـ Signup:**

| الـ role | الـ status | بيروح فين | ليه |
|---------|-----------|-----------|-----|
| `null` | `null` | `/choose-role` | الـ profile اتعمل بس الـ role لسه ما اتحددش ❶ |
| `student` | `approved` | `/` (Home) | طالب → مش محتاج حاجة تانية |
| `teacher` | `onboarding` | `/onboarding` | معلم جديد → محتاج يكمل بياناته |

> ❶ ده الأرجح في أول مرة signup لأن الـ Supabase trigger بيعمل profile بـ `role = null`

**بعد `/choose-role`:**

| اختار ايه | الـ status اللي بيتحط | بيروح فين |
|-----------|-----------------------|-----------|
| **Student** | `approved` | `/` (Home) ✅ |
| **Teacher** | `onboarding` | `/onboarding` → يكمل 3 steps |

---

## 🧭 الحالة التانية: تسجيل بـ Google OAuth

```
/login أو /signup → Google → /api/callback → (حسب الحالة)
```

**بالتفصيل:**

| الخطوة | الصفحة/المكان | ايه اللي بيحصل |
|--------|---------------|---------------|
| 1 | `/login` أو `/signup` | المستخدم بيدوس على زرار **Google** |
| 2 | `accounts.google.com` | بيختار حسابه ويوافق |
| 3 | `/api/callback?code=...` | Google بيرجع المستخدم مع code مؤقت |
| 4 | (في السيرفر) | السيرفر بيحول الـ code لـ session |
| 5 | (في السيرفر) | بيبص على الـ **profiles table** |

**بعد الـ Callback، السيرفر بيقرر:**

| الحالة | بيروح فين | ليه |
|--------|-----------|-----|
| 🆕 **مفيش profile** | `/choose-role` | مستخدم جديد، لسه ما اختارش دوره |
| profile موجود بس **role = null** | `/choose-role` | عنده profile بس ما اختارش |
| **student** + `approved` | `/` (Home) | طالب عادي |
| **teacher** + `onboarding` | `/onboarding` | معلم لسه بيكمل بياناته |
| **teacher** + `waiting` | `/waiting` | معلم مستني الموافقة |
| **teacher** + `approved` | `/dashboard` | معلم تمت الموافقة عليه |
| **teacher** + `rejected` | `/rejected` | معلم تم رفضه |

---

## 🔀 الرحلة الكاملة بالرسم:

```mermaid
flowchart LR
    subgraph Entry["🚪 نقطة الدخول"]
        Signup["/signup"]
        Login["/login"]
    end

    subgraph Method["📝 طريقة التسجيل"]
        Email["Email/Password"]
        OAuth["Google OAuth"]
    end

    subgraph ServerCheck["🖥️ السيرفر بيتشيك"]
        API_Signup["POST /api/signup"]
        API_Login["POST /api/login"]
        API_Callback["GET /api/callback"]
        CheckProfile{"profile موجود؟"}
        CheckRole{"role = ?"}
        CheckStatus{"status = ?"}
    end

    subgraph Destinations["📍 الصفحات النهائية"]
        ChooseRole["/choose-role"]
        Home["/ (Home)"]
        Onboarding["/onboarding"]
        Waiting["/waiting"]
        Dashboard["/dashboard"]
        Rejected["/rejected"]
    end

    Signup --> Email --> API_Signup
    Signup --> OAuth
    Login --> Email --> API_Login
    Login --> OAuth

    OAuth -->|"Google → ?code=..."| API_Callback
    API_Callback --> CheckProfile

    CheckProfile -->|"❌ No"| ChooseRole
    CheckProfile -->|"✅ Yes"| CheckRole

    API_Signup --> CheckRole
    API_Login --> CheckRole

    CheckRole -->|"null"| ChooseRole
    CheckRole -->|"student"| Home
    CheckRole -->|"teacher"| CheckStatus

    CheckStatus -->|"onboarding"| Onboarding
    CheckStatus -->|"waiting"| Waiting
    CheckStatus -->|"approved"| Dashboard
    CheckStatus -->|"rejected"| Rejected

    ChooseRole -->|"اختار Student"| Home
    ChooseRole -->|"اختار Teacher"| Onboarding
```

---

## ✨ ملخص سريع

**القرار بيتاخد بناءً على حاجتين بس** من الـ `profiles` table:
1. **`role`** → `null` | `student` | `teacher`
2. **`status`** → `null` | `onboarding` | `waiting` | `approved` | `rejected`

والفانكشن اللي بتاخد القرار ده هي [`getAuthRedirectRouteService()`](file:///d:/coding/Next%20Js/my-app/src/services/auth/getAuthRedirectRoute.ts) في كل الحالات (signup, login, و callback).

