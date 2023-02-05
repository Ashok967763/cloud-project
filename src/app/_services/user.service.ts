import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '@/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
    constructor(private http: HttpClient) { }

    getAll() {
        return this.http.get<User[]>(`${config.apiUrl}/users`);
    }

    register(user: User) {
        return this.http.post(`${config.apiUrl}/users/register`, user);
    }

    update(id,formData) {
        return this.http.put(`${config.apiUrl}/users/${id}`, formData);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/${id}`);
    }

    download(filename) {
        return this.http.get(`${config.apiUrl}/uploads/${filename}`);
    }
}