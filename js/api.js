import AuthService from './auth.js';
import TripService from './trips.js';

class TravelAPI {
  constructor() {
    this.auth = new AuthService();
    this.trips = new TripService();
  }

  register(username, email, password) {
    return this.auth.register(username, email, password);
  }

  login(email, password) {
    return this.auth.login(email, password);
  }

  logout() {
    return this.auth.logout();
  }

  getCurrentUser() {
    return this.auth.getCurrentUser();
  }

  createTrip(destination, startDate, endDate, budget) {
    const user = this.auth.getCurrentUser();
    if (!user) return { success: false, message: 'Необхідно увійти' };
    return this.trips.createTrip(user.id, destination, startDate, endDate, budget);
  }

  getUserTrips() {
    const user = this.auth.getCurrentUser();
    if (!user) return { success: false, message: 'Необхідно увійти' };
    return { success: true, trips: this.trips.getUserTrips(user.id) };
  }

  deleteTrip(tripId) {
    const user = this.auth.getCurrentUser();
    if (!user) return { success: false, message: 'Необхідно увійти' };
    return this.trips.deleteTrip(tripId, user.id);
  }

  updateTrip(tripId, updates) {
    const user = this.auth.getCurrentUser();
    if (!user) return { success: false, message: 'Необхідно увійти' };
    return this.trips.updateTrip(tripId, user.id, updates);
  }
}

export const api = new TravelAPI();