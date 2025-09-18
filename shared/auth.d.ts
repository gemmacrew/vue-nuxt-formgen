// auth.d.ts
declare module '#auth-utils' {
    interface User {
        id: number;
        name: string;
    }

    interface UserSession {
        // Add your own fields
        lastLogin: Date;
    }

    interface SecureSessionData {
        // Add your own fields
    }
}

export {}