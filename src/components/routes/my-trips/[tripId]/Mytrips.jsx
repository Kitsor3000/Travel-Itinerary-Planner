import { db } from '@/Service/Firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useContext, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import TripInfo from '../Elements/TripInfo';
import Hotels from '../Elements/Hotels';
import { LogInContext } from '@/Context/LogInContext/Login';
import Places from '../Elements/Places';


class BaseService {
  constructor(db) {
    this._db = db;
  }

  #getCollectionRef(collection, id) {
    return doc(this._db, collection, id);
  }

  async fetchById(collection, id) {
    const docRef = this.#getCollectionRef(collection, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? docSnap.data() : null;
  }
}

class TripService extends BaseService {
  constructor(db) {
    super(db);
  }

  async getTripById(tripId) {
    return this.fetchById('Trips', tripId);
  }

  async execute(tripId) {
    return this.getTripById(tripId);
  }
}


function MyTrips() {
  const { tripId } = useParams();
  const { setTrip } = useContext(LogInContext);

  const getTripData = async () => {
    try {
      const tripService = new TripService(db); 
      const tripData = await tripService.getTripById(tripId);

      if (tripData) {
        setTrip(tripData);
      } else {
        toast.error('No Such Trip');
      }
    } catch (error) {
      toast.error('Error fetching trip data');
      console.error(error);
    }
  };

  useEffect(() => {
    if (tripId) getTripData();
  }, [tripId]);

  return (
    <div className="py-2">
      <TripInfo />
      <Hotels />
      <Places />
    </div>
  );
}

export default MyTrips;
