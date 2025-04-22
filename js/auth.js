class AuthService {
    constructor() {
      this.users = JSON.parse(localStorage.getItem('users')) || [];
      this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    }
  
    register(username, email, password) {
      if (this.users.some(u => u.email === email)) {
        return { success: false, message: 'Email вже використовується' };
      }
  
      const newUser = {
        id: Date.now(),
        username,
        email,
        password,
        trips: []
      };
  
      this.users.push(newUser);
      localStorage.setItem('users', JSON.stringify(this.users));
      return { success: true, user: newUser };
    }
  
    login(email, password) {
      const user = this.users.find(u => u.email === email && u.password === password);
      if (user) {
        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));
        return { success: true, user };
      }
      return { success: false, message: 'Невірний email або пароль' };
    }
  
    logout() {
      this.currentUser = null;
      localStorage.removeItem('currentUser');
      return { success: true };
    }
  
    getCurrentUser() {
      return this.currentUser;
    }
  }
  
  export default AuthService;