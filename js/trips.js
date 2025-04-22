class TripService {
    constructor() {
      this.trips = JSON.parse(localStorage.getItem('trips')) || [];
    }
  
    createTrip(userId, destination, startDate, endDate, totalBudget) {
      const newTrip = {
        id: Date.now(),
        userId,
        destination,
        startDate,
        endDate,
        totalBudget,
        createdAt: new Date().toISOString()
      };
  
      this.trips.push(newTrip);
      localStorage.setItem('trips', JSON.stringify(this.trips));
      return { success: true, trip: newTrip };
    }
  
    getUserTrips(userId) {
      return this.trips.filter(trip => trip.userId === userId);
    }
  
    deleteTrip(tripId, userId) {
      const initialLength = this.trips.length;
      this.trips = this.trips.filter(t => !(t.id === tripId && t.userId === userId));
      localStorage.setItem('trips', JSON.stringify(this.trips));
      return { 
        success: this.trips.length !== initialLength,
        message: this.trips.length !== initialLength ? '' : 'Подорож не знайдена або немає прав'
      };
    }
  
    updateTrip(tripId, userId, updates) {
      const trip = this.trips.find(t => t.id === tripId && t.userId === userId);
      if (!trip) return { success: false, message: 'Не знайдено' };
  
      Object.assign(trip, updates);
      localStorage.setItem('trips', JSON.stringify(this.trips));
      return { success: true, trip };
    }
  }
  
  export default TripService;