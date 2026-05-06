// Auth helper for MongoDB + JWT
let API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
// Clean up trailing slashes if present
if (API_URL.endsWith('/')) {
    API_URL = API_URL.slice(0, -1);
}

export const auth = {
    async login(email, password) {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const text = await res.text();
            console.error("Non-JSON response received:", text);
            throw new Error(`Server returned a non-JSON response. This usually means the API URL is wrong or the server is down. (Status: ${res.status})`);
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed');
        
        if (typeof window !== 'undefined') {
            localStorage.setItem('growthory_token', data.token);
            localStorage.setItem('growthory_user', JSON.stringify(data.user));
        }
        return data;
    },

    async signup(email, password, full_name, role) {
        const res = await fetch(`${API_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, full_name, role }),
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            throw new Error(`Server returned a non-JSON response. (Status: ${res.status})`);
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Signup failed');
        
        if (typeof window !== 'undefined') {
            localStorage.setItem('growthory_token', data.token);
            localStorage.setItem('growthory_user', JSON.stringify(data.user));
        }
        return data;
    },

    logout() {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('growthory_token');
            localStorage.removeItem('growthory_user');
        }
    },

    getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('growthory_token');
        }
        return null;
    },

    getUser() {
        if (typeof window !== 'undefined') {
            const user = localStorage.getItem('growthory_user');
            return user ? JSON.parse(user) : null;
        }
        return null;
    },

    async getMe() {
        const token = this.getToken();
        if (!token) return null;

        const res = await fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${token}` },
        });

        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            return null;
        }

        if (!res.ok) {
            this.logout();
            return null;
        }
        return await res.json();
    }
};
