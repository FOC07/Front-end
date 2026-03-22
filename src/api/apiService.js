const BASE_URL = "http://192.168.1.9:8000/api";

export const loginService = async (email, password) => {
    const response = await fetch(`${BASE_URL}/auth/login/`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Error al iniciar sesión");
    }

    return data;
};

export const taskApiService = {

    getAll: (token) =>
        fetch(`${BASE_URL}/tareas/`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then(res => res.json()),

    create: (token, data) =>
        fetch(`${BASE_URL}/tareas/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }).then(res => res.json()),

    update: (token, id, data) =>
        fetch(`${BASE_URL}/tareas/${id}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        }).then(res => res.json()),

    delete: (token, id) =>
        fetch(`${BASE_URL}/tareas/${id}/`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
};

export const userService = {

    getProfile: async (token) => {
        const res = await fetch(`${BASE_URL}/perfil/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Error perfil");
        }

        return data;
    },

    uploadProfileImage: async (token, imageUri) => {

        const getImageType = (uri) => {
            if (uri.endsWith(".png")) return "image/png";
            if (uri.endsWith(".jpg") || uri.endsWith(".jpeg")) return "image/jpeg";
            return "image/jpeg";
        };

        const formData = new FormData();

        formData.append("imagen", {
            uri: imageUri,
            name: "profile.jpg",
            type: getImageType(imageUri),
        });

        const res = await fetch(`${BASE_URL}/perfil/foto/`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.error || "Error al subir imagen");
        }

        return data;
    },
};